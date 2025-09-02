
import { Player, PropTypes, TextureAsset } from 'horizon/core';
import { AvatarImageExpressions, Binding, Image, ImageSource, Pressable, UIComponent, UINode, View } from 'horizon/ui';
import { CUIReady, PlayersToDisplay } from 'Trigger';

const expressions: AvatarImageExpressions[] = [
    AvatarImageExpressions.Neutral,
    AvatarImageExpressions.Happy,
    AvatarImageExpressions.Sad,
    AvatarImageExpressions.Angry,
    AvatarImageExpressions.TeeHee,
    AvatarImageExpressions.Congrats,
    AvatarImageExpressions.Shocked,
    AvatarImageExpressions.Waving
]

class CUI extends UIComponent<typeof CUI> {
    static propsDefinition = {
        serverEntity: { type: PropTypes.Entity }
    };
    private playerCapacity: number = 9;
    private imagesToDisplay: { player: Player | undefined, image: Binding<ImageSource>, currentExpression: number }[] = []
    //IMPORTANT: This is a placeholder image, and it might get deleted in the future
    private placeHolderImage: ImageSource = ImageSource.fromTextureAsset(new TextureAsset(BigInt("4135527350052414")));

    initializeUI(): UINode {
        return View({
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
        })
    }

    preStart() {
        if (!this.props.serverEntity) {
            throw new Error("CUI component requires a 'serverEntity' prop with an Entity reference");
        }
        this.connectNetworkEvent(this.entity, PlayersToDisplay, ({ players }) => {
            this.imagesToDisplay.forEach((entry, index) => {
                if (index < players.length) {
                    entry.player = players[index];
                    entry.image.set(ImageSource.fromPlayerAvatarExpression(entry.player, expressions[entry.currentExpression]));
                } else {
                    entry.player = undefined;
                    entry.image.set(this.placeHolderImage);
                    entry.currentExpression = 0;
                }
            });
        })

        const owner = this.world.getLocalPlayer();
        if (owner !== this.world.getServerPlayer()) {
            this.sendNetworkEvent(this.props.serverEntity, CUIReady, {});
        }
    }

    start() {

    }

    private imagesGrid(): UINode[] {
        const grid: UINode[] = [];
        for (let i = 0; i < this.playerCapacity; i++) {
            const entry = {
                player: undefined,

                image: new Binding(this.placeHolderImage),
                currentExpression: 0
            }
            this.imagesToDisplay.push(entry);

            grid.push(Pressable({
                children: [
                    Image({
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
                        entry.image.set(ImageSource.fromPlayerAvatarExpression(entry.player, expressions[entry.currentExpression]));
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
UIComponent.register(CUI);