"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
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
exports.PlayerControllerLocal = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Local Script that takes the Players input and allows for doublejump and boost jumping.
 * Additionally, for responsiveness of game effects, it also plays SFX and VFX for players.
 */
const Events_1 = require("Events");
const hz = __importStar(require("horizon/core"));
const MathUtils = __importStar(require("MathUtils"));
class PlayerControllerLocal extends hz.Component {
    constructor() {
        super(...arguments);
        this.boostUsedParticleVFX = null;
        this.hasJumped = false;
        // Double Jump vars
        this.jump1 = false;
        this.jump2 = false;
        // Boosted Jump vars
        this.isBoosted = false;
        this.canBoost = false;
        this.boostJumpAmount = 12;
        this.boostJumpRadians = 1.5;
        this.doubleJumpAmount = 5;
        this.connectedJumpInput = null;
        this.connectedBoostInput = null;
        this.connectLocalControlX = null;
        this.connectLocalControlY = null;
        this.onUpdateSub = null;
        this.setJumpCtrlDataSub = null;
        this.onPlayerOOBSub = null;
        this.stopRacePosUpdatesSub = null;
        this.playerGotBoostSub = null;
    }
    preStart() {
        this.owner = this.entity.owner.get(); //set owner
        if (this.owner !== this.world.getServerPlayer()) {
            this.localPreStart();
        }
    }
    start() {
        if (this.owner === this.world.getServerPlayer()) {
            this.serverStart();
        }
        else {
            this.localStart();
        }
    }
    serverStart() {
        this.cleanup();
        this.sendLocalBroadcastEvent(Events_1.Events.onRegisterPlyrCtrl, {
            caller: this.entity,
        });
    }
    localPreStart() {
        this.connectDoubleJumpInputs();
        this.connectBoostJumpInputs();
        this.doubleJumpSFX = this.props.doubleJumpSFX?.as(hz.AudioGizmo);
        this.boostUsedSFX = this.props.boostUsedSFX?.as(hz.AudioGizmo);
        this.boostReceivedSFX = this.props.boostReceivedSFX?.as(hz.AudioGizmo);
        this.respawnSFX = this.props.respawnSFX?.as(hz.AudioGizmo);
        this.localSFXSettings = { fade: 0, players: [this.owner] }; //optimization to create the a local only sound setting
        this.boostUsedParticleVFX = this.props.boostUsedParticleVFX?.as(hz.ParticleGizmo);
        this.onUpdateSub = this.connectLocalBroadcastEvent(hz.World.onUpdate, () => {
            //reset ability to double jump or boost when player is grounded
            if (this.hasJumped && this.owner.isGrounded.get()) {
                this.hasJumped = false;
                this.jump1 = false;
                this.jump2 = false;
                this.isBoosted = false;
            }
        });
        this.playerGotBoostSub = this.connectNetworkEvent(this.owner, Events_1.Events.onPlayerGotBoost, () => {
            this.canBoost = true;
            this.boostReceivedSFX?.play(this.localSFXSettings);
        });
        this.setJumpCtrlDataSub = this.connectNetworkEvent(this.owner, Events_1.Events.onSetPlyrCtrlData, (data) => {
            this.boostJumpAmount = data.boostJumpAmount;
            this.boostJumpRadians = data.boostJumpAngle * MathUtils.Deg2Rad;
            this.doubleJumpAmount = data.doubleJumpAmount;
        });
        this.onPlayerOOBSub = this.connectNetworkEvent(this.owner, Events_1.Events.onPlayerOutOfBounds, () => {
            this.respawnSFX?.play(this.localSFXSettings);
        });
        this.connectLocalEvent(this.owner, Events_1.Events.onResetLocalObjects, () => {
            this.reset();
        });
    }
    localStart() {
        this.sendNetworkBroadcastEvent(Events_1.Events.onGetPlyrCtrlData, {
            caller: this.owner,
        });
    }
    connectDoubleJumpInputs() {
        this.connectedJumpInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.Jump, hz.ButtonIcon.Jump, this);
        this.connectedJumpInput.registerCallback((input, pressed) => {
            if (!pressed) {
                return;
            }
            this.hasJumped = true;
            if (!this.jump1 && !this.jump2) {
                this.jump1 = true;
            }
            else if (this.jump1 && !this.jump2) {
                this.jump2 = true;
                let ownerVel = this.owner.velocity.get();
                this.owner.velocity.set(new hz.Vec3(ownerVel.x, this.doubleJumpAmount, ownerVel.z));
                this.doubleJumpSFX?.play(this.localSFXSettings);
                this.sendNetworkEvent(this.owner, Events_1.Events.onPlayerUsedDoubleJump, {});
            }
        });
    }
    connectBoostJumpInputs() {
        this.connectedBoostInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.RightSecondary, hz.ButtonIcon.RocketJump, this, { preferredButtonPlacement: hz.ButtonPlacement.Default });
        this.connectLocalControlX = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftXAxis, hz.ButtonIcon.RocketJump, this);
        this.connectLocalControlY = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftYAxis, hz.ButtonIcon.RocketJump, this);
        this.connectedBoostInput.registerCallback((input, pressed) => {
            if (!pressed) {
                return;
            }
            this.hasJumped = true;
            if (!this.isBoosted && this.canBoost) {
                this.canBoost = false;
                let XAxis = this.connectLocalControlX?.axisValue.get();
                let YAxis = this.connectLocalControlY?.axisValue.get();
                //If there is no player movement, default to boosting forward by taking the Y axis
                if (XAxis === undefined ||
                    YAxis === undefined ||
                    (XAxis === 0 && YAxis === 0)) {
                    XAxis = 0;
                    YAxis = 1;
                }
                //Get the boost XZ vector, then rotate it by the provided angle
                const boostJump = this.getBoostVectorBasedOnInput(XAxis, YAxis, this.owner.forward.get(), this.boostJumpRadians, this.boostJumpAmount);
                //instead of adding, we just set the velocity to the boost jump vector so as to be more responsive
                this.owner.velocity.set(boostJump);
                this.isBoosted = true;
                this.boostUsedSFX?.play(this.localSFXSettings);
                this.entity.position.set(this.owner.position.get());
                this.boostUsedParticleVFX?.play();
                this.sendLocalEvent(this.owner, Events_1.Events.onPlayerUsedBoost, {});
            }
        });
    }
    getBoostVectorBasedOnInput(XaxisInput, YaxisInput, ownerfacing, boostAngle, boostForce) {
        const facingXZ = new hz.Vec3(ownerfacing.x, 0, ownerfacing.z).normalizeInPlace();
        //based on the player's XZ facing, rotate the input to their facing, Yaxis being equal to their forward
        const angleRads = MathUtils.getClockwiseAngle(hz.Vec3.forward, facingXZ);
        const quartForControl = hz.Quaternion.fromAxisAngle(hz.Vec3.up, angleRads);
        const movementDir = new hz.Vec3(XaxisInput, 0, YaxisInput).normalizeInPlace();
        //Get the final XZ direction for the boost vector
        const boostFlatDir = hz.Quaternion.mulVec3(quartForControl, movementDir);
        //Rotate the boost direction by the angle in the direction of facing
        const rotation = hz.Quaternion.fromAxisAngle(boostFlatDir.cross(hz.Vec3.up), boostAngle);
        const boostJump = hz.Quaternion.mulVec3(rotation, boostFlatDir).mulInPlace(boostForce);
        return boostJump;
    }
    reset() {
        this.hasJumped = false;
        this.jump1 = false;
        this.jump2 = false;
        this.isBoosted = false;
        this.canBoost = false;
    }
    cleanup() {
        this.connectedJumpInput?.unregisterCallback();
        this.connectedJumpInput?.disconnect();
        this.connectedJumpInput = null;
        this.connectedBoostInput?.unregisterCallback();
        this.connectedBoostInput?.disconnect();
        this.connectedBoostInput = null;
        this.connectLocalControlX?.unregisterCallback();
        this.connectLocalControlX?.disconnect();
        this.connectLocalControlX = null;
        this.connectLocalControlY?.unregisterCallback();
        this.connectLocalControlY?.disconnect();
        this.connectLocalControlY = null;
        this.onUpdateSub?.disconnect();
        this.onUpdateSub = null;
        this.playerGotBoostSub?.disconnect();
        this.playerGotBoostSub = null;
        this.setJumpCtrlDataSub?.disconnect();
        this.setJumpCtrlDataSub = null;
        this.onPlayerOOBSub?.disconnect();
        this.onPlayerOOBSub = null;
        this.stopRacePosUpdatesSub?.disconnect();
        this.stopRacePosUpdatesSub = null;
    }
}
exports.PlayerControllerLocal = PlayerControllerLocal;
PlayerControllerLocal.propsDefinition = {
    doubleJumpSFX: { type: hz.PropTypes.Entity },
    boostUsedSFX: { type: hz.PropTypes.Entity },
    boostReceivedSFX: { type: hz.PropTypes.Entity },
    respawnSFX: { type: hz.PropTypes.Entity },
    boostUsedParticleVFX: { type: hz.PropTypes.Entity },
};
hz.Component.register(PlayerControllerLocal);
