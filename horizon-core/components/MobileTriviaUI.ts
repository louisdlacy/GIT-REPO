import { TriviaUITemplate } from "triviaUITemplate";
import * as hz from "horizon/core";
import {
    UIComponent,
    View,
    Text,
    Pressable,
    Binding,
    AnimatedBinding,
    Animation,
} from "horizon/ui";
import { Events } from "Events";

export class MobileTriviaUI extends TriviaUITemplate {
    static instance: MobileTriviaUI;

    panelHeight = 800;
    panelWidth = 600;

    selectedLabelValue: string = "";
    selectedLabel = new Binding<string>("");

    // Track blinking state across buttons
    blinkingIntervalId: number | null = null;
    lastShowTextBinding: Binding<boolean> | null = null;
    currentPlayers: hz.Player[] = [];

    preStart() {
        super.preStart();
        MobileTriviaUI.instance = this;
        this.setVisibility([this.world.getServerPlayer()]);
        this.connectLocalBroadcastEvent(Events.hideMobileUI, () =>
            this.setVisibility([this.world.getServerPlayer()])
        );
        this.connectLocalBroadcastEvent(
            Events.assignMobilePlayers,
            ({ mobilePlayers }) => this.assignPlayer(mobilePlayers)
        );
        this.connectLocalBroadcastEvent(Events.RemoveMobilePlayer, ({ player }) =>
            this.removePlayer(player)
        );
    }

    setVisibility(players: hz.Player[]): void {
        this.entity.setVisibilityForPlayers(
            players,
            hz.PlayerVisibilityMode.VisibleTo
        );
    }

    assignPlayer(players: hz.Player[]): void {
        this.currentPlayers = players;
    }

    override showMobileUI() {
        this.setVisibility(this.currentPlayers);
    }

    removePlayer(player: hz.Player): void {
        this.currentPlayers = this.currentPlayers.filter(
            (currentPlayer) => currentPlayer !== player
        );
        this.setVisibility(this.currentPlayers);
    }

    override initiateRevealAnswerSubscription(): void {
        return;
    }

    initializeUI() {
        const buttonStyle = {
            height: 70,
            width: 180,
            justifyContent: "center" as const,
            alignItems: "center" as const,
            borderRadius: 12,
            margin: 8,
            borderWidth: 2,
            borderColor: "#000000",
        };

        const textStyle = {
            fontSize: 22,
            fontWeight: "600" as const,
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

        const makeAnimatedButton = (
            label: Binding<string>,
            color: string,
            bindScale: AnimatedBinding,
            index: number
        ) => {
            const scale = new AnimatedBinding(1);
            const showText = new Binding<boolean>(true);
            const colorBinding = new Binding<string>(color);
            const originalColor = color;

            // Sync text label visibility based on blinking
            showText.derive((visible: boolean) => {
                colorBinding.set(visible ? originalColor : "");
                return visible;
            });

            return Pressable({
                children: Text({
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
                    this.sendLocalEvent(player, Events.processPlayerAnswer, { index });

                    this.buttonPressed();
                    // Animate button press

                    // Animate press
                    scale.set(0.9);
                    scale.set(Animation.timing(1));

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

        return View({
            children: [
                // Question
                View({
                    children: Text({
                        text: this.questionBinding,
                        style: {
                            fontSize: 28,
                            color: "#fff",
                            textAlign: "center" as const,
                            fontWeight: "bold" as const,
                        },
                    }),
                    style: {
                        backgroundColor: "#333",
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        justifyContent: "center" as const,
                        alignItems: "center" as const,
                        width: "75%",
                        marginBottom: 12,
                    },
                }),

                // Round and Timer
                View({
                    children: [
                        View({
                            children: Text({
                                text: "Round: 0",
                                style: { fontSize: 20, color: "#000" },
                            }),
                            style: { ...infoBoxStyle, marginRight: 12 },
                        }),
                        View({
                            children: Text({
                                text: "Timer: 00",
                                style: { fontSize: 20, color: "#000" },
                            }),
                            style: infoBoxStyle,
                        }),
                    ],
                    style: {
                        flexDirection: "row" as const,
                        justifyContent: "center" as const,
                        alignItems: "center" as const,
                        marginBottom: 40,
                    },
                }),

                // Color buttons
                View({
                    children: [
                        makeAnimatedButton(this.answerABinding, "#007BFF", this.scaleA, 0),
                        makeAnimatedButton(this.answerBBinding, "#FFD700", this.scaleB, 1),
                        makeAnimatedButton(this.answerCBinding, "#FF4C4C", this.scaleC, 2),
                        makeAnimatedButton(this.answerDBinding, "#28A745", this.scaleD, 3),
                    ],
                    style: {
                        flexDirection: "row" as const,
                        flexWrap: "wrap" as const,
                        justifyContent: "center" as const,
                        alignItems: "center" as const,
                        marginTop: 250,
                    },
                }),
            ],
            style: {
                flexDirection: "column" as const,
                alignItems: "center" as const,
                padding: 20,
                backgroundColor: "transparent",
                borderRadius: 20,
                height: "100%",
                width: "100%",
            },
        });
    }
    //TODO Need to troubleshoot sound effect for the button press
    private buttonPressed(): void {
        console.log("Button Pressed!");
        let buttonPress: any | undefined = this.props.buttonPress?.as(
            hz.AudioGizmo
        );
        //let vfx = this.props.vfxpress?.as(hz.ParticleGizmo).play();
        if (buttonPress) {
            buttonPress.play();
        } else {
            console.warn("No selected sound for button press property.");
        }
    }
}

UIComponent.register(MobileTriviaUI);
