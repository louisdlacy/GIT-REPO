
/*
  Station 10a: Non-Interactive Overlay

  This station demonstrates use of the non-interactive Screen Overlay mode for custom UIs. When a custom UI is set to this mode,
  it is displayed as a screen overlay in front of the player, which makes it a useful mechanism for displaying HUD information
  during gameplay.

  In this station, a non-interactive timer is placed in front of the player. The player has a predefined number of seconds to find the
  button in the world and step on it, stopping the timer. Else, the timer runs out, and the player "loses."

  This script sets up the overlay and launches the timer.
  
  IMPORTANT: When you add the custom UI gizmo, make sure to set the value of Display mode to "Screen Overlay" for non-interactive 
  screen overlays (HUDs).
*/

import * as hz from 'horizon/core';
import {
  UIComponent,
  View,
  Text,
  ViewStyle,
  Callback,
  Pressable,
  Binding,
  UINode,
  Image,
  ImageSource,
  ImageStyle,
} from "horizon/ui";

// borrowed from Advanced Tutorial: Rooftop Racers
export const GameStart = new hz.NetworkEvent<{ timeMS: number }>("GameStart")
export const GameOver = new hz.NetworkEvent<{ timeMS: number }>("GameOver")
export const TimerStart  = new hz.NetworkEvent<{ timeMS: number }>("TimerStart")
export const TimerEnd  = new hz.NetworkEvent<{ timeMS: number }>("TimerEnd")

// borrowed from Advanced Tutorial: Rooftop Racers
export function fctnTimedIntervalAction(
  timerMS: number,
  component: hz.Component,
  onTickAction: (timerMS: number) => void, 
  onEndAction: () => void 
): number {
    let timerID = component.async.setInterval(() => {
      if (timerMS > 0) {
        onTickAction(timerMS); // Call the onTick function
        timerMS -= 1000;
      } else {
        if (timerID !== undefined) {
          onEndAction();
          component.async.clearInterval(timerID);
        }
      }
    }, 1000);
    return timerID;
}


class Station10_NonInteractiveOverlay extends UIComponent<typeof Station10_NonInteractiveOverlay> {

  static propsDefinition = {
    StartTimerSecs: {type: hz.PropTypes.String, default: 20}, // Time in seconds for the timer to elapse
    soundTick: {type: hz.PropTypes.Entity}, // sound entity in the world to play with each tick (1 sec)
    soundGameOver: {type: hz.PropTypes.Entity}, // sound entity in the world to play when timer ends 
    soundGameWin: {type: hz.PropTypes.Entity}, // sound entity in the world to play when you stop the timer before it runs out. 
  };

//  panelHeight = 300; IMPORTANT: properties do not apply to UI of Screen Overlay type 
//  panelWidth = 300; IMPORTANT: properties do not apply to UI of Screen Overlay type

  countdownTimerID: number = 0;
  strPlayerName = new Binding<string>(''); // Init and set default for string variable bound to custom UI for player name;
  intTimeRemainingSecs = new Binding<string>('0'); // Init and set default for int variable bound to custom UI for the message associated with the total;
  strDisplay = new Binding<string>('flex'); // property to manage visibility of HUD

  // Following config object is applied to the popup that is shown when the timer ends. These properties are available for
  // configuration, although only some of them are modified for this example.
  myPopupOptions: hz.PopupOptions = { 
    position: new hz.Vec3(0, -0.5, 0), // default
    fontSize: 18, // default
    fontColor: new hz.Color (0,0,0),
    backgroundColor: new hz.Color (0.26,0.53,0.96), // lightblue = RGB(66,135,245)
    playSound: false,
    showTimer: false, 
  };


