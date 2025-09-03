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
exports.Events = void 0;
const hz = __importStar(require("horizon/core"));
exports.Events = {
    answeredQns: new hz.LocalEvent('answeredQuestion'),
};
class TriviaGameManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.currQnsData = null;
        this.allQnsData = null;
        this.currQnsNum = 0;
        this.score = 0;
    }
    preStart() {
        this.connectLocalBroadcastEvent(exports.Events.answeredQns, (data) => {
            if (this.currQnsData && this.allQnsData) {
                console.log(this.currQnsData.question +
                    "answered as : " + data.answer +
                    " --> correct answer: " + this.currQnsData.correct_answer);
                const wasAnswerRight = ((data.answer && this.currQnsData.correct_answer == "True") ||
                    (!data.answer && this.currQnsData.correct_answer == "False")) ? true : false;
                if (wasAnswerRight) {
                    this.score++;
                }
                this.handleUpdateScore(this.score);
                this.world.ui.showPopupForEveryone(wasAnswerRight ? "Correct!" : "Incorrect!", 2, {
                    backgroundColor: wasAnswerRight ? hz.Color.green : hz.Color.red,
                    fontColor: hz.Color.white,
                    fontSize: 3,
                    showTimer: false,
                    playSound: true,
                    position: hz.Vec3.zero,
                });
                ++this.currQnsNum;
                this.currQnsData = this.allQnsData[this.currQnsNum];
                this.handleUpdateQns(this.props.questionTextGizmo, this.currQnsData ? this.currQnsData.question : "no Question!");
            }
        });
    }
    // called on world start
    async start() {
        let asset = this.props.textAsset;
        asset.fetchAsData().then((output) => {
            console.warn("[TriviaGameManager] FetchAssetData: " + asset.id + " \n" + asset.versionId);
            this.allQnsData = this.handleExtractAssetContentData(output);
            console.log("[TriviaGameManager] allQnsData: Data loaded.");
            this.currQnsData = this.allQnsData ? this.allQnsData[0] : null;
            console.log("[TriviaGameManager] currQnsData: Get first question: " + this.currQnsData);
            this.handleUpdateQns(this.props.questionTextGizmo, this.currQnsData ? this.currQnsData.question : "Game Over!");
            this.handleUpdateScore(this.score);
            this.handleUpdateAssetDetails(asset);
        });
    }
    handleUpdateAssetDetails(asset) {
        this.props.assetDetailsTextGizmo.as(hz.TextGizmo)?.text.set("Asset ID: " + asset.id + "\nVersion ID: " + asset.versionId);
    }
    handleUpdateScore(score) {
        (this.props.scoreTextGizmo.as(hz.TextGizmo))?.text.set("Score: " + score);
    }
    handleUpdateQns(textGiz, question) {
        console.warn("[TriviaGameManager] " + question);
        (textGiz.as(hz.TextGizmo))?.text.set(question);
    }
    handleAnswerQns(currentQns, answer) {
        if (answer && currentQns.correct_answer == "True" ||
            !answer && currentQns.correct_answer == "False") {
            return true;
        }
        else {
            return false;
        }
    }
    handleExtractAssetContentData(output) {
        var text = output.asText();
        console.log("[TriviaGameManager] Total text length: ", text.length);
        console.log("[TriviaGameManager] First 10 characters of the text for verification: ", text.substring(0, 10));
        console.log("[TriviaGameManager] ==================================");
        var jsobj = output.asJSON();
        if (jsobj == null || jsobj == undefined) {
            console.error("[TriviaGameManager] null jsobj");
            return null;
        }
        else {
            return output.asJSON();
        }
    }
}
TriviaGameManager.propsDefinition = {
    textAsset: { type: hz.PropTypes.Asset },
    questionTextGizmo: { type: hz.PropTypes.Entity },
    scoreTextGizmo: { type: hz.PropTypes.Entity },
    assetDetailsTextGizmo: { type: hz.PropTypes.Entity }
};
// This tells the UI that your component can be attached to an entity
hz.Component.register(TriviaGameManager);
class TriviaAnswerTrigger extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            console.log("[TriviaGameManager] answered: " + this.props.answerType);
            this.sendLocalBroadcastEvent(exports.Events.answeredQns, { answer: this.props.answerType });
        });
    }
}
TriviaAnswerTrigger.propsDefinition = {
    answerType: { type: hz.PropTypes.Boolean }
};
hz.Component.register(TriviaAnswerTrigger);
