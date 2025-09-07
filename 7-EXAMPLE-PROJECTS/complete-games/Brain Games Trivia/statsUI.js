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
const ui = __importStar(require("horizon/ui"));
class InteractiveScreenOverlay extends ui.UIComponent {
    constructor() {
        super(...arguments);
        // Define panel dimensions
        this.panelHeight = 1080;
        this.panelWidth = 1920;
        // Bindings for dynamic percentages
        this.percentageBindings = [
            new ui.Binding("100%"), // Answer A
            new ui.Binding("100%"), // Answer B
            new ui.Binding("100%"), // Answer C
            new ui.Binding("100%"), // Answer D
            new ui.Binding("100%"), // No Answer
        ];
        // Colors for the vertical lines
        this.lineColors = ["orange", "yellow", "hotpink", "white", "lightblue"];
        // Labels for the answers
        this.answerLabels = [
            "Answer A",
            "Answer B",
            "Answer C",
            "Answer D",
            "No Answer",
        ];
    }
    // Initialize the UI
    initializeUI() {
        const lineWidth = 300; // Width of each vertical line
        const lineHeight = 500; // Height of each vertical line
        const spacing = 50; // Spacing between lines
        const titleStyle = {
            fontSize: 120,
            color: "orange",
            fontWeight: "bold",
            textAlign: "center",
            textAlignVertical: "center",
        };
        const labelStyle = {
            fontSize: 30,
            color: "white",
            textAlign: "center",
            textAlignVertical: "center",
        };
        const percentageStyle = {
            fontSize: 40,
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            textAlignVertical: "center",
        };
        // Create the main UI layout
        return ui.View({
            children: [
                // Title at the top
                ui.Text({
                    text: "Stats",
                    style: titleStyle,
                }),
                // Vertical lines with labels and percentages
                ui.View({
                    children: this.lineColors.map((color, index) => {
                        const translateX = 0 + (index - 2) * spacing; // Center the lines horizontally
                        return ui.View({
                            children: [
                                // Vertical colored line
                                ui.View({
                                    style: {
                                        backgroundColor: color,
                                        width: lineWidth,
                                        height: lineHeight,
                                        borderRadius: 5,
                                    },
                                }),
                                // Percentage text below the line
                                ui.Text({
                                    text: this.percentageBindings[index],
                                    style: percentageStyle,
                                }),
                                // Label below the percentage
                                ui.Text({
                                    text: this.answerLabels[index],
                                    style: labelStyle,
                                }),
                            ],
                            style: {
                                alignItems: "center",
                                justifyContent: "flex-start",
                                height: 800, // Combined height for line, percentage, and label
                            },
                        });
                    }),
                    style: {
                        flexDirection: "row", // Arrange the lines horizontally
                        justifyContent: "center",
                        alignItems: "flex-end", // Align to the bottom
                        transform: [{ translate: [0, 200] }], // Move bars lower on the screen
                    },
                }),
            ],
            style: {
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                flexDirection: "column", // Arrange title and lines vertically
                justifyContent: "flex-start",
                alignItems: "center",
            },
        });
    }
}
// Register the class properly
ui.UIComponent.register(InteractiveScreenOverlay);
