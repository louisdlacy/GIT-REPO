import { Component, Player, CodeBlockEvents } from 'horizon/core';

/**
 * Defines a basic structure for the data we want to persist for each player.
 * This can be expanded with any serializable data (numbers, strings, booleans, arrays, objects).
 */
interface PlayerData {
  score: number;
  level: number;
  lastLogin: number;
}

/**
 * PersistenceManager
 * Handles saving and loading player data using Horizon's persistent storage API.
 * It automatically loads data when a player joins and saves when they leave.
 */
class PersistenceManager extends Component<typeof PersistenceManager> {
  static propsDefinition = {};

  // A cache to hold player data for the current session, reducing storage lookups.
  private playerDataCache: Map<number, PlayerData> = new Map();

  override preStart() {
    // Hook into player join and leave events to manage data automatically.
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterWorld,
      (player: Player) => this.handlePlayerEnter(player)
    );

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      (player: Player) => this.handlePlayerLeave(player)
    );
  }

  override start() {
    console.log("PersistenceManager started. Loading data for existing players.");
    // Ensure data is loaded for any players already in the world when the script starts.
    this.world.getPlayers().forEach(player => {
      this.loadPlayerData(player);
    });
  }

  private handlePlayerEnter(player: Player): void {
    console.log(`Player ${player.name.get()} entered. Loading persistent data.`);
    this.loadPlayerData(player);
  }

  private handlePlayerLeave(player: Player): void {
    const playerData = this.playerDataCache.get(player.id);
    if (playerData) {
      console.log(`Player ${player.name.get()} left. Saving data.`);
      this.savePlayerData(player, playerData);
      this.playerDataCache.delete(player.id); // Clean up cache on leave.
    }
  }

  /**
   * Loads a player's data from persistent storage into the local cache.
   * @param player The player whose data to load.
   * @returns The loaded player data object, or a new default object if no data exists.
   */
  public loadPlayerData(player: Player): PlayerData {
    const playerKey = `playerData:${player.id}`;
    const storedDataString = this.world.persistentStorage.getPlayerVariable<string>(player, playerKey);

    if (storedDataString) {
      try {
        const playerData: PlayerData = JSON.parse(storedDataString);
        this.playerDataCache.set(player.id, playerData);
        console.log(`Successfully loaded data for ${player.name.get()}.`);
        return playerData;
      } catch (error) {
        console.error(`Failed to parse data for player ${player.name.get()}:`, error);
      }
    }
    
    // If no data is found or parsing fails, create and cache default data.
    console.log(`No persistent data found for ${player.name.get()}. Creating default.`);
    const defaultData: PlayerData = { score: 0, level: 1, lastLogin: Date.now() };
    this.playerDataCache.set(player.id, defaultData);
    return defaultData;
  }

  /**
   * Saves a player's data to persistent storage.
   * @param player The player whose data to save.
   * @param data The data object to save.
   */
  public savePlayerData(player: Player, data: PlayerData): void {
    try {
      const playerKey = `playerData:${player.id}`;
      // Update last login time before saving
      const dataToSave = { ...data, lastLogin: Date.now() };
      const dataString = JSON.stringify(dataToSave);

      this.world.persistentStorage.setPlayerVariable(player, playerKey, dataString);
      this.playerDataCache.set(player.id, dataToSave); // Also update the cache
      console.log(`Successfully saved data for ${player.name.get()}.`);
    } catch (error) {
      console.error(`Failed to save data for player ${player.name.get()}:`, error);
    }
  }

  /**
   * Retrieves the cached data for a player for use by other scripts.
   * @param player The player to get data for.
   * @returns The cached PlayerData or undefined if not loaded.
   */
  public getPlayerData(player: Player): PlayerData | undefined {
    return this.playerDataCache.get(player.id);
  }
}

Component.register(PersistenceManager);