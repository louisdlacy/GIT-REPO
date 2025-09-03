"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const inputData = new ui_1.Binding([]);
class InputViewer extends core_1.Component {
    constructor() {
        super(...arguments);
        this.inputBuffer = [];
        this.onUpdate = (data) => {
            // After 3 seconds, clear from the input buffer
            const now = Date.now();
            const filteredBuffer = this.inputBuffer.filter(input => now - input.timestamp < 3000);
            // Only update if the buffer changed
            if (filteredBuffer.length !== this.inputBuffer.length) {
                this.inputBuffer = filteredBuffer;
                inputData.set([...this.inputBuffer]);
            }
        };
    }
    preStart() {
        this.owner = this.entity.owner.get();
        this.props.ui?.owner.set(this.owner);
        if (this.owner === this.world.getServerPlayer()) {
            return;
        }
        // Create input callbacks for all possible PlayerInputAction values
        const inputActions = [
            core_1.PlayerInputAction.Jump,
            core_1.PlayerInputAction.RightPrimary,
            core_1.PlayerInputAction.RightSecondary,
            core_1.PlayerInputAction.RightTertiary,
            core_1.PlayerInputAction.RightGrip,
            core_1.PlayerInputAction.RightTrigger,
            core_1.PlayerInputAction.RightXAxis,
            core_1.PlayerInputAction.RightYAxis,
            core_1.PlayerInputAction.LeftPrimary,
            core_1.PlayerInputAction.LeftSecondary,
            core_1.PlayerInputAction.LeftTertiary,
            core_1.PlayerInputAction.LeftGrip,
            core_1.PlayerInputAction.LeftTrigger,
            core_1.PlayerInputAction.LeftXAxis,
            core_1.PlayerInputAction.LeftYAxis
        ];
        // Connect each input action and register callbacks
        inputActions.forEach(action => {
            const input = core_1.PlayerControls.connectLocalInput(action, core_1.ButtonIcon.None, this);
            input.registerCallback((inputAction, pressed) => {
                if (pressed) {
                    let inputNameArray = core_1.PlayerControls.getPlatformKeyNames(inputAction);
                    // Check if it's an axis input and value is over 0, then use index 1
                    const isAxis = inputAction === core_1.PlayerInputAction.RightXAxis ||
                        inputAction === core_1.PlayerInputAction.RightYAxis ||
                        inputAction === core_1.PlayerInputAction.LeftXAxis ||
                        inputAction === core_1.PlayerInputAction.LeftYAxis;
                    console.log(isAxis, input.axisValue);
                    let inputName = inputNameArray[0];
                    if (isAxis) {
                        const text = inputName.split("/");
                        if (input.axisValue.get() > 0) {
                            inputName = text[1];
                        }
                        else {
                            inputName = text[0];
                        }
                    }
                    inputName = `${core_1.PlayerInputAction[inputAction]} - ${inputName}`;
                    this.inputBuffer.push({ name: inputName, timestamp: Date.now() });
                    // Force remove the top (oldest) input if there are over 10 inputs
                    if (this.inputBuffer.length > 10) {
                        this.inputBuffer.shift();
                    }
                    inputData.set([...this.inputBuffer]);
                }
            });
        });
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate);
    }
    start() { }
}
InputViewer.propsDefinition = {
    ui: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(InputViewer);
class InputViewerUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelWidth = 800;
        this.panelHeight = 600;
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            text: "Input\nViewer",
                            style: {
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#000",
                                marginBottom: 16,
                                textAlign: "center",
                                marginTop: 150
                            }
                        }),
                        (0, ui_1.DynamicList)({
                            data: inputData,
                            renderItem: (item) => {
                                return this.showInput(item);
                            },
                            style: {
                                flex: 1
                            }
                        })
                    ],
                    style: {
                        flex: 1
                    }
                }),
                (0, ui_1.View)({
                    style: {
                        flex: 6,
                    }
                })
            ],
            style: {
                flex: 1,
                flexDirection: "row",
            }
        });
    }
    showInput(item) {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: item.name,
                    style: {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000"
                    }
                })
            ],
            style: {
                padding: 8,
                width: "100%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
            }
        });
    }
}
InputViewerUI.propsDefinition = {};
ui_1.UIComponent.register(InputViewerUI);
