"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class BackgroundImageUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Image)({
                    source: ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt(0))),
                    style: {
                        width: '100%',
                        height: '100%',
                        position: 'absolute'
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello World",
                    style: {
                        flex: 1,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(BackgroundImageUI);
