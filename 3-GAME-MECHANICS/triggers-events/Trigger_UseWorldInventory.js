"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class UseWorldInventory extends core_1.Component {
    constructor() {
        super(...arguments);
        this.iwpId = 'myIwp'; // Replace with your actual In-World Purchase Item ID
        this.isEarning = false;
        this.isConsuming = false;
    }
    preStart() {
        this.earnTrigger = this.props.earnTrigger;
        this.consumeTrigger = this.props.consumeTrigger;
        this.earnTrigger && this.connectCodeBlockEvent(this.earnTrigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onEnterEarnTrigger.bind(this));
        this.consumeTrigger && this.connectCodeBlockEvent(this.consumeTrigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onEnterConsumeTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onEnterEarnTrigger(player) {
        // Check if the player is already in the process of earning an item
        if (this.isEarning) {
            console.log('Already processing an earn request. Please wait.');
            return;
        }
        this.isEarning = true;
        // Count how many items the player has in their inventory
        core_1.WorldInventory.getPlayerEntitlementQuantity(player, this.iwpId)
            .then((count) => {
            console.log(`Player had ${count} items in their inventory.`);
            // As an example, we will max out the player's inventory to 5 items
            if (count <= 5) {
                // Add the item to the player's inventory
                core_1.WorldInventory.grantItemToPlayer(player, this.iwpId);
                console.log('Item granted to player inventory.');
            }
        })
            .catch((error) => {
            console.error('Error fetching player entitlement quantity:', error);
        })
            .finally(() => {
            this.isEarning = false;
        });
    }
    onEnterConsumeTrigger(player) {
        // Check if the player is already in the process of consuming an item
        if (this.isConsuming) {
            console.log('Already processing a consume request. Please wait.');
            return;
        }
        this.isConsuming = true;
        // Check if the player has the item in their inventory
        core_1.WorldInventory.doesPlayerHaveEntitlement(player, this.iwpId)
            .then((hasItem) => {
            if (hasItem) {
                // Remove the item from the player's inventory
                core_1.WorldInventory.consumeItemForPlayer(player, this.iwpId);
                console.log('Item consumed from player inventory.');
            }
            else {
                console.log('Player does not have the item in their inventory.');
            }
        })
            .catch((error) => {
            console.error('Error checking player entitlement:', error);
        })
            .finally(() => {
            this.isConsuming = false;
        });
    }
}
UseWorldInventory.propsDefinition = {
    earnTrigger: { type: core_1.PropTypes.Entity },
    consumeTrigger: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(UseWorldInventory);
