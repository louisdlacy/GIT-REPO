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
class sysHintHUDManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.hintHUDEntities = new Array();
        this.hintHUDComponents = new Array();
        this.timeoutID = -1;
    }
    preStart() {
        // Register all hint HUDs to keep track of their entities and components
        this.connectLocalBroadcastEvent(sysEvents_1.sysEvents.OnRegisterHintHUDEntity, (data) => {
            this.hintHUDEntities.push(data.HUDEntity);
            this.hintHUDComponents.push(data.HUDComponent);
        });
    }
    start() {
        // Display the hint HUD of each player when a broadcast event is received
        this.connectNetworkBroadcastEvent(sysEvents_1.sysEvents.OnDisplayHintHUD, (data) => {
            // Reset timeout
            this.async.clearTimeout(this.timeoutID);
            // Update all hint HUDs texts via their components
            this.hintHUDComponents.forEach(hudComponent => {
                hudComponent.UpdateHintHUDText(data.text);
            });
            // Show the hint HUD of each player
            data.players.forEach(player => {
                // Display a popup instead of the hint HUD for VR players
                if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
                    this.world.ui.showPopupForPlayer(player, data.text, data.duration);
                }
                else {
                    let playerIndex = player.index.get();
                    // Display the hint HUD
                    if (playerIndex < this.hintHUDEntities.length) {
                        let playerHintHUDEntity = this.hintHUDEntities[playerIndex];
                        playerHintHUDEntity.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
                        playerHintHUDEntity.setVisibilityForPlayers([player], hz.PlayerVisibilityMode.VisibleTo);
                    }
                    // Set timeout to hide the hint HUD after a certain amount of time
                    this.timeoutID = this.async.setTimeout(() => this.HideHintHUD(), data.duration * 1000);
                }
            });
        });
    }
    // Detach and hide a hint HUD for all players
    HideHintHUD() {
        let players = this.world.getPlayers();
        players.forEach(player => {
            let playerIndex = player.index.get();
            if (playerIndex < this.hintHUDEntities.length) {
                let playerHintHUDEntity = this.hintHUDEntities[playerIndex];
                playerHintHUDEntity.as(hz.AttachableEntity)?.detach();
                playerHintHUDEntity.setVisibilityForPlayers([], hz.PlayerVisibilityMode.VisibleTo);
            }
        });
    }
}
sysHintHUDManager.propsDefinition = {};
hz.Component.register(sysHintHUDManager);
