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
const hz = __importStar(require("horizon/core"));
const sysEvents_1 = require("sysEvents");
class RoomB_KeypadButton extends hz.Component {
    constructor() {
        super(...arguments);
        this.startPos = hz.Vec3.zero;
        this.pushedPos = hz.Vec3.zero;
        this.isPushed = false;
    }
    start() {
        const keypad = this.props.keypad;
        if (keypad === undefined)
            return;
        this.startPos = this.entity.position.get();
        this.pushedPos = this.startPos.add(this.entity.forward.get().mul(-0.02));
        this.isPushed = false;
        // Listen for collisions with the player to press the button. Applicable for VR players physically pressing the button
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerCollision, () => {
            this.HandleButtonPress(keypad);
        });
        // Listen for `OnEntityTapped` events to press the button. Applicable for Web and Mobile players using Focused Interactions to press the button
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnEntityTapped, () => {
            this.HandleButtonPress(keypad);
        });
    }
    HandleButtonPress(keypad) {
        if (this.isPushed)
            return;
        this.isPushed = true;
        this.entity.position.set(this.pushedPos);
        // Notify the keypad that a button has been pressed
        this.sendNetworkEvent(keypad, sysEvents_1.sysEvents.OnButtonPressed, { number: this.props.number });
        // Reset the button after a small delay
        this.async.setTimeout(() => this.ResetButton(), 300);
    }
    ResetButton() {
        this.entity.position.set(this.startPos);
        this.isPushed = false;
    }
}
RoomB_KeypadButton.propsDefinition = {
    keypad: { type: hz.PropTypes.Entity },
    number: { type: hz.PropTypes.Number },
};
hz.Component.register(RoomB_KeypadButton);
