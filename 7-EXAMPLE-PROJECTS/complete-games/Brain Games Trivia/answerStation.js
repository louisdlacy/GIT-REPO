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
exports.TriviaGameUI = void 0;
const hz = __importStar(require("horizon/core"));
const Events_1 = require("Events");
const ui_1 = require("horizon/ui");
const gameManager_1 = require("gameManager"); // Import the gameManager instance
const triviaUITemplate_1 = require("triviaUITemplate"); // Import the TriviaUITemplate class
// Singleton class to manage the trivia game UI
class TriviaGameUI extends triviaUITemplate_1.TriviaUITemplate {
    constructor() {
        super(...arguments);
        this.panelHeight = 900; // Customize panel size
        this.panelWidth = 800;
        // Bindings for dynamic content
        this.timerBinding = new ui_1.Binding("Timer: 00");
        this.roundBinding = new ui_1.Binding("Round: 01");
        this.subscriptions = [];
    }
    // Animated bindings for answer selection
    preStart() {
        super.preStart();
        this.connectLocalBroadcastEvent(Events_1.Events.showOnlyToVR, () => {
            console.log("Showing only to VR players");
            const allPlayers = this.world.getPlayers();
            const vrPlayers = allPlayers.filter((player) => player.deviceType.get() === hz.PlayerDeviceType.VR);
            this.entity.setVisibilityForPlayers(vrPlayers, hz.PlayerVisibilityMode.VisibleTo);
            vrPlayers.forEach((player) => {
                console.log(`VR Player: ${player.name.get()}`);
            });
        });
    }
    start() {
        gameManager_1.gameManager.s_instance.registerStation(this);
    }
    pointAssigner(answer) {
        if (this.currentPlayer && this.currentAnswer === answer) {
            // Get the current lifetime score
            const currentAllTimeScore = this.world.persistentStorage.getPlayerVariable(this.currentPlayer, "TriviaGroup:LifetimeScore");
            this.world.persistentStorage.setPlayerVariable(this.currentPlayer, "TriviaGroup:LifetimeScore", currentAllTimeScore + 1);
            this.world.leaderboards.setScoreForPlayer("LTRoundsWon", this.currentPlayer, currentAllTimeScore + 1, true);
            // Get the current session score
            const DailyScore = this.world.persistentStorage.getPlayerVariable(this.currentPlayer, "TriviaGroup:Daily Score");
            this.world.persistentStorage.setPlayerVariable(this.currentPlayer, "TriviaGroup:Daily Score", DailyScore + 1);
            this.world.leaderboards.setScoreForPlayer("DailyScore", this.currentPlayer, DailyScore + 1, true);
            // Get the current weekly score
            const WeeklyScore = this.world.persistentStorage.getPlayerVariable(this.currentPlayer, "TriviaGroup:WeeklyScore");
            this.world.persistentStorage.setPlayerVariable(this.currentPlayer, "TriviaGroup:WeeklyScore", WeeklyScore + 1);
            this.world.leaderboards.setScoreForPlayer("WeeklyScore", this.currentPlayer, WeeklyScore + 1, true);
            // Get the current monthly score
            const MonthlyScore = this.world.persistentStorage.getPlayerVariable(this.currentPlayer, "TriviaGroup:Monthly");
            this.world.persistentStorage.setPlayerVariable(this.currentPlayer, "TriviaGroup:Monthly", MonthlyScore + 1);
            this.world.leaderboards.setScoreForPlayer("MonthlyScore", this.currentPlayer, MonthlyScore + 1, true);
        }
    }
    // Function to trigger the animation sequence when an answer is selected
    // Initialize the UI layout
    initializeUI() {
        TriviaGameUI.s_instance = this;
        return (0, ui_1.View)({
            children: [
                // Question box with white border and black text
                (0, ui_1.View)({
                    children: (0, ui_1.Text)({
                        text: this.questionBinding,
                        style: { fontSize: 30, color: "black", textAlign: "center" },
                    }),
                    style: {
                        backgroundColor: "white",
                        borderColor: "black",
                        borderWidth: 4,
                        borderRadius: 15,
                        padding: 20,
                        marginBottom: 20,
                    },
                }),
                // Answer boxes in two rows
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            children: [
                                // Answer A
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: this.answerABinding,
                                        style: { fontSize: 25, color: "black" },
                                    }),
                                    style: {
                                        backgroundColor: "#87CEEB", // Sky blue for A
                                        height: 100,
                                        width: 200,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 10,
                                        borderColor: "black",
                                        borderWidth: 4,
                                        borderRadius: 10,
                                        transform: [{ scale: this.scaleA }],
                                    },
                                    onPress: (player) => {
                                        console.log("Option A selected");
                                        this.processAnswer(player, this.scaleA, 0);
                                    },
                                }),
                                // Answer B
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: this.answerBBinding,
                                        style: { fontSize: 25, color: "black" },
                                    }),
                                    style: {
                                        backgroundColor: "red", // Red for B
                                        height: 100,
                                        width: 200,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 10,
                                        borderColor: "black",
                                        borderWidth: 4,
                                        borderRadius: 10,
                                        transform: [{ scale: this.scaleB }],
                                    },
                                    onPress: (player) => {
                                        console.log("Option B selected");
                                        this.processAnswer(player, this.scaleB, 1);
                                    },
                                }),
                            ],
                            style: {
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 20, // Space between top row and bottom row
                            },
                        }),
                        (0, ui_1.View)({
                            children: [
                                // Answer C
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: this.answerCBinding,
                                        style: { fontSize: 25, color: "black" },
                                    }),
                                    style: {
                                        backgroundColor: "yellow", // Yellow for C
                                        height: 100,
                                        width: 200,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 10,
                                        borderColor: "black",
                                        borderWidth: 4,
                                        borderRadius: 10,
                                        transform: [{ scale: this.scaleC }],
                                    },
                                    onPress: (player) => {
                                        console.log("Option C selected");
                                        this.processAnswer(player, this.scaleC, 2);
                                    },
                                }),
                                // Answer D
                                (0, ui_1.Pressable)({
                                    children: (0, ui_1.Text)({
                                        text: this.answerDBinding,
                                        style: { fontSize: 25, color: "black" },
                                    }),
                                    style: {
                                        backgroundColor: "green", // Green for D
                                        height: 100,
                                        width: 200,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: 10,
                                        borderColor: "black",
                                        borderWidth: 4,
                                        borderRadius: 10,
                                        transform: [{ scale: this.scaleD }],
                                    },
                                    onPress: (player) => {
                                        console.log("Option D selected");
                                        this.processAnswer(player, this.scaleD, 3);
                                    },
                                }),
                            ],
                            style: {
                                flexDirection: "row",
                                justifyContent: "space-around",
                            },
                        }),
                    ],
                    style: {
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: 20,
                    },
                }),
                // Timer and Round Counter with white rounded box
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            children: (0, ui_1.Text)({
                                text: this.timerBinding,
                                style: { fontSize: 24, color: "black" },
                            }),
                            style: {
                                backgroundColor: "white",
                                borderColor: "black",
                                borderWidth: 4,
                                borderRadius: 15,
                                padding: 15,
                                marginRight: 20,
                            },
                        }),
                        (0, ui_1.View)({
                            children: (0, ui_1.Text)({
                                text: this.roundBinding,
                                style: { fontSize: 24, color: "black" },
                            }),
                            style: {
                                backgroundColor: "white",
                                borderColor: "black",
                                borderWidth: 4,
                                borderRadius: 15,
                                padding: 15,
                            },
                        }),
                    ],
                    style: {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingTop: 20,
                    },
                }),
            ],
            style: {
                padding: 60, // Increased padding for more space at the edges
                backgroundColor: "#e4d3be", // Background color set to black
                borderRadius: 20,
                flexDirection: "column",
                justifyContent: "space-between",
            },
        });
    }
    assignplayer(player) {
        this.currentPlayer = player;
        console.log("Player assigned to station");
        this.props.spawnPoint?.as(hz.SpawnPointGizmo).teleportPlayer(player);
        this.subscriptions.forEach((sub) => sub.disconnect());
        this.subscriptions = [
            this.connectLocalEvent(player, Events_1.Events.processPlayerAnswer, ({ index }) => this.processAnswer(player, this.genericBinding, index)),
        ];
    }
}
exports.TriviaGameUI = TriviaGameUI;
ui_1.UIComponent.register(TriviaGameUI);
