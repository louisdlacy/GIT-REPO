"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class TextUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Hello World!",
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(TextUI);
