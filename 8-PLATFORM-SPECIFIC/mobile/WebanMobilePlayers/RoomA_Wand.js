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
// TODO: Disable HWXS Grab Relax Animation in the property panel of grabbable objects
class RoomA_Wand extends hz.Component {
    start() {
        const launcher = this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo);
        const door = this.props.objectToMove;
        if (launcher === undefined || launcher === null)
            return;
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
            // Set ownership of the launcher to the player. This will also allow us to set the aim direction on web and mobile,
            // shooting projectile in the direction the camera is facing
            launcher.owner.set(player);
            // Send event to HintHUDManager to display wand hint
            this.sendNetworkBroadcastEvent(sysEvents_1.sysEvents.OnDisplayHintHUD, { players: [player], text: this.props.hintText, duration: this.props.hintDuration });
            // Play animation and launch projectile on index trigger down
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player) => {
                player.playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
                // Small delay to allow the animation to play before launching the projectile
                this.async.setTimeout(() => launcher.launchProjectile(), 30);
            });
            // Solve puzzle when door is hit
            this.connectCodeBlockEvent(launcher, hz.CodeBlockEvents.OnProjectileHitObject, (obj, position, normal) => {
                if (obj === door && this.props.puzzleManager) {
                    this.sendNetworkEvent(this.props.puzzleManager, sysEvents_1.sysEvents.OnFinishPuzzle, {});
                }
            });
        });
    }
}
RoomA_Wand.propsDefinition = {
    projectileLauncher: { type: hz.PropTypes.Entity },
    hintText: { type: hz.PropTypes.String },
    hintDuration: { type: hz.PropTypes.Number, default: 2 },
    puzzleManager: { type: hz.PropTypes.Entity },
    objectToMove: { type: hz.PropTypes.Entity },
};
hz.Component.register(RoomA_Wand);
