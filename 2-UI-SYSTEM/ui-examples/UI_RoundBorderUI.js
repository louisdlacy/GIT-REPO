"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class RoundBorderUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    style: {
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: core_1.Color.black,
                        width: 100,
                        height: 100
                    }
                }),
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(RoundBorderUI);
