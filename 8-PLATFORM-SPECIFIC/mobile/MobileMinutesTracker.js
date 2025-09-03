"use strict";
//// Provided BY: king_of_Miami Game Developer ///
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
///// INSTRUCTIONS ////
// Create a LeaderBoard like "MobileMinutes" in your systems Drop Down.
// Create a Group Variable AND NUMBER PPV in that group variable such AS "TimeSpent".
//  ON LINE  23 FOR SCORE_PPV_NAME, REPLACE WITH YOUR "GROUP VARIABLE NAME: TimeSpent"
//  ON LINE  24 FOR MOBILE_MINUTES_LEADERBOARD_NAME, REPLACE WITH YOUR LEADERBOARD NAME SUCH AS "MobileMinutes"
// FOLLOW ALONG SETUP VIDEO --> https://youtu.be/avHWkGuKwaA     //My YOUTUBE CHANNEL https://www.youtube.com/@Miami_VR
// MobileMinutesTS.ts// This script tracks the time spent by players on mobile devices in a game
// and updates their scores in a leaderboard every minute.
// It uses the Horizon SDK to manage player variables and leaderboards.
/////
const hz = __importStar(require("horizon/core"));
//////////////
//////////////////
/////////////////////// UPDATE YOUR VARIABLES BELOW For LEADERBOARD AND PPV GROUP NAME: PPV NAME
// Define the PPV name for storing player minutes
const MOBILE_MINUTES_PPV_NAME = "Clothing Store:Minutes"; // Replace with your "group variable name : ppv name"  EXAMPLE "MyWorldGroupPPVS:TimeSpent"
const MOBILE_MINUTES_LEADERBOARD_NAME = "Minutes"; // Replace with your leaderboard name
///////////////////////
///////////////////////
///////////////////////
class MobileMinutesTracker extends hz.Component {
    constructor() {
        super(...arguments);
        // Store the players being tracked
        this.trackedPlayers = {};
    }
    start() {
        // Listen for players entering the world
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.onPlayerEnterWorld(player);
        });
        // Listen for players exiting the world
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.onPlayerExitWorld(player);
        });
        // Listen for players going AFK
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterAFK, (player) => {
            this.onPlayerEnterAFK(player);
        });
        // Listen for players returning from AFK
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitAFK, (player) => {
            this.onPlayerExitAFK(player);
        });
    }
    onPlayerEnterWorld(player) {
        // Check if the player is on a mobile device
        if (player.deviceType.get() === hz.PlayerDeviceType.Mobile) {
            // Start tracking the player's minutes
            console.log("Starting to track player:", player.name.get());
            this.startTrackingPlayer(player);
        }
    }
    onPlayerExitWorld(player) {
        // Stop tracking the player's minutes
        this.stopTrackingPlayer(player);
    }
    onPlayerEnterAFK(player) {
        // Pause the minutes increment for the player
        console.log("Pausing tracking for player:", player.name.get());
        this.pauseTrackingPlayer(player);
    }
    onPlayerExitAFK(player) {
        // Resume the minutes increment for the player
        console.log("Resuming tracking for player:", player.name.get());
        this.resumeTrackingPlayer(player);
    }
    startTrackingPlayer(player) {
        // Check if player is already being tracked
        if (this.trackedPlayers[player.id]) {
            console.log("Player already being tracked:", player.name.get());
            return;
        }
        // Increment the minutes every minute
        this.trackedPlayers[player.id] = this.async.setInterval(() => {
            // Get the current minutes fresh each time to avoid stale data
            const currentMinutes = this.world.persistentStorage.getPlayerVariable(player, MOBILE_MINUTES_PPV_NAME) || 0;
            const newMinutes = currentMinutes + 1;
            console.log("Incrementing minutes for player:", player.name.get(), "Current minutes:", currentMinutes, "New minutes:", newMinutes);
            this.world.persistentStorage.setPlayerVariable(player, MOBILE_MINUTES_PPV_NAME, newMinutes);
            this.world.leaderboards.setScoreForPlayer(MOBILE_MINUTES_LEADERBOARD_NAME, player, newMinutes, false);
        }, 60 * 1000); // 1 minute
        console.log(`Now tracking ${Object.keys(this.trackedPlayers).length} players`);
    }
    stopTrackingPlayer(player) {
        // Clear the interval for the player
        const intervalId = this.trackedPlayers[player.id];
        if (intervalId) {
            this.async.clearInterval(intervalId);
            delete this.trackedPlayers[player.id];
            console.log(`Stopped tracking player: ${player.name.get()}. Now tracking ${Object.keys(this.trackedPlayers).length} players`);
        }
    }
    pauseTrackingPlayer(player) {
        // Clear the interval for the player but don't delete from tracking
        const intervalId = this.trackedPlayers[player.id];
        if (intervalId) {
            this.async.clearInterval(intervalId);
            delete this.trackedPlayers[player.id];
            console.log("Paused tracking for player:", player.name.get());
        }
    }
    resumeTrackingPlayer(player) {
        // Only resume if player is on mobile device
        if (player.deviceType.get() === hz.PlayerDeviceType.Mobile) {
            this.startTrackingPlayer(player);
        }
    }
}
hz.Component.register(MobileMinutesTracker);
