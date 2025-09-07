"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PopupDisplay extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        this.world.ui.showPopupForPlayer(player, 'Welcome!', 5);
    }
}
core_1.Component.register(PopupDisplay);
