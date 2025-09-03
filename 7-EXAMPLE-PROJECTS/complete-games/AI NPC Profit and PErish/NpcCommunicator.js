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
const BaseComponent_1 = require("BaseComponent");
const BaseLogger_1 = require("BaseLogger");
const hz = __importStar(require("horizon/core"));
const NPC_Base_1 = require("NPC_Base");
/**
 * This is a simple class which will pass text to the given NPC and allow a simple form of communication.
 */
class NpcCommunicator extends BaseComponent_1.BaseComponent {
    preStart() {
        this.connectCodeBlockEvent(this.props.button, hz.CodeBlockEvents.OnPlayerCollision, (player) => {
            this.tellNpc(player);
        });
        this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.tellNpc(player);
        });
    }
    start() {
        this.targetNpc = this.getAndVerifyComponent(this.props.targetNpc, NPC_Base_1.NPC_Base);
        if (!this.targetNpc) {
            this.log("Target NPC not found", this.enableLogging, BaseLogger_1.LogLevel.Error);
            return;
        }
    }
    tellNpc(player) {
        if (!player) {
            this.log(`No player found. How did we get here?`, true, BaseLogger_1.LogLevel.Error);
            return;
        }
        // this will interrupt the NPC from voicing what they're saying if they are currently speaking
        // but they'll still think that they completed speaking their sentences
        this.targetNpc?.askLLMToStopTalking(); //make the input clear;
        let text = `${player.name.get()} just said: ${this.props.text}`;
        this.log(`Telling NPC: ${text}`, this.enableLogging);
        this.targetNpc?.elicitSpeech(text);
    }
}
NpcCommunicator.propsDefinition = {
    ...BaseComponent_1.BaseComponent.propsDefinition,
    targetNpc: { type: hz.PropTypes.Entity },
    button: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
    text: { type: hz.PropTypes.String },
};
hz.Component.register(NpcCommunicator);
