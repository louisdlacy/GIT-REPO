// Hello world
import { Events } from "Events";
import { gameManager, GameStatus } from "gameManager";
import { Player, TextureAsset } from "horizon/core";
import { categories, images } from "sharedData";
import {
    UIComponent, View, Text, ScrollView, Image,
    Binding, AnimatedBinding, Pressable, UINode, Animation, ImageSource,
} from "horizon/ui";


type VoteEntry = {
    value: number;
    binding: Binding<number>;
};

export class CategorySelectionUI extends UIComponent {
    panelWidth = 1050;
    panelHeight = 600;
    static instance: CategorySelectionUI;

    // Bindings to track selected category and vote counts
    selectedCategory = new Binding<number>(0); // Tracks selected category index
    bindCountDownText = new Binding<string>("Please vote to start the game."); // Countdown timer
    catergoryImage = new Binding(ImageSource.fromTextureAsset(new TextureAsset(BigInt(633925502694137)))) //Title image

    playerVotes = new Map<Player, number>();
    listOfPlayers: Player[] = [];
    countDownInterval = 0;

    // Vote counts for each category
    votes: VoteEntry[] = [];

    initializeUI() {
        CategorySelectionUI.instance = this;

        for (let i = 0; i < categories.length; i++) {
            this.votes.push({
                value: 0,
                binding: new Binding<number>(0),
            });
        }

        return View({
            children: [
                // Top: Title text "Choose a Category."
                Text({
                    text: "Choose a Category.",
                    style: {
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#3D3330", //change background color to black
                        height: 50,
                    },
                }),

                View({
                    children: [
                        // Left: Scrollable list of categories
                        ScrollView({
                            children: categories.map((category, index) =>
                                Pressable({
                                    children: Text({
                                        text: category[0],
                                        style: {
                                            fontSize: 22,
                                            padding: 10,
                                            backgroundColor: this.selectedCategory.derive((v) =>
                                                v === index ? "#FE3C64" : "#FEB950"
                                            ), // Highlight selected category
                                            color: "3D3330",
                                        },
                                    }),
                                    onClick: (player) => {
                                        this.playerVoted(player, index);
                                        console.log("Player voted");
                                    },
                                })
                            ),
                            style: {
                                width: 250, // Increased width of the gray area on the left
                                height: 400,
                                backgroundColor: "#E4D3BE",
                                padding: 10,
                                justifyContent: "flex-start", // Align items to the top
                                alignItems: "flex-start", // Align the list content to the top
                            },
                            horizontal: false,
                        }),

                        // Center: Animated picture frame showing image based on selected category
                        View({
                            children: [
                                Image({
                                    //background image
                                    source: this.catergoryImage,
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                    },
                                }),
                            ],
                            style: {
                                width: 400,
                                height: 400,
                                alignItems: "center",
                                justifyContent: "center",
                            },
                        }),

                        // Right: Scrollable list of categories with votes, aligned to the top
                        ScrollView({
                            children: categories.map((category, index) =>
                                UINode.if(
                                    this.votes[index].binding.derive(
                                        (voteCount) => voteCount > 0
                                    ), // Only show if votes > 0
                                    View({
                                        children: [
                                            Text({
                                                text: `${category[0]}: `,
                                                style: {
                                                    fontSize: 15, // Increased font size for categories on the right
                                                    paddingRight: 10,
                                                    color: "3D3330",
                                                },
                                            }),
                                            Text({
                                                text: this.votes[index].binding.derive(
                                                    (voteCount) => `${voteCount} votes`
                                                ),
                                                style: {
                                                    fontSize: 15, // Increased font size for votes
                                                    fontWeight: "bold",
                                                    color: "green", // Set votes text color to green
                                                },
                                            }),
                                        ],
                                        style: {
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: 10,
                                        },
                                    })
                                )
                            ),
                            style: {
                                width: 250, // Increased width of the gray area on the right
                                height: 400,
                                padding: 20,
                                backgroundColor: "#E4D3BE",
                                justifyContent: "flex-start", // Align items to the top
                                alignItems: "flex-start", // Align the list content to the top
                            },
                            horizontal: false,
                        }),
                    ],
                    style: {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        //paddingBottom: 40, // Added padding at the bottomDrake], //commented out to remove padding
                        height: 400,
                        width: "100%",
                        backgroundColor: "yellow", // Set background color to yellow
                    },
                }),

                // Black spacer at the bottom
                Text({
                    text: this.bindCountDownText,
                    style: {
                        color: "white",
                        fontSize: 45,
                        textAlign: "center",
                        textAlignVertical: "center",
                        height: 50, // Set height of the black space
                        width: "100%",
                    },
                }),
            ],
            style: {
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingHorizontal: 10,
                backgroundColor: "#3D3330", //  Set background color to black
            },
        });
    }

    preStart() {
        this.connectLocalBroadcastEvent(Events.gameOver, () => {
            this.selectedCategory.set(0);
            this.playerVotes.clear();
            this.bindCountDownText.set("Please vote to start the game.");
            this.listOfPlayers = [];
            this.votes.forEach((element) => {
                element.binding.set(0);
                element.value = 0;
            });
            this.catergoryImage.set(
                ImageSource.fromTextureAsset(
                    new TextureAsset(BigInt("540217871977098")) //Title image
                )
            );
        });
    }

    playerVoted(player: Player, index: number) {
        if (GameStatus === "running") {
            // Prevent voting during game
            this.world.ui.showPopupForPlayer(player, "You cannot vote during the game.", 6);
            return;
        }

        if (!this.listOfPlayers.includes(player)) {
            this.listOfPlayers.push(player);
            if (this.listOfPlayers.length === 1) {
                this.countdown();
            }
        }

        this.selectedCategory.set(index); // Set the selected category

        const currentVote = this.playerVotes.get(player);
        if (currentVote !== undefined && currentVote !== index) {
            // Player has voted before, but for a different category
            this.votes[currentVote].value = this.votes[currentVote].value - 1;
            this.votes[currentVote].binding.set(this.votes[currentVote].value);
            this.playerVotes.set(player, index); // Update player's vote
        } else if (currentVote === index) {
            // Player has voted, for the same category before
        } else {
            // Player has not voted before
            gameManager.s_instance.registerPlayer(player); // Register player vote
            this.votes[index].value = this.votes[index].value + 1;
            this.votes[index].binding.set(this.votes[index].value);
            this.playerVotes.set(player, index);
        }

        this.updateImage(index);
    }

    countdown() {
        this.async.clearInterval(this.countDownInterval);
        let time = 5;
        this.bindCountDownText.set(`Game starting in ${time} seconds.`);
        this.countDownInterval = this.async.setInterval(() => {
            time--;
            if (time === 0) {
                this.async.clearInterval(this.countDownInterval);

                let winningCategory = 0;
                let maxVotes = 0;
                this.votes.forEach((value, key) => {
                    if (value.value > maxVotes) {
                        maxVotes = value.value;
                        winningCategory = key;
                    }
                });

                gameManager.s_instance.startGame(winningCategory);
                this.bindCountDownText.set(`Game is currently in progress.`);
            } else {
                this.bindCountDownText.set(`Game starting in ${time} seconds.`);
            }
        }, 1000);
    }

    updateImage(index: number) {
        this.catergoryImage.set(
            ImageSource.fromTextureAsset(new TextureAsset(BigInt(images[index])))
        );
    }
}

UIComponent.register(CategorySelectionUI);
