"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueTaskGoTo = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const FtueTask_1 = require("FtueTask");
const core_1 = require("horizon/core");
class FtueTaskGoTo extends FtueTask_1.FtueTask {
    constructor() {
        super();
        this.updateListener = null;
        this.player = null;
    }
    start() {
        super.start();
        this.entity.visible.set(false);
    }
    onTaskStart(player) {
        this.player = player;
        this.setPosition();
        if (!this.props.entityGoal) {
            return;
        }
        if (this.props.newGoalSfx) {
            this.props.newGoalSfx.position.set(this.player.position.get());
            this.props.newGoalSfx.as(core_1.AudioGizmo).play();
        }
        if (this.props.followArrow) {
            this.props.followArrow.visible.set(true);
        }
        if (this.props.goalMarker) {
            this.props.goalMarker.visible.set(true);
            this.props.goalMarker.position.set(this.props.entityGoal.position.get());
        }
        this.updateListener = this.connectLocalBroadcastEvent(core_1.World.onUpdate, (data) => {
            this.update(data.deltaTime);
        });
    }
    onTaskComplete(player) {
        this.updateListener?.disconnect();
        if (this.props.followArrow) {
            if (this.props.arrowDisappearVfx) {
                this.props.arrowDisappearVfx.position.set(this.props.followArrow.position.get());
                this.props.arrowDisappearVfx.as(core_1.ParticleGizmo).play();
            }
            this.props.followArrow.visible.set(false);
        }
        if (this.props.goalReachedSfx) {
            this.props.goalReachedSfx.position.set(this.props.entityGoal.position.get());
            this.props.goalReachedSfx.as(core_1.AudioGizmo).play();
        }
        if (this.props.goalMarker) {
            this.props.goalMarker.visible.set(false);
        }
    }
    update(deltaTime) {
        this.setPosition();
    }
    setPosition() {
        const playerPos = this.player.position.get();
        const goalPos = this.props.entityGoal.position.get();
        // Close enough
        let playerToGoal = goalPos.sub(playerPos);
        if (playerToGoal.magnitudeSquared() < this.props.goalRadius * this.props.goalRadius) {
            this.complete(this.player);
        }
        // Update the follow arrow
        if (this.props.followArrow) {
            let playerToArrow = playerToGoal.normalize();
            const arrowPos = playerPos.add(playerToArrow.mul(this.props.playerArrowOffset));
            const arrowToGoal = goalPos.sub(arrowPos);
            const arrowToGoalRight = arrowToGoal.cross(core_1.Vec3.up);
            const arrowToGoalUp = arrowToGoal.cross(arrowToGoalRight);
            this.props.followArrow.position.set(arrowPos);
            this.props.followArrow.rotation.set(core_1.Quaternion.lookRotation(arrowToGoal.normalize(), arrowToGoalUp.normalize()));
        }
    }
}
exports.FtueTaskGoTo = FtueTaskGoTo;
FtueTaskGoTo.propsDefinition = {
    ...FtueTask_1.FtueTask.propsDefinition,
    entityGoal: { type: core_1.PropTypes.Entity },
    goalRadius: { type: core_1.PropTypes.Number },
    followArrow: { type: core_1.PropTypes.Entity },
    playerArrowOffset: { type: core_1.PropTypes.Number, default: 2 },
    goalMarker: { type: core_1.PropTypes.Entity },
    goalMarkerOffset: { type: core_1.PropTypes.Vec3, default: core_1.Vec3.zero },
    arrowDisappearVfx: { type: core_1.PropTypes.Entity },
    newGoalSfx: { type: core_1.PropTypes.Entity },
    goalReachedSfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(FtueTaskGoTo);
