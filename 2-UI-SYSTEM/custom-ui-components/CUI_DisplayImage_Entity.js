"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class CUI_DisplayImageAsset_Entity extends ui_1.UIComponent {
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                this.getImage(this.props.backgroundImageTextureAsset?.as(core_1.TextureAsset)),
                this.getImage(this.props.foregroundImageTextureAsset?.as(core_1.TextureAsset)),
            ],
            style: {
                width: '100%',
                height: '100%',
            },
        });
    }
    getImage(textureAsset) {
        if (textureAsset) {
            return (0, ui_1.Image)({
                source: ui_1.ImageSource.fromTextureAsset(textureAsset),
                style: {
                    resizeMode: 'contain',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                },
            });
        }
        else {
            return (0, ui_1.View)({});
        }
    }
    start() {
    }
}
CUI_DisplayImageAsset_Entity.propsDefinition = {
    backgroundImageTextureAsset: { type: core_1.PropTypes.Asset },
    foregroundImageTextureAsset: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(CUI_DisplayImageAsset_Entity);
