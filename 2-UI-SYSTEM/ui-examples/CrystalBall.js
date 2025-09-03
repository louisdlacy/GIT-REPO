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
exports.CrystalBallEvents = void 0;
const hz = __importStar(require("horizon/core"));
const npc_1 = require("horizon/npc");
/*
  Events to broadcast to other scripts that the LLM is speaking
*/
exports.CrystalBallEvents = {
    BeginSpeechEvent: new hz.LocalEvent('llmBeginSpeechEvent'),
    EndSpeechEvent: new hz.LocalEvent('llmEndSpeechEvent')
};
class CrystalBall extends hz.Component {
    constructor() {
        super(...arguments);
        this._canSpeak = true;
    }
    preStart() {
        if (this.props.trigger) {
            this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.askForFuture();
            });
        }
    }
    start() {
        this._npc = this.entity.as(npc_1.Npc);
        if (!this._npc) {
            console.error("CrystalBall script needs to be attached to an NPC gizmo!");
            return;
        }
    }
    async askForFuture() {
        if (!this._canSpeak) {
            return;
        }
        this.startSpeech();
        await this._npc.conversation.elicitResponse("Give me a prediction about my future");
        this.endSpeech();
    }
    startSpeech() {
        this._canSpeak = false;
        this.sendLocalEvent(this.props.speakFX, exports.CrystalBallEvents.BeginSpeechEvent, {});
    }
    endSpeech() {
        this._canSpeak = true;
        this.sendLocalEvent(this.props.speakFX, exports.CrystalBallEvents.EndSpeechEvent, {});
    }
}
CrystalBall.propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    speakFX: { type: hz.PropTypes.Entity }
};
hz.Component.register(CrystalBall);
