"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class ImageUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.textureId = 0;
    }
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Image)({
                    source: ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt(this.textureId)))
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(ImageUI);
