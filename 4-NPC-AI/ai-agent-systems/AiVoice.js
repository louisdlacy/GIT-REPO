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
class AiVoice extends hz.Component {
    constructor() {
        super(...arguments);
        this.questionList = [
            "How is your day going?",
            "What are you working on?",
            "What do you like to do for fun?",
            "Do you have any hobbies?",
            "What is your favorite book or movie?",
            "What is your favorite food?",
            "Do you have any pets?",
            "What is your favorite place to visit?",
            "What is your dream job?",
            "What is something you are passionate about?",
        ];
        this.infoList = [
            "What can you do as an AI assistant?",
            "How were you created?",
            "What is your main purpose?",
            "Can you learn new things?",
            "How do you process information?",
            "Are you always available to help?",
            "What makes you different from a human?",
            "Can you understand emotions?",
            "How do you keep my information private?",
            "What are your limitations as an AI?",
        ];
        this.factsList = [
            "Can you tell me a random fun fact?",
            "What's an interesting fact I might not know?",
            "Do you know any surprising facts?",
            "Share a cool science fact with me.",
            "What's a weird fact about animals?",
            "Tell me a fact about space.",
            "Do you have a historical fact to share?",
            "What's a fact that sounds fake but is true?",
            "Give me a fact about food.",
            "What's a record-breaking fact?",
        ];
    }
    start() {
        this.npc = this.props.npcGizmo.as(npc_1.Npc);
        if (this.npc == undefined) {
            console.error("ComputerFriend: npc is undefined.");
            return;
        }
        // if (!this.npc.isConversationEnabled()) {
        //   console.error("ComputerFriend: conversation not enabled");
        //   return;
        // }
        this.connectCodeBlockEvent(this.props.questionsTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.onPlayerEnterTrigger(player, "questions");
        });
        this.connectCodeBlockEvent(this.props.infoTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.onPlayerEnterTrigger(player, "info");
        });
        this.connectCodeBlockEvent(this.props.factsTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.onPlayerEnterTrigger(player, "facts");
        });
    }
    onPlayerEnterTrigger(player, category) {
        let question;
        switch (category) {
            case "questions":
                question =
                    this.questionList[Math.floor(Math.random() * this.questionList.length)];
                break;
            case "info":
                question =
                    this.infoList[Math.floor(Math.random() * this.infoList.length)];
                break;
            case "facts":
                question =
                    this.factsList[Math.floor(Math.random() * this.factsList.length)];
                break;
            default:
                question = "How can I help you today?";
        }
        this.props.textGizmo.as(hz.TextGizmo).text.set(question);
        this.npc.conversation.elicitResponse(question);
    }
}
AiVoice.propsDefinition = {
    npcGizmo: { type: hz.PropTypes.Entity },
    questionsTrigger: { type: hz.PropTypes.Entity },
    infoTrigger: { type: hz.PropTypes.Entity },
    factsTrigger: { type: hz.PropTypes.Entity },
    textGizmo: { type: hz.PropTypes.Entity },
};
hz.Component.register(AiVoice);
