"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
const core_1 = require("horizon/core");
const TeleportPlayer_Func_1 = require("TeleportPlayer_Func");
class TestTeleportingPlayer_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    }
    start() {
    }
    playerEnterWorld(player) {
        if (avatar_ai_agent_1.AvatarAIAgent.getGizmoFromPlayer(player) === undefined) {
            this.async.setTimeout(() => {
                TeleportPlayer_Func_1.teleportPlayer_Func.randomLocation(player);
            }, 500);
        }
    }
}
TestTeleportingPlayer_Entity.propsDefinition = {};
core_1.Component.register(TestTeleportingPlayer_Entity);
