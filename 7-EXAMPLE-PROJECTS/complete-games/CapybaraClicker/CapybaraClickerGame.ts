import * as hz from 'horizon/core';

/**
 * Capybara Clicker Game - Main Component
 *
 * A clicker game where players click on a capybara to earn points.
 * Features include:
 * - Click-based scoring with multipliers
 * - Auto-clicker upgrades
 * - Persistent player progress
 * - Upgrade shop system
 */

// Network event for score updates
export const scoreUpdateEvent = new hz.NetworkEvent<{
  oldValue: number;
  newValue: number;
  player: hz.Player;
  clickValue: number;
  autoClickRate: number;
}>('capybaraScoreUpdate');

// Network event for upgrade purchases
export const upgradePurchaseEvent = new hz.NetworkEvent<{
  player: hz.Player;
  upgradeType: string;
  cost: number;
}>('capybaraUpgradePurchase');

// Upgrade definitions
interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentLevel: number;
  costMultiplier: number;
  effect: number;
}

class CapybaraClickerGame extends hz.Component<typeof CapybaraClickerGame> {
  static propsDefinition = {
    // The clickable capybara entity (can be a 3D model or trigger)
    capybaraEntity: { type: hz.PropTypes.Entity },
    // Variable group name for persistent storage
    variableGroup: { type: hz.PropTypes.String, default: "CapybaraScore" },
    // Base points per click
    baseClickValue: { type: hz.PropTypes.Number, default: 1 },
    // Auto-clicker interval in seconds
    autoClickInterval: { type: hz.PropTypes.Number, default: 1 },
  };

  // Player data storage
  private playerData = new Map<hz.Player, PlayerGameData>();

  start() {
    // Initialize click handling
    this.setupClickHandler();

    // Initialize auto-clicker
    this.startAutoClicker();

    // Handle player join
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => {
        this.initializePlayer(player);
      }
    );

