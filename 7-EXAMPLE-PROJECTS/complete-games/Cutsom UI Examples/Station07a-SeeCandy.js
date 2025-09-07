"use strict";
/*
  Station 7a: SeeCandy

  This station demonstrates how you can capture persistent variables and use them in your customUIs. In this station, the count for the
  player's candy is retrieved from a persistent variable. Based on the value, a commentary message is displayed in the CUI, along with
  the count of candy.

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
exports.PVARName = exports.VarGroupName = exports.CandyUpdated = void 0;
// Imported components from the APIs.
const hz = __importStar(require("horizon/core"));
// Imported components from the UI module.
const ui_1 = require("horizon/ui");
// Event: This event is used to message from the GetCandy CUI to this one that the total value of the player's candy has changed.
exports.CandyUpdated = new hz.NetworkEvent("CandyUpdated");
// These exported constants define the persistent variable used to store a player's candy.
exports.VarGroupName = "vgStation07";
exports.PVARName = "intCandy";
class UIComponentSeeCandy extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 500; // default value is 500.
        this.panelWidth = 350; // default value is 500
        this.strPlayerCandyPVar = exports.VarGroupName + ":" + exports.PVARName; // Name of world PVar holding player's candy total. Define this PVar in your world as a simple Number type
        this.strPlayerCandyTotal = new ui_1.Binding('0'); // Init and set default for string variable bound to custom UI for candy total;
        this.strMessage = new ui_1.Binding('Test Message'); // Init and set default for string variable bound to custom UI for the message associated with the total;
        this.strColor = new ui_1.Binding('red'); // Init and set default for string variable bound to custom UI for the message color associated with the total;
    }
    // refresh method is run whenever a player enters the trigger zone and is called when the GetCandy panel has been updated.
    refresh(players, intPlayerCurrentScore) {
        let msg = "";
        let clr = "";
        let scr = intPlayerCurrentScore.toString();
        if (intPlayerCurrentScore > 20) {
            msg = "Too much candy, kid! You'll spoil your appetite.";
            clr = "red";
        }
        else if ((intPlayerCurrentScore > 10) && (intPlayerCurrentScore <= 20)) {
            msg = "Slow down! You wanna end up like Veruca Salt?";
            clr = "orange";
        }
        else if ((intPlayerCurrentScore > 0) && (intPlayerCurrentScore <= 10)) {
            msg = "Go ahead and help yourself.";
            clr = "blue";
        }
        else if (intPlayerCurrentScore == 0) {
            msg = "You got nothin'! Go get some candy, kid!";
            clr = "green";
        }
        else if (intPlayerCurrentScore < 0) {
            msg = "How'd you end up with negative candy, kid?!?!";
            clr = "pink";
        }
        ;
        this.strPlayerCandyTotal.set(scr);
        this.strMessage.set(msg);
        this.strColor.set(clr);
    }
    ;
    initializeUI() {
        let strSpacer = " ";
        const viewCandyHeader = (0, ui_1.View)({
            children: [
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
                (0, ui_1.Text)({
                    text: strSpacer,
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
                        color: "pink",
                        letterSpacing: 18,
                    }
                }),
                (0, ui_1.Text)({
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
        const viewCandyTotal = (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Total Candy",
                    style: {
                        fontFamily: "Roboto",
                        fontSize: 24,
                        justifyContent: "flex-start",
                        color: "black",
                        marginRight: 48,
                    },
                }),
                (0, ui_1.Text)({
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
        const viewCandyTotalMsg = (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
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
        return (0, ui_1.View)({
            children: [
                viewCandyHeader,
                viewCandyTotal,
                viewCandyTotalMsg,
            ],
            // https://www.w3.org/wiki/CSS/Properties/color/keywords
            style: { backgroundColor: "honeydew" },
        });
    }
    ;
    preStart() {
        // listener for when the GetCandy CUI has set the Persistent Variable upon exit. This listener responds faster than writing to and then reloading from Persistent Storage.
        this.connectNetworkBroadcastEvent(exports.CandyUpdated, (data) => {
            this.refresh([data.localPlayer], data.intCandy);
        });
    }
    start() {
        // Initialize the UI for this player, when the attached trigger zone is entered.
        this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            let sct = this.world.persistentStorage.getPlayerVariable(enteredBy, this.strPlayerCandyPVar);
            if ((sct == undefined) || (sct == null)) {
                console.log("Candy value is undefined for this player.");
                sct = 0;
            }
            else {
                console.log(enteredBy.name.get() + " player has " + sct.toString() + " points.");
            }
            ;
            this.refresh([enteredBy], sct);
        });
    }
    ;
}
UIComponentSeeCandy.propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }
};
;
ui_1.UIComponent.register(UIComponentSeeCandy);
