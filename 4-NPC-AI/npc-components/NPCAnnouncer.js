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
const npc_1 = require("horizon/npc");
const Checkpoint_1 = require("./Checkpoint");
class NPCAnnouncer extends hz.Component {
    preStart() {
        this.connectLocalEvent(this.entity, Checkpoint_1.CheckpointEvents.PlayerReset, (data) => {
            this.resetMemory();
        });
        this.connectLocalEvent(this.entity, Checkpoint_1.CheckpointEvents.PlayerEntered, (data) => {
            this.playerEnteredCheckpoint(data.player, data.checkpointNum);
        });
        this.connectLocalEvent(this.entity, Checkpoint_1.CheckpointEvents.PlayerVisited, (data) => {
            this.playerVisitedCheckpoint(data.player, data.checkpointNum);
        });
    }
    start() {
        this._npc = this.entity.as(npc_1.Npc);
        if (!this._npc) {
            console.error("NPCAnnouncer: Entity needs to be attached to an NPC gizmo!");
        }
        if (!this._npc.conversation) {
            console.error("NPCAnnouncer: npc conversation not found?");
        }
        this.resetMemory();
    }
    // Ask the NPC to comment on a player reaching a checkpoint.
    async playerEnteredCheckpoint(player, checkpointNum) {
        if (!player) {
            console.warn("NPCAnnouncer: null player passed to playerReachedCheckpoint");
            return;
        }
        console.log("player entered checkpoint: " + checkpointNum);
        const prompt = `A player has reached checkpoint ${checkpointNum}.
    Comment on whether or not a player has already visited this checkpoint before.`;
        await this._npc.conversation?.elicitResponse(prompt);
    }
    // When a player has visited a checkpoint, make the NPC aware of this.
    playerVisitedCheckpoint(player, checkpointNum) {
        if (!player) {
            console.warn("NPCAnnouncer: null player passed to playerReachedCheckpoint");
            return;
        }
        const prompt = `A player has already visited checkpoint ${checkpointNum}.`;
        this._npc.conversation?.addEventPerception(prompt);
    }
    resetMemory() {
        this._npc.conversation?.resetMemory();
    }
}
NPCAnnouncer.propsDefinition = {};
hz.Component.register(NPCAnnouncer);
