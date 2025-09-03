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
class PlayerHudManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.playerHuds = [];
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.onPlayerEnterWorld(player);
        });
    }
    start() {
        if (this.props.playerHud1 !== undefined) {
            this.playerHuds.push(this.props.playerHud1);
        }
        if (this.props.playerHud2 !== undefined) {
            this.playerHuds.push(this.props.playerHud2);
        }
        if (this.props.playerHud3 !== undefined) {
            this.playerHuds.push(this.props.playerHud3);
        }
        if (this.props.playerHud4 !== undefined) {
            this.playerHuds.push(this.props.playerHud4);
        }
    }
    onPlayerEnterWorld(player) {
        if (player.name.get() === "Trader") {
            return;
        }
        // Get a player hud
        if (player.index.get() > this.playerHuds.length - 1) {
            console.warn("No player hud for player: " + player.index.get());
            return;
        }
        console.log("Setting player hud for player: " + player.index.get());
        const playerHud = this.playerHuds[player.index.get()];
        playerHud.owner.set(player);
        // Assign the player hud to the player
    }
}
PlayerHudManager.propsDefinition = {
    playerHud1: { type: hz.PropTypes.Entity },
    playerHud2: { type: hz.PropTypes.Entity },
    playerHud3: { type: hz.PropTypes.Entity },
    playerHud4: { type: hz.PropTypes.Entity },
};
hz.Component.register(PlayerHudManager);
