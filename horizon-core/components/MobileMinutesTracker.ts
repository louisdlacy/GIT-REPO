//// Provided BY: king_of_Miami Game Developer ///

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

import * as hz from "horizon/core";
//////////////
//////////////////
/////////////////////// UPDATE YOUR VARIABLES BELOW For LEADERBOARD AND PPV GROUP NAME: PPV NAME
// Define the PPV name for storing player minutes
const MOBILE_MINUTES_PPV_NAME = "Clothing Store:Minutes"; // Replace with your "group variable name : ppv name"  EXAMPLE "MyWorldGroupPPVS:TimeSpent"
const MOBILE_MINUTES_LEADERBOARD_NAME = "Minutes"; // Replace with your leaderboard name
///////////////////////
///////////////////////
///////////////////////

class MobileMinutesTracker extends hz.Component<typeof MobileMinutesTracker> {
  // Store the players being tracked
  private trackedPlayers: { [playerId: number]: number } = {};

  start() {
    // Listen for players entering the world
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => {
        this.onPlayerEnterWorld(player);
      }
    );

    // Listen for players exiting the world
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerExitWorld,
      (player: hz.Player) => {
        this.onPlayerExitWorld(player);
      }
    );

    // Listen for players going AFK
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterAFK,
      (player: hz.Player) => {
        this.onPlayerEnterAFK(player);
      }
    );

    // Listen for players returning from AFK
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerExitAFK,
      (player: hz.Player) => {
        this.onPlayerExitAFK(player);
      }
    );
  }

  onPlayerEnterWorld(player: hz.Player) {
    // Check if the player is on a mobile device
    if (player.deviceType.get() === hz.PlayerDeviceType.Mobile) {
      // Start tracking the player's minutes
      console.log("Starting to track player:", player.name.get());
      this.startTrackingPlayer(player);
    }
  }

  onPlayerExitWorld(player: hz.Player) {
    // Stop tracking the player's minutes
    this.stopTrackingPlayer(player);
  }

  onPlayerEnterAFK(player: hz.Player) {
    // Pause the minutes increment for the player
    console.log("Pausing tracking for player:", player.name.get());
    this.pauseTrackingPlayer(player);
  }

  onPlayerExitAFK(player: hz.Player) {
    // Resume the minutes increment for the player
    console.log("Resuming tracking for player:", player.name.get());
    this.resumeTrackingPlayer(player);
  }

  startTrackingPlayer(player: hz.Player) {
    // Check if player is already being tracked
    if (this.trackedPlayers[player.id]) {
      console.log("Player already being tracked:", player.name.get());
      return;
    }

    // Increment the minutes every minute
    this.trackedPlayers[player.id] = this.async.setInterval(() => {
      // Get the current minutes fresh each time to avoid stale data
      const currentMinutes =
        this.world.persistentStorage.getPlayerVariable(
          player,
          MOBILE_MINUTES_PPV_NAME
        ) || 0;
      const newMinutes = currentMinutes + 1;

      console.log(
        "Incrementing minutes for player:",
        player.name.get(),
        "Current minutes:",
        currentMinutes,
        "New minutes:",
        newMinutes
      );

      this.world.persistentStorage.setPlayerVariable(
        player,
        MOBILE_MINUTES_PPV_NAME,
        newMinutes
      );
      this.world.leaderboards.setScoreForPlayer(
        MOBILE_MINUTES_LEADERBOARD_NAME,
        player,
        newMinutes,
        false
      );
    }, 60 * 1000); // 1 minute

    console.log(
      `Now tracking ${Object.keys(this.trackedPlayers).length} players`
    );
  }

  stopTrackingPlayer(player: hz.Player) {
    // Clear the interval for the player
    const intervalId = this.trackedPlayers[player.id];
    if (intervalId) {
      this.async.clearInterval(intervalId);
      delete this.trackedPlayers[player.id];
      console.log(
        `Stopped tracking player: ${player.name.get()}. Now tracking ${
          Object.keys(this.trackedPlayers).length
        } players`
      );
    }
  }

  pauseTrackingPlayer(player: hz.Player) {
    // Clear the interval for the player but don't delete from tracking
    const intervalId = this.trackedPlayers[player.id];
    if (intervalId) {
      this.async.clearInterval(intervalId);
      delete this.trackedPlayers[player.id];
      console.log("Paused tracking for player:", player.name.get());
    }
  }

  resumeTrackingPlayer(player: hz.Player) {
    // Only resume if player is on mobile device
    if (player.deviceType.get() === hz.PlayerDeviceType.Mobile) {
      this.startTrackingPlayer(player);
    }
  }
}

hz.Component.register(MobileMinutesTracker);
