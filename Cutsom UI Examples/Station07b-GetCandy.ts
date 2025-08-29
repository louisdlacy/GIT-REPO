/*
  Station 7b: GetCandy

  This station demonstrates how you can capture persistent variables and use them in your customUIs. When the player enters the panel, their
  amount of candy is retrieved from a persistent variable and is displayed in the panel using a Binding.

  In this customUI panel, the player can increase or decrease their amount of candy using +/- buttons. 

  When the player exits the panel, the persistent variable is updated, and the SeeCandy receives an event indicating that the number has been updated.

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

import { VarGroupName, PVARName, CandyUpdated } from 'Station07a-SeeCandy';

// Button type needed for Station07b
type MyButtonProps = {
  label: string;
  onClick: Callback;
  style: ViewStyle;
  baseColor: string;
};

  // Station07b: Local value is used to store the value in the Custom UI as it is being changed. On exit, this value is posted back as the new value to the PVAR.
  let intLocalCandyCount: number = 0; //

  // Added for Station07b: function to return a Pressable button within a View().
function MyButton(props: MyButtonProps): UINode {
  const DEFAULT_COLOR = props.baseColor;
  const HOVERED_COLOR = "blue";
  const backgroundColor = new Binding<string>(DEFAULT_COLOR);
  const buttonText = new Binding<string>(props.label);

  return Pressable({
    children: Text({
      text: buttonText,
      style: { color: "white" },
    }),
    onClick: props.onClick,
    onEnter: (player: hz.Player) => {
      backgroundColor.set(HOVERED_COLOR, [player]);
    },
    onExit: (player: hz.Player) => {
      backgroundColor.set(DEFAULT_COLOR, [player]);
      buttonText.set(props.label, [player]);
    },
    style: {
      backgroundColor: backgroundColor,
      borderRadius: 8,
      height: 36,
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      // additional styles are spread
      // to override default styles
      ...props.style,
    },
  });
}

type UIComponentGetCandyProps = {
  triggerZone: hz.Entity
};

class UIComponentGetCandy extends UIComponent<UIComponentGetCandyProps> {
  static propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }
  };

  panelHeight = 500; // default value is 500.
  panelWidth = 350; // default value is 500

  strPlayerCandyPVar = VarGroupName + ":" + PVARName as string; // Name of world PVar holding player's candy total. Define this PVar in your world as a simple Number type
  
  strPlayerCandyTotal = new Binding<string>('0'); // Init and set default for string variable bound to custom UI for candy total;


  refresh(players: hz.Player[], intPlayerCurrentScore:number) {
    let scr: string = intPlayerCurrentScore.toString()
    this.strPlayerCandyTotal.set(scr);
  };

  initializeUI() {
    let strSpacer = " ";
    const viewCandyHeader = View({
      children: [
        Text({
          text: "Get",
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
        Text({
          text: strSpacer + strSpacer + strSpacer,
          style: {
            fontFamily: "Optimistic",
            fontSize: 36,
            color: "pink",
            letterSpacing: 18,
          }
        }),
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
      ],
      style: {
        height: 48,
        flexDirection: "row",
        alignSelf: "center",
        marginBottom: 24,
      },
    });

    /*
      This View builds a message, whose second element is the total candy for the player:
      (strPlayerCandyTotal).
    */
    const viewCandyTotal = View({
      children: [
      Text({
          text: "Total Candy:" + strSpacer,
          style: {
            fontFamily: "Roboto",
            fontSize: 24,
            justifyContent: "flex-start",
            color: "black",
          },
        }),
        Text({
          text: this.strPlayerCandyTotal,
          style: {
            fontFamily: "Roboto",
            fontSize: 24,
            justifyContent: "flex-end",
            color: "gold",
            marginLeft: 16,
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

    const changeCandyButtons = View({
      children: [
        MyButton({
          label: "-",
          baseColor: "red",
          onClick: () => {
            // console.log("Pressed Less button.");
            if (intLocalCandyCount <= 0) {
              intLocalCandyCount = 0
            } else {
              intLocalCandyCount = intLocalCandyCount - 1
            }
            this.strPlayerCandyTotal.set(intLocalCandyCount.toString());
          },
          style: {
            marginRight: 12,
          },
        }),
        MyButton({
          label: "+",
          baseColor: "green",
          onClick: () => {
            // console.log("Pressed More button.");
            if (intLocalCandyCount > 49) {
              intLocalCandyCount = 50
            } else {
              intLocalCandyCount = intLocalCandyCount + 1
            }
            this.strPlayerCandyTotal.set(intLocalCandyCount.toString());
          },
          style: {
            marginLeft: 12,
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


  // Added for Station 07b: This is the master View(), which references the other UI objects within it.
    return View({
        children: [
          viewCandyHeader,
          viewCandyTotal,
          changeCandyButtons,
        ],
        // https://www.w3.org/wiki/CSS/Properties/color/keywords
        style: { backgroundColor: "honeydew" },
      });
    };

    preStart() {

      // Initialize the UI for this player, when the attached trigger zone is entered.
      this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {
        intLocalCandyCount = this.world.persistentStorage.getPlayerVariable(enteredBy, this.strPlayerCandyPVar);
        if ((intLocalCandyCount == undefined) || (intLocalCandyCount == null)) {
          console.log("Candy value is undefined for this player.")
          intLocalCandyCount = 0;
        } else {
        };
        this.refresh([enteredBy], intLocalCandyCount);
    })

      // When the attached trigger zone is exited, set the player var to the local value that was updated in this UI.
      this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerExitTrigger, (enteredBy: hz.Player) => {
        this.refresh([enteredBy], intLocalCandyCount);
        this.world.persistentStorage.setPlayerVariable(enteredBy, this.strPlayerCandyPVar,intLocalCandyCount);
        this.sendNetworkBroadcastEvent(CandyUpdated, {player: enteredBy, intCandy: intLocalCandyCount});
      })

  };

//  start() {}

};

UIComponent.register(UIComponentGetCandy);
