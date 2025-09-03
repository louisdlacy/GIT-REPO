"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class Animation extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityEnterTrigger, this.OnEntityEnterTrigger.bind(this));
    }
    start() {
    }
    OnPlayerEnterTrigger(player) {
        player.playAvatarAnimation(this.props.animation);
        // Show popup with trigger tag name
        const triggerTags = this.entity.tags.get();
        const triggerTagName = triggerTags.length > 0 ? triggerTags[0] : 'No Tag';
        this.world.ui.showPopupForPlayer(player, `Trigger: ${triggerTagName}`, 1.5);
        // Add code here that you want to run when a player enters the trigger.
        // For more details and examples go to:
        // https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/use-the-trigger-zone
        console.log(`Player ${player.name.get()} entered trigger.`);
    }
    OnEntityEnterTrigger(entity) {
        // Add code here that you want to run when an entity enters the trigger.
        // The entity will need to have a Gameplay Tag that matches the tag your
        // trigger is configured to detect.
        console.log(`Entity ${entity.name.get()} entered trigger`);
    }
}
Animation.propsDefinition = {
    animation: {
        type: core_1.PropTypes.Asset
    }
};
core_1.Component.register(Animation);
