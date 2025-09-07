"use strict";
/*
  Station 0: Welcome to the UI Gym!

  This station demonstrates how you can use uploaded Text assets in JSON form as source data for a set of similar custom UIs. In this case, they are information kiosks.

  This script is attached to a Trigger Zone gizmo. When the player enters the trigger, the custom UI inside the gizmo is populated with the appropriate data. The appropriate
  data is specified in the jsonRowID property in the Properties panel. To populate, the code scans the AssetReferenceRows[] for the jsonRowID value and then uses the values
  in that row to populate the custom UI objects.

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
// style object for the logo
const logoImage2Style = { width: 117, height: 12 }; // 5%
class Station00Welcome extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        // Following are fixed values (no variables permitted) for the height and width of the custom UI panel.
        this.panelHeight = 1200;
        this.panelWidth = 1600;
        // Following are special variables (bindings) for applying variable values to custom UIs.
        this.bndTitleText = new ui_1.Binding('');
        this.bndSubTitleText = new ui_1.Binding('');
        this.bndbodyText = new ui_1.Binding('');
        this.bndLogoSource = new ui_1.Binding('');
        /*
          For UIComponent classes, the start() (and preStart()) methods are not required. However, you can use them to perform additional actions
          if needed. Order of execution: initializeUI(), preStart(), start()
        */
        //  start() {}
    }
    // initializeUI() is a special method used only for creating custom UIs.
    initializeUI() {
        // Here, we set the values of the bindings using the set() method.
        this.bndTitleText.set('Welcome to Custom UI Examples!');
        this.bndSubTitleText.set('How to explore:');
        // The body text is long. It is easier to build a string as a series of paragraphs as a variable and then to apply the string using the set() method.
        let strBody = "This world is composed of many different stations, each of which demonstrates a separate aspect of custom UIs.\r\n";
        strBody = strBody + "Start at Station 01 to your left, which demonstrates how to display available fonts. Since custom UIs are primarily created in TypeScript, you should open the related script files in your editor.\r\n";
        strBody = strBody + "This is Station 00. Additional examples of this kind of signage are available at Station 08.\r\n";
        strBody = strBody + "Code is commented, and additional explanations are available in the Custom UI Examples documentation.";
        // Documentation may be available at the following URL: https://developers.meta.com/horizon-worlds/learn/documentation/tutorials/tutorial-worlds/custom-ui-examples-tutorial
        strBody = strBody + "Thanks for visiting! If you have ideas for additional stations, please reach out.\r\n";
        this.bndbodyText.set(strBody);
        // Below, the Meta logo defined in the Properties panel is assigned to local variables and bound to the
        // bndLogoSource binding.
        let myLogo = this.props.MetaLogo;
        let myLogoSource = ui_1.ImageSource.fromTextureAsset(myLogo);
        this.bndLogoSource.set(myLogoSource);
        // A custom UI is defined as View that is returned from the initializeUI() method.
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
                            style: logoImage2Style // The logoImage2Style is defined as a style object so that it can be consistently applied.
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
            // Note here that the double forward slashes are used for commenting a single line.
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
}
Station00Welcome.propsDefinition = {
    MetaLogo: { type: hz.PropTypes.Asset },
};
;
ui_1.UIComponent.register(Station00Welcome);
