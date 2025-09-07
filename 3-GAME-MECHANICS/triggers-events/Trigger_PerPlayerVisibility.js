"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PerPlayerVisibility extends core_1.Component {
    constructor() {
        super(...arguments);
        this.playersThatCanSee = [];
    }
    preStart() {
        this.entityToShow = this.props.entityToShow;
        //Hide from everyone
        this.entityToShow?.visible.set(false);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.OnPlayerExitTrigger.bind(this));
    }
    start() { }
    OnPlayerEnterTrigger(player) {
        this.playersThatCanSee.push(player);
        // Show the entity to the player
        this.entityToShow?.setVisibilityForPlayers(this.playersThatCanSee, core_1.PlayerVisibilityMode.VisibleTo);
    }
    OnPlayerExitTrigger(player) {
        this.playersThatCanSee = this.playersThatCanSee.filter(p => p !== player);
        this.entityToShow?.setVisibilityForPlayers(this.playersThatCanSee, core_1.PlayerVisibilityMode.VisibleTo);
    }
}
PerPlayerVisibility.propsDefinition = {
    entityToShow: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(PerPlayerVisibility);
