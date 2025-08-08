import * as hz from "horizon/core";
import { Events } from "Events";
import {
    UIComponent,
    View,
    Text,
    Binding,
    AnimatedBinding,
    Animation,
    Pressable,
    UINode,
} from "horizon/ui";
import { gameManager } from "gameManager"; // Import the gameManager instance
import { TriviaUITemplate } from "triviaUITemplate"; // Import the TriviaUITemplate class
import { EventSubscription } from "horizon/core";

// Singleton class to manage the trivia game UI

export class TriviaGameUI extends TriviaUITemplate {
    static s_instance: TriviaGameUI;
    panelHeight = 900; // Customize panel size
    panelWidth = 800;

    // Bindings for dynamic content

    timerBinding = new Binding<string>("Timer: 00");
    roundBinding = new Binding<string>("Round: 01");
    subscriptions: EventSubscription[] = [];

    // Animated bindings for answer selection

    preStart() {
        super.preStart();

        this.connectLocalBroadcastEvent(Events.showOnlyToVR, () => {
            console.log("Showing only to VR players");
            const allPlayers = this.world.getPlayers();
            const vrPlayers = allPlayers.filter((player) => player.deviceType.get() === hz.PlayerDeviceType.VR);

            this.entity.setVisibilityForPlayers(
                vrPlayers,
                hz.PlayerVisibilityMode.VisibleTo
            );

            vrPlayers.forEach((player) => {
                console.log(`VR Player: ${player.name.get()}`);
            })
        });
    }

    start() {
        gameManager.s_instance.registerStation(this);
    }

    pointAssigner(answer: number) {
        if (this.currentPlayer && this.currentAnswer === answer) {
            // Get the current lifetime score
            const currentAllTimeScore =
                this.world.persistentStorage.getPlayerVariable(
                    this.currentPlayer,
                    "TriviaGroup:LifetimeScore"
                );
            this.world.persistentStorage.setPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:LifetimeScore",
                currentAllTimeScore + 1
            );
            this.world.leaderboards.setScoreForPlayer(
                "LTRoundsWon",
                this.currentPlayer,
                currentAllTimeScore + 1,
                true
            );

            // Get the current session score
            const DailyScore = this.world.persistentStorage.getPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:Daily Score"
            );
            this.world.persistentStorage.setPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:Daily Score",
                DailyScore + 1
            );
            this.world.leaderboards.setScoreForPlayer(
                "DailyScore",
                this.currentPlayer,
                DailyScore + 1,
                true
            );
            // Get the current weekly score
            const WeeklyScore = this.world.persistentStorage.getPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:WeeklyScore"
            );
            this.world.persistentStorage.setPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:WeeklyScore",
                WeeklyScore + 1
            );
            this.world.leaderboards.setScoreForPlayer(
                "WeeklyScore",
                this.currentPlayer,
                WeeklyScore + 1,
                true
            );
            // Get the current monthly score
            const MonthlyScore = this.world.persistentStorage.getPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:Monthly"
            );
            this.world.persistentStorage.setPlayerVariable(
                this.currentPlayer,
                "TriviaGroup:Monthly",
                MonthlyScore + 1
            );
            this.world.leaderboards.setScoreForPlayer(
                "MonthlyScore",
                this.currentPlayer,
                MonthlyScore + 1,
                true
            );
        }
    }

    // Function to trigger the animation sequence when an answer is selected

    // Initialize the UI layout
    override initializeUI() {
        TriviaGameUI.s_instance = this;
        return View({
            children: [
                // Question box with white border and black text
                View({
                    children: Text({
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
                View({
                    children: [
                        View({
                            children: [
                                // Answer A
                                Pressable({
                                    children: Text({
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
                                Pressable({
                                    children: Text({
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
                        View({
                            children: [
                                // Answer C
                                Pressable({
                                    children: Text({
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
                                Pressable({
                                    children: Text({
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
                View({
                    children: [
                        View({
                            children: Text({
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
                        View({
                            children: Text({
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

    assignplayer(player: hz.Player) {
        this.currentPlayer = player;
        console.log("Player assigned to station");
        this.props.spawnPoint?.as(hz.SpawnPointGizmo).teleportPlayer(player);

        this.subscriptions.forEach((sub) => sub.disconnect());
        this.subscriptions = [
            this.connectLocalEvent(player, Events.processPlayerAnswer, ({ index }) =>
                this.processAnswer(player, this.genericBinding, index)
            ),
        ];
    }
}

UIComponent.register(TriviaGameUI);
