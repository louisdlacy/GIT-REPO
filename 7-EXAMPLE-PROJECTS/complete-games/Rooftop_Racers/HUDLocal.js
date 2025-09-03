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
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 *  Local Player UI script that tells the player which race position they are and the race timings
 */
const hz = __importStar(require("horizon/core"));
const Events_1 = require("Events");
const GameUtils_1 = require("GameUtils");
class HUDLocal extends hz.Component {
    constructor() {
        super(...arguments);
        this.localMatchTime = 0;
        this.updateUI = false;
        this.playerBoostSub = null;
        this.stopRacePosUpdatesSub = null;
        this.racePosUpdateSub = null;
        this.playerUsedBoostSub = null;
        this.worldUpdateSub = null;
        this.racePosition = "";
        this.matchTime = "";
        this.boostInactiveColor = new hz.Color(1, 0, 0);
        this.boostActiveColor = new hz.Color(0, 1, 0);
        this.iconGroup = null;
        this.innerIcon = null;
        this.timerTextGizmo = null;
        this.positionTextGizmo = null;
        this.shouldSpinStar = false;
        this.spinCounter = 0;
        this.spinDuration = 2;
        this.spinSpeed = 5;
        this.fromRotation = hz.Quaternion.fromEuler(new hz.Vec3(180, 0, 90), hz.EulerOrder.XYZ);
        this.toRotation = hz.Quaternion.fromEuler(new hz.Vec3(0, 0, 90), hz.EulerOrder.XYZ);
    }
    preStart() {
        if (!this.innerIcon) {
            this.innerIcon = this.props.iconColorEntity;
        }
        if (!this.iconGroup) {
            this.iconGroup = this.props.superIcon;
            this.iconGroup?.transform.localRotation.set(this.fromRotation);
        }
        if (!this.timerTextGizmo) {
            this.timerTextGizmo = this.props.timerText.as(hz.TextGizmo);
        }
        if (!this.positionTextGizmo) {
            this.positionTextGizmo = this.props.positionText.as(hz.TextGizmo);
        }
        this.owner = this.entity.owner.get(); //get owner, init fires when ownership changes
        if (this.owner === this.world.getServerPlayer()) {
            this.cleanup();
            this.entity.as(hz.AttachableEntity)?.detach();
            this.entity.visible.set(false);
        }
        else {
            this.setInactiveBoostColor();
            this.playerBoostSub = this.connectNetworkEvent(this.owner, Events_1.Events.onPlayerGotBoost, () => {
                this.activateBoostAbility();
            });
            this.stopRacePosUpdatesSub = this.connectNetworkEvent(this.owner, Events_1.Events.onStopRacePosUpdates, () => {
                this.updateUI = false;
            });
            this.racePosUpdateSub = this.connectNetworkEvent(this.owner, Events_1.Events.onRacePosUpdate, (data) => {
                this.updateUI = true;
                this.racePosition = `${data.playerPos} of ${data.totalRacers}`;
                this.localMatchTime = data.matchTime; //We update the local match time to follow the server's
            });
            this.playerUsedBoostSub = this.connectLocalEvent(this.owner, Events_1.Events.onPlayerUsedBoost, () => {
                this.props.vfx?.as(hz.ParticleGizmo)?.play();
                this.setInactiveBoostColor();
            });
            this.worldUpdateSub = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
                if (!this.updateUI) {
                    return;
                }
                this.localMatchTime += data.deltaTime;
                this.timerTextGizmo?.text.set(`<line-height=75%>${(0, GameUtils_1.msToMinutesAndSeconds)(this.localMatchTime)}`);
                this.positionTextGizmo?.text.set(`<line-height=75%>${this.racePosition}`);
                /** Star spin effect in HUD */
                if (this.shouldSpinStar === true) {
                    const current = this.iconGroup?.transform.localRotation.get();
                    if (current != undefined) {
                        if (this.spinCounter < this.spinDuration) {
                            this.iconGroup?.transform.localRotation.set(hz.Quaternion.slerp(current, this.toRotation, this.spinCounter));
                            this.spinCounter += data.deltaTime * this.spinSpeed;
                        }
                    }
                    if (this.spinCounter >= this.spinDuration) {
                        this.shouldSpinStar = false;
                        this.iconGroup?.transform.localRotation.set(this.fromRotation);
                    }
                }
            });
            this.connectLocalEvent(this.owner, Events_1.Events.onResetLocalObjects, (data) => {
                this.reset();
            });
            let attachableEnt = this.entity.as(hz.AttachableEntity);
            attachableEnt?.detach();
            attachableEnt?.visible.set(true);
            attachableEnt?.setVisibilityForPlayers([this.owner], hz.PlayerVisibilityMode.VisibleTo);
            attachableEnt?.attachToPlayer(this.owner, hz.AttachablePlayerAnchor.Head);
        }
    }
    start() {
        if (this.owner === this.world.getServerPlayer()) {
            this.sendLocalBroadcastEvent(Events_1.Events.onRegisterRaceHUD, {
                caller: this.entity,
            });
        }
    }
    setActiveBoostColor() {
        const star = this.innerIcon?.as(hz.MeshEntity);
        star.style.tintColor.set(this.boostActiveColor);
        star.style.tintStrength.set(1);
        star.style.brightness.set(5);
    }
    setInactiveBoostColor() {
        const star = this.innerIcon?.as(hz.MeshEntity);
        star.style.tintColor.set(this.boostInactiveColor);
        star.style.tintStrength.set(1);
        star.style.brightness.set(5);
    }
    activateBoostAbility() {
        this.setActiveBoostColor();
        this.spinCounter = 0;
        this.iconGroup?.transform.localRotation.set(this.fromRotation);
        this.shouldSpinStar = true;
    }
    cleanup() {
        this.playerBoostSub?.disconnect();
        this.stopRacePosUpdatesSub?.disconnect();
        this.racePosUpdateSub?.disconnect();
        this.playerUsedBoostSub?.disconnect();
        this.worldUpdateSub?.disconnect();
        this.playerBoostSub = null;
        this.stopRacePosUpdatesSub = null;
        this.racePosUpdateSub = null;
        this.playerUsedBoostSub = null;
        this.worldUpdateSub = null;
        this.reset();
    }
    reset() {
        this.setInactiveBoostColor();
        this.racePosition = "";
        this.matchTime = "";
        this.timerTextGizmo?.text.set(`<line-height=75%>${this.matchTime}`);
        this.positionTextGizmo?.text.set(`<line-height=75%>${this.racePosition}`);
        this.entity.position.set(hz.Vec3.zero);
    }
}
HUDLocal.propsDefinition = {
    superIcon: { type: hz.PropTypes.Entity },
    timerText: { type: hz.PropTypes.Entity },
    positionText: { type: hz.PropTypes.Entity },
    iconColorEntity: { type: hz.PropTypes.Entity },
    vfx: { type: hz.PropTypes.Entity },
    // UIHolder: { type: hz.PropTypes.Entity },
};
hz.Component.register(HUDLocal);
