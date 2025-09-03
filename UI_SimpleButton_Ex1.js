"use strict";
// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const UI_SimpleButtonEvent_1 = require("UI_SimpleButtonEvent");
class UI_SimpleButton_Ex1 extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.bndColor = new ui_1.Binding("rgb(255, 255, 255)");
        this.isWhite = true;
        this.index = 0;
        this.txtMap = {
            0: "Welcome to Simple Button!\n\nClick the button again",
            1: "Nice Button!\n\nClick again!",
            2: "Simple Button" + "\nis a developers" + "\nbest friend",
            3: "Assign the target entity you want to test." +
                "\nMake sure it connects to simpleButtonEvent",
            4: "Then call your function from the button event!",
            5: "Hide the button in the property panel",
            6: "See the UI_SimpleButton_README for more info",
            7: "I think you're ready for example 2!",
            8: "Stop the world and" +
                "\nassign the Cat [Example 2] to" +
                "\n the 'targetEntity' of the UI Simple Button." +
                "\nThen press to test!",
            9: "What are you doing?!" + "\nGo try it out!",
        };
        this.bndTxt = new ui_1.Binding(this.txtMap[this.index]);
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: this.bndTxt,
                    style: {
                        color: "rgba(109, 72, 143, 1)",
                        fontSize: 30,
                        fontFamily: "Kallisto",
                        textAlign: "center",
                        padding: 12,
                    },
                }),
            ],
            style: {
                backgroundColor: this.bndColor,
                borderRadius: 40,
                width: 500,
                height: 250,
                layoutOrigin: [0.5, 0.5],
                left: "50%",
                top: "20%",
                alignContent: "center",
                justifyContent: "center",
            },
        });
    }
    preStart() {
        this.connectNetworkEvent(this.entity, UI_SimpleButtonEvent_1.simpleButtonEvent, (data) => {
            console.log("Received simpleButtonEvent:", data);
            if (!this.entity.visible.get()) {
                this.entity.visible.set(true);
                this.index = -1;
            }
            if (this.index < Object.keys(this.txtMap).length - 1) {
                this.index++;
            }
            else {
                this.entity.visible.set(false);
            }
            this.bndTxt.set(this.txtMap[this.index]);
        });
        //Hide until the button is pressed
        this.entity.visible.set(false);
    }
}
UI_SimpleButton_Ex1.propsDefinition = {};
ui_1.UIComponent.register(UI_SimpleButton_Ex1);
