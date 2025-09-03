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
class sysPlayerManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.cameraManagers = [];
        this.focusedInteractionManagers = [];
    }
    preStart() {
        // Get all camera managers
        this.cameraManagers = this.world.getEntitiesWithTags(["CameraManager"]);
        // Get all Focused Interaction managers
        this.focusedInteractionManagers = this.world.getEntitiesWithTags(["FIManager"]);
    }
    start() {
        // When a player enters the world assign them a Camera Manager and a Focused Interaction Manager
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.RegisterPlayer(player);
        });
        // When a player exits the world release their Camera Manager and Focused Interaction Manager
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.DeregisterPlayer(player);
        });
    }
    RegisterPlayer(player) {
        let playerIndex = player.index.get();
        // Assign a Camera Manager to the player
        if (playerIndex < this.cameraManagers.length) {
            this.cameraManagers[playerIndex].owner.set(player);
        }
        else {
            console.error("Not enough Camera managers in the world");
        }
        // Assign a Focused Interaction Manager to the player
        if (playerIndex < this.focusedInteractionManagers.length) {
            this.focusedInteractionManagers[playerIndex].owner.set(player);
        }
        else {
            console.error("Not enough Focused Interaction managers in the world");
        }
    }
    DeregisterPlayer(player) {
        let playerIndex = player.index.get();
        // Release the Camera Manager from the player
        if (playerIndex < this.cameraManagers.length) {
            this.cameraManagers[playerIndex].owner.set(this.world.getServerPlayer());
        }
        // Release the Focused Interaction Manager from the player
        if (playerIndex < this.focusedInteractionManagers.length) {
            this.focusedInteractionManagers[playerIndex].owner.set(this.world.getServerPlayer());
        }
    }
}
sysPlayerManager.propsDefinition = {};
hz.Component.register(sysPlayerManager);
