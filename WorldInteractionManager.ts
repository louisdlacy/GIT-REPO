import { Component, PropTypes, Entity, NetworkEvent } from 'horizon/core';

// Forward declaration for the sysGameStateManager component type.
// This allows TypeScript to know about its methods without needing to import the full file.
declare class sysGameStateManager extends Component {
  public setGameState(newState: number): void;
  start(): void;
}

// Define the network event to listen for.
// This must match the event definition in the sending script (e.g., InteractionTrigger).
const OnWorldInteraction = new NetworkEvent<{ interactionId: string }>('OnWorldInteraction');

// Define the GameState enum locally to match sysGameStateManager.
enum GameState {
  Lobby,
  InProgress,
  PostGame,
}

/**
 * WorldInteractionManager
 * Listens for global interaction events and delegates actions to other systems.
 */
class WorldInteractionManager extends Component<typeof WorldInteractionManager> {
  static propsDefinition = {
    // Reference to the central configuration entity (gfcConfiguration).
    gfcConfiguration: { type: PropTypes.Entity },
  };

  override preStart() {
    // Connect to the global network event for world interactions.
    this.connectNetworkBroadcastEvent(OnWorldInteraction, (payload) => {
      this.handleWorldInteraction(payload.interactionId);
    });
  }

  override start() {
    console.log("WorldInteractionManager started and is listening for interactions.");
  }

  /**
   * Handles incoming interaction events and routes them to the correct logic.
   * @param interactionId The unique ID of the interaction that was triggered.
   */
  private handleWorldInteraction(interactionId: string): void {
    console.log(`Received world interaction: ${interactionId}`);

    // 1. Get the gfcConfiguration entity from props.
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("WorldInteractionManager: 'gfcConfiguration' property is not assigned.");
      return;
    }

    // 2. Get the sysGameStateManager component from the config entity.
    // Note: In a real implementation, you would get the sysConfiguration component first,
    // then get the gameStateManager entity from its props. This is a simplified approach.
    const gameStateManagerComps = configEntity.getComponents("sysGameStateManager" as any);
    if (!gameStateManagerComps || gameStateManagerComps.length === 0) {
      console.error("WorldInteractionManager: Could not find 'sysGameStateManager' component on the entity provided by gfcConfiguration.");
      return;
    }
    const gameStateManager = gameStateManagerComps[0] as sysGameStateManager;

    // Use a switch statement to handle different interaction IDs.
    switch (interactionId) {
      case 'StartGame':
        console.log("Handling 'StartGame' interaction.");
        gameStateManager.setGameState(GameState.InProgress);
        break;

      case 'EndGame':
        console.log("Handling 'EndGame' interaction.");
        gameStateManager.setGameState(GameState.PostGame);
        break;

      default:
        console.warn(`WorldInteractionManager: Received unhandled interactionId: ${interactionId}`);
        break;
    }
  }
}

Component.register(WorldInteractionManager);