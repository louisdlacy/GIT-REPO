"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootItem = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
const LootPickup = new core_1.NetworkEvent('LootPickup');
class LootItem extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.isCollected = true;
        this.lootMagnetRadiusSquared = 0;
        this.lootMagnetCaptureRadiusSquared = 0;
        this.lootTable = null;
        // There's a race condition to place the item in the world, use this as a known position
        this.basePosition = core_1.Vec3.zero;
    }
    Start() {
        this.lootMagnetRadiusSquared = this.props.lootMagnetRadius * this.props.lootMagnetRadius;
        this.lootMagnetCaptureRadiusSquared = this.props.lootMagnetCaptureRadius * this.props.lootMagnetCaptureRadius;
    }
    Update(deltaTime) {
        if (this.isCollected)
            return;
        // Loot wobble
        var wobbleVec = core_1.Vec3.up.mul(Math.sin(Date.now() / 500) * this.props.wobbleHeight);
        this.entity.rotation.set(core_1.Quaternion.fromEuler(core_1.Vec3.up.mul(Date.now() * (0.360 / this.props.revolutionTime))));
        // Loot magnet
        if (this.props.enableLootMagnet && this.world.getPlayers().length != 0) {
            // Find closest player
            var closestPlayer = this.world.getPlayers()[0];
            var closestPlayerVec = closestPlayer.position.get().sub(this.basePosition);
            this.world.getPlayers().forEach(player => {
                if (player.id != closestPlayer.id) {
                    var playerVec = player.position.get().sub(this.basePosition);
                    if (playerVec.magnitudeSquared() < closestPlayerVec.magnitudeSquared()) {
                        closestPlayer = player;
                        closestPlayerVec = playerVec;
                    }
                }
            });
            if (closestPlayerVec.magnitudeSquared() < this.lootMagnetCaptureRadiusSquared) {
                this.collectItem(closestPlayer);
                return;
            }
            if (closestPlayerVec.magnitudeSquared() < this.lootMagnetRadiusSquared) {
                this.basePosition = this.basePosition.add(closestPlayerVec.normalize().mul(this.props.lootMagnetSpeed * deltaTime));
            }
        }
        this.entity.position.set(this.basePosition.add(wobbleVec));
    }
    setBasePosition(position) {
        this.basePosition = position;
    }
    OnPlayerCollision(collidedWith, collisionAt, normal, relativeVelocity, localColliderName, otherColliderName) {
        // Only collect once
        if (this.isCollected)
            return;
        this.collectItem(collidedWith);
    }
    setPosition(position) {
        this.basePosition = position;
    }
    setLootTable(lootTable) {
        this.lootTable = lootTable;
    }
    collectItem(player) {
        this.isCollected = true;
        this.props.collectSound?.as(core_1.AudioGizmo)?.play();
        this.entity.collidable.set(false);
        this.entity.visible.set(false);
        this.props.vfx?.as(core_1.ParticleGizmo)?.stop();
        // Notify the game of pickup and remove the item
        this.sendNetworkBroadcastEvent(LootPickup, { player: player, loot: this.props.itemType });
        this.async.setTimeout(() => {
            if (this.lootTable != null) {
                this.lootTable.clearItem(this.entity);
            }
        }, 1000);
    }
}
exports.LootItem = LootItem;
LootItem.propsDefinition = {
    itemType: { type: core_1.PropTypes.String },
    collectSound: { type: core_1.PropTypes.Entity },
    enableLootMagnet: { type: core_1.PropTypes.Boolean, default: false },
    lootMagnetRadius: { type: core_1.PropTypes.Number, default: 3.0 },
    lootMagnetSpeed: { type: core_1.PropTypes.Number, default: 2.0 },
    lootMagnetCaptureRadius: { type: core_1.PropTypes.Number, default: 1.0 },
    vfx: { type: core_1.PropTypes.Entity },
    wobbleHeight: { type: core_1.PropTypes.Number, default: 0.05 },
    revolutionTime: { type: core_1.PropTypes.Number, default: 2.0 },
};
core_1.Component.register(LootItem);
