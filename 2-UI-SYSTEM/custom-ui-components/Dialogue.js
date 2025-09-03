"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const DialogueEvents_1 = require("./DialogueEvents");
class PromptTrigger extends core_1.Component {
    constructor() {
        super(...arguments);
        this.onPlayerEnterTrigger = (player) => {
            //console.log("Player entered trigger", player);
            this.sendNetworkEvent(player, DialogueEvents_1.AddPromptEvent, { target: this.entity });
        };
        this.onPlayerExitTrigger = (player) => {
            //console.log("Player exited trigger", player);
            this.sendNetworkEvent(player, DialogueEvents_1.RemovePromptEvent, {});
        };
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExitTrigger);
    }
    start() {
    }
}
PromptTrigger.propsDefinition = {};
core_1.Component.register(PromptTrigger);
