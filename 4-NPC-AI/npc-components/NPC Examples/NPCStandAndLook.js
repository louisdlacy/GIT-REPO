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
exports.NPCStandAndLook = exports.PlayAnimation = exports.StopLookingAtPlayer = exports.LookAtPlayer = void 0;
const hz = __importStar(require("horizon/core"));
const NPCAgent_1 = require("NPCAgent");
exports.LookAtPlayer = new hz.LocalEvent('LookAtPlayer');
exports.StopLookingAtPlayer = new hz.LocalEvent('StopLookingAtPlayer');
exports.PlayAnimation = new hz.LocalEvent('PlayAnimation');
class NPCStandAndLook extends NPCAgent_1.NPCAgent {
    constructor() {
        super(...arguments);
        this.players = [];
        this.reevaluateTimer = 0;
    }
    start() {
        super.start();
        if (this.props.lookAtAllPlayers) {
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
                this.onLookAtPlayer(player);
            });
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
                this.onStopLookingAtPlayer(player);
            });
        }
        this.connectLocalEvent(this.entity, exports.LookAtPlayer, ({ player }) => {
            this.onLookAtPlayer(player);
        });
        this.connectLocalEvent(this.entity, exports.StopLookingAtPlayer, ({ player }) => {
            this.onStopLookingAtPlayer(player);
        });
        this.connectLocalEvent(this.entity, exports.PlayAnimation, ({ animation, player }) => {
            console.log("Playing emote");
            if (player !== undefined) {
                this.playerToLookAt = player;
                this.reevaluateTimer = this.getReevaluateDelay();
            }
            this.triggerAnimation(animation);
        });
    }
    onLookAtPlayer(player) {
        this.players.push(player);
    }
    onStopLookingAtPlayer(player) {
        const index = this.players.indexOf(player, 0);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        if (player == this.playerToLookAt) {
            this.playerToLookAt = undefined;
        }
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.reevaluateTimer -= deltaTime;
        if (this.reevaluateTimer <= 0 || this.playerToLookAt == undefined) {
            this.playerToLookAt = this.selectRandomPlayerToLookAt();
            // Wait 1-5s before changing who to look at.
            this.reevaluateTimer = this.getReevaluateDelay();
        }
        if (this.playerToLookAt != undefined) {
            this.lookAt = this.playerToLookAt.head.position.get();
        }
    }
    selectRandomPlayerToLookAt() {
        const candidates = [];
        const forward = this.entity.forward.get();
        this.players.forEach((player) => {
            if (hz.Vec3.dot(forward, player.head.position.get()) > 0) {
                candidates.push(player);
            }
        });
        if (candidates.length == 0) {
            return undefined;
        }
        else {
            const index = Math.floor(Math.random() * candidates.length);
            return candidates[index];
        }
    }
    getReevaluateDelay() {
        return this.props.changeTargetDelayMin + Math.random() * (this.props.changeTargetDelayMax - this.props.changeTargetDelayMin);
    }
}
exports.NPCStandAndLook = NPCStandAndLook;
NPCStandAndLook.propsDefinition = {
    ...NPCAgent_1.NPCAgent.propsDefinition,
    lookAtAllPlayers: { type: hz.PropTypes.Boolean, default: true },
    changeTargetDelayMin: { type: hz.PropTypes.Number, default: 1 },
    changeTargetDelayMax: { type: hz.PropTypes.Number, default: 5 },
};
NPCStandAndLook.dummy = 0;
hz.Component.register(NPCStandAndLook);
