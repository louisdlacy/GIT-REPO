"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class ScrollViewUI extends ui_1.UIComponent {
    preStart() { }
    start() { }
    initializeUI() {
        // Create a list of squares to fill the scroll view
        const squares = Array.from({ length: 20 }, (_, i) => (0, ui_1.View)({
            style: {
                width: 50,
                height: 50,
                backgroundColor: 'black',
                margin: 10
            },
        }));
        return (0, ui_1.View)({
            children: [
                (0, ui_1.ScrollView)({
                    children: squares,
                    style: {
                        width: 300,
                        height: 300,
                        backgroundColor: 'white'
                    }
                })
            ],
            style: {
                flex: 1
            }
        });
    }
}
ui_1.UIComponent.register(ScrollViewUI);
