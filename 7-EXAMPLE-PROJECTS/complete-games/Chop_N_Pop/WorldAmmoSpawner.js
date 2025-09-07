"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
const LootSystem_1 = require("LootSystem");
class WorldAmmoSpawner extends Behaviour_1.Behaviour {
    Start() {
        this.reset();
        this.connectNetworkBroadcastEvent(Events_1.Events.gameReset, (data) => {
            this.reset();
        });
    }
    reset() {
        this.async.setTimeout(() => {
            var lootTable = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.lootTable);
            lootTable?.clearItems();
            this.spawnAmmo();
        }, 2000);
    }
    spawnAmmo() {
        this.entity.children.get().forEach((child) => {
            if (this.props.lootTable != undefined) {
                LootSystem_1.LootSystem.instance?.dropLoot(this.props.lootTable, child.position.get(), child.rotation.get(), true);
            }
        });
    }
}
WorldAmmoSpawner.propsDefinition = {
    lootTable: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(WorldAmmoSpawner);
