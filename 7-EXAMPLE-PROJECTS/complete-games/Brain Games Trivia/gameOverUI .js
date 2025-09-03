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
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
class StandButtonUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        // Set panel size (optional, can be configured as per requirement)
        this.panelHeight = 1080;
        this.panelWidth = 1920;
        // Initialize animated binding for hover state (scale of circle)
        this.borderWidth = new ui_1.Binding(0); // No scale initially
    }
    initializeUI() {
        // Return the View containing the button and circle animation
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Pressable)({
                    children: [
                        // Text that says "Stand"
                        // Circle that will scale up on hover
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.Image)({
                                    source: ui_1.ImageSource.fromTextureAsset(new hz.TextureAsset(BigInt(1153115006401565))),
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        alignSelf: "center",
                                        resizeMode: "cover",
                                    },
                                }),
                            ],
                        }),
                    ],
                    // Handle hover enter event (increase circle size)
                }),
            ],
        });
    }
}
StandButtonUI.propsDefinition = {
    PositionCtrl: { type: hz.PropTypes.Entity },
};
ui_1.UIComponent.register(StandButtonUI);
