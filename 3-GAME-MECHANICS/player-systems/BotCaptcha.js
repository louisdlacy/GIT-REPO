"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const popUpFormat = {
    position: new core_1.Vec3(0, -0.3, 0),
    fontSize: 3,
    fontColor: core_1.Color.white,
    backgroundColor: core_1.Color.black,
    playSound: false,
    showTimer: false,
};
class BotCaptcha extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 600;
        this.panelWidth = 800;
        this.images = [];
        this.imageBindings = [];
        this.answers = new Map();
        this.question = new ui_1.Binding('Select an image!');
        this.timer = new ui_1.Binding("Are you a bot? 60secs");
        this.progress = new ui_1.Binding('0%');
        this.expectedValidAnswers = 3;
        this.secondsToComplete = 60;
    }
    initializeUI() {
        this.getProps();
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: this.timer,
                    style: {
                        fontSize: 48,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: 50,
                        width: '100%',
                    }
                }),
                (0, ui_1.Text)({
                    text: this.question,
                    style: {
                        fontSize: 48,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: 50,
                        width: '100%',
                    }
                }),
                (0, ui_1.View)({
                    children: this.makeTiles(),
                    style: {
                        height: 350,
                        aspectRatio: 1,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                    }
                }),
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            style: {
                                width: this.progress,
                                height: '100%',
                                backgroundColor: '#0d8711',
                                borderRadius: 10,
                            }
                        })
                    ],
                    style: {
                        width: '90%',
                        height: 50,
                        borderColor: 'white',
                        borderWidth: 4,
                        borderRadius: 10,
                    }
                })
            ],
            style: {
                backgroundColor: 'black',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                borderRadius: 20,
            }
        });
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            const expectedAnswer = this.refreshTiles(player);
            this.answers.set(player, { expected: expectedAnswer, score: 0, timerID: this.startTimerForPlayer(player) });
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.answers.delete(player);
        });
    }
    startTimerForPlayer(player) {
        let timeLeft = this.secondsToComplete;
        const timerID = this.async.setInterval(() => {
            if (timeLeft <= 0) {
                this.async.clearInterval(timerID);
                this.props.sfxWrong?.as(core_1.AudioGizmo)?.play({ players: [player], fade: 0 });
                this.props.spawnBot?.as(core_1.SpawnPointGizmo).teleportPlayer(player);
                this.world.ui.showPopupForPlayer(player, 'You are a bot! Maybe?', 5, popUpFormat);
                return;
            }
            timeLeft--;
            this.timer.set(`Are you a bot? ${timeLeft}secs`, [player]);
        }, 1000);
        return timerID;
    }
    makeTiles() {
        const randomizedImages = this.images.sort(() => Math.random() - 0.5);
        return randomizedImages.map((image, index) => {
            this.imageBindings.push(new ui_1.Binding(image.asset));
            return (0, ui_1.Pressable)({
                children: [
                    (0, ui_1.Image)({
                        source: this.imageBindings[index],
                        style: {
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                        }
                    })
                ],
                onPress: (player) => {
                    this.validateAnswer(player, index);
                },
                style: {
                    width: 100,
                    aspectRatio: 1,
                    margin: 5,
                }
            });
        });
    }
    refreshTiles(player) {
        const randomizedImages = this.images.sort(() => Math.random() - 0.5);
        this.imageBindings.forEach((binding, index) => {
            binding.set(randomizedImages[index].asset, [player]);
        });
        const randomQuestion = Math.floor(Math.random() * randomizedImages.length);
        const answer = randomizedImages[randomQuestion].tileName;
        this.question.set('Select the ' + answer + '!', [player]);
        return randomQuestion;
    }
    validateAnswer(player, answer) {
        let data = this.answers.get(player);
        if (data && answer === data.expected) {
            const updatedScore = Math.min(data.score + 1, this.expectedValidAnswers);
            data.score = updatedScore;
            const progress = `${(updatedScore / this.expectedValidAnswers) * 100}%`;
            this.progress.set(progress, [player]);
            this.props.sfxCorrect?.as(core_1.AudioGizmo)?.play({ players: [player], fade: 0 });
            if (updatedScore >= this.expectedValidAnswers) {
                console.log(`Player ${player.name} completed the game!`);
                this.props.spawnPlayer?.as(core_1.SpawnPointGizmo).teleportPlayer(player);
                this.world.ui.showPopupForPlayer(player, 'You are human!', 5, popUpFormat);
                this.async.clearInterval(data.timerID);
                return;
            }
            else {
                data.expected = this.refreshTiles(player);
            }
        }
        else {
            this.props.sfxWrong?.as(core_1.AudioGizmo)?.play({ players: [player], fade: 0 });
            if (!data) {
                data = { expected: 0, score: 0, timerID: this.startTimerForPlayer(player) };
            }
        }
        data.expected = this.refreshTiles(player);
        this.answers.set(player, data);
    }
    getProps() {
        const data = [
            { name: 'cat', asset: this.props.cat?.as(core_1.TextureAsset) },
            { name: 'pigeon', asset: this.props.pigeon?.as(core_1.TextureAsset) },
            { name: 'bunny', asset: this.props.bunny?.as(core_1.TextureAsset) },
            { name: 'elephant', asset: this.props.elephant?.as(core_1.TextureAsset) },
            { name: 'chicken', asset: this.props.chicken?.as(core_1.TextureAsset) },
            { name: 'cow', asset: this.props.cow?.as(core_1.TextureAsset) },
            { name: 'monkey', asset: this.props.monkey?.as(core_1.TextureAsset) },
            { name: 'dog', asset: this.props.dog?.as(core_1.TextureAsset) },
            { name: 'fox', asset: this.props.fox?.as(core_1.TextureAsset) },
        ];
        data.forEach(item => {
            if (item.asset) {
                this.images.push({ tileName: item.name, asset: ui_1.ImageSource.fromTextureAsset(item.asset) });
            }
            else {
                console.warn(`Asset for ${item.name} is not provided.`);
            }
        });
    }
}
BotCaptcha.propsDefinition = {
    cat: { type: core_1.PropTypes.Asset },
    pigeon: { type: core_1.PropTypes.Asset },
    bunny: { type: core_1.PropTypes.Asset },
    elephant: { type: core_1.PropTypes.Asset },
    chicken: { type: core_1.PropTypes.Asset },
    cow: { type: core_1.PropTypes.Asset },
    monkey: { type: core_1.PropTypes.Asset },
    dog: { type: core_1.PropTypes.Asset },
    fox: { type: core_1.PropTypes.Asset },
    sfxCorrect: { type: core_1.PropTypes.Entity },
    sfxWrong: { type: core_1.PropTypes.Entity },
    spawnBot: { type: core_1.PropTypes.Entity },
    spawnPlayer: { type: core_1.PropTypes.Entity },
};
ui_1.UIComponent.register(BotCaptcha);
