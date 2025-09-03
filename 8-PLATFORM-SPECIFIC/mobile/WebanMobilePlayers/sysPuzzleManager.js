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
class sysPuzzleManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.activePlayersList = new Array();
        this.isActive = false;
        this.timeoutID = -1;
        this.intervalID = -1;
    }
    start() {
        // Keeping track of players in the puzzle room and start the puzzle when the first player enters
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (!this.activePlayersList.includes(player)) {
                this.activePlayersList.push(player);
            }
            if (!this.isActive)
                this.OnStartPuzzle();
        });
        // Removing players from the active players list when they exit the puzzle room
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            if (this.activePlayersList.includes(player)) {
                this.activePlayersList.splice(this.activePlayersList.indexOf(player), 1);
            }
        });
        // Listen to the `OnFinishPuzzle` event to complete the puzzle and allow the player to continue
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFinishPuzzle, () => {
            this.OnFinishPuzzle();
        });
    }
    // Starts the puzzle and displays a hint to the active players after `hintDelay` seconds and repeat the hint every `hintRepeatTime` seconds
    OnStartPuzzle() {
        this.isActive = true;
        this.timeoutID = this.async.setTimeout(() => {
            this.sendNetworkBroadcastEvent(sysEvents_1.sysEvents.OnDisplayHintHUD, { players: this.activePlayersList, text: this.props.hintText, duration: this.props.hintDuration });
            this.intervalID = this.async.setInterval(() => {
                this.sendNetworkBroadcastEvent(sysEvents_1.sysEvents.OnDisplayHintHUD, { players: this.activePlayersList, text: this.props.hintText, duration: this.props.hintDuration });
            }, this.props.hintRepeatTime * 1000);
        }, this.props.hintDelay * 1000);
    }
    // Finish the puzzle, clearing all the timeouts and sending an event to move the object (for example, the door to the next room or some platforms)
    OnFinishPuzzle() {
        this.async.clearTimeout(this.timeoutID);
        this.async.clearInterval(this.intervalID);
        if (this.props.objectToMove)
            this.sendLocalEvent(this.props.objectToMove, sysEvents_1.sysEvents.OnMoveObject, {});
    }
}
sysPuzzleManager.propsDefinition = {
    hintText: { type: hz.PropTypes.String },
    hintDelay: { type: hz.PropTypes.Number, default: 30 },
    hintDuration: { type: hz.PropTypes.Number, default: 5 },
    hintRepeatTime: { type: hz.PropTypes.Number, default: 30 },
    objectToMove: { type: hz.PropTypes.Entity },
};
hz.Component.register(sysPuzzleManager);
