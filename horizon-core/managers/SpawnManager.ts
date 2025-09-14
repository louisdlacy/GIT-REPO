import { Component, PropTypes, Entity, Player, EntityTagMatchOperation } from 'horizon/core';

// Forward declaration for the TeamManager component type.
// This allows TypeScript to know about its methods without needing to import the full file.
declare class TeamManager extends Component {
  public getPlayerTeam(player: Player): { id: string; name: string; score: number } | undefined;
  start(): void;
}

// Forward declaration for the SpawnPointController component type.
declare class SpawnPointController extends Component<typeof SpawnPointController> {
  static propsDefinition: {
    teamId: { type: typeof PropTypes.String; default: string };
  };
  start(): void;
}

/**
 * SpawnManager
 * Manages all spawn points in the world, handling spawn requests based on player teams.
 */
class SpawnManager extends Component<typeof SpawnManager> {
  static propsDefinition = {
    // Reference to the central configuration entity (gfcConfiguration).
    gfcConfiguration: { type: PropTypes.Entity },
  };

  // Cache for all spawn point entities found in the world.
  private spawnPoints: Entity[] = [];

  /**
   * On start, find and cache all entities with the SpawnPointController script.
   */
  override start() {
    if (!this.props.gfcConfiguration) {
      console.error("SpawnManager: 'gfcConfiguration' property is not assigned. Spawning will not work correctly.");
    }

    // Find all entities with the 'SpawnPoint' tag attached.
    // This is a robust way to find all spawn points in the world.
    this.spawnPoints = this.world.getEntitiesWithTags(['SpawnPoint'], EntityTagMatchOperation.HasAnyExact);

    if (this.spawnPoints.length === 0) {
      console.warn("SpawnManager: No entities with the 'SpawnPoint' tag found. Please tag your spawn point entities.");
    } else {
      console.log(`SpawnManager started and cached ${this.spawnPoints.length} spawn points.`);
    }
  }

  /**
   * Handles a request to spawn a player.
   * @param player The player to be spawned.
   */
  public requestSpawn(player: Player): void {
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("SpawnManager: Cannot process spawn request because 'gfcConfiguration' is not assigned.");
      return;
    }

    // Get the TeamManager component via the gfcConfiguration entity.
    const teamManagerComps = configEntity.getComponents(TeamManager);
    if (!teamManagerComps || teamManagerComps.length === 0) {
      console.error("SpawnManager: Could not find 'TeamManager' component on the entity provided by gfcConfiguration.");
      return;
    }
    const teamManager = teamManagerComps[0];
    const playerTeam = teamManager.getPlayerTeam(player);
    const targetTeamId = playerTeam ? playerTeam.id.toLowerCase() : 'all';

    // Filter the cached spawn points to find ones matching the player's team.
    const validSpawnPoints = this.spawnPoints.filter(sp => {
      const controller = sp.getComponents(SpawnPointController)[0];
      return controller && controller.props.teamId.toLowerCase() === targetTeamId;
    });

    if (validSpawnPoints.length === 0) {
      console.warn(`SpawnManager: No spawn points found for team '${targetTeamId}'. Trying 'all'.`);
      const allSpawnPoints = this.spawnPoints.filter(sp => {
        const controller = sp.getComponents(SpawnPointController)[0];
        return controller && controller.props.teamId.toLowerCase() === 'all';
      });
      if (allSpawnPoints.length === 0) {
        console.error("SpawnManager: No 'all' spawn points found as a fallback.");
        return;
      }
      this.teleportPlayerToRandomSpawn(player, allSpawnPoints, 'all');
      return;
    }

    this.teleportPlayerToRandomSpawn(player, validSpawnPoints, targetTeamId);
  }

  private teleportPlayerToRandomSpawn(player: Player, spawnPointList: Entity[], teamId: string) {
    const randomSpawnPoint = spawnPointList[Math.floor(Math.random() * spawnPointList.length)];
    const spawnPosition = randomSpawnPoint.position.get();
    const spawnRotation = randomSpawnPoint.rotation.get();

    console.log(`Spawning player ${player.name.get()} at ${randomSpawnPoint.name.get()} for team '${teamId}'.`);
    
    // Teleport the player to the selected spawn point's location.
    player.position.set(spawnPosition);
    player.rootRotation.set(spawnRotation);
  }
}

Component.register(SpawnManager);