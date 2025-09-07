"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class BackgroundImageUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    style: {
                        flex: 1,
                        backgroundColor: "red",
                    }
                }),
                (0, ui_1.View)({
                    style: {
                        flex: 1,
                        backgroundColor: "green",
                    }
                }),
                (0, ui_1.View)({
                    style: {
                        flex: 1,
                        backgroundColor: "blue",
                    }
                }),
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(BackgroundImageUI);
