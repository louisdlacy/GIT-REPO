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
exports.triviaDisplay = void 0;
//Big Screen
const hz = __importStar(require("horizon/core"));
const ui = __importStar(require("horizon/ui"));
const Events_1 = require("Events");
const sharedData_1 = require("sharedData");
const styleAnswer = {
    width: "100%",
    height: "100%",
    textAlign: "left",
    fontSize: 30,
    color: "black",
    textAlignVertical: "center",
    paddingLeft: 20,
};
const correctAnswerS = {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: 75,
    color: "black",
    textAlignVertical: "center",
};
const numberImages = [
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(2926572484165648))), //Replace with #0 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1032221462048619))), //Replace with #1 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1165632311594150))), //Replace with #2 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1803260020511435))), //Replace with #3 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(2066754387176049))), //Replace with #4 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1615246309199403))), //Replace with #5 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1171178604606772))), //Replace with #6 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(2076176152821126))), //Replace with #7 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(996525795712132))), //Replace with #8 image
    ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(627809319937454))), //Replace with #9 image
];
class triviaDisplay extends ui.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 1080;
        this.panelWidth = 1920;
        this.bindQuestion = new ui.Binding("question2");
        this.bindAnswerA = new ui.Binding("answerA2");
        this.bindAnswerB = new ui.Binding("answerB2");
        this.bindAnswerC = new ui.Binding("answerC2");
        this.bindAnswerD = new ui.Binding("answerD2");
        this.bindTimer = new ui.Binding("timer2");
        this.bindRounddigit1 = new ui.Binding(numberImages[0]);
        this.bindRounddigit2 = new ui.Binding(numberImages[0]);
        this.bindRoundopacity1 = new ui.AnimatedBinding(1);
        this.bindRoundopacity2 = new ui.AnimatedBinding(1);
        this.binddigit1 = new ui.Binding(numberImages[0]);
        this.binddigit2 = new ui.Binding(numberImages[0]);
        this.bindopacity1 = new ui.AnimatedBinding(1);
        this.bindopacity2 = new ui.AnimatedBinding(1);
        this.iterator = 0;
        this.answers = new Map();
        this.correctAnswer = new ui.Binding("");
        this.correctAnswerID = 0;
        this.selectedCategoryID = 0;
        this.selectedCategoryDB = [];
        this.categoryImage = new ui.Binding(ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(sharedData_1.images[0]))));
        this.pagesbinding = {
            splash: new ui.Binding("flex"),
            questions: new ui.Binding("none"),
            stats: new ui.Binding("none"),
            answerReveal: new ui.Binding("none"),
            gameover: new ui.Binding("none"),
        };
        this.isPlaying = false;
        // Bindings for dynamic percentages
        this.percentageBindings = [
            new ui.Binding("100%"), // Answer A
            new ui.Binding("100%"), // Answer B
            new ui.Binding("100%"), // Answer C
            new ui.Binding("100%"), // Answer D
            new ui.Binding("100%"), // No Answer
        ];
        this.barHeights = [
            new ui.Binding(500), // Answer A
            new ui.Binding(500), // Answer B
            new ui.Binding(500), // Answer C
            new ui.Binding(500), // Answer D
            new ui.Binding(500), // No Answer
        ];
        this.roundOriginalAnswer = ["a", "b", "c", "d"];
        // Colors for the vertical lines
        this.lineColors = ["#3d3330", "#fe3c64", "#feb950", "#545b5f", "#828282"];
        // Labels for the answers
        this.answerLabels = [
            "Answer A",
            "Answer B",
            "Answer C",
            "Answer D",
            "No Answer",
        ];
        this.roundNumber = new ui.Binding(1);
        this.roundQuestionsQTY = 5; //TODO Change to 10
        this.roundNumberValue = 5; //TODO Change to 10
    }
    preStart() {
        triviaDisplay.s_instance = this; // Save the instance
        this.connectLocalBroadcastEvent(Events_1.Events.gameOver, () => {
            this.roundQuestionsQTY = 5; //TODO Change to 10
        });
        this.connectLocalBroadcastEvent(Events_1.Events.allplayersEliminated, () => {
            this.allplayersEliminated();
        });
        this.connectLocalBroadcastEvent(Events_1.Events.startGame, ({ winningCategory, players }) => {
            this.startGame(winningCategory, players);
        });
    }
    processAnswer(player, answerID) {
        console.log("processing answer from", player.name.get(), "value", answerID);
        this.answers.set(player, answerID);
    }
    calculateStats() {
        const answerCounts = [0, 0, 0, 0, 0]; // Answer A, Answer B, Answer C, Answer D, No Answer
        Array.from(this.answers.values()).forEach((answer) => {
            answerCounts[answer]++;
        });
        const totalAnswers = this.answers.size;
        for (let i = 0; i < answerCounts.length; i++) {
            const percentage = totalAnswers === 0 ? 0 : (answerCounts[i] / totalAnswers) * 100;
            this.barHeights[i].set((percentage / 100) * 500); // Scale the percentage to a height
            this.percentageBindings[i].set(percentage.toFixed(2) + "%");
        }
        this.answers.clear();
    }
    allplayersEliminated() {
        this.isPlaying = false;
    }
    countdown() {
        let time = 15; //count down from 15 seconds
        this.number2Image(time);
        const countDownInterval = this.async.setInterval(() => {
            time--;
            this.countdownUpdateDisplay(time);
            if (time > 0) {
                return;
            }
            this.async.clearInterval(countDownInterval);
            this.calculateStats();
            this.sendLocalBroadcastEvent(Events_1.Events.hideMobileUI, {});
            this.switchPages(this.pagesbinding.questions, this.pagesbinding.stats);
            this.roundQuestionsQTY--;
            this.async.setTimeout(() => {
                this.switchPages(this.pagesbinding.stats, this.pagesbinding.answerReveal);
                this.sendLocalBroadcastEvent(Events_1.Events.revealanswer, { answer: this.correctAnswerID });
            }, 5000); //TODO 5 seconds possible change
            this.async.setTimeout(() => {
                if (this.roundQuestionsQTY === 0 || !this.isPlaying) {
                    this.switchPages(this.pagesbinding.answerReveal, this.pagesbinding.gameover);
                    this.isPlaying = false;
                    this.sendLocalBroadcastEvent(Events_1.Events.gameOver, {});
                }
                else {
                    this.displayQuestion();
                    this.roundNumberValue++;
                    this.roundNumber.set(this.roundNumberValue);
                    this.setRoundNumber(this.roundNumberValue);
                }
            }, 10000); //TODO 10 seconds possible change
        }, 1000);
    }
    countdownUpdateDisplay(time) {
        this.bindTimer.set(time.toString());
        this.number2Image(time);
    }
    switchPages(fromPage, toPage) {
        fromPage.set("none");
        toPage.set("flex");
    }
    number2Image(num) {
        const digit1 = Math.floor(num / 10);
        const digit2 = num % 10;
        this.bindopacity1.set(0);
        this.bindopacity2.set(0);
        this.binddigit1.set(numberImages[digit1]);
        this.binddigit2.set(numberImages[digit2]);
        this.bindopacity1.set(ui.Animation.timing(1, { duration: 250 }));
        this.bindopacity2.set(ui.Animation.timing(1, { duration: 250 }));
    }
    setRoundNumber(num) {
        const digit1 = Math.floor(num / 10);
        const digit2 = num % 10;
        this.bindRoundopacity1.set(0);
        this.bindRoundopacity2.set(0);
        this.bindRounddigit1.set(numberImages[digit1]);
        this.bindRounddigit2.set(numberImages[digit2]);
        this.bindRoundopacity1.set(ui.Animation.timing(1, { duration: 250 }));
        this.bindRoundopacity2.set(ui.Animation.timing(1, { duration: 250 }));
    }
    startGame(winningCategory, players) {
        this.roundNumber.set(1);
        this.roundNumberValue = 1;
        this.setRoundNumber(this.roundNumberValue);
        this.answers.clear();
        players.forEach((value, key) => {
            this.answers.set(key, -1);
        });
        this.isPlaying = true;
        this.categoryImage.set(ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(sharedData_1.images[winningCategory]))));
        this.selectedCategoryID = winningCategory;
        this.selectedCategoryDB = sharedData_1.categories[this.selectedCategoryID][1];
        this.selectedCategoryDB.sort(() => (0, sharedData_1.seededRandom)(Date.now()) - 0.5);
        this.displayQuestion();
    }
    displayQuestion() {
        this.bindQuestion.set(this.selectedCategoryDB[this.iterator].question);
        const values = [0, 1, 2, 3];
        values.sort(() => Math.random() - 0.5);
        this.bindAnswerA.set(this.selectedCategoryDB[this.iterator].answers[values[0]]);
        this.bindAnswerB.set(this.selectedCategoryDB[this.iterator].answers[values[1]]);
        this.bindAnswerC.set(this.selectedCategoryDB[this.iterator].answers[values[2]]);
        this.bindAnswerD.set(this.selectedCategoryDB[this.iterator].answers[values[3]]);
        this.roundOriginalAnswer[0] = this.selectedCategoryDB[this.iterator].answers[0];
        this.roundOriginalAnswer[1] = this.selectedCategoryDB[this.iterator].answers[1];
        this.roundOriginalAnswer[2] = this.selectedCategoryDB[this.iterator].answers[2];
        this.roundOriginalAnswer[3] = this.selectedCategoryDB[this.iterator].answers[3];
        this.correctAnswer.set(this.selectedCategoryDB[this.iterator].answers[0]);
        this.correctAnswerID = values.indexOf(0);
        this.sendLocalBroadcastEvent(Events_1.Events.displayQuestion, {
            question: this.selectedCategoryDB[this.iterator].question,
            answerA: this.selectedCategoryDB[this.iterator].answers[values[0]],
            answerB: this.selectedCategoryDB[this.iterator].answers[values[1]],
            answerC: this.selectedCategoryDB[this.iterator].answers[values[2]],
            answerD: this.selectedCategoryDB[this.iterator].answers[values[3]],
        });
        this.iterator = (this.iterator + 1) % this.selectedCategoryDB.length;
        this.pagesbinding.questions.set("flex");
        this.pagesbinding.splash.set("none");
        this.pagesbinding.gameover.set("none");
        this.pagesbinding.answerReveal.set("none");
        this.countdown();
    }
    initializeUI() {
        const lineWidth = 200; // Width of each vertical line
        const spacing = 20; // Spacing between lines
        const titleStyle = {
            fontSize: 120,
            color: "orange",
            fontWeight: "bold",
            textAlign: "center",
            textAlignVertical: "center",
        };
        const labelStyle = {
            fontSize: 30,
            color: "#545b5f",
            textAlign: "center",
            textAlignVertical: "center",
        };
        const percentageStyle = {
            fontSize: 40,
            color: "#545b5f",
            fontWeight: "bold",
            textAlign: "center",
            textAlignVertical: "center",
        };
        return ui.View({
            children: [
                ui.View({
                    children: [
                        ui.Image({
                            //background image
                            source: ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1002093418476564))),
                            style: {
                                width: "100%",
                                height: "100%",
                            },
                        }),
                        ui.View({
                            //view for the question
                            children: [
                                ui.Text({
                                    text: this.bindQuestion,
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        textAlign: "center",
                                        fontSize: 50,
                                        color: "black",
                                        textAlignVertical: "center",
                                    },
                                }),
                            ],
                            style: {
                                width: 750,
                                height: 280,
                                //backgroundColor: "pink",
                                position: "absolute",
                                transform: [{ translate: [200, 125] }],
                            },
                        }),
                        ui.View({
                            //view for the A answers
                            children: [
                                ui.Text({
                                    text: this.bindAnswerA,
                                    style: { ...styleAnswer },
                                }),
                            ],
                            style: {
                                width: 400,
                                height: 240,
                                //backgroundColor: "blue",
                                position: "absolute", //absolute position
                                transform: [{ translate: [125, 470] }], //horizontal and vertical position
                            },
                        }),
                        ui.View({
                            //view for the B answers
                            children: [
                                ui.Text({
                                    text: this.bindAnswerB,
                                    style: { ...styleAnswer },
                                }),
                            ],
                            style: {
                                width: 400,
                                height: 240,
                                //backgroundColor: "red",
                                position: "absolute",
                                transform: [{ translate: [620, 470] }],
                            },
                        }),
                        ui.View({
                            //view for the C answers
                            children: [
                                ui.Text({
                                    text: this.bindAnswerC,
                                    style: { ...styleAnswer },
                                }),
                            ],
                            style: {
                                width: 400,
                                height: 240,
                                //backgroundColor: "yellow",
                                position: "absolute",
                                transform: [{ translate: [125, 770] }],
                            },
                        }),
                        ui.View({
                            //view for the D answers
                            children: [
                                ui.Text({
                                    text: this.bindAnswerD,
                                    style: { ...styleAnswer },
                                }),
                            ],
                            style: {
                                width: 400,
                                height: 240,
                                //backgroundColor: "green",
                                position: "absolute",
                                transform: [{ translate: [620, 770] }],
                            },
                        }),
                        ui.View({
                            //view for the category
                            children: [
                                ui.Image({
                                    source: this.categoryImage,
                                    style: {
                                        height: "100%",
                                        aspectRatio: 1,
                                    },
                                }),
                            ],
                            style: {
                                width: 600,
                                height: 340,
                                //backgroundColor: "purple",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "absolute",
                                transform: [{ translate: [1200, 650] }],
                            },
                        }),
                        ui.Image({
                            //view for the timer digit 1
                            source: this.binddigit1,
                            style: {
                                width: 100,
                                height: 125,
                                //backgroundColor: "black",
                                position: "absolute",
                                transform: [{ translate: [1570, 335] }],
                                opacity: this.bindopacity1,
                            },
                        }),
                        ui.Image({
                            //view for the timer digit 2
                            //TODO Changed
                            source: this.binddigit2,
                            style: {
                                width: 100,
                                height: 125,
                                //backgroundColor: "black",
                                position: "absolute",
                                transform: [{ translate: [1670, 335] }],
                                opacity: this.bindopacity2,
                            },
                        }),
                        ui.Image({
                            //view for the round digit 1
                            source: this.bindRounddigit1,
                            style: {
                                width: 100,
                                height: 125,
                                //backgroundColor: "white",
                                position: "absolute",
                                transform: [{ translate: [1218, 335] }],
                                opacity: this.bindRoundopacity1,
                            },
                        }),
                        ui.Image({
                            //view for the round digit 2
                            source: this.bindRounddigit2,
                            style: {
                                width: 100,
                                height: 125,
                                //backgroundColor: "grey",
                                position: "absolute",
                                transform: [{ translate: [1317, 335] }],
                                opacity: this.bindRoundopacity2,
                            },
                        }),
                    ],
                    style: {
                        backgroundColor: "black",
                        width: "100%",
                        height: "100%",
                        display: this.pagesbinding.questions, //hide the view
                    },
                }),
                ui.View({
                    //GameOver
                    children: [
                        ui.Image({
                            source: ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1022334299735444))),
                            style: {
                                width: "100%",
                                height: "100%",
                                alignSelf: "center",
                                resizeMode: "cover",
                                display: this.pagesbinding.gameover,
                            },
                        }),
                    ],
                }),
                ui.View({
                    //Splash Screen
                    children: [
                        ui.Image({
                            source: ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1379025993261776))),
                            style: {
                                width: "100%",
                                height: "100%",
                                alignSelf: "center",
                                resizeMode: "cover",
                                display: this.pagesbinding.splash,
                            },
                        }),
                    ],
                }),
                //TODO Add next screen here
                ui.View({
                    //Stats
                    children: [
                        ui.Image({
                            source: ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("1016254296991373"))),
                            style: {
                                width: "100%",
                                height: "100%",
                                alignSelf: "center",
                                position: "absolute",
                            },
                        }),
                        // Vertical lines with labels and percentages
                        ui.View({
                            children: this.lineColors.map((color, index) => {
                                const translateX = 0 + (index - 2) * spacing; // Center the lines horizontally
                                return ui.View({
                                    children: [
                                        // Vertical colored line
                                        ui.View({
                                            style: {
                                                backgroundColor: color,
                                                width: lineWidth,
                                                height: this.barHeights[index],
                                                borderRadius: 5,
                                            },
                                        }),
                                        // Percentage text below the line
                                        ui.Text({
                                            text: this.percentageBindings[index],
                                            style: percentageStyle,
                                        }),
                                        // Label below the percentage
                                        ui.Text({
                                            text: this.answerLabels[index],
                                            style: labelStyle,
                                        }),
                                    ],
                                    style: {
                                        alignItems: "center",
                                        marginHorizontal: spacing,
                                        justifyContent: "flex-end",
                                        //backgroundColor: "red",
                                        height: 800, // Combined height for line, percentage, and label
                                    },
                                });
                            }),
                            style: {
                                flexDirection: "row", // Arrange the lines horizontally
                                justifyContent: "center",
                                //backgroundColor: "yellow",
                                alignItems: "flex-end", // Align to the bottom
                                marginBottom: 75,
                                //transform: [{ translate: [0, 200] }], // Move bars lower on the screen
                            },
                        }),
                    ],
                    style: {
                        width: "100%",
                        height: "100%",
                        justifyContent: "flex-end",
                        display: this.pagesbinding.stats, //hide the view
                    },
                }),
                ui.View({
                    //Answer Reveal
                    children: [
                        ui.Image({
                            source: ui.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt("3538474376456507"))),
                            style: {
                                width: "100%",
                                height: "100%",
                                alignSelf: "center",
                                resizeMode: "cover",
                                position: "absolute",
                                display: this.pagesbinding.answerReveal,
                            },
                        }),
                        ui.Text({
                            text: this.correctAnswer,
                            style: correctAnswerS,
                        }),
                    ],
                }), //
            ],
            style: {
                backgroundColor: "black",
                width: "100%",
                height: "100%",
                display: "flex", //hide the view
            },
        });
    }
}
exports.triviaDisplay = triviaDisplay;
triviaDisplay.propsDefinition = {};
ui.UIComponent.register(triviaDisplay);
