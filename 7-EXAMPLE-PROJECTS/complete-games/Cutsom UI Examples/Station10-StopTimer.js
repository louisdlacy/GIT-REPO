"use strict";
/*
  Station 10a: Non-Interactive Overlay

  This station demonstrates use of the non-interactive Screen Overlay mode for custom UIs. When a custom UI is set to this mode,
  it is displayed as a screen overlay in front of the player, which makes it a useful mechanism for displaying HUD information
  during gameplay.

  In this station, a non-interactive timer is placed in front of the player. The player has a predefined number of seconds to find the
  button in the world and step on it, stopping the timer. Else, the timer runs out, and the player "loses."

  This script attaches to the trigger zone, which when breached, causes the TimerEnd event to emit. The TimerEnd
  event causes the timer to stop running.
  
*/
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
const Station10_NonInteractiveOverlay_1 = require("Station10-NonInteractiveOverlay"); // imports the event, which is emitted when the player enters the trigger.
class Station10_StopTimer extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            this.sendNetworkBroadcastEvent(Station10_NonInteractiveOverlay_1.TimerEnd, { timeMS: -1 });
            console.log("Sent TimerEnd event from trigger.");
        });
    }
}
Station10_StopTimer.propsDefinition = {};
hz.Component.register(Station10_StopTimer);
