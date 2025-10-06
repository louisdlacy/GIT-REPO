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

/**
 * Defines the structure for a single loadout's attributes.
 */
interface Loadout {
  name: string;
  healthModifier: number;
  speedModifier: number;
}

/**
 * LoadoutManager
 * Manages player loadouts by parsing a CSV string and applying stat modifiers.
 */
class LoadoutManager extends Component<typeof LoadoutManager> {
  static propsDefinition = {
    /**
     * A semicolon-separated list of loadouts, where each loadout is a comma-separated list of Name,HealthModifier,SpeedModifier.
     * Example: 'Standard,100,1.1;Heavy,120,0.9'
     */
    loadoutsCSV: { type: PropTypes.String, default: '' },
    // Reference to the central configuration entity that holds all manager references.
    gfcConfiguration: { type: PropTypes.Entity },
  };

  // Internal data structure to store parsed loadouts. Map<loadoutName, Loadout>
  private loadouts: Map<string, Loadout> = new Map();
  // Tracks the currently active loadout for each player. Map<playerID, loadoutName>
  private playerLoadouts: Map<number, string> = new Map();

  override start() {
    this.parseLoadouts();
  }

  /**
   * Parses the loadoutsCSV string property into the internal 'loadouts' map.
   */
  private parseLoadouts(): void {
    if (!this.props.loadoutsCSV) {
      console.warn('LoadoutManager: loadoutsCSV property is empty. No loadouts will be available.');
      return;
    }

    const loadoutDefinitions = this.props.loadoutsCSV.split(';');

    for (const definition of loadoutDefinitions) {
      const parts = definition.split(',').map(part => part.trim());
      if (parts.length === 3) {
        const [name, healthStr, speedStr] = parts;
        const healthModifier = parseFloat(healthStr);
        const speedModifier = parseFloat(speedStr);

        if (!isNaN(healthModifier) && !isNaN(speedModifier)) {
          this.loadouts.set(name, {
            name,
            healthModifier,
            speedModifier,
          });
          console.log(`LoadoutManager: Parsed and stored loadout '${name}'.`);
        } else {
          console.error(`LoadoutManager: Invalid number format in definition: "${definition}"`);
        }
      } else {
        console.error(`LoadoutManager: Malformed loadout definition: "${definition}"`);
      }
    }
  }

  /**
   * Applies a specific loadout to a player.
   * @param player The player to apply the loadout to.
   * @param loadoutName The name of the loadout to apply.
   */
  public applyLoadout(player: Player, loadoutName: string): void {
    const loadout = this.loadouts.get(loadoutName);

    if (!loadout) {
      console.error(`LoadoutManager: Attempted to apply non-existent loadout '${loadoutName}' to player ${player.name.get()}.`);
      return;
    }

    // Get the sysPlayerStatsManager via the gfcConfiguration entity.
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("LoadoutManager: 'gfcConfiguration' property is not assigned.");
      return;
    }

    const configComponents = configEntity.getComponents(sysConfiguration);
    if (!configComponents || configComponents.length === 0) {
      console.error("LoadoutManager: Could not find 'sysConfiguration' component on the provided gfcConfiguration entity.");
      return;
    }
    const config = configComponents[0];

    const statsManagerEntity = config.props.playerStatsManager;
    if (!statsManagerEntity) {
      console.error("LoadoutManager: 'playerStatsManager' property is not assigned on the sysConfiguration component.");
      return;
    }

    const statsManagerComps = statsManagerEntity.getComponents(sysPlayerStatsManager);
    if (!statsManagerComps || statsManagerComps.length === 0) {
      console.error("LoadoutManager: Could not find 'sysPlayerStatsManager' component on the entity provided by sysConfiguration.");
      return;
    }
    const statsManager = statsManagerComps[0];

    // Remove the modifier from the previous loadout, if any.
    const previousLoadoutName = this.playerLoadouts.get(player.id);
    if (previousLoadoutName) {
      const previousLoadout = this.loadouts.get(previousLoadoutName);
      if (previousLoadout) {
        // Apply a zero modifier to effectively remove the old one.
        statsManager.applyStatModifier(player, 'health', 0, `Loadout_${previousLoadout.name}`);
      }
    }

    // Apply the new loadout's health modifier.
    const source = `Loadout_${loadout.name}`;
    statsManager.applyStatModifier(player, 'health', loadout.healthModifier, source);

    // Store the new active loadout for the player.
    this.playerLoadouts.set(player.id, loadout.name);

    console.log(
      `Applying '${loadout.name}' loadout to player ${player.name.get()}: ` +
      `health modifier ${loadout.healthModifier}, speed modifier ${loadout.speedModifier}`
    );
  }

  /**
   * Retrieves the name of the currently active loadout for a given player.
   * @param player The player to check.
   * @returns The name of the active loadout, or undefined if none is active.
   */
  public getPlayerLoadout(player: Player): string | undefined {
    return this.playerLoadouts.get(player.id);
  }
}

Component.register(LoadoutManager);