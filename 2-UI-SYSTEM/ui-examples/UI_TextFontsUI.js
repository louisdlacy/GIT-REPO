"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class TextFontsUI extends ui_1.UIComponent {
    //Available fonts: 'Anton' | 'Bangers' | 'Kallisto' | 'Optimistic' | 'Oswald' | 'Roboto' | 'Roboto-Mono'
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Anton',
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Bangers',
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Kallisto',
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Optimistic',
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Oswald',
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Roboto',
                    }
                }),
                (0, ui_1.Text)({
                    text: "Hello",
                    style: {
                        fontFamily: 'Roboto-Mono',
                    }
                }),
            ]
        });
    }
}
ui_1.UIComponent.register(TextFontsUI);
