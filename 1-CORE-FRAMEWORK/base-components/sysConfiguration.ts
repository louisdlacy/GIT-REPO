import { Component, PropTypes } from 'horizon/core';

/**
 * sysConfiguration
 * A central data container for the Game Frame Core. It holds references
 * to all manager entities, allowing other scripts to easily access any
 * system by first getting a reference to this configuration entity.
 */
class sysConfiguration extends Component<typeof sysConfiguration> {
  static propsDefinition = {
    // Core Player & Game State Managers
    accessibilityManager: { type: PropTypes.Entity },
    hudManager: { type: PropTypes.Entity },
    playerManager: { type: PropTypes.Entity },
    gameStateManager: { type: PropTypes.Entity },
    playerStatsManager: { type: PropTypes.Entity },
    globalEventManager: { type: PropTypes.Entity },
    gamePhaseManager: { type: PropTypes.Entity },

    // Gameplay & Rules Managers
    combatManager: { type: PropTypes.Entity },
    teamManager: { type: PropTypes.Entity },
    gameRulesManager: { type: PropTypes.Entity },
    teamGameRulesManager: { type: PropTypes.Entity },

    // Player Progression & Economy Managers
    economyManager: { type: PropTypes.Entity },
    shopManager: { type: PropTypes.Entity },
    inventoryManager: { type: PropTypes.Entity },
    objectiveManager: { type: PropTypes.Entity },
    persistenceManager: { type: PropTypes.Entity },

    // Player Customization Managers
    loadoutManager: { type: PropTypes.Entity },
    powerUpManager: { type: PropTypes.Entity },

    // World & Interaction Managers
    controlRoomManager: { type: PropTypes.Entity },
    worldInteractionManager: { type: PropTypes.Entity },
    spawnManager: { type: PropTypes.Entity },
  };

  override start() {
    console.log('sysConfiguration started. All manager references are configured.');
  }
}

Component.register(sysConfiguration);