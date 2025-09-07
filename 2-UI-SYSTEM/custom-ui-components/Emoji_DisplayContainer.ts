//--- SCRIPT: Emoji_DisplayContainer.ts ---//
// Functionality: Manages the spawned emoji pop - up asset.
// Type: Server Script
// Placement: Attached to the root of the dynamically spawned EmojiPopupAsset.
// Responsibilities:
// - Listens for the InitializePopupEvent from the Emoji_Controller.
// - Identifies the target player and continuously follows their head position in a server - side update loop.
// - Controls the continuous rotation of the pop - up asset.
// - Relays the necessary animation and color data to its child Emoji_UI_Display components via the RelayInitializePopupEvent.


import * as hz from 'horizon/core';
import { InitializePopupEvent, RelayInitializePopupEvent } from './Emoji_Globals';

export class Emoji_DisplayContainer extends hz.Component<typeof Emoji_DisplayContainer> {
    static propsDefinition = {};

    private currentYAngle = 0;
    private rotationSpeed = 3.5;
    private isUpdating = false;
    private targetPlayer: hz.Player | null = null;

    start() {
        // NOTE: This now expects an `imageScale` and `popupDriftAmount` property from the event.
        // You must update the InitializePopupEvent definition in Emoji_Globals.ts to include them.
        this.connectNetworkEvent(this.entity, InitializePopupEvent, (data) => {
            if (!data) return;

            const allPlayers = this.world.getPlayers();
            this.targetPlayer = allPlayers.find(p => p.id === data.playerId) || null;

            if (!this.targetPlayer) {
                console.error(`Emoji_DisplayContainer: Could not find player with ID ${data.playerId}. Deleting pop-up.`);
                this.world.deleteAsset(this.entity, true);
                return;
            }

            this.rotationSpeed = data.popupRotationSpeed;
            this.isUpdating = true;
            this.currentYAngle = Math.random() * 2 * Math.PI;

            const imageScale = (data as any).imageScale || 0.2;
            const inverseScale = imageScale !== 0 ? 1 / imageScale : 1;

            const driftAmount = (data as any).popupDriftAmount || 0.1;
            const startPosition = new hz.Vec3(0, 0, 0);

            const restingY = data.popupRestingHeight * inverseScale;
            const exitY = data.popupExitHeight * inverseScale;

            // NEW (v0.20): Calculate a random point within a circle for a more natural drift.
            const restingAngle = Math.random() * 2 * Math.PI;
            // Use Math.sqrt on the random value to ensure a uniform distribution within the circle.
            const restingRadius = Math.sqrt(Math.random()) * driftAmount;
            const restingX = Math.cos(restingAngle) * restingRadius;
            const restingZ = Math.sin(restingAngle) * restingRadius;
            const restingPositionFront = new hz.Vec3(restingX, restingY, restingZ);

            // The exit position also gets a smaller, circular random drift from the resting position.
            const exitDriftAmount = driftAmount / 2;
            const exitAngle = Math.random() * 2 * Math.PI;
            const exitRadius = Math.sqrt(Math.random()) * exitDriftAmount;
            const exitX = restingPositionFront.x + Math.cos(exitAngle) * exitRadius;
            const exitZ = restingPositionFront.z + Math.sin(exitAngle) * exitRadius;
            const exitPositionFront = new hz.Vec3(exitX, exitY, exitZ);

            this.sendNetworkEvent(this.entity, RelayInitializePopupEvent, {
                ...data,
                startPosition: startPosition,
                restingPosition: restingPositionFront,
                exitPosition: exitPositionFront,
            });
        });

        this.connectLocalBroadcastEvent(hz.World.onUpdate, (updateData: { deltaTime: number }) => {
            if (this.isUpdating && this.targetPlayer) {
                const targetPosition = this.targetPlayer.head.position.get();
                this.entity.position.set(targetPosition);

                this.currentYAngle += this.rotationSpeed * updateData.deltaTime;
                const newRotation = hz.Quaternion.fromAxisAngle(hz.Vec3.up, this.currentYAngle);
                this.entity.rotation.set(newRotation);
            }
        });
    }
}

hz.Component.register(Emoji_DisplayContainer);

