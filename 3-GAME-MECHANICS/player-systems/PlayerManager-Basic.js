"use strict";
// Meant to be used in conjunction with an Asset Pool Gizmo
// This is a basic player manager component that can be used to handle events sent to the player.
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
exports.PMEvents = void 0;
const hz = __importStar(require("horizon/core"));
// Define the network events that this player manager will handle
exports.PMEvents = {
    exampleEvent: new hz.NetworkEvent('exampleEvent')
};
class PlayerManager_Basic extends hz.Component {
    start() {
        //set the owner of this entity
        this.owner = this.entity.owner.get();
        //confirm the owner is a player, exit if not
        if (this.owner === this.world.getServerPlayer()) {
            return;
        }
        //looks like we have a real player, lets connect to the network events
        console.log('PlayerManager_Basic: Player manager', this.entity.id, ' started for', this.owner.name.get());
        this.connectNetworkEvent(this.owner, exports.PMEvents.exampleEvent, () => this.exampleEvent());
    }
    exampleEvent() {
        console.log('exampleEvent triggered on,', this.entity.id);
    }
}
PlayerManager_Basic.propsDefinition = {};
hz.Component.register(PlayerManager_Basic);
/***********************************************************************************************
****************************You can have more than 1 script per file.***************************
******Below is just a test script for the trigger to prove the Player Manager script works******
***********************************************************************************************/
class testScript extends hz.Component {
    preStart() {
        // Connect to the trigger enter event and send the network event to the player
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendNetworkEvent(player, exports.PMEvents.exampleEvent, {});
        });
    }
    start() {
    }
}
testScript.propsDefinition = {};
hz.Component.register(testScript);
