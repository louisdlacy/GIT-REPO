import { Component, PropTypes, Player, Entity } from 'horizon/core';

// Forward declaration for the sysPlayerStatsManager component type.
// This allows TypeScript to know about its methods without needing to import the full file.
declare class sysPlayerStatsManager extends Component {
  public applyStatModifier(player: Player, statName: string, modifier: number, source: string): void;
  start(): void;
}

// Forward declaration for the central configuration component.
declare class sysConfiguration extends Component<typeof sysConfiguration> {
  static propsDefinition: {
    playerStatsManager: { type: typeof PropTypes.Entity };
  };
  start(): void;
}

// Defines the structure for a single power-up's attributes.
interface PowerUp {
  name: string;
  duration: number;
  statModifierName: string;
  modifierValue: number;
}

/**
 * PowerUpManager
 * Manages temporary power-ups for players by parsing a CSV string.
 */
class PowerUpManager extends Component<typeof PowerUpManager> {
  static propsDefinition = {
    /**
     * A semicolon-separated list of power-ups, where each is a comma-separated list of Name,Duration,StatToModify,ModifierValue.
     * Example: 'SpeedBoost,10,speed,1.5;DamageBoost,15,damage,2.0'
     */
    powerUpsCSV: { type: PropTypes.String, default: '' },
    // Reference to the central configuration entity that holds all manager references.
    gfcConfiguration: { type: PropTypes.Entity },
  };

  // Internal data structure to store parsed power-ups. Map<powerUpName, PowerUp>
  private powerUps: Map<string, PowerUp> = new Map();
  // Tracks active power-up timers for each player. Map<PlayerID, Map<PowerUpName, TimerID>>
  private activePlayerPowerUps: Map<number, Map<string, number>> = new Map();

  override start() {
    this.parsePowerUps();
  }

  /**
   * Parses the powerUpsCSV string property into the internal 'powerUps' map.
   */
  private parsePowerUps(): void {
    if (!this.props.powerUpsCSV) {
      console.warn('PowerUpManager: powerUpsCSV property is empty. No power-ups will be available.');
      return;
    }

    const powerUpDefinitions = this.props.powerUpsCSV.split(';');

    for (const definition of powerUpDefinitions) {
      const parts = definition.split(',').map(part => part.trim());
      if (parts.length === 4) {
        const [name, durationStr, statName, valueStr] = parts;
        const duration = parseFloat(durationStr);
        const modifierValue = parseFloat(valueStr);

        if (!isNaN(duration) && !isNaN(modifierValue)) {
          this.powerUps.set(name, {
            name: name,
            duration: duration,
            statModifierName: statName,
            modifierValue: modifierValue,
          });
        } else {
          console.error(`PowerUpManager: Invalid number format in definition: "${definition}"`);
        }
      } else {
        console.error(`PowerUpManager: Malformed power-up definition: "${definition}"`);
      }
    }
  }

  /**
   * Applies a specific power-up to a player and starts its timer.
   * @param player The player to apply the power-up to.
   * @param powerUpName The name of the power-up to apply.
   */
  public applyPowerUp(player: Player, powerUpName: string): void {
    const powerUp = this.powerUps.get(powerUpName);

    if (!powerUp) {
      console.error(`PowerUpManager: Attempted to apply non-existent power-up '${powerUpName}'.`);
      return;
    }

    // Get the sysPlayerStatsManager via the gfcConfiguration entity.
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("PowerUpManager: 'gfcConfiguration' property is not assigned.");
      return;
    }

    const configComponents = configEntity.getComponents(sysConfiguration);
    if (!configComponents || configComponents.length === 0) {
      console.error("PowerUpManager: Could not find 'sysConfiguration' component on the provided gfcConfiguration entity.");
      return;
    }
    const config = configComponents[0];

    const statsManagerEntity = config.props.playerStatsManager;
    if (!statsManagerEntity) {
      console.error("PowerUpManager: 'playerStatsManager' property is not assigned on the sysConfiguration component.");
      return;
    }

    const statsManagerComps = statsManagerEntity.getComponents(sysPlayerStatsManager);
    if (!statsManagerComps || statsManagerComps.length === 0) {
      console.error("PowerUpManager: Could not find 'sysPlayerStatsManager' component on the entity provided by sysConfiguration.");
      return;
    }
    const statsManager = statsManagerComps[0];
    const source = `PowerUp_${powerUp.name}`;

    if (!this.activePlayerPowerUps.has(player.id)) {
      this.activePlayerPowerUps.set(player.id, new Map<string, number>());
    }

    const playerActiveTimers = this.activePlayerPowerUps.get(player.id)!;

    if (playerActiveTimers.has(powerUp.name)) {
      this.async.clearTimeout(playerActiveTimers.get(powerUp.name)!);
    }

    console.log(`Applying ${powerUp.name} to player ${player.name.get()} for ${powerUp.duration} seconds.`);
    statsManager.applyStatModifier(player, powerUp.statModifierName, powerUp.modifierValue, source);

    const timerId = this.async.setTimeout(() => {
      console.log(`Power-up ${powerUp.name} has expired for player ${player.name.get()}.`);
      // Apply a zero modifier to remove the effect.
      statsManager.applyStatModifier(player, powerUp.statModifierName, 0, source);
      playerActiveTimers.delete(powerUp.name);
    }, powerUp.duration * 1000);

    playerActiveTimers.set(powerUp.name, timerId);
  }
}

Component.register(PowerUpManager);