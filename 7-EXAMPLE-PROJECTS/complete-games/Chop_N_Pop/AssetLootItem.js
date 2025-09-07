"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetLootItem = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const core_1 = require("horizon/core");
const LootItem_1 = require("LootItem");
class AssetLootItem extends LootItem_1.LootItem {
    Start() {
        super.Start();
        this.basePosition = this.entity.position.get();
        this.isCollected = false;
        this.props.vfx?.as(core_1.ParticleGizmo)?.play();
    }
}
exports.AssetLootItem = AssetLootItem;
AssetLootItem.propsDefinition = {
    ...LootItem_1.LootItem.propsDefinition,
    hackToMakeItCompile: { type: core_1.PropTypes.Entity, default: undefined }
};
core_1.Component.register(AssetLootItem);
