"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class ShadowUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    style: {
                        width: 200,
                        height: 150,
                        backgroundColor: 'white',
                        shadowColor: core_1.Color.black,
                        shadowOffset: [10, 10],
                        shadowOpacity: 0.5,
                        shadowRadius: 5
                    }
                }),
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(ShadowUI);
