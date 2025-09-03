"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hz = __importStar(require("horizon/core"));
const sysEvents_1 = require("sysEvents");
class RoomB_RotateClues extends hz.Component {
    start() {
        this.activePlayer = this.world.getServerPlayer();
        const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 1, 0));
        const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(90, 0, 0));
        this.vrPlayers = [];
        // Set who can grab the object to none at first
        this.SetWhoCanGrabObject([]);
        // Set who can grab the object to VR players only. Web and Mobile players will use Focused Interactions instead of grabbing the object to interact with it
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
                this.vrPlayers.push(player);
                this.SetWhoCanGrabObject(this.vrPlayers);
            }
        });
        // Updating who can grab the object when a player leaves the world
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
                let playerIndex = this.vrPlayers.indexOf(player);
                if (playerIndex > -1) {
                    this.vrPlayers.splice(playerIndex, 1);
                }
                this.SetWhoCanGrabObject(this.vrPlayers);
            }
        });
        // Enter Focused Interaction mode when a non-VR player interacts with the object
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR && this.props.objectToDrag !== undefined) {
                this.activePlayer = player;
                this.SetWhoCanGrabObject([]);
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
            }
        });
        // Reset status after a player exits Focused Interaction mode
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnExitFocusMode, (data) => {
            if (this.activePlayer === data.player) {
                this.activePlayer = this.world.getServerPlayer();
                this.SetWhoCanGrabObject(this.vrPlayers);
            }
        });
        // Tracking Focused Interaction inputs to rotate the object
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputStarted, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0) {
                this.dragLastPos = interaction.screenPosition;
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputMoved, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0) {
                if (this.dragLastPos === undefined || this.props.objectToDrag === undefined)
                    return;
                let dragDelta = interaction.screenPosition.sub(this.dragLastPos);
                if (dragDelta.magnitude() > 0) {
                    let newRotation = hz.Quaternion.fromEuler(new hz.Vec3(dragDelta.y * 1080, 0, -dragDelta.x * 1080));
                    this.props.objectToDrag.rotation.set(newRotation.mul(this.props.objectToDrag.rotation.get()));
                }
                this.dragLastPos = interaction.screenPosition;
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputEnded, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0) {
                this.dragLastPos = undefined;
            }
        });
    }
    SetWhoCanGrabObject(players) {
        if (this.props.objectToDrag !== undefined && this.props.objectToDrag.simulated.get()) {
            this.props.objectToDrag.as(hz.GrabbableEntity)?.setWhoCanGrab(players);
        }
    }
}
RoomB_RotateClues.propsDefinition = {
    objectToDrag: { type: hz.PropTypes.Entity },
};
hz.Component.register(RoomB_RotateClues);
