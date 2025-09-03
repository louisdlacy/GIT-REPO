"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const Trigger_1 = require("Trigger");
const expressions = [
    ui_1.AvatarImageExpressions.Neutral,
    ui_1.AvatarImageExpressions.Happy,
    ui_1.AvatarImageExpressions.Sad,
    ui_1.AvatarImageExpressions.Angry,
    ui_1.AvatarImageExpressions.TeeHee,
    ui_1.AvatarImageExpressions.Congrats,
    ui_1.AvatarImageExpressions.Shocked,
    ui_1.AvatarImageExpressions.Waving
];
class CUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.playerCapacity = 9;
        this.imagesToDisplay = [];
        //IMPORTANT: This is a placeholder image, and it might get deleted in the future
        this.placeHolderImage = ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt("4135527350052414")));
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: this.imagesGrid(),
            style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#000000',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
                alignItems: 'center',
            }
        });
    }
    preStart() {
        if (!this.props.serverEntity) {
            throw new Error("CUI component requires a 'serverEntity' prop with an Entity reference");
        }
        this.connectNetworkEvent(this.entity, Trigger_1.PlayersToDisplay, ({ players }) => {
            this.imagesToDisplay.forEach((entry, index) => {
                if (index < players.length) {
                    entry.player = players[index];
                    entry.image.set(ui_1.ImageSource.fromPlayerAvatarExpression(entry.player, expressions[entry.currentExpression]));
                }
                else {
                    entry.player = undefined;
                    entry.image.set(this.placeHolderImage);
                    entry.currentExpression = 0;
                }
            });
        });
        const owner = this.world.getLocalPlayer();
        if (owner !== this.world.getServerPlayer()) {
            this.sendNetworkEvent(this.props.serverEntity, Trigger_1.CUIReady, {});
        }
    }
    start() {
    }
    imagesGrid() {
        const grid = [];
        for (let i = 0; i < this.playerCapacity; i++) {
            const entry = {
                player: undefined,
                image: new ui_1.Binding(this.placeHolderImage),
                currentExpression: 0
            };
            this.imagesToDisplay.push(entry);
            grid.push((0, ui_1.Pressable)({
                children: [
                    (0, ui_1.Image)({
                        source: entry.image,
                        style: {
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#2671a3',
                        }
                    })
                ],
                onPress: () => {
                    if (entry.player) {
                        entry.currentExpression = (entry.currentExpression + 1) % expressions.length;
                        entry.image.set(ui_1.ImageSource.fromPlayerAvatarExpression(entry.player, expressions[entry.currentExpression]));
                    }
                },
                style: {
                    width: 100,
                    aspectRatio: 1,
                    backgroundColor: '#ffffff',
                    margin: 20
                }
            }));
        }
        return grid;
    }
}
CUI.propsDefinition = {
    serverEntity: { type: core_1.PropTypes.Entity }
};
ui_1.UIComponent.register(CUI);
