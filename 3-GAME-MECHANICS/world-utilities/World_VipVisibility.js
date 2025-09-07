"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class VipGrab extends core_1.Component {
    constructor() {
        super(...arguments);
        this.vipList = [
            'Tellous'
        ];
        this.whoCanSee = [];
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, this.onPlayerExitWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        if (this.vipList.includes(player.name.get())) {
            this.whoCanSee.push(player);
            this.entity.setVisibilityForPlayers(this.whoCanSee, core_1.PlayerVisibilityMode.VisibleTo);
        }
    }
    onPlayerExitWorld(player) {
        if (this.vipList.includes(player.name.get())) {
            this.whoCanSee = this.whoCanSee.filter(p => p !== player);
            this.entity.setVisibilityForPlayers(this.whoCanSee, core_1.PlayerVisibilityMode.VisibleTo);
        }
    }
}
core_1.Component.register(VipGrab);
