"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const HapticFeedback_1 = require("HapticFeedback");
const _2p_1 = require("horizon/2p");
const core_1 = require("horizon/core");
const StageHand_1 = require("StageHand");
const Throttler_1 = require("Throttler");
class Axe extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.hand = HapticFeedback_1.HapticHand.Right;
        this.triggerSub = null;
        this.inRangeSub = null;
    }
    Start() {
        super.Start();
        if (this.entity.owner.get() == this.world.getServerPlayer()) {
            StageHand_1.StageHand.instance.addCuePosition(this.entity, this.entity.position.get(), this.entity.rotation.get());
        }
    }
    OnGrabStart(isRightHand, player) {
        this.entity.owner.set(player);
        if (isRightHand) {
            this.hand = HapticFeedback_1.HapticHand.Right;
        }
        else {
            this.hand = HapticFeedback_1.HapticHand.Left;
        }
        if (player.deviceType.get() != core_1.PlayerDeviceType.VR) {
            this.triggerSub = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, (triggerPlayer) => {
                Throttler_1.Throttler.try("AxeHit", () => {
                    this.entity.owner.get().playAvatarGripPoseAnimationByName(core_1.AvatarGripPoseAnimationNames.Fire);
                    this.sendNetworkBroadcastEvent(Events_1.Events.monstersInRange, { entity: this.entity, range: this.props.threatRange });
                }, this.props.swingCooldown);
            });
            this.inRangeSub = this.connectNetworkEvent(this.entity, Events_1.Events.monstersInRangeResponse, this.hitMonsters.bind(this));
        }
    }
    OnGrabEnd() {
        this.entity.owner.set(this.world.getServerPlayer());
        this.triggerSub?.disconnect();
        this.inRangeSub?.disconnect();
    }
    OnEntityCollision(itemHit, position, normal, velocity) {
        if (this.entity.owner.get() != this.world.getServerPlayer() && this.entity.owner.get().deviceType.get() == core_1.PlayerDeviceType.VR) {
            Throttler_1.Throttler.try("AxeHit", () => {
                this.props.hitSound?.as(core_1.AudioGizmo)?.play();
                this.props.hitVfx?.position.set(position);
                this.props.hitVfx?.as(_2p_1.VFXParticleGizmo)?.play();
                HapticFeedback_1.HapticFeedback.playPattern(this.entity.owner.get(), HapticFeedback_1.HapticType.hitPlayerBody, this.hand, this);
                this.sendNetworkEvent(itemHit, Events_1.Events.axeHit, { hitPos: position, hitNormal: normal, fromPlayer: this.entity.owner.get() });
            }, this.props.swingCooldown);
        }
    }
    hitMonsters(data) {
        data.monsters.forEach((monster) => {
            var monsterVec = monster.position.get().sub(this.entity.position.get()).normalize();
            var angle = Math.acos(monsterVec.dot(this.entity.forward.get()));
            // Use half the angle because it could be left or right
            if (angle < (this.props.threatAngle / 2)) {
                this.props.hitSound?.as(core_1.AudioGizmo)?.play();
                HapticFeedback_1.HapticFeedback.playPattern(this.entity.owner.get(), HapticFeedback_1.HapticType.hitPlayerBody, this.hand, this);
                this.sendNetworkEvent(monster, Events_1.Events.axeHit, { hitPos: monster.position.get().add(new core_1.Vec3(0, 1, 0)), hitNormal: this.entity.forward.get(), fromPlayer: this.entity.owner.get() });
            }
        });
    }
}
Axe.propsDefinition = {
    swingCooldown: { type: core_1.PropTypes.Number, default: 200 },
    threatRange: { type: core_1.PropTypes.Number, default: 2.0 },
    threatAngle: { type: core_1.PropTypes.Number, default: 45.0 },
    hitSound: { type: core_1.PropTypes.Entity },
    hitVfx: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(Axe);
