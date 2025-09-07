"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUI_Instructions_Styles_1 = require("CUI_Instructions_Styles");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class Instructions extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.backgroundImage = new ui_1.Binding('');
        this.index = 0;
        this.textures = [];
        this.orgPos = core_1.Vec3.zero;
        this.buttons = [
            this.createButton('Back', false),
            this.createButton('Next', true),
        ];
    }
    preStart() {
    }
    addTextureToArray(texture) {
        const t = texture?.as(core_1.TextureAsset);
        if (t) {
            this.textures.push(t);
        }
    }
    start() {
        this.orgPos = this.entity.position.get();
        this.backgroundImage.set(ui_1.ImageSource.fromTextureAsset(this.textures[this.index]));
    }
    initializeUI() {
        this.addTextureToArray(this.props.logoPage);
        this.addTextureToArray(this.props.howToPlay);
        this.addTextureToArray(this.props.proTips);
        this.addTextureToArray(this.props.stages);
        this.addTextureToArray(this.props.team);
        this.addTextureToArray(this.props.community);
        this.addTextureToArray(this.props.keepItKind);
        this.backgroundImage.set(ui_1.ImageSource.fromTextureAsset(this.textures[this.index]));
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Image)({
                    source: ui_1.ImageSource.fromTextureAsset(this.props.empty),
                    style: CUI_Instructions_Styles_1.cuiInstructionStyles.imageStyle,
                }),
                (0, ui_1.Image)({
                    source: this.backgroundImage,
                    style: CUI_Instructions_Styles_1.cuiInstructionStyles.imageStyle,
                }),
                (0, ui_1.View)({
                    children: [...this.buttons],
                    style: CUI_Instructions_Styles_1.cuiInstructionStyles.buttonsStyle,
                }),
            ],
            style: { ...CUI_Instructions_Styles_1.cuiInstructionStyles.containerStyle, borderWidth: 4, borderColor: core_1.Color.black },
        });
    }
    createButton(buttonText, goUp) {
        return (0, ui_1.Pressable)({
            children: (0, ui_1.Text)({
                text: buttonText,
                style: CUI_Instructions_Styles_1.cuiInstructionStyles.buttonText,
            }),
            onClick: () => { this.updateIndex(goUp); }, //put function call here
            style: CUI_Instructions_Styles_1.cuiInstructionStyles.buttonBackground,
        });
    }
    updateIndex(goUp) {
        this.props.click?.position.set(this.orgPos);
        this.props.click?.as(core_1.AudioGizmo).play();
        if (goUp) {
            this.index++;
        }
        else {
            this.index += (this.textures.length - 1);
        }
        this.index = this.index % this.textures.length;
        this.backgroundImage.set(ui_1.ImageSource.fromTextureAsset(this.textures[this.index]));
    }
}
Instructions.propsDefinition = {
    click: { type: core_1.PropTypes.Entity },
    empty: { type: core_1.PropTypes.Asset },
    logoPage: { type: core_1.PropTypes.Asset },
    howToPlay: { type: core_1.PropTypes.Asset },
    proTips: { type: core_1.PropTypes.Asset },
    stages: { type: core_1.PropTypes.Asset },
    team: { type: core_1.PropTypes.Asset },
    community: { type: core_1.PropTypes.Asset },
    keepItKind: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(Instructions);
