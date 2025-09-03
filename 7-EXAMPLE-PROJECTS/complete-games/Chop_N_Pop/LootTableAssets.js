"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootTableAssets = void 0;
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
// Loot table using a list of assets and their odds
class LootTableAssets extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.lootItems = [];
        this.lootDrops = new Set();
    }
    Start() {
        // Add the items to the array
        if (this.props.item1) {
            this.lootItems.push({ asset: this.props.item1, odds: this.props.item1Odds });
        }
        if (this.props.item2) {
            this.lootItems.push({ asset: this.props.item2, odds: this.props.item2Odds });
        }
        if (this.props.item3) {
            this.lootItems.push({ asset: this.props.item3, odds: this.props.item3Odds });
        }
        if (this.props.item4) {
            this.lootItems.push({ asset: this.props.item4, odds: this.props.item4Odds });
        }
        if (this.props.item5) {
            this.lootItems.push({ asset: this.props.item5, odds: this.props.item5Odds });
        }
        if (this.props.item6) {
            this.lootItems.push({ asset: this.props.item6, odds: this.props.item6Odds });
        }
        if (this.props.item7) {
            this.lootItems.push({ asset: this.props.item7, odds: this.props.item7Odds });
        }
        if (this.props.item8) {
            this.lootItems.push({ asset: this.props.item8, odds: this.props.item8Odds });
        }
        if (this.props.item9) {
            this.lootItems.push({ asset: this.props.item9, odds: this.props.item9Odds });
        }
        if (this.props.item10) {
            this.lootItems.push({ asset: this.props.item10, odds: this.props.item10Odds });
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
                if (this.lootItems[i].asset != null) {
                    this.world.spawnAsset(this.lootItems[i].asset, position, rotation).then((values) => {
                        values.forEach((value) => {
                            if (value != null) {
                                this.lootDrops.add(value);
                                var lootItem = Behaviour_1.BehaviourFinder.GetBehaviour(value);
                                lootItem?.setLootTable(this);
                            }
                        });
                    });
                }
            }
        }
    }
    clearItem(item) {
        this.lootDrops.delete(item);
        this.world.deleteAsset(item);
    }
    clearItems() {
        this.lootDrops.forEach((item) => {
            this.world.deleteAsset(item);
        });
        this.lootDrops.clear();
    }
}
exports.LootTableAssets = LootTableAssets;
LootTableAssets.propsDefinition = {
    noItemOdds: { type: core_1.PropTypes.Number, default: 0 },
    item1: { type: core_1.PropTypes.Asset },
    item1Odds: { type: core_1.PropTypes.Number, default: 0 },
    item2: { type: core_1.PropTypes.Asset },
    item2Odds: { type: core_1.PropTypes.Number, default: 0 },
    item3: { type: core_1.PropTypes.Asset },
    item3Odds: { type: core_1.PropTypes.Number, default: 0 },
    item4: { type: core_1.PropTypes.Asset },
    item4Odds: { type: core_1.PropTypes.Number, default: 0 },
    item5: { type: core_1.PropTypes.Asset },
    item5Odds: { type: core_1.PropTypes.Number, default: 0 },
    item6: { type: core_1.PropTypes.Asset },
    item6Odds: { type: core_1.PropTypes.Number, default: 0 },
    item7: { type: core_1.PropTypes.Asset },
    item7Odds: { type: core_1.PropTypes.Number, default: 0 },
    item8: { type: core_1.PropTypes.Asset },
    item8Odds: { type: core_1.PropTypes.Number, default: 0 },
    item9: { type: core_1.PropTypes.Asset },
    item9Odds: { type: core_1.PropTypes.Number, default: 0 },
    item10: { type: core_1.PropTypes.Asset },
    item10Odds: { type: core_1.PropTypes.Number, default: 0 },
};
core_1.Component.register(LootTableAssets);