    // Listen for upgrade purchases
    this.connectNetworkBroadcastEvent(
      upgradePurchaseEvent,
      (data) => {
        this.handleUpgradePurchase(data.player, data.upgradeType, data.cost);
      }
    );
  }

  private setupClickHandler() {
    if (!this.props.capybaraEntity) {
      console.warn("CapybaraClickerGame: No capybara entity set!");
      return;
    }

    // Connect to click/trigger events on the capybara entity
    this.connectCodeBlockEvent(
      this.props.capybaraEntity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        this.handleClick(player);
      }
    );

    // Also handle interaction events for 3D models
    this.connectCodeBlockEvent(
      this.props.capybaraEntity,
      hz.CodeBlockEvents.OnPlayerInteractAsPlayer,
      (player: hz.Player) => {
        this.handleClick(player);
      }
    );
  }

  private initializePlayer(player: hz.Player) {
    // Load player data from persistent storage
    const score = this.world.persistentStorage.getPlayerVariable<number>(
      player,
      this.props.variableGroup
    ) ?? 0;

    // Load upgrade levels
    const clickLevel = this.world.persistentStorage.getPlayerVariable<number>(
      player,
      `${this.props.variableGroup}_ClickLevel`
    ) ?? 0;

    const autoClickLevel = this.world.persistentStorage.getPlayerVariable<number>(
      player,
      `${this.props.variableGroup}_AutoClickLevel`
    ) ?? 0;

    const clickMultiplierLevel = this.world.persistentStorage.getPlayerVariable<number>(
      player,
      `${this.props.variableGroup}_MultiplierLevel`
    ) ?? 0;

    // Create player data
    const playerGameData: PlayerGameData = {
      score: score,
      clickValue: this.props.baseClickValue + clickLevel,
      autoClickRate: autoClickLevel,
      clickMultiplier: 1 + (clickMultiplierLevel * 0.5),
      upgrades: this.initializeUpgrades(clickLevel, autoClickLevel, clickMultiplierLevel),
    };

    this.playerData.set(player, playerGameData);

    // Send initial state to UI
    this.broadcastScoreUpdate(player, 0, score);
  }

  private initializeUpgrades(clickLevel: number, autoClickLevel: number, multiplierLevel: number): Upgrade[] {
    return [
      {
        id: 'clickPower',
        name: 'Better Clicks',
        description: '+1 point per click',
        baseCost: 10,
        currentLevel: clickLevel,
        costMultiplier: 1.5,
        effect: 1,
      },
      {
        id: 'autoClicker',
        name: 'Auto Clicker',
        description: '+1 click per second',
        baseCost: 50,
        currentLevel: autoClickLevel,
        costMultiplier: 2,
        effect: 1,
      },
      {
        id: 'clickMultiplier',
        name: 'Click Multiplier',
        description: '+50% to all clicks',
        baseCost: 100,
        currentLevel: multiplierLevel,
        costMultiplier: 3,
        effect: 0.5,
      },
    ];
  }

  private handleClick(player: hz.Player) {
    const data = this.playerData.get(player);
    if (!data) {
      this.initializePlayer(player);
      return;
    }

    const oldScore = data.score;
    const pointsEarned = Math.floor(data.clickValue * data.clickMultiplier);
    data.score += pointsEarned;

    // Save to persistent storage
    this.world.persistentStorage.setPlayerVariable(
      player,
      this.props.variableGroup,
      data.score
    );

    // Broadcast update
    this.broadcastScoreUpdate(player, oldScore, data.score);

    console.log(`${player.name.get()} clicked! Earned ${pointsEarned} points. Total: ${data.score}`);
  }

  private startAutoClicker() {
    // Run auto-clicker every interval
    this.async.setInterval(() => {
      this.playerData.forEach((data, player) => {
        if (data.autoClickRate > 0) {
          const oldScore = data.score;
          const pointsEarned = Math.floor(data.autoClickRate * data.clickMultiplier);
          data.score += pointsEarned;

          // Save to persistent storage
          this.world.persistentStorage.setPlayerVariable(
            player,
            this.props.variableGroup,
            data.score
          );

          // Broadcast update
          this.broadcastScoreUpdate(player, oldScore, data.score);
        }
      });
    }, this.props.autoClickInterval * 1000);
  }

  private handleUpgradePurchase(player: hz.Player, upgradeType: string, cost: number) {
    const data = this.playerData.get(player);
    if (!data) return;

    // Check if player can afford
    if (data.score < cost) {
      console.warn(`${player.name.get()} cannot afford upgrade ${upgradeType}`);
      return;
    }

    // Find the upgrade
    const upgrade = data.upgrades.find(u => u.id === upgradeType);
    if (!upgrade) return;

    // Deduct cost
    const oldScore = data.score;
    data.score -= cost;

    // Apply upgrade
    upgrade.currentLevel++;

    switch (upgradeType) {
      case 'clickPower':
        data.clickValue += upgrade.effect;
        this.world.persistentStorage.setPlayerVariable(
          player,
          `${this.props.variableGroup}_ClickLevel`,
          upgrade.currentLevel
        );
        break;
      case 'autoClicker':
        data.autoClickRate += upgrade.effect;
        this.world.persistentStorage.setPlayerVariable(
          player,
          `${this.props.variableGroup}_AutoClickLevel`,
          upgrade.currentLevel
        );
        break;
      case 'clickMultiplier':
        data.clickMultiplier += upgrade.effect;
        this.world.persistentStorage.setPlayerVariable(
          player,
          `${this.props.variableGroup}_MultiplierLevel`,
          upgrade.currentLevel
        );
        break;
    }

    // Save new score
    this.world.persistentStorage.setPlayerVariable(
      player,
      this.props.variableGroup,
      data.score
    );

    // Broadcast update
    this.broadcastScoreUpdate(player, oldScore, data.score);

    console.log(`${player.name.get()} purchased ${upgrade.name} (Level ${upgrade.currentLevel})`);
  }

  private broadcastScoreUpdate(player: hz.Player, oldValue: number, newValue: number) {
    const data = this.playerData.get(player);
    if (!data) return;

    this.sendNetworkBroadcastEvent(scoreUpdateEvent, {
      oldValue,
      newValue,
      player,
      clickValue: Math.floor(data.clickValue * data.clickMultiplier),
      autoClickRate: Math.floor(data.autoClickRate * data.clickMultiplier),
    });
  }

  // Public method to get upgrade cost
  static getUpgradeCost(upgrade: Upgrade): number {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
  }

  // Public method to get player data for UI
  getPlayerData(player: hz.Player): PlayerGameData | undefined {
    return this.playerData.get(player);
  }
}

// Player game data interface
interface PlayerGameData {
  score: number;
  clickValue: number;
  autoClickRate: number;
  clickMultiplier: number;
  upgrades: Upgrade[];
}

// Export for use in other components
export type { Upgrade, PlayerGameData };

hz.Component.register(CapybaraClickerGame);
