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
exports.CheckpointEvents = void 0;
const hz = __importStar(require("horizon/core"));
exports.CheckpointEvents = {
    // Fired when the player visits a checkpoint for the first time
    PlayerVisited: new hz.LocalEvent('checkpointVisited'),
    // Fired every time the player enters a checkpoint, even if they've already visited it
    PlayerEntered: new hz.LocalEvent('checkpointEntered'),
    // Fired every time the player resets a checkpoint, even if they've already visited it
    PlayerReset: new hz.LocalEvent('checkpointReset'),
};
class Checkpoint extends hz.Component {
    constructor() {
        super(...arguments);
        // Use a set to track of which players have visited this checkpoint (for multiplayer)
        this._visited = new Set();
        this._unvisitedColor = new hz.Color(0.07, 0.58, 1);
        this._visitedColor = new hz.Color(0.27, 1, 0.25);
    }
    preStart() {
        this.connectLocalEvent(this.entity, exports.CheckpointEvents.PlayerReset, (data) => {
            this.resetCheckpoints(data.player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.enteredCheckpoint(player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            this.exitedCheckpoint(player);
        });
    }
    start() {
        if (!this.props.checkpoint) {
            console.error(`Checkpoint ${this.props.num} has no checkpoint model set!`);
            return;
        }
        this._mesh = this.props.checkpoint?.as(hz.MeshEntity);
        this._mesh.style.tintStrength.set(1);
        this._mesh.style.tintColor.set(this._unvisitedColor);
    }
    enteredCheckpoint(player) {
        this.sendLocalEvent(this.props.npc, exports.CheckpointEvents.PlayerEntered, {
            player: player,
            checkpointNum: this.props.num
        });
        this._mesh.style.tintColor.set(this._visitedColor);
    }
    exitedCheckpoint(player) {
        if (this._visited.has(player.id)) {
            return;
        }
        this._visited.add(player.id);
        this.sendLocalEvent(this.props.npc, exports.CheckpointEvents.PlayerVisited, {
            player: player,
            checkpointNum: this.props.num
        });
    }
    resetCheckpoints(player) {
        this._visited.clear();
        this._mesh.style.tintColor.set(this._unvisitedColor);
    }
}
Checkpoint.propsDefinition = {
    num: { type: hz.PropTypes.Number, default: 1 },
    checkpoint: { type: hz.PropTypes.Entity },
    npc: { type: hz.PropTypes.Entity }
};
hz.Component.register(Checkpoint);
