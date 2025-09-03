"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
var GameState;
(function (GameState) {
    GameState[GameState["Active"] = 0] = "Active";
    GameState[GameState["Inactive"] = 1] = "Inactive";
})(GameState || (GameState = {}));
class StateManager extends core_1.Component {
    constructor() {
        super(...arguments);
        this.state = GameState.Inactive;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnterTrigger() {
        if (this.state === GameState.Inactive) {
            this.state = GameState.Active;
            console.log('Game state changed to Active');
        }
        else {
            this.state = GameState.Inactive;
            console.log('Game state changed to Inactive');
        }
    }
}
core_1.Component.register(StateManager);
