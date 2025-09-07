"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootTablePool = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
// Loot table using pools of entities and their odds
class LootTablePool extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.lootItems = [];
        this.lootDrops = new Set();
    }
    Start() {
        // Add the items to the array
        if (this.props.item1) {
            var objPool1 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item1);
            this.lootItems.push({ pool: objPool1, odds: this.props.item1Odds });
        }
        if (this.props.item2) {
            var objPool2 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item2);
            this.lootItems.push({ pool: objPool2, odds: this.props.item2Odds });
        }
        if (this.props.item3) {
            var objPool3 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item3);
            this.lootItems.push({ pool: objPool3, odds: this.props.item3Odds });
        }
        if (this.props.item4) {
            var objPool4 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item4);
            this.lootItems.push({ pool: objPool4, odds: this.props.item4Odds });
        }
        if (this.props.item5) {
            var objPool5 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item5);
            this.lootItems.push({ pool: objPool5, odds: this.props.item5Odds });
        }
        if (this.props.item6) {
            var objPool6 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item6);
            this.lootItems.push({ pool: objPool6, odds: this.props.item6Odds });
        }
        if (this.props.item7) {
            var objPool7 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item7);
            this.lootItems.push({ pool: objPool7, odds: this.props.item7Odds });
        }
        if (this.props.item8) {
            var objPool8 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item8);
            this.lootItems.push({ pool: objPool8, odds: this.props.item8Odds });
        }
        if (this.props.item9) {
            var objPool9 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item9);
            this.lootItems.push({ pool: objPool9, odds: this.props.item9Odds });
        }
        if (this.props.item10) {
            var objPool10 = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.item10);
            this.lootItems.push({ pool: objPool10, odds: this.props.item10Odds });
        }
        // Normalize the odds
        let totalOdds = 0;
        for (let i = 0; i < this.lootItems.length; i++) {
            totalOdds += this.lootItems[i].odds;
        }
        for (let i = 0; i < this.lootItems.length; i++) {
            this.lootItems[i].odds /= totalOdds;
        }
    }
    shouldDropItem() {
        // If the noItemOdds is 1, we should never drop an item
        return Math.random() > this.props.noItemOdds;
    }
    dropRandomItem(position, rotation) {
        var randomItemChosen = Math.random();
        // Find the item that was chosen by adding up the odds until we reach or pass the random number
        var currentOdds = 0;
        for (let i = 0; i < this.lootItems.length; i++) {
            currentOdds += this.lootItems[i].odds;
            if (randomItemChosen <= currentOdds) {
                var droppedLoot = this.lootItems[i].pool.allocate(position, rotation, null);
                if (droppedLoot != null) {
                    this.lootDrops.add({ pool: this.lootItems[i].pool, entity: droppedLoot });
                    var lootItem = Behaviour_1.BehaviourFinder.GetBehaviour(droppedLoot);
                    lootItem?.setLootTable(this);
                }
                break;
            }
        }
    }
    clearItem(item) {
        this.lootDrops.forEach(element => {
            if (element.entity.id == item.id) {
                element.pool.free(element.entity);
                this.lootDrops.delete(element);
            }
        });
    }
    clearItems() {
        this.lootDrops.forEach(element => {
            element.pool.free(element.entity);
        });
        this.lootDrops.clear();
    }
}
exports.LootTablePool = LootTablePool;
LootTablePool.propsDefinition = {
    noItemOdds: { type: core_1.PropTypes.Number, default: 0 },
    item1: { type: core_1.PropTypes.Entity },
    item1Odds: { type: core_1.PropTypes.Number, default: 0 },
    item2: { type: core_1.PropTypes.Entity },
    item2Odds: { type: core_1.PropTypes.Number, default: 0 },
    item3: { type: core_1.PropTypes.Entity },
    item3Odds: { type: core_1.PropTypes.Number, default: 0 },
    item4: { type: core_1.PropTypes.Entity },
    item4Odds: { type: core_1.PropTypes.Number, default: 0 },
    item5: { type: core_1.PropTypes.Entity },
    item5Odds: { type: core_1.PropTypes.Number, default: 0 },
    item6: { type: core_1.PropTypes.Entity },
    item6Odds: { type: core_1.PropTypes.Number, default: 0 },
    item7: { type: core_1.PropTypes.Entity },
    item7Odds: { type: core_1.PropTypes.Number, default: 0 },
    item8: { type: core_1.PropTypes.Entity },
    item8Odds: { type: core_1.PropTypes.Number, default: 0 },
    item9: { type: core_1.PropTypes.Entity },
    item9Odds: { type: core_1.PropTypes.Number, default: 0 },
    item10: { type: core_1.PropTypes.Entity },
    item10Odds: { type: core_1.PropTypes.Number, default: 0 },
};
core_1.Component.register(LootTablePool);
