"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
class MobileTriviaUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 800;
        this.panelWidth = 600;
    }
    initializeUI() {
        const buttonStyle = {
            height: 70,
            width: 180,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 12,
            margin: 8,
            borderWidth: 2,
            borderColor: "#000000", //
        };
        const textStyle = {
            color: "white",
            fontSize: 22,
            fontWeight: "600",
        };
        const infoBoxStyle = {
            backgroundColor: "white",
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#ccc",
        };
        // Reusable animated button creator
        const makeAnimatedButton = (label, color) => {
            const scale = new ui_1.AnimatedBinding(1);
            return (0, ui_1.Pressable)({
                children: (0, ui_1.Text)({ text: label, style: textStyle }),
                style: {
                    ...buttonStyle,
                    backgroundColor: color,
                    transform: [{ scale }],
                },
                onClick: () => {
                    console.log(`${label} button pressed`);
                    // Animate the button: shrink and bounce back
                    scale.set(0.9); // quick shrink
                    scale.set(ui_1.Animation.timing(1)); // smooth return to original scale
                },
            });
        };
        return (0, ui_1.View)({
            children: [
                // Question Prompt
                (0, ui_1.View)({
                    children: (0, ui_1.Text)({
                        text: "Which color do you choose?", // This will replace with the question
                        style: {
                            fontSize: 28,
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: "bold",
                        },
                    }),
                    style: {
                        backgroundColor: "#333",
                        paddingVertical: 14,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "75%",
                        marginBottom: 12,
                    },
                }),
                // Round and Timer
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            children: (0, ui_1.Text)({
                                text: "Round: 0",
                                style: { fontSize: 20, color: "#000" },
                            }),
                            style: { ...infoBoxStyle, marginRight: 12 },
                        }),
                        (0, ui_1.View)({
                            children: (0, ui_1.Text)({
                                text: "Timer: 00",
                                style: { fontSize: 20, color: "#000" },
                            }),
                            style: infoBoxStyle,
                        }),
                    ],
                    style: {
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 40,
                    },
                }),
                // Color Buttons
                (0, ui_1.View)({
                    children: [
                        makeAnimatedButton("Blue", "#007BFF"),
                        makeAnimatedButton("Yellow", "#FFD700"),
                        makeAnimatedButton("Red", "#FF4C4C"),
                        makeAnimatedButton("Green", "#28A745"),
                    ],
                    style: {
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 250,
                    },
                }),
            ],
            style: {
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
                backgroundColor: "transparent",
                borderRadius: 20,
                height: "100%",
                width: "100%",
            },
        });
    }
}
ui_1.UIComponent.register(MobileTriviaUI);
