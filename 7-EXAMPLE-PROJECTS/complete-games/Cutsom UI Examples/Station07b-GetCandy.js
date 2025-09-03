"use strict";
/*
  Station 7b: GetCandy

  This station demonstrates how you can capture persistent variables and use them in your customUIs. When the player enters the panel, their
  amount of candy is retrieved from a persistent variable and is displayed in the panel using a Binding.

  In this customUI panel, the player can increase or decrease their amount of candy using +/- buttons.

  When the player exits the panel, the persistent variable is updated, and the SeeCandy receives an event indicating that the number has been updated.

*/
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
// Imported components from the APIs.
const hz = __importStar(require("horizon/core"));
// Imported components from the UI module.
const ui_1 = require("horizon/ui");
const Station07a_SeeCandy_1 = require("Station07a-SeeCandy");
// Station07b: Local value is used to store the value in the Custom UI as it is being changed. On exit, this value is posted back as the new value to the PVAR.
let intLocalCandyCount = 0; //
// Added for Station07b: function to return a Pressable button within a View().
function MyButton(props) {
    const DEFAULT_COLOR = props.baseColor;
    const HOVERED_COLOR = "blue";
    const backgroundColor = new ui_1.Binding(DEFAULT_COLOR);
    const buttonText = new ui_1.Binding(props.label);
    return (0, ui_1.Pressable)({
        children: (0, ui_1.Text)({
            text: buttonText,
            style: { color: "white" },
        }),
        onClick: props.onClick,
        onEnter: (player) => {
            backgroundColor.set(HOVERED_COLOR, [player]);
        },
        onExit: (player) => {
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
class UIComponentGetCandy extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 500; // default value is 500.
        this.panelWidth = 350; // default value is 500
        this.strPlayerCandyPVar = Station07a_SeeCandy_1.VarGroupName + ":" + Station07a_SeeCandy_1.PVARName; // Name of world PVar holding player's candy total. Define this PVar in your world as a simple Number type
        this.strPlayerCandyTotal = new ui_1.Binding('0'); // Init and set default for string variable bound to custom UI for candy total;
        //  start() {}
    }
    refresh(players, intPlayerCurrentScore) {
        let scr = intPlayerCurrentScore.toString();
        this.strPlayerCandyTotal.set(scr);
    }
    ;
    initializeUI() {
        let strSpacer = " ";
        const viewCandyHeader = (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Get",
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "pink",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: strSpacer + strSpacer + strSpacer,
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "pink",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: "C",
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "green",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: strSpacer,
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: "A",
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "pink",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: strSpacer,
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: "N",
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "green",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: strSpacer,
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: "D",
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "pink",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: strSpacer,
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: "Y",
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        color: "green",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
                    text: strSpacer,
                    style: {
                        fontFamily: "Optimistic",
                        fontSize: 36,
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
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
        const viewCandyTotal = (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Total Candy:" + strSpacer,
                    style: {
                        fontFamily: "Roboto",
                        fontSize: 24,
                        justifyContent: "flex-start",
                        color: "black",
                    },
                }),
                (0, ui_1.Text)({
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
        const changeCandyButtons = (0, ui_1.View)({
            children: [
                MyButton({
                    label: "-",
                    baseColor: "red",
                    onClick: () => {
                        // console.log("Pressed Less button.");
                        if (intLocalCandyCount <= 0) {
                            intLocalCandyCount = 0;
                        }
                        else {
                            intLocalCandyCount = intLocalCandyCount - 1;
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
                            intLocalCandyCount = 50;
                        }
                        else {
                            intLocalCandyCount = intLocalCandyCount + 1;
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
        return (0, ui_1.View)({
            children: [
                viewCandyHeader,
                viewCandyTotal,
                changeCandyButtons,
            ],
            // https://www.w3.org/wiki/CSS/Properties/color/keywords
            style: { backgroundColor: "honeydew" },
        });
    }
    ;
    preStart() {
        // Initialize the UI for this player, when the attached trigger zone is entered.
        this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            intLocalCandyCount = this.world.persistentStorage.getPlayerVariable(enteredBy, this.strPlayerCandyPVar);
            if ((intLocalCandyCount == undefined) || (intLocalCandyCount == null)) {
                console.log("Candy value is undefined for this player.");
                intLocalCandyCount = 0;
            }
            else {
            }
            ;
            this.refresh([enteredBy], intLocalCandyCount);
        });
        // When the attached trigger zone is exited, set the player var to the local value that was updated in this UI.
        this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerExitTrigger, (enteredBy) => {
            this.refresh([enteredBy], intLocalCandyCount);
            this.world.persistentStorage.setPlayerVariable(enteredBy, this.strPlayerCandyPVar, intLocalCandyCount);
            this.sendNetworkBroadcastEvent(Station07a_SeeCandy_1.CandyUpdated, { player: enteredBy, intCandy: intLocalCandyCount });
        });
    }
    ;
}
UIComponentGetCandy.propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }
};
;
ui_1.UIComponent.register(UIComponentGetCandy);
