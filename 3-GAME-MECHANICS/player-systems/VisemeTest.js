"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _2p_1 = require("horizon/2p");
const core_1 = require("horizon/core");
const npc_1 = require("horizon/npc");
const ui_1 = require("horizon/ui");
class VisemeTest extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelWidth = 1080;
        this.panelHeight = 1080;
        this.moveX = new ui_1.Binding(0);
        this.moveY = new ui_1.Binding(0);
        this.i = 0;
    }
    preStart() { }
    initializeUI() {
        return (0, ui_1.View)({
            style: {
                width: this.panelWidth,
                height: this.panelHeight,
                backgroundColor: '#354600c0',
                // justifyContent: "center",
                // alignItems: "center"
            },
            children: [
                (0, ui_1.Image)({
                    source: ui_1.ImageSource.fromTextureAsset(new _2p_1.TextureAsset(BigInt('1077667850961560'))),
                    style: {
                        width: this.panelWidth * 4,
                        aspectRatio: 1,
                        transform: [{ translate: [this.moveX, this.moveY] }]
                    }
                })
            ]
        });
    }
    start() {
        if (this.props.voice) {
            this.connectNetworkEvent(this.props.voice, npc_1.NpcEvents.OnNpcVisemeChanged, ({ viseme }) => this.visemeHandler(viseme));
            this.voiceSpeak();
            // this.async.setInterval(() => {
            //   this.cycleTest();
            // }, 500);
        }
        else {
            console.warn('No voice linked to viseme UI');
        }
    }
    voiceSpeak() {
        if (this.props.voice) {
            this.props.voice.as(npc_1.Npc).conversation.elicitResponse('Something so totally random to make the listener question your sanity, but it kinda makes a bit of sense').then(() => {
                this.async.setTimeout(() => {
                    this.voiceSpeak();
                }, 1000);
            });
        }
    }
    visemeHandler(visemeID) {
        console.log(`Received viseme: ${visemeID}`);
        const idX = visemeID % 4;
        const idY = Math.floor(visemeID / 4);
        // console.log(`Current tile X,Y :[${idX}, ${idY}]`);
        this.moveX.set((idX * this.panelWidth) * -1);
        this.moveY.set((idY * this.panelHeight) * -1);
    }
    cycleTest() {
        const idX = this.i % 4;
        const idY = Math.floor(this.i / 4);
        // console.log(`Current tile X,Y :[${idX}, ${idY}]`);
        this.moveX.set((idX * this.panelWidth) * -1);
        this.moveY.set((idY * this.panelHeight) * -1);
        this.i = (this.i + 1) % 15;
    }
}
VisemeTest.propsDefinition = {
    voice: {
        type: core_1.PropTypes.Entity
    },
};
ui_1.UIComponent.register(VisemeTest);
