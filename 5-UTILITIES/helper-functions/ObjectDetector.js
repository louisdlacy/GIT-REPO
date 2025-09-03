"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ColorChangeButton_1 = require("ColorChangeButton");
const hz = __importStar(require("horizon/core"));
const npc_1 = require("horizon/npc");
const LLMButton_1 = require("LLMButton");
/*
  Note: need to assign hex -> color name here to pass into dynamic context
  since LLM is VERY BAD at properly recognizing hex values and translating them to color names
*/
const Colors = new Map([
    ['#ffffff', 'gray'],
    ['#ff0000', 'red'],
    ['#00ff00', 'green'],
    ['#0000ff', 'blue']
]);
class ObjectDetector extends hz.Component {
    constructor() {
        super(...arguments);
        this._canReport = true;
    }
    preStart() {
        this.connectLocalEvent(this.entity, ColorChangeButton_1.ColorChangeButton.ColorChangeEvent, (data) => {
            this.updateColorKnowledge(data.color);
        });
        this.connectLocalEvent(this.entity, LLMButton_1.LLMButton.ColorQueryEvent, () => {
            this.askAboutColor();
        });
    }
    start() {
        this._npc = this.entity.as(npc_1.Npc);
        if (!this._npc) {
            console.error("ObjectDetector: needs to be attached to NPC gizmo!");
        }
        /*
        * Note: Resetting the LLM's memory on start (and sometimes periodically through gameplay)
        * is a good practice to prevent the LLM's responses from degrading or hallucinating over time.
        */
        this._npc.conversation.resetMemory();
        // Set understanding of sphere color to gray by default
        this.updateColorKnowledge(new hz.Color(1, 1, 1));
    }
    updateColorKnowledge(newColor) {
        const colorName = Colors.get(newColor.toHex());
        if (colorName == null) {
            console.log("Color name not defined for " + newColor.toHex() + "!");
            return;
        }
        this._npc.conversation.addEventPerception("The sphere is now the color " + colorName + ".");
        const newColorPrompt = "The sphere is currently the color " + colorName + ".";
        this._npc.conversation.setDynamicContext("sphere_color", newColorPrompt);
    }
    async askAboutColor() {
        /*
        * Note: This flag blocks the user from prompting the LLM while it's still speaking,
        * since the current behavior for multiple elicitResponse requests in quick sucession
        * is to create a stack of responses to generate sequentially. In this use case we would
        * only care about the most recent color, so having it report old colors wouldn't make sense.
        */
        if (!this._canReport) {
            return;
        }
        let meshEnt = this.props.speakingIndicator.as(hz.MeshEntity);
        this._canReport = false;
        meshEnt.style.brightness.set(10);
        await this._npc.conversation.elicitResponse("Tell me the current color of the sphere.");
        this._canReport = true;
        meshEnt.style.brightness.set(0);
    }
}
ObjectDetector.propsDefinition = {
    speakingIndicator: { type: hz.PropTypes.Entity },
};
hz.Component.register(ObjectDetector);
