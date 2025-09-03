"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolLootItem = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
const LootItem_1 = require("LootItem");
class PoolLootItem extends LootItem_1.LootItem {
    constructor() {
        super(...arguments);
        this.originalPosition = core_1.Vec3.zero;
    }
    Start() {
        super.Start();
        this.originalPosition = this.entity.position.get();
        this.addSelfToPool();
    }
    onAllocate(position, rotation) {
        this.entity.visible.set(true);
        this.basePosition = position;
        this.entity.rotation.set(rotation);
        this.isCollected = false;
        this.props.vfx?.as(core_1.ParticleGizmo)?.play();
    }
    onFree() {
        this.entity.visible.set(false);
        this.basePosition = this.originalPosition;
        this.entity.position.set(this.basePosition);
    }
    addSelfToPool() {
        var pool = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.parentPool);
        pool?.addEntity(this.entity);
    }
}
exports.PoolLootItem = PoolLootItem;
PoolLootItem.propsDefinition = {
    ...LootItem_1.LootItem.propsDefinition,
    parentPool: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(PoolLootItem);
