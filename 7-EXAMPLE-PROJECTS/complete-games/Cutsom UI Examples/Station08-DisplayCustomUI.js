"use strict";
/*
  Station 8: JSON as Datasource for custom UIs

  This station demonstrates how you can use uploaded Text assets in JSON form as source data for a set of similar custom UIs. In this case, they are information kiosks.

  This script is attached to a Trigger Zone gizmo. When the player enters the trigger, the custom UI inside the gizmo is populated with the appropriate data. The appropriate
  data is specified in a row in the jsonRowID property in the Properties panel. To populate, the code scans the AssetReferenceRows[] for the jsonRowID value and then
  uses the values in that row to populate the custom UI objects.

  The code executes as follows:
  1. initializeUI() - this method is executed when the simulation begins. This sets up the data structures. By default, the custom UI is empty.
  2. start() - this method is executed when the player enters the simulation. This creates the onPlayerEnterTrigger() event listener, which fires when the player enters the trigger zone.
    Note that we are counting on this start() method to execute after the other start() methods,
    including the one that reads in the data, under the assumption that the first custom UI is some distance from the SpawnPoint.
  3.refresh() - when the player enters the trigger zone, the AssetReferenceRows[] array is scanned for the proper row and, if found, populates the custom UI with the correct data.
    This occurs after the player enters the trigger zone, meaning the player is in close proximity to the custom UI.

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
const ui_1 = require("horizon/ui");
// Imported components from the Loadcustom UI script. These are exportable data objects that are populated by the time the player approaches any of the custom UIs (we hope).
const Station08_LoadCustomUIData_1 = require("Station08-LoadCustomUIData");
// style object for the logo
const logoImage2Style = { width: 117, height: 12 }; // 5%
class Station08DisplayCUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 800;
        this.panelWidth = 1200;
        /*
          Following is the schema for the JSON file, which is helpful to include here so that you can build the code to support it.
          JSON record information should match the information in the exported type CUIRowData (see below):
                "CUIId": "3",
                "enabled": true,
                "titleText": "Winning the Game",
                "subTitleText": "",
                "bodyText": "To win the game, you need to hunt and kill the Wumpus. I feel a draft....",
                "logoAssetId": "3640063222903226"
        */
        this.bndCUIId = new ui_1.Binding('-1');
        this.bndenabled = new ui_1.Binding('');
        this.bndTitleText = new ui_1.Binding('');
        this.bndSubTitleText = new ui_1.Binding('');
        this.bndbodyText = new ui_1.Binding('');
        // For the image object, you must create a new ImageSource entity, which is used as the initial value of the Binding. If the Binding does not have a valid ImageSource initial value,
        // an error is generated. In this case, we create the placeholder text as a reference to the asset that is used in the JSON, but you can override this value with your own asset Ids in the JSON.
        this.imgSourcePlaceHolderTexture = ui_1.ImageSource.fromTextureAsset(new hz.Asset(BigInt(3640063222903226)));
        this.bndLogoSource = new ui_1.Binding(this.imgSourcePlaceHolderTexture); // assetId here is a placeholder. It can be assigned as needed through the JSON. 
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({ text: this.bndTitleText,
                            style: {
                                color: "black",
                                fontSize: 72,
                                fontWeight: "800",
                            }
                        }),
                        (0, ui_1.Image)({
                            source: this.bndLogoSource,
                            style: logoImage2Style
                        })
                    ],
                    style: {
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignContent: "flex-end",
                        justifyContent: "space-between",
                    },
                }),
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({ text: this.bndSubTitleText,
                            style: { color: "black", fontSize: 36, fontWeight: "600" }
                        }),
                        (0, ui_1.Text)({ text: this.bndbodyText,
                            style: { color: "black", fontSize: 36 }
                        }),
                    ],
                    style: {
                        flexDirection: "column",
                        paddingTop: 18,
                    },
                })
            ],
            // These style elements apply to the entire custom UI panel.
            style: { backgroundColor: "white",
                borderColor: "#00008B", // dark blue in RGB hex value
                borderWidth: 12,
                borderRadius: 25,
                padding: 20,
                flexDirection: "column",
                alignItems: "stretch",
            },
        });
    }
    ;
    /*
      When the simulation begins (Play button in Desktop Editor), the start() method is executed.
    
      For this script, start() sets up the listener for the onPlayerEnterTrigger CodeBlockEvent.
    
      When that event fires, the refresh() method is called, using the value of this.props.jsonRowID,
      which identifies the JSON row data to use to populate the custom UI.
    */
    start() {
        this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            let r = this.props.jsonRowID;
            this.refresh([enteredBy], r);
        });
    }
    /*
      The refresh() method is called when the onPlayerEnterTrigger event fires. This method populates
      the custom UI with data from the appropriate JSON record. Correct record
      is specified as a property (jsonRowId) on the Property panel of the custom UI.
    */
    refresh(thisPlayer, myJSONRowId) {
        let r = 0;
        for (r = 0; r < Station08_LoadCustomUIData_1.AssetReferencesCount; r++) {
            let thisRow = Station08_LoadCustomUIData_1.AssetReferenceRows[r];
            if ((thisRow.CUIId.valueOf() == myJSONRowId) && (thisRow.enabled == true)) {
                // If thisRow (AssetReferenceRows[r]) is enabled and matches the value for the myJSONRowId parameter, 
                // we set() the values for the bindings of the custom UI based on the row's data.
                this.bndTitleText.set(thisRow.titleText.valueOf());
                this.bndSubTitleText.set(thisRow.subTitleText.valueOf());
                this.bndbodyText.set(thisRow.bodyText.valueOf());
                // The following converts the value of the logoAssetId field to a Number, which is used to create 
                // a reference to an hz.Asset. This asset is used as the input parameter for the ImageSource object.
                // The ImageSource object is bound to the bndLogoSource Binding, which is part of the custom UI definition.
                let lid = BigInt(+thisRow.logoAssetId);
                let myLogo = new hz.Asset(lid);
                let myLogoSource = ui_1.ImageSource.fromTextureAsset(myLogo);
                this.bndLogoSource.set(myLogoSource);
                break;
            }
        }
        if (r >= Station08_LoadCustomUIData_1.AssetReferencesCount) {
            console.error("Cannot find JSON rowID: " + myJSONRowId);
        }
    }
}
Station08DisplayCUI.propsDefinition = {
    jsonRowID: { type: hz.PropTypes.String },
    triggerZone: { type: hz.PropTypes.Entity }
};
;
ui_1.UIComponent.register(Station08DisplayCUI);
