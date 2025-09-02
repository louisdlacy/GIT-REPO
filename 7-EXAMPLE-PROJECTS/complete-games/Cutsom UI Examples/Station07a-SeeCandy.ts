/*
  Station 7a: SeeCandy

  This station demonstrates how you can capture persistent variables and use them in your customUIs. In this station, the count for the 
  player's candy is retrieved from a persistent variable. Based on the value, a commentary message is displayed in the CUI, along with
  the count of candy.

*/

// Imported components from the APIs.
import * as hz from "horizon/core";

// Imported components from the UI module.
import {
  UIComponent,
  View,
  Text,
  ViewStyle,
  Callback,
  Pressable,
  Binding,
  UINode,
} from "horizon/ui";

// Event: This event is used to message from the GetCandy CUI to this one that the total value of the player's candy has changed.
export const CandyUpdated  = new hz.NetworkEvent<{ player: hz.Player, intCandy: number }>("CandyUpdated")

// These exported constants define the persistent variable used to store a player's candy.
export const VarGroupName = "vgStation07"
export const PVARName = "intCandy"


// defines Trigger Zone where the CUI is activated and populated with PVAR data.
type UIComponentSeeCandyProps = {
  triggerZone: hz.Entity
};

class UIComponentSeeCandy extends UIComponent<UIComponentSeeCandyProps> {
  static propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }
  };

  panelHeight = 500; // default value is 500.
  panelWidth = 350; // default value is 500

  strPlayerCandyPVar = VarGroupName + ":" + PVARName as string; // Name of world PVar holding player's candy total. Define this PVar in your world as a simple Number type

  strPlayerCandyTotal = new Binding<string>('0'); // Init and set default for string variable bound to custom UI for candy total;
  strMessage = new Binding<string>('Test Message'); // Init and set default for string variable bound to custom UI for the message associated with the total;
  strColor = new Binding<string>('red'); // Init and set default for string variable bound to custom UI for the message color associated with the total;

    // refresh method is run whenever a player enters the trigger zone and is called when the GetCandy panel has been updated.
    refresh(players: hz.Player[], intPlayerCurrentScore:number) {
    let msg: string = ""
    let clr: string = ""
    let scr: string = intPlayerCurrentScore.toString()
    if (intPlayerCurrentScore > 20) {
      msg = "Too much candy, kid! You'll spoil your appetite.";
      clr = "red";
    } else if ((intPlayerCurrentScore > 10) && (intPlayerCurrentScore <= 20)) {
        msg = "Slow down! You wanna end up like Veruca Salt?";
        clr = "orange";
    } else if ((intPlayerCurrentScore > 0) && (intPlayerCurrentScore <= 10)) {
        msg = "Go ahead and help yourself.";
        clr = "blue";
    } else if (intPlayerCurrentScore == 0) {
        msg = "You got nothin'! Go get some candy, kid!";
        clr = "green";
    } else if (intPlayerCurrentScore < 0) {
        msg = "How'd you end up with negative candy, kid?!?!";
        clr = "pink";
    };
    this.strPlayerCandyTotal.set(scr);
    this.strMessage.set(msg);
    this.strColor.set(clr);
  };

  initializeUI() {
    let strSpacer = " ";
    const viewCandyHeader = View({
      children: [
        Text({
          text: "C",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "green",
            letterSpacing: 18,

          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            letterSpacing: 18,

          }
        }),
        Text({
          text: "A",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            letterSpacing: 18,

          }
        }),
        Text({
          text: "N",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "green",
            letterSpacing: 18,

          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            letterSpacing: 18,

          }
        }),
        Text({
          text: "D",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            letterSpacing: 18,
          }
        }),
        Text({
          text: "Y",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "green",
            letterSpacing: 18,

          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            letterSpacing: 18,
          }
        }),
        Text({
          text: "!",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
        Text({
          text: strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
        Text({
          text: "-->",
          style: {
            fontFamily: "Roboto",
            fontSize: 36,
            color: "orange",
          }
        }),
      ],
      style: {
        height: 48,
        flexDirection: "row",
        alignSelf: "center",
        marginBottom: 24,
      },
    });

    const viewCandyTotal = View({
      children: [
        Text({
          text: "Total Candy",
          style: {
            fontFamily: "Roboto",
            fontSize: 24,
            justifyContent: "flex-start",
            color: "black",
            marginRight: 48,
          },
        }),
        Text({
          text: this.strPlayerCandyTotal,
          style: {
            fontFamily: "Roboto",
            fontSize: 24,
            justifyContent: "flex-end",
            color: "gold",
            marginLeft: 48,
          },
        }),
      ],
      style: {
        flexDirection: "row",
        alignContent: "space-between",
        alignItems: "stretch",
        marginLeft: 18,
        marginRight: 18,
        marginBottom: 24,
      },
    });

    /*
      Based on the total candy for the player (strPlayerCandyTotal), a message is displayed to the player.

    */
    const viewCandyTotalMsg = View({
      children: [
        Text({
          text: this.strMessage,
          style: {
            fontFamily: "Roboto",
            fontSize: 18,
            justifyContent: "flex-start",
            color: this.strColor,
            marginRight: 48,
          },
        }),
      ],
      style: {
        flexDirection: "row",
        alignContent: "space-between",
        alignItems: "stretch",
        marginLeft: 18,
        marginRight: 18,
        marginBottom: 24,
      },
    });

    return View({
        children: [
          viewCandyHeader,
          viewCandyTotal,
          viewCandyTotalMsg,
        ],
        // https://www.w3.org/wiki/CSS/Properties/color/keywords
        style: { backgroundColor: "honeydew" },
      });
    };

    preStart() {
      // listener for when the GetCandy CUI has set the Persistent Variable upon exit. This listener responds faster than writing to and then reloading from Persistent Storage.
      this.connectNetworkBroadcastEvent(CandyUpdated, (data:{localPlayer: hz.Player, intCandy: number}) => {
        this.refresh([data.localPlayer], data.intCandy);
      });
    }

    start() {
        // Initialize the UI for this player, when the attached trigger zone is entered.
        this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {
        let sct = this.world.persistentStorage.getPlayerVariable(enteredBy, this.strPlayerCandyPVar);
        if ((sct == undefined) || (sct == null)) {
          console.log("Candy value is undefined for this player.")
          sct = 0;
        } else {
          console.log(enteredBy.name.get() + " player has " + sct.toString() + " points.")
        };
      this.refresh([enteredBy], sct);
    })

  };
};

UIComponent.register(UIComponentSeeCandy);
