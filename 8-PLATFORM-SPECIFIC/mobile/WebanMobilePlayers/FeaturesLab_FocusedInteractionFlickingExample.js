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
const sysUtils_1 = require("sysUtils");
class FeaturesLab_FocusedInteractionFlickingExample extends hz.Component {
    constructor() {
        super(...arguments);
        this.canSwipe = true;
    }
    start() {
        this.activePlayer = this.world.getServerPlayer();
        const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 10, 3));
        const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(90, 0, 0));
        if (this.props.objectToFlick !== undefined) {
            this.objectStartPos = this.props.objectToFlick.position.get();
            this.objectStartRot = this.props.objectToFlick.rotation.get();
            this.objectPhysicalEntity = this.props.objectToFlick.as(hz.PhysicalEntity);
        }
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
                this.activePlayer = player;
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
                (0, sysUtils_1.SetTextGizmoText)(this.props.focusedInteractionFlickingText, `Focused Interaction<br>Flicking<br>Active player: ${player.name.get()}`);
                this.props.focusedInteractionFlickingInstructionsText?.visible.set(true);
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnExitFocusMode, (data) => {
            if (this.activePlayer === data.player) {
                this.activePlayer = this.world.getServerPlayer();
                this.ResetObject();
                (0, sysUtils_1.SetTextGizmoText)(this.props.focusedInteractionFlickingText, "Focused Interaction<br>Flicking");
                this.props.focusedInteractionFlickingInstructionsText?.visible.set(false);
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputStarted, (data) => {
            if (!this.canSwipe || data.interactionInfo.interactionIndex !== 0)
                return;
            this.dragStartPos = data.interactionInfo.screenPosition;
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputEnded, (data) => {
            if (!this.canSwipe || data.interactionInfo.interactionIndex !== 0 || this.dragStartPos === undefined)
                return;
            let dragTotalDelta = data.interactionInfo.screenPosition.sub(this.dragStartPos);
            let dragAngle = 90 - (Math.atan2(dragTotalDelta.y, dragTotalDelta.x) * 180) / Math.PI;
            dragAngle *= 0.25;
            let force = hz.Vec3.zero;
            force.x += 1000 * (dragTotalDelta.x / 100);
            force.z += 1000 * (dragTotalDelta.y / 100);
            this.objectPhysicalEntity?.applyForce(force.mul(1000), hz.PhysicsForceMode.Impulse);
            this.dragStartPos = undefined;
            this.canSwipe = false;
            this.async.setTimeout(() => {
                this.ResetObject();
            }, 1500);
        });
    }
    ResetObject() {
        if (this.props.objectToFlick !== undefined) {
            this.props.objectToFlick.position.set(this.objectStartPos);
            this.props.objectToFlick.rotation.set(this.objectStartRot);
        }
        this.objectPhysicalEntity?.zeroVelocity();
        this.canSwipe = true;
    }
}
FeaturesLab_FocusedInteractionFlickingExample.propsDefinition = {
    focusedInteractionFlickingText: { type: hz.PropTypes.Entity },
    focusedInteractionFlickingInstructionsText: { type: hz.PropTypes.Entity },
    objectToFlick: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_FocusedInteractionFlickingExample);
