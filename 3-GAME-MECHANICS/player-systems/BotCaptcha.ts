import { AudioGizmo, CodeBlockEvents, Color, Player, PopupOptions, PropTypes, SpawnPointGizmo, TextureAsset, Vec3 } from 'horizon/core';
import { Binding, Image, ImageSource, Pressable, Text, UIComponent, UINode, View } from 'horizon/ui';

const popUpFormat: PopupOptions = {
    position: new Vec3(0, -0.3, 0),
    fontSize: 3,
    fontColor: Color.white,
    backgroundColor: Color.black,
    playSound: false,
    showTimer: false,
}

class BotCaptcha extends UIComponent<typeof BotCaptcha> {
    protected panelHeight: number = 600;
    protected panelWidth: number = 800;

    static propsDefinition = {
        cat: { type: PropTypes.Asset },
        pigeon: { type: PropTypes.Asset },
        bunny: { type: PropTypes.Asset },
        elephant: { type: PropTypes.Asset },
        chicken: { type: PropTypes.Asset },
        cow: { type: PropTypes.Asset },
        monkey: { type: PropTypes.Asset },
        dog: { type: PropTypes.Asset },
        fox: { type: PropTypes.Asset },
        sfxCorrect: { type: PropTypes.Entity },
        sfxWrong: { type: PropTypes.Entity },
        spawnBot: { type: PropTypes.Entity },
        spawnPlayer: { type: PropTypes.Entity },
    };
    private images: { tileName: string, asset: ImageSource }[] = []
    private imageBindings: Binding<ImageSource>[] = [];
    private answers = new Map<Player, { expected: number, score: number, timerID: number }>()

    private question = new Binding<string>('Select an image!');
    private timer = new Binding<string>("Are you a bot? 60secs");
    private progress = new Binding<string>('0%');

    private expectedValidAnswers: number = 3;
    private secondsToComplete: number = 60;

    initializeUI(): UINode {

        this.getProps()

        return View({
            children: [
                Text({
                    text: this.timer,
                    style: {
                        fontSize: 48,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: 50,
                        width: '100%',
                    }
                }),
                Text({
                    text: this.question,
                    style: {
                        fontSize: 48,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: 50,
                        width: '100%',
                    }
                }),
                View({
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
                View({
                    children: [
                        View({
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

    preStart(): void {
        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player: Player) => {
            const expectedAnswer = this.refreshTiles(player);
            this.answers.set(player, { expected: expectedAnswer, score: 0, timerID: this.startTimerForPlayer(player) });
        });

        this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player: Player) => {
            this.answers.delete(player);
        })
    }

    private startTimerForPlayer(player: Player): number {
        let timeLeft = this.secondsToComplete;
        const timerID = this.async.setInterval(() => {
            if (timeLeft <= 0) {
                this.async.clearInterval(timerID);
                this.props.sfxWrong?.as(AudioGizmo)?.play({ players: [player], fade: 0 });
                this.props.spawnBot?.as(SpawnPointGizmo).teleportPlayer(player);
                this.world.ui.showPopupForPlayer(player, 'You are a bot! Maybe?', 5, popUpFormat);
                return;
            }
            timeLeft--;
            this.timer.set(`Are you a bot? ${timeLeft}secs`, [player]);
        }, 1000);
        return timerID;
    }

    private makeTiles(): UINode[] {
        const randomizedImages = this.images.sort(() => Math.random() - 0.5);
        return randomizedImages.map((image, index) => {
            this.imageBindings.push(new Binding<ImageSource>(image.asset));
            return Pressable({
                children: [
                    Image({
                        source: this.imageBindings[index],
                        style: {
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                        }
                    })
                ],
                onPress: (player: Player) => {
                    this.validateAnswer(player, index);
                },
                style: {
                    width: 100,
                    aspectRatio: 1,
                    margin: 5,
                }
            })
        })
    }

    private refreshTiles(player: Player) {
        const randomizedImages = this.images.sort(() => Math.random() - 0.5);
        this.imageBindings.forEach((binding, index) => {
            binding.set(randomizedImages[index].asset, [player]);
        });
        const randomQuestion = Math.floor(Math.random() * randomizedImages.length);
        const answer = randomizedImages[randomQuestion].tileName
        this.question.set('Select the ' + answer + '!', [player]);
        return randomQuestion;
    }

    private validateAnswer(player: Player, answer: number) {
        let data = this.answers.get(player)
        if (data && answer === data.expected) {
            const updatedScore = Math.min(data.score + 1, this.expectedValidAnswers);
            data.score = updatedScore;
            const progress = `${(updatedScore / this.expectedValidAnswers) * 100}%`;
            this.progress.set(progress, [player]);
            this.props.sfxCorrect?.as(AudioGizmo)?.play({ players: [player], fade: 0 });
            if (updatedScore >= this.expectedValidAnswers) {
                console.log(`Player ${player.name} completed the game!`);
                this.props.spawnPlayer?.as(SpawnPointGizmo).teleportPlayer(player);
                this.world.ui.showPopupForPlayer(player, 'You are human!', 5, popUpFormat);
                this.async.clearInterval(data.timerID);
                return;
            } else {
                data.expected = this.refreshTiles(player);
            }
        } else {
            this.props.sfxWrong?.as(AudioGizmo)?.play({ players: [player], fade: 0 });
            if (!data) {
                data = { expected: 0, score: 0, timerID: this.startTimerForPlayer(player) };
            }
        }

        data.expected = this.refreshTiles(player);
        this.answers.set(player, data);
    }

    private getProps() {
        const data = [
            { name: 'cat', asset: this.props.cat?.as(TextureAsset) },
            { name: 'pigeon', asset: this.props.pigeon?.as(TextureAsset) },
            { name: 'bunny', asset: this.props.bunny?.as(TextureAsset) },
            { name: 'elephant', asset: this.props.elephant?.as(TextureAsset) },
            { name: 'chicken', asset: this.props.chicken?.as(TextureAsset) },
            { name: 'cow', asset: this.props.cow?.as(TextureAsset) },
            { name: 'monkey', asset: this.props.monkey?.as(TextureAsset) },
            { name: 'dog', asset: this.props.dog?.as(TextureAsset) },
            { name: 'fox', asset: this.props.fox?.as(TextureAsset) },
        ];

        data.forEach(item => {
            if (item.asset) {
                this.images.push({ tileName: item.name, asset: ImageSource.fromTextureAsset(item.asset) });
            } else {
                console.warn(`Asset for ${item.name} is not provided.`);
            }
        })

    }
}
UIComponent.register(BotCaptcha);
