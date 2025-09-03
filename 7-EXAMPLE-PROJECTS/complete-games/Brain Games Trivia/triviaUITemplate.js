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
exports.TriviaUITemplate = void 0;
const Events_1 = require("Events");
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
const triviaDisplay_1 = require("triviaDisplay");
const gameManager_1 = require("gameManager");
let revealAnswerCounts = 0;
class TriviaUITemplate extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.questionBinding = new ui_1.Binding("Welcome To Brain Games Trivia?");
        // Bindings for the answers
        this.answerABinding = new ui_1.Binding("Answer A");
        this.answerBBinding = new ui_1.Binding("Answer B");
        this.answerCBinding = new ui_1.Binding("Answer C");
        this.answerDBinding = new ui_1.Binding("Answer D");
        this.currentAnswer = undefined;
        this.currentPlayer = undefined;
        this.scaleA = new ui_1.AnimatedBinding(1);
        this.scaleB = new ui_1.AnimatedBinding(1);
        this.scaleC = new ui_1.AnimatedBinding(1);
        this.scaleD = new ui_1.AnimatedBinding(1);
        this.genericBinding = new ui_1.AnimatedBinding(1);
    }
    initializeUI() {
        return (0, ui_1.View)({});
    }
    preStart() {
        this.connectLocalBroadcastEvent(Events_1.Events.displayQuestion, ({ question, answerA, answerB, answerC, answerD }) => {
            this.displayNewQuestion(question, answerA, answerB, answerC, answerD);
            console.log("Screen Recv'd");
        });
        this.initiateRevealAnswerSubscription();
    }
    initiateRevealAnswerSubscription() {
        this.connectLocalBroadcastEvent(Events_1.Events.revealanswer, ({ answer }) => {
            if (!this.currentPlayer) {
                return;
            }
            revealAnswerCounts++;
            console.warn("number of times that reveal answer was called", revealAnswerCounts, this.entity.id.toString());
            console.log("Player answered", this.currentAnswer, answer);
            let result = "incorrect";
            if (this.currentAnswer === answer) {
                result = "correct";
                console.log("Player answered correctly", this.currentPlayer.name.get());
            }
            else {
                console.log("Player answered incorrectly", this.currentPlayer.name.get(), this.currentAnswer, answer);
                gameManager_1.gameManager.s_instance.playerElimination(this.currentPlayer);
                this.currentPlayer = undefined;
                this.currentAnswer = undefined;
            }
            this.world.ui.showPopupForEveryone(result, 5);
            this.pointAssigner(answer);
        });
    }
    processAnswer(player, scaleBinding, answerID) {
        if (!player) {
            console.warn("Player is null");
            return;
        }
        triviaDisplay_1.triviaDisplay.s_instance.processAnswer(player, answerID);
        scaleBinding.set(ui_1.Animation.sequence(ui_1.Animation.timing(1.2, { duration: 200 }), // Scale up
        ui_1.Animation.timing(1, { duration: 200 }) // Scale back down
        ), (finished) => { }, [player] //Optional callback function that tells the animation has ended
        );
        this.currentPlayer = player;
        this.currentAnswer = answerID;
    }
    pointAssigner(answer) { }
    displayNewQuestion(question, answerA, answerB, answerC, answerD) {
        console.warn("New question received:", question);
        this.questionBinding.set(question);
        this.answerABinding.set(answerA);
        this.answerBBinding.set(answerB);
        this.answerCBinding.set(answerC);
        this.answerDBinding.set(answerD);
        this.currentAnswer = undefined;
        this.showMobileUI();
    }
    showMobileUI() { }
}
exports.TriviaUITemplate = TriviaUITemplate;
TriviaUITemplate.propsDefinition = {
    spawnPoint: { type: hz.PropTypes.Entity },
    buttonPress: { type: hz.PropTypes.Entity },
    vfxpress: { type: hz.PropTypes.Entity },
};
