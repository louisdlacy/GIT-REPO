"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySelectionUI = void 0;
// Hello world
const Events_1 = require("Events");
const gameManager_1 = require("gameManager");
const core_1 = require("horizon/core");
const sharedData_1 = require("sharedData");
const ui_1 = require("horizon/ui");
class CategorySelectionUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelWidth = 1050;
        this.panelHeight = 600;
        // Bindings to track selected category and vote counts
        this.selectedCategory = new ui_1.Binding(0); // Tracks selected category index
        this.bindCountDownText = new ui_1.Binding("Please vote to start the game."); // Countdown timer
        this.catergoryImage = new ui_1.Binding(ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt(633925502694137)))); //Title image
        this.playerVotes = new Map();
        this.listOfPlayers = [];
        this.countDownInterval = 0;
        // Vote counts for each category
        this.votes = [];
    }
    initializeUI() {
        CategorySelectionUI.instance = this;
        for (let i = 0; i < sharedData_1.categories.length; i++) {
            this.votes.push({
                value: 0,
                binding: new ui_1.Binding(0),
            });
        }
        return (0, ui_1.View)({
            children: [
                // Top: Title text "Choose a Category."
                (0, ui_1.Text)({
                    text: "Choose a Category.",
                    style: {
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#3D3330", //change background color to black
                        height: 50,
                    },
                }),
                (0, ui_1.View)({
                    children: [
                        // Left: Scrollable list of categories
                        (0, ui_1.ScrollView)({
                            children: sharedData_1.categories.map((category, index) => (0, ui_1.Pressable)({
                                children: (0, ui_1.Text)({
                                    text: category[0],
                                    style: {
                                        fontSize: 22,
                                        padding: 10,
                                        backgroundColor: this.selectedCategory.derive((v) => v === index ? "#FE3C64" : "#FEB950"), // Highlight selected category
                                        color: "3D3330",
                                    },
                                }),
                                onClick: (player) => {
                                    this.playerVoted(player, index);
                                    console.log("Player voted");
                                },
                            })),
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
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.Image)({
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
                        (0, ui_1.ScrollView)({
                            children: sharedData_1.categories.map((category, index) => ui_1.UINode.if(this.votes[index].binding.derive((voteCount) => voteCount > 0), // Only show if votes > 0
                            (0, ui_1.View)({
                                children: [
                                    (0, ui_1.Text)({
                                        text: `${category[0]}: `,
                                        style: {
                                            fontSize: 15, // Increased font size for categories on the right
                                            paddingRight: 10,
                                            color: "3D3330",
                                        },
                                    }),
                                    (0, ui_1.Text)({
                                        text: this.votes[index].binding.derive((voteCount) => `${voteCount} votes`),
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
                            }))),
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
                (0, ui_1.Text)({
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
        this.connectLocalBroadcastEvent(Events_1.Events.gameOver, () => {
            this.selectedCategory.set(0);
            this.playerVotes.clear();
            this.bindCountDownText.set("Please vote to start the game.");
            this.listOfPlayers = [];
            this.votes.forEach((element) => {
                element.binding.set(0);
                element.value = 0;
            });
            this.catergoryImage.set(ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt("540217871977098")) //Title image
            ));
        });
    }
    playerVoted(player, index) {
        if (gameManager_1.GameStatus === "running") {
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
        }
        else if (currentVote === index) {
            // Player has voted, for the same category before
        }
        else {
            // Player has not voted before
            gameManager_1.gameManager.s_instance.registerPlayer(player); // Register player vote
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
                gameManager_1.gameManager.s_instance.startGame(winningCategory);
                this.bindCountDownText.set(`Game is currently in progress.`);
            }
            else {
                this.bindCountDownText.set(`Game starting in ${time} seconds.`);
            }
        }, 1000);
    }
    updateImage(index) {
        this.catergoryImage.set(ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt(sharedData_1.images[index]))));
    }
}
exports.CategorySelectionUI = CategorySelectionUI;
ui_1.UIComponent.register(CategorySelectionUI);
