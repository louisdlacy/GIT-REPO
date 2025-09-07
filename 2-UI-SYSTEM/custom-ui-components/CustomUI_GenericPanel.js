"use strict";
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
exports.CustomUI_GenericPanel = void 0;
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
/**
 * A generic three part panel for custom UIs consisting of a title, subtitle, and body.
 */
class CustomUI_GenericPanel extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        // Following are fixed values (no variables permitted) for the height and width of the custom UI panel.
        this.panelHeight = 1200;
        this.panelWidth = 1600;
        // Following are special variables (bindings) for applying variable values to custom UIs.
        this.bndTitleText = new ui_1.Binding('');
        this.bndSubTitleText = new ui_1.Binding('');
        this.bndbodyText = new ui_1.Binding('');
    }
    initializeUI() {
        this.bndTitleText.set(this.props.title);
        this.bndSubTitleText.set(this.props.subTitle);
        this.bndbodyText.set(this.props.body);
        // A custom UI is defined as View that is returned from the initializeUI() method.
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            text: this.bndTitleText,
                            style: {
                                color: "black",
                                fontSize: 72,
                                fontWeight: "800",
                            }
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
                        (0, ui_1.Text)({
                            text: this.bndSubTitleText,
                            style: { color: "black", fontSize: 36, fontWeight: "600" }
                        }),
                        (0, ui_1.Text)({
                            text: this.bndbodyText,
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
            style: {
                backgroundColor: "white",
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
exports.CustomUI_GenericPanel = CustomUI_GenericPanel;
CustomUI_GenericPanel.propsDefinition = {
    title: { type: hz.PropTypes.String },
    subTitle: { type: hz.PropTypes.String },
    body: { type: hz.PropTypes.String }
};
;
ui_1.UIComponent.register(CustomUI_GenericPanel);
