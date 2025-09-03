"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class ButtonUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.hoverColor = core_1.Color.white;
        this.pressedColor = new core_1.Color(0, 1, 1);
        this.defaultColor = core_1.Color.green;
        this.buttonColorBinding = new ui_1.Binding(this.defaultColor);
    }
    preStart() { }
    start() { }
    initializeUI() {
        return (0, ui_1.Pressable)({
            children: (0, ui_1.Text)({
                text: "Click Me",
                style: {
                    color: 'black',
                    textAlign: 'center',
                    textAlignVertical: 'center'
                }
            }),
            onPress: () => { this.buttonColorBinding.set(this.pressedColor); },
            onRelease: () => { this.buttonColorBinding.set(this.defaultColor); },
            onClick: (player) => { console.log(`Button clicked by ${player.name.get()}`); },
            onEnter: () => { this.buttonColorBinding.set(this.hoverColor); },
            onExit: () => { this.buttonColorBinding.set(this.defaultColor); },
            style: {
                backgroundColor: this.buttonColorBinding,
                width: 150,
                height: 50,
            }
        });
    }
}
ui_1.UIComponent.register(ButtonUI);
