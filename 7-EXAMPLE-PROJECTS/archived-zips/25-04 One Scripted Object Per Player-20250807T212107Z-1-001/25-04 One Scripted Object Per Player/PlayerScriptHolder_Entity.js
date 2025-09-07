"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const PlayerScriptHolder_Data_1 = require("PlayerScriptHolder_Data");
class PlayerScriptHolder_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.iAmFor = -1;
    }
    preStart() {
        if (!PlayerScriptHolder_Data_1.playerScriptHolder_Data.psHolderEntities.includes(this.entity)) {
            PlayerScriptHolder_Data_1.playerScriptHolder_Data.psHolderEntities.push(this.entity);
        }
        this.iAmFor = PlayerScriptHolder_Data_1.playerScriptHolder_Data.psHolderEntities.indexOf(this.entity);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (payload) => { this.onUpdate(payload.deltaTime); });
    }
    start() {
    }
    onUpdate(deltaTime) {
        if (this.myPlayer) {
            console.log(this.myPlayer.name.get());
        }
    }
    playerEnterWorld(player) {
        if (this.iAmFor === player.index.get()) {
            this.myPlayer = player;
        }
    }
    playerExitWorld(player) {
        if (this.myPlayer === player) {
            this.myPlayer = undefined;
        }
    }
}
PlayerScriptHolder_Entity.propsDefinition = {};
core_1.Component.register(PlayerScriptHolder_Entity);
