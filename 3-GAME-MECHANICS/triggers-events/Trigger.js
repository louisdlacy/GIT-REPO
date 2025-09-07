"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUIReady = exports.PlayersToDisplay = void 0;
const core_1 = require("horizon/core");
exports.PlayersToDisplay = new core_1.NetworkEvent("playersToDisplay");
exports.CUIReady = new core_1.NetworkEvent("cuiReady");
class Trigger extends core_1.Component {
    preStart() {
        if (!this.props.local) {
            throw new Error("Trigger component requires a 'local' prop with an Entity reference.");
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.currentUser && this.currentUser !== player) {
                this.world.ui.showPopupForPlayer(player, this.currentUser.name.get() + " is using this station", 8);
                return;
            }
            else if (this.currentUser === player) {
                if (this.playerLeavingTimeout) {
                    this.async.clearTimeout(this.playerLeavingTimeout);
                }
            }
            this.currentUser = player;
            this.props.local.owner.set(player);
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            if (this.currentUser === player) {
                this.returnToServer();
            }
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.sendNetworkEvent(this.props.local, exports.PlayersToDisplay, { players: this.world.getPlayers() });
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (this.currentUser === player) {
                this.returnToServer();
            }
            else {
                this.sendNetworkEvent(this.props.local, exports.PlayersToDisplay, { players: this.world.getPlayers() });
            }
        });
        this.connectNetworkEvent(this.entity, exports.CUIReady, () => {
            if (this.currentUser) {
                this.sendNetworkEvent(this.props.local, exports.PlayersToDisplay, { players: this.world.getPlayers() });
            }
        });
    }
    start() {
    }
    returnToServer() {
        if (this.playerLeavingTimeout) {
            this.async.clearTimeout(this.playerLeavingTimeout);
        }
        this.playerLeavingTimeout = this.async.setTimeout(() => {
            this.currentUser = undefined;
            this.props.local.owner.set(this.world.getServerPlayer());
            this.playerLeavingTimeout = undefined;
        }, 2000);
    }
}
Trigger.propsDefinition = {
    local: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(Trigger);
