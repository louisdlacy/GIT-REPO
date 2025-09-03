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
const hz = __importStar(require("horizon/core"));
const npc_1 = require("horizon/npc");
class ScoreIncrementer extends hz.Component {
    constructor() {
        super(...arguments);
        this._score = 0;
        this._canInteract = true;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.onPlayerInteract(player);
        });
    }
    start() {
        this._score = 0;
        this._npc = this.props.npcGizmo.as(npc_1.Npc);
        if (!this._npc) {
            console.error("No NPC gizmo set!");
            return;
        }
        this._npc.conversation.resetMemory();
        this._npc.conversation.setDynamicContext('score', 'The current score is 0.');
    }
    async onPlayerInteract(player) {
        /*
        * Note: This flag blocks the user from prompting the LLM while it's still speaking,
        * since the current behavior for multiple elicitResponse requests in quick sucession
        * is to create a stack of responses to generate sequentially which can cause hallucinations.
        */
        if (!this._canInteract) {
            return;
        }
        this._score += 1;
        this.updateText();
        this._canInteract = false;
        this._npc.conversation.stopSpeaking();
        this._npc.conversation.setDynamicContext('score', `The current score of the game is ${this._score}. Announce this number when asked about the score of the game.`);
        await this._npc.conversation.elicitResponse(`Announce the current score of the game.`);
        this._canInteract = true;
    }
    updateText() {
        const label = this.props.scoreView.as(hz.TextGizmo);
        label.text.set("Score: " + this._score.toString());
    }
}
ScoreIncrementer.propsDefinition = {
    npcGizmo: { type: hz.PropTypes.Entity },
    scoreView: { type: hz.PropTypes.Entity },
};
hz.Component.register(ScoreIncrementer);
