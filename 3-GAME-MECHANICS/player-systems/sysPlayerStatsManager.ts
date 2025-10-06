import { Component, PropTypes, Player, CodeBlockEvents, NetworkEvent } from 'horizon/core';

// This event is also defined in sysGlobalEventManager. Re-defining it here with the same name
// allows this script to send the event without a direct file import.
const OnPlayerStatChanged = new NetworkEvent<{ player: Player; statName: string; newValue: number }>('OnPlayerStatChanged');

/**
 * Defines the statistical data for a player.
 */
interface PlayerStats {
  score: number;
  health: number;
  lives: number;
  maxHealth: number;
}

/**
 * sysPlayerStatsManager
 * Manages the core statistics (score, health, lives) for all players in the world,
 * including the application of stat modifiers.
 */
class sysPlayerStatsManager extends Component<typeof sysPlayerStatsManager> {
  static propsDefinition = {
    startingHealth: { type: PropTypes.Number, default: 100 },
    startingLives: { type: PropTypes.Number, default: 3 },
    startingScore: { type: PropTypes.Number, default: 0 },
  };

  private playerStats: Map<number, PlayerStats> = new Map();
  // New data structure to track modifiers: Map<PlayerID, Map<StatName, Map<Source, ModifierValue>>>
  private playerStatModifiers: Map<number, Map<string, Map<string, number>>> = new Map();

  override preStart() {
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterWorld,
      (player: Player) => this.registerPlayer(player)
    );

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      (player: Player) => this.unregisterPlayer(player)
    );

    // Listen for the global item collection event with the updated payload.
    this.connectNetworkBroadcastEvent(
      new NetworkEvent<{ player: Player, itemName: string, pointValue: number }>('OnItemCollected'),
      (payload) => {
        this.handleItemCollected(payload);
      }
    );
  }

  override start() {
    // Register any players already in the world when the script starts
    this.world.getPlayers().forEach(player => {
      this.registerPlayer(player);
    });
    console.log("sysPlayerStatsManager started.");
  }

  private handleItemCollected(payload: { player: Player; itemName: string, pointValue: number }): void {
    // Directly use the pointValue from the payload to add score.
    this.addScore(payload.player, payload.pointValue);
  }

  private registerPlayer(player: Player): void {
    if (!this.playerStats.has(player.id)) {
      const initialStats: PlayerStats = {
        score: this.props.startingScore,
        health: this.props.startingHealth,
        lives: this.props.startingLives,
        maxHealth: this.props.startingHealth,
      };
      this.playerStats.set(player.id, initialStats);
      this.playerStatModifiers.set(player.id, new Map());
      console.log(`Player ${player.name.get()} registered with default stats.`);

      // Send initial stat events for HUD
      this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'score', newValue: initialStats.score });
      this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'health', newValue: initialStats.health });
      this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'lives', newValue: initialStats.lives });
    }
  }

  private unregisterPlayer(player: Player): void {
    if (this.playerStats.has(player.id)) {
      this.playerStats.delete(player.id);
      this.playerStatModifiers.delete(player.id); // Clear modifiers on exit
      console.log(`Player ${player.name.get()} unregistered.`);
    }
  }

  public addScore(player: Player, amount: number): void {
    const stats = this.playerStats.get(player.id);
    if (stats) {
      stats.score += amount;
      console.log(`Player ${player.name.get()} score is now ${stats.score}.`);
      this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'score', newValue: stats.score });
    }
  }

  public takeDamage(player: Player, amount: number): void {
    const stats = this.playerStats.get(player.id);
    if (stats && stats.lives > 0) {
      stats.health = Math.max(0, stats.health - amount);
      console.log(`Player ${player.name.get()} took ${amount} damage. Health is now ${stats.health}.`);
      this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'health', newValue: stats.health });

      if (stats.health <= 0) {
        console.log(`Player ${player.name.get()} Defeated!`);
        stats.lives--;
        this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'lives', newValue: stats.lives });

        if (stats.lives <= 0) {
          console.log(`Game Over for player ${player.name.get()}.`);
        } else {
          // Reset health to the current max health, which may have been modified
          stats.health = stats.maxHealth;
          console.log(`Player ${player.name.get()} health reset to ${stats.health}.`);
          this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'health', newValue: stats.health });
        }
      }
    }
  }

  public setLives(player: Player, count: number): void {
    const stats = this.playerStats.get(player.id);
    if (stats) {
      stats.lives = count;
      console.log(`Player ${player.name.get()} lives set to ${stats.lives}.`);
      this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'lives', newValue: stats.lives });
    }
  }

  public getPlayerStats(player: Player): PlayerStats | undefined {
    return this.playerStats.get(player.id);
  }

  /**
   * Applies a modifier to a player's stat.
   * @param player The player to affect.
   * @param statName The name of the stat to modify (e.g., 'health').
   * @param modifier The value of the modifier.
   * @param source A unique key for the source of the modifier (e.g., 'PowerUp_Speed').
   */
  public applyStatModifier(player: Player, statName: string, modifier: number, source: string): void {
    if (!this.playerStatModifiers.has(player.id)) {
      console.warn(`Cannot apply modifier, player ${player.id} not registered.`);
      return;
    }

    const playerMods = this.playerStatModifiers.get(player.id)!;
    if (!playerMods.has(statName)) {
      playerMods.set(statName, new Map<string, number>());
    }

    const statMods = playerMods.get(statName)!;
    statMods.set(source, modifier);
    console.log(`Applied modifier from '${source}' to stat '${statName}' for player ${player.name.get()} with value ${modifier}.`);

    // Handle specific stat recalculations
    if (statName === 'health') {
      this.recalculateMaxHealth(player);
    }
  }

  /**
   * Recalculates a player's max health based on all active modifiers and resets their current health.
   * @param player The player whose health needs recalculation.
   */
  private recalculateMaxHealth(player: Player): void {
    const stats = this.playerStats.get(player.id);
    const playerMods = this.playerStatModifiers.get(player.id);
    if (!stats || !playerMods) return;

    let totalModifier = 0;
    const healthMods = playerMods.get('health');
    if (healthMods) {
      healthMods.forEach(value => {
        totalModifier += value;
      });
    }

    const newMaxHealth = this.props.startingHealth + totalModifier;
    stats.maxHealth = newMaxHealth;
    stats.health = newMaxHealth; // Reset current health to the new maximum

    console.log(`Player ${player.name.get()}'s max health recalculated to ${newMaxHealth}. Current health reset.`);
    this.sendNetworkBroadcastEvent(OnPlayerStatChanged, { player, statName: 'health', newValue: stats.health });
  }
}

Component.register(sysPlayerStatsManager);