"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPC = exports.DialogEvents = void 0;
const hz = __importStar(require("horizon/core"));
class DialogEvents {
}
exports.DialogEvents = DialogEvents;
DialogEvents.requestDialog = new hz.NetworkEvent('sendDialogTreeKey'); // send the key to the dialog script to get the dialog tree
DialogEvents.sendDialogScript = new hz.NetworkEvent('sendDialogScript');
DialogEvents.onEnterTalkableProximity = new hz.NetworkEvent('onEnterNpcTrigger');
class NPC extends hz.Component {
    start() {
        this.scriptData = this.props.dialogScript?.getComponents()[0];
        this.connectCodeBlockEvent(this.props.proximityTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.onPlayerEnterTrigger(player));
        this.connectNetworkEvent(this.entity, DialogEvents.requestDialog, (payload) => this.onOptionReceived(payload.player, payload.key));
    }
    onPlayerEnterTrigger(player) {
        this.sendNetworkBroadcastEvent(DialogEvents.onEnterTalkableProximity, { npc: this.entity }, [player]);
    }
    onOptionReceived(player, key) {
        let dialog = this.scriptData?.getDialogFromTree(key);
        if (dialog) {
            dialog.title = this.props.name;
        }
        this.sendNetworkBroadcastEvent(DialogEvents.sendDialogScript, { container: dialog }, [player]);
    }
}
exports.NPC = NPC;
NPC.propsDefinition = {
    name: { type: hz.PropTypes.String }, // the human-readable name of the NPC
    proximityTrigger: { type: hz.PropTypes.Entity }, // trigger player enters to make this the NPC we are interacting with
    dialogScript: { type: hz.PropTypes.Entity } // first entity in the list of dialog scripts
};
hz.Component.register(NPC);