  //  Defines the custom UI
  initializeUI() {

    //  initializeUI() must return a View object. 
    return View({
      children: [
        Text({ text: this.strPlayerName, style: { 
          fontFamily: "Roboto", 
          fontWeight: "600", 
          color: "black",
          alignItems: "center",
        } }),
        Text({ text: this.intTimeRemainingSecs, style: { 
          fontFamily: "Roboto", 
          color: "red", 
          fontWeight: "600", 
          fontSize: 36,  
          alignItems: "center",
          padding: 12,
        } }),
        ],
  
        // These style elements apply to the entire custom UI panel.
      style: { 
        position: "absolute", // IMPORTANT: This property must be set to "absolute" for custom UI Screen Overlay type.
        display: this.strDisplay,
        alignItems: "center",
        padding: 12,
        left: 36, // IMPORTANT: This value determines the absolute location in pixels of the UI relative to left margin.
        bottom: 36, // IMPORTANT: This value determines the absolute location in pixels of the UI relative to bottom margin.
        backgroundColor: new hz.Color (0.26,0.53,0.96), // light blue.
        borderColor: "black",
        borderWidth: 2,
      },
    });
  }

  // preStart() {}

  start() {

    let tickSound: any | undefined = this.props.soundTick?.as(hz.AudioGizmo);
    let STsecs: number | undefined = Number(this.props.StartTimerSecs)
    let booGameOver: boolean = false
    
    // listener to receive TimerEnd event (win or lose)
    this.connectNetworkBroadcastEvent(TimerEnd, (data:{timeMS: number}) => {
      console.log("Received TimerEnd event.")
      this.async.clearInterval(this.countdownTimerID);
      if ((data.timeMS == -1) && (booGameOver == false)) { // Trigger Zone has been tripped and the game has not ended.
        booGameOver = true;
        this.fctnGameWin()
      } else { // Ran out of time. Code that is executed to handle this scenario is referenced call to set the timed interval. See below.
        booGameOver = true;
      }
    });


    // Capture player name on entrance and apply it and Start timer to the screen overlay
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      let strPlayerName: string | undefined = player.name.get()
      if (strPlayerName) {
        if (strPlayerName.length > 12) {
          strPlayerName = strPlayerName.substring(0,9) + "..."
        }
        this.strPlayerName.set(strPlayerName)
      }
      let STsecs: number | undefined = Number(this.props.StartTimerSecs)
      if (STsecs > 0) {
        this.intTimeRemainingSecs.set(this.props.StartTimerSecs);
      } else {
        console.error ("StartTimerSecs property value must be greater than 0. Disabling timer.")
        this.strDisplay.set('none');
      }

      // begin timer when player enters.
      if (STsecs > 0 ) {
        this.countdownTimerID = fctnTimedIntervalAction((Number(this.props.StartTimerSecs) * 1000), this,
          (timerMS) => {
            if (timerMS > 0) {
              if (tickSound) {
                tickSound.play()
              } else {
                console.warn("No selected sound for soundTick property.")
              }
              this.intTimeRemainingSecs.set((timerMS/1000).toString());
            } else {
              this.intTimeRemainingSecs.set('0');
            };
          },
          this.fctnGameOver.bind(this)
        );
      };

    });

  }

  // Executed when Trigger Zone is triggered and time remains.
  private fctnGameWin(): void {
    console.log("You win!")
    let gameWinSound: any | undefined = this.props.soundGameWin?.as(hz.AudioGizmo);
    if (gameWinSound) {
      gameWinSound.play()
    } else {
      console.warn("No selected sound for soundGameWin property.")
    }
    this.world.ui.showPopupForEveryone("You win!", 3, this.myPopupOptions); 
  }

  // Executed when timer has expired.
  private fctnGameOver(): void {
    console.log("Game over!")
    this.sendNetworkBroadcastEvent(TimerEnd, {timeMS: 0});
    let gameOverSound: any | undefined = this.props.soundGameOver?.as(hz.AudioGizmo);
    if (gameOverSound) {
      gameOverSound.play()
    } else {
      console.warn("No selected sound for soundGameOver property.")
    }
    this.intTimeRemainingSecs.set('0')
    this.strDisplay.set("none")
    this.world.ui.showPopupForEveryone("Game Over!", 3, this.myPopupOptions); 

  }
}

UIComponent.register(Station10_NonInteractiveOverlay);