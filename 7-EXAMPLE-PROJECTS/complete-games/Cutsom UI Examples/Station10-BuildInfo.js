"use strict";
/*
  Station 10b: Build Info in Non-Interactive Overlay

  This station demonstrates use of the non-interactive Screen Overlay for inserting user-defined build
  information on the screen.


  IMPORTANT: When you add the custom UI gizmo,
  make sure to set the value of Display mode to "Screen Overlay"
  for non-interactive screen overlays (HUDs).
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
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
class Station10_BuildInfo extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        // Define bindings for the custom UI.
        this.strBuildMessage = new ui_1.Binding('Build:');
        this.strBuildNumber = new ui_1.Binding('1234.567');
        this.strDisplay = new ui_1.Binding('flex');
    }
    /*
    Defines the custom UI
  */
    initializeUI() {
        /*
          Define values for bindings.
        */
        if (this.props.enabled == false) {
            this.strDisplay.set('none');
        }
        else {
            this.strDisplay.set('flex');
        }
        let bM = this.props.buildMessage;
        if (bM) {
            this.strBuildMessage.set(bM);
        }
        let bN = this.props.buildNumber;
        if (bN) {
            this.strBuildNumber.set(bN);
        }
        /*
          initializeUI() must return a View object.
        */
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text: this.strBuildMessage, style: {
                        fontFamily: "Roboto",
                        color: "black",
                        fontWeight: "600",
                        fontSize: 18,
                        alignItems: "flex-end",
                    } }),
                (0, ui_1.Text)({ text: this.strBuildNumber, style: {
                        fontFamily: "Roboto",
                        color: "black",
                        fontWeight: "600",
                        fontSize: 18,
                        alignItems: "flex-end",
                    } }),
            ],
            // These style elements apply to the entire custom UI panel.
            style: {
                position: "absolute", // IMPORTANT: This attribute must be set to "absolute" for non-interactive overlays.
                display: this.strDisplay,
                flexDirection: "row",
                alignItems: "flex-end",
                padding: 2,
                left: 4, // IMPORTANT: This value determines the absolute location in pixels of the UI relative to left margin.
                bottom: 4, // IMPORTANT: This value determines the absolute location in pixels of the UI relative to bottom margin.
            },
        });
    }
    start() { }
}
Station10_BuildInfo.propsDefinition = {
    enabled: { type: hz.PropTypes.Boolean, default: true },
    buildMessage: { type: hz.PropTypes.String },
    buildNumber: { type: hz.PropTypes.String },
};
hz.Component.register(Station10_BuildInfo);
