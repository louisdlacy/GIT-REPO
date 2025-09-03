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
exports.MobileTriviaUI = void 0;
const triviaUITemplate_1 = require("triviaUITemplate");
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
const Events_1 = require("Events");
class MobileTriviaUI extends triviaUITemplate_1.TriviaUITemplate {
    constructor() {
        super(...arguments);
        this.panelHeight = 800;
        this.panelWidth = 600;
        this.selectedLabelValue = "";
        this.selectedLabel = new ui_1.Binding("");
        // Track blinking state across buttons
        this.blinkingIntervalId = null;
        this.lastShowTextBinding = null;
        this.currentPlayers = [];
    }
    preStart() {
        super.preStart();
        MobileTriviaUI.instance = this;
        this.setVisibility([this.world.getServerPlayer()]);
        this.connectLocalBroadcastEvent(Events_1.Events.hideMobileUI, () => this.setVisibility([this.world.getServerPlayer()]));
        this.connectLocalBroadcastEvent(Events_1.Events.assignMobilePlayers, ({ mobilePlayers }) => this.assignPlayer(mobilePlayers));
        this.connectLocalBroadcastEvent(Events_1.Events.RemoveMobilePlayer, ({ player }) => this.removePlayer(player));
    }
    setVisibility(players) {
        this.entity.setVisibilityForPlayers(players, hz.PlayerVisibilityMode.VisibleTo);
    }
    assignPlayer(players) {
        this.currentPlayers = players;
    }
    showMobileUI() {
        this.setVisibility(this.currentPlayers);
    }
    removePlayer(player) {
        this.currentPlayers = this.currentPlayers.filter((currentPlayer) => currentPlayer !== player);
        this.setVisibility(this.currentPlayers);
    }
    initiateRevealAnswerSubscription() {
        return;
    }
    initializeUI() {
        const buttonStyle = {
            height: 70,
            width: 180,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            margin: 8,
            borderWidth: 2,
            borderColor: "#000000",
        };
        const textStyle = {
            fontSize: 22,
            fontWeight: "600",
            color: "white",
        };
        const infoBoxStyle = {
            backgroundColor: "white",
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#ccc",
        };
        const makeAnimatedButton = (label, color, bindScale, index) => {
            const scale = new ui_1.AnimatedBinding(1);
            const showText = new ui_1.Binding(true);
            const colorBinding = new ui_1.Binding(color);
            const originalColor = color;
            // Sync text label visibility based on blinking
            showText.derive((visible) => {
                colorBinding.set(visible ? originalColor : "");
                return visible;
            });
            return (0, ui_1.Pressable)({
                children: (0, ui_1.Text)({
                    text: label,
                    style: textStyle,
                }),
                style: {
                    ...buttonStyle,
                    backgroundColor: color,
                    transform: [{ scale }],
                },
                onClick: (player) => {
                    console.log(`${label} button pressed`);
                    //   this.processAnswer(player, bindScale, index);
                    this.sendLocalEvent(player, Events_1.Events.processPlayerAnswer, { index });
                    this.buttonPressed();
                    // Animate button press
                    // Animate press
                    scale.set(0.9);
                    scale.set(ui_1.Animation.timing(1));
                    //TODO animate button flash
                    //   // Clear blinking from previous button
                    //   if (this.lastShowTextBinding) {
                    //     this.lastShowTextBinding.set(true);
                    //   }
                    //   if (this.blinkingIntervalId !== null) {
                    //     this.async.clearInterval(this.blinkingIntervalId);
                    //     this.blinkingIntervalId = null;
                    //   }
                    //   // Show text immediately on click
                    //   showText.set(true);
                    //   // Update selected state
                    //   this.selectedLabelValue = label;
                    //   this.selectedLabel.set(label);
                    //   this.lastShowTextBinding = showText;
                    //   // Start blinking every 500ms
                    //   this.blinkingIntervalId = this.async.setInterval(() => {
                    //     showText.set(prev => !prev);
                    //   }, 500);
                    //   // Stop blinking after 10 seconds
                    //   this.async.setTimeout(() => {
                    //     if (this.selectedLabelValue === label) {
                    //       this.selectedLabel.set("");
                    //       this.selectedLabelValue = "";
                    //     }
                    //     // Always restore text visibility
                    //     showText.set(true);
                    //     if (this.blinkingIntervalId !== null) {
                    //       this.async.clearInterval(this.blinkingIntervalId);
                    //       this.blinkingIntervalId = null;
                    //     }
                    //   }, 10000);
                },
            });
        };
        return (0, ui_1.View)({
            children: [
                // Question
                (0, ui_1.View)({
                    children: (0, ui_1.Text)({
                        text: this.questionBinding,
                        style: {
                            fontSize: 28,
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: "bold",
                        },
                    }),
                    style: {
                        backgroundColor: "#333",
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "75%",
                        marginBottom: 12,
                    },
                }),
                // Round and Timer
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            children: (0, ui_1.Text)({
                                text: "Round: 0",
                                style: { fontSize: 20, color: "#000" },
                            }),
                            style: { ...infoBoxStyle, marginRight: 12 },
                        }),
                        (0, ui_1.View)({
                            children: (0, ui_1.Text)({
                                text: "Timer: 00",
                                style: { fontSize: 20, color: "#000" },
                            }),
                            style: infoBoxStyle,
                        }),
                    ],
                    style: {
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 40,
                    },
                }),
                // Color buttons
                (0, ui_1.View)({
                    children: [
                        makeAnimatedButton(this.answerABinding, "#007BFF", this.scaleA, 0),
                        makeAnimatedButton(this.answerBBinding, "#FFD700", this.scaleB, 1),
                        makeAnimatedButton(this.answerCBinding, "#FF4C4C", this.scaleC, 2),
                        makeAnimatedButton(this.answerDBinding, "#28A745", this.scaleD, 3),
                    ],
                    style: {
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 250,
                    },
                }),
            ],
            style: {
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
                backgroundColor: "transparent",
                borderRadius: 20,
                height: "100%",
                width: "100%",
            },
        });
    }
    //TODO Need to troubleshoot sound effect for the button press
    buttonPressed() {
        console.log("Button Pressed!");
        let buttonPress = this.props.buttonPress?.as(hz.AudioGizmo);
        //let vfx = this.props.vfxpress?.as(hz.ParticleGizmo).play();
        if (buttonPress) {
            buttonPress.play();
        }
        else {
            console.warn("No selected sound for button press property.");
        }
    }
}
exports.MobileTriviaUI = MobileTriviaUI;
ui_1.UIComponent.register(MobileTriviaUI);
