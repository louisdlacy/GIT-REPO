import * as hz from 'horizon/core';

// Step 1: Attach this script to an empty entity in the world.
// Step 2: Attach the PlayerCamera.ts script to an empty entity in the world.
// Step 3: Duplicate the entity with the PlayerCamera.ts script attached. You should have one per player, so the same amount as the maximum number of players in your world.

export const CameraManagerEvents = {
  OnRegisterPlayerCamera: new hz.NetworkEvent<{ ObjectId: string, Object: hz.Entity}>('OnRegisterPlayerCamera'),
}

interface AssignCameraAttempts {
  player: hz.Player;
  attempts: number;
}

class PlayerCameraManager extends hz.Component<typeof PlayerCameraManager> {
  static propsDefinition = {};

  private playerCameras: hz.Entity[] = [];

  private assignCameraIntervalId: number = -1;
  private assignCameraAttempts: AssignCameraAttempts[] = [];
  private retryCameraAssignDelay: number = 0.1;
  private maxAssignAttempts: number = 5;

  preStart(): void {
    this.connectNetworkBroadcastEvent(CameraManagerEvents.OnRegisterPlayerCamera, ({ObjectId, Object}) => {
      if (ObjectId === "PlayerCamera") {
        this.playerCameras.push(Object);
      }
    });
  }

  start() {
    // When a web/mobile player enters the world, assign them a camera.
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      if (player.deviceType.get() !== hz.PlayerDeviceType.VR){
        this.assignCameraAttempts.push({player, attempts: 0});
        if (this.assignCameraIntervalId === -1){
          this.assignCameraIntervalId = this.async.setInterval(() => {
            this.assignPlayerCamera();
          }, this.retryCameraAssignDelay * 1000);
        }
      }
    });
    // When a web/mobile player leaves the world, reassign their camera to the server player.
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      if (player.deviceType.get() !== hz.PlayerDeviceType.VR){
        console.log("Player left world");
        this.unassignPlayerCamera(player);
      }
    });
  }

  assignPlayerCamera(): void {
    // Reverse iterate through the list of players without a camera. We reverse iterate because we can then remove from the attempts list as we go.
    let playerAttemptIndex = this.assignCameraAttempts.length - 1;
    while (playerAttemptIndex >= 0) {
      const player = this.assignCameraAttempts[playerAttemptIndex].player;
      this.assignCameraAttempts[playerAttemptIndex].attempts++;
      if (this.assignCameraAttempts[playerAttemptIndex].attempts >= this.maxAssignAttempts) {
        console.error("Failed to assign a camera to " + player.name.get() + " after " + this.maxAssignAttempts + " attempts. Giving up.");
        this.assignCameraAttempts.splice(playerAttemptIndex, 1);
      } else {
        const assignedCamera = this.attemptAssignCamera(player);
        if (assignedCamera) {
          this.assignCameraAttempts.splice(playerAttemptIndex, 1);
        }
      }
      playerAttemptIndex--;
    }
    // If there are no more players without a camera, clear the interval.
    if (this.assignCameraAttempts.length === 0){
      this.async.clearInterval(this.assignCameraIntervalId);
      this.assignCameraIntervalId = -1;
    }
  }

  // Returns true if the camera was assigned successfully. Otherwise returns false and shows a warning in the console.
  attemptAssignCamera(player: hz.Player): boolean {
    const playerCamera = this.getCameraForPlayer(player);
    if (playerCamera === undefined) {
      // This could be caused by a race condition where not all the cameras have been registered yet.
      // Or could just be there is not enough cameras for the number of players.
      console.warn("Attempted to assign a camera to " + player.name.get() + " but there was no camera for this player index (Player index: "+ player.index.get() +"). Retrying...");
      console.log("Hint: Check you have enough PlayerCamera objects in the world.");
      return false;
    } else if(playerCamera.owner.get() !== this.world.getServerPlayer()){
      console.error("Attempted to assign a camera to " + player.name.get() + " but it is already assigned to " + playerCamera.owner.get().name.get() + ". Error with player.index.");
      // Returning true here will cause the camera to be re-assigned to the newer player.
      return false;
    } else {
      console.log("Found a camera for " + player.name.get() + " (Player index: "+ player.index.get() + ")");
      playerCamera.owner.set(player);
      return true;
    }
  }

  getCameraForPlayer(player: hz.Player): hz.Entity | undefined {
    const playerIndex = player.index.get();
    if (playerIndex < this.playerCameras.length){
      return this.playerCameras[playerIndex];
    } else {
      return undefined;
    }
  }

  unassignPlayerCamera(player: hz.Player): void {
    this.playerCameras[player.index.get()].owner.set(this.world.getServerPlayer());
  }
}
hz.Component.register(PlayerCameraManager);
