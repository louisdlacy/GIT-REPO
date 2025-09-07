"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DialogueData_1 = require("DialogueData");
const DialogueEvents_1 = require("DialogueEvents");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class LocalManager extends core_1.Component {
    preStart() {
        this.props.local?.owner?.set(this.entity.owner.get());
    }
    start() { }
}
LocalManager.propsDefinition = {
    local: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(LocalManager);
class DialogueUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 800;
        this.panelWidth = 600;
        this.nameBinding = new ui_1.Binding('');
        this.speechBinding = new ui_1.Binding(''); //3 new lines max, For Example, Test\nTest\nTest
        this.isTalking = false;
        this.dialogueKey = "";
        this.textArray = [];
        this.onTalk = (data) => {
            if (this.isTalking || !this.owner) {
                return;
            }
            this.isTalking = true;
            const name = data.target.name.get();
            this.nameBinding.set(name);
            if (this.dialogueKey !== name) {
                this.dialogueKey = name;
                DialogueData_1.dialogueData.messageDataIndex = 0;
            }
            this.textArray = DialogueData_1.DialogueMap.get(name) ?? [];
            //console.log(textArray);
            if (this.textArray.length > 0) {
                //console.log("Dialogue Data Index", dialogueData.messageDataIndex, this.textArray.length);
                const messages = this.textArray[DialogueData_1.dialogueData.messageDataIndex].messages;
                //console.log("Messages for", name, this.messages);
                DialogueData_1.dialogueData.messageIndex = 0;
                const message = messages[DialogueData_1.dialogueData.messageIndex];
                this.speechBinding.set(message);
            }
            else {
                this.speechBinding.set("");
            }
            this.input = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.RightTrigger, core_1.ButtonIcon.RightChevron, this);
            this.input.registerCallback((action, pressed) => {
                if (pressed) {
                    this.onContinue();
                }
            });
            this.entity.visible.set(true);
        };
        this.onContinue = () => {
            if (!this.owner) {
                return;
            }
            //console.log("Continuing dialogue", dialogueData.messageIndex === this.messages.length - 1);
            const messages = this.textArray[DialogueData_1.dialogueData.messageDataIndex].messages;
            if (DialogueData_1.dialogueData.messageIndex < messages.length - 1) {
                DialogueData_1.dialogueData.messageIndex = DialogueData_1.dialogueData.messageIndex + 1;
                const message = messages[DialogueData_1.dialogueData.messageIndex];
                this.speechBinding.set(message);
            }
            else {
                this.isTalking = false;
                DialogueData_1.dialogueData.messageDataIndex = (DialogueData_1.dialogueData.messageDataIndex + 1) % this.textArray.length;
                //console.log("Dialogue Data Index", dialogueData.messageDataIndex, this.textArray.length);
                this.input?.disconnect();
                this.entity.visible.set(false);
                this.sendLocalBroadcastEvent(DialogueEvents_1.UpdatePromptVisibilityEvent, {});
            }
        };
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                //Content
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            text: this.speechBinding,
                            style: {
                                fontSize: 50,
                                color: "#000",
                            }
                        }),
                    ],
                    style: {
                        height: '30%',
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginHorizontal: 20,
                        backgroundColor: "#ffffff",
                        paddingVertical: 50,
                        paddingHorizontal: 50,
                        borderRadius: 100,
                    }
                }),
                //Name
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            text: this.nameBinding,
                            style: {
                                fontSize: 50,
                                color: "#000",
                                backgroundColor: "#bbffbb",
                                padding: 20,
                                borderRadius: 200,
                                marginHorizontal: 20,
                            }
                        }),
                    ],
                    style: {
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginBottom: -50,
                    }
                })
            ],
            style: {
                flexDirection: 'column-reverse',
                position: "absolute",
                height: '100%',
                width: '100%',
                bottom: 0,
                left: 0,
            }
        });
    }
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        this.props.promptUI?.owner?.set(this.entity.owner.get());
        if (this.owner === this.serverPlayer) {
            return;
        }
        //console.log("Connecting events for DialogueUI");
        this.connectLocalBroadcastEvent(DialogueEvents_1.TalkEvent, this.onTalk);
    }
}
DialogueUI.propsDefinition = {
    promptUI: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(DialogueUI);
class PromptUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.isTalking = false;
        this.onAddPrompt = (data) => {
            // Always update target, but don't show while talking
            this.target = data.target;
            this.updateVisibility();
            this.entity.position.set(data.target.position.get().add(core_1.Vec3.up.mul(1.5)));
            this.entity.rotation.set(data.target.rotation.get());
        };
        this.onRemovePrompt = () => {
            // Always clear target, even while talking
            this.target = undefined;
            this.updateVisibility();
        };
        this.onUpdateVisibility = () => {
            this.isTalking = false;
            this.updateVisibility();
        };
        this.updateVisibility = () => {
            const shouldShow = !!this.target && !this.isTalking;
            this.entity.visible.set(shouldShow);
            if (shouldShow) {
                this.connectInput();
            }
            else {
                this.disconnectInput();
            }
        };
        this.connectInput = () => {
            //console.log("Connecting input");
            this.input = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.RightGrip, core_1.ButtonIcon.Speak, this);
            this.input?.registerCallback((action, pressed) => {
                if (pressed && this.target) {
                    this.isTalking = true;
                    this.sendLocalBroadcastEvent(DialogueEvents_1.TalkEvent, { target: this.target });
                    this.updateVisibility();
                }
            });
        };
        this.disconnectInput = () => {
            //console.log("Disconnecting input");
            this.input?.disconnect();
        };
    }
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        //this.entity.visible.set(false);
        if (this.owner === this.serverPlayer) {
            return;
        }
        //console.log("Connecting events for PromptUI");
        this.connectNetworkEvent(this.owner, DialogueEvents_1.AddPromptEvent, this.onAddPrompt);
        this.connectNetworkEvent(this.owner, DialogueEvents_1.RemovePromptEvent, this.onRemovePrompt);
        this.connectLocalBroadcastEvent(DialogueEvents_1.UpdatePromptVisibilityEvent, this.onUpdateVisibility);
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Talk",
                    style: {
                        fontSize: 80,
                        color: "#ffffff",
                        textAlign: "center",
                        textAlignVertical: "center",
                        backgroundColor: "#000000",
                        padding: "10px",
                        borderRadius: 300,
                        height: 400,
                        width: 400,
                    }
                })
            ],
            style: {
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
            }
        });
    }
}
ui_1.UIComponent.register(PromptUI);
