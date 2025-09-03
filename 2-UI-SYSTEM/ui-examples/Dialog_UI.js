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
exports.Dialog_UI = void 0;
const hz = __importStar(require("horizon/core"));
const ui_1 = require("horizon/ui");
const NPC_1 = require("NPC");
const SHOW_RESPONSE_DELAY_MS = 700;
class Dialog_UI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.dialogTitle = new ui_1.Binding("title");
        this.line = new ui_1.Binding("dialog");
        this.option1 = new ui_1.Binding("option1");
        this.option2 = new ui_1.Binding("option2");
        this.option3 = new ui_1.Binding("option3");
        this.optionTree = []; // tracks which options we have chosen
    }
    start() {
        this.localPlayer = this.world.getLocalPlayer();
        this.entity.visible.set(false);
        this.trigger = this.props.trigger.as(hz.TriggerGizmo);
        this.trigger.enabled.set(false);
        if (this.localPlayer === hz.World.prototype.getServerPlayer()) {
            return;
        }
        // Set up trigger gizmo to only detect our owning player
        this.trigger.setWhoCanTrigger([this.localPlayer]);
        // Triggers when a player enters the proximity of a talkable entity
        this.connectNetworkBroadcastEvent(NPC_1.DialogEvents.onEnterTalkableProximity, (payload) => {
            this.talkingEntity = payload.npc;
            this.entity.position.set(payload.npc.position.get());
            this.trigger.enabled.set(true);
        });
        // Triggers when a player clicks on the "talk" button
        // Sends a request to the server to start the dialog
        this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => {
            this.optionTree = [];
            this.sendNetworkEvent(this.talkingEntity, NPC_1.DialogEvents.requestDialog, { player: this.localPlayer, key: this.optionTree });
        });
        // Triggers when the server sends a response to the dialog request
        // If response has content, will fill out the UI
        // If response is empty, will hide the UI
        this.connectNetworkBroadcastEvent(NPC_1.DialogEvents.sendDialogScript, (payload) => {
            if (payload.container) {
                this.updateText(payload.container);
                this.entity.visible.set(true);
                this.trigger.enabled.set(false);
            }
            else {
                this.entity.visible.set(false);
                this.async.setTimeout(() => {
                    this.trigger.enabled.set(true);
                }, SHOW_RESPONSE_DELAY_MS);
            }
        });
    }
    // Triggers when a player clicks on an option in the dialog UI
    chooseDialogOption(option) {
        this.optionTree.push(option);
        this.sendNetworkEvent(this.talkingEntity, NPC_1.DialogEvents.requestDialog, { player: this.localPlayer, key: this.optionTree });
    }
    updateText(container) {
        const target = [this.localPlayer];
        this.dialogTitle.set(container.title || "", target);
        this.line.set(container.response, target);
        this.option1.set("", target);
        this.option2.set("", target);
        this.option3.set("", target);
        this.async.setTimeout(() => {
            this.option1.set(container.option1Text, target);
            this.option2.set(container.option2Text || "", target);
            this.option3.set(container.option3Text || "", target);
        }, SHOW_RESPONSE_DELAY_MS);
    }
    initializeUI() {
        const root = (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            children: [],
                            style: {
                                width: 472,
                                flexShrink: 0,
                                alignSelf: "stretch",
                                borderRadius: 12,
                                borderWidth: 4,
                                borderColor: "#F9D470",
                                backgroundColor: "#FAECD3"
                            }
                        }),
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.Text)({
                                    text: this.line,
                                    style: {
                                        width: 424,
                                        color: "#5A3715",
                                        textAlign: "center",
                                        textAlignVertical: "center",
                                        fontFamily: "Roboto",
                                        fontSize: 24,
                                        fontWeight: "700",
                                        minHeight: 84
                                    }
                                })
                            ],
                            style: {
                                display: "flex",
                                paddingTop: 24,
                                paddingRight: 24,
                                paddingBottom: 16,
                                paddingLeft: 24,
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                marginLeft: -472
                            }
                        }),
                        (0, ui_1.View)({
                            children: [
                                (0, ui_1.View)({
                                    children: [
                                        (0, ui_1.Text)({
                                            text: this.dialogTitle,
                                            style: {
                                                color: "#5A3715",
                                                textAlign: "center",
                                                fontFamily: "Roboto",
                                                fontSize: 28,
                                                fontWeight: "900"
                                            }
                                        })
                                    ],
                                    style: {
                                        display: "flex",
                                        height: 36,
                                        paddingVertical: 0,
                                        paddingHorizontal: 24,
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 18,
                                        backgroundColor: "#F9D470"
                                    }
                                })
                            ],
                            style: {
                                display: "flex",
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                top: -17
                            }
                        })
                    ],
                    style: {
                        display: "flex",
                        width: 472,
                        justifyContent: "center",
                        alignItems: "flex-end",
                        borderRadius: 12,
                        flexDirection: "row"
                    }
                }),
                (0, ui_1.View)({
                    children: [
                        ui_1.UINode.if(this.option1.derive(x => x.length > 0), (0, ui_1.Pressable)({
                            children: [(0, ui_1.View)({
                                    children: [(0, ui_1.Text)({
                                            text: this.option1,
                                            style: {
                                                color: "#61470B",
                                                textAlign: "center",
                                                textAlignVertical: "center",
                                                fontFamily: "Roboto",
                                                fontSize: 24,
                                                fontWeight: "700"
                                            },
                                        })],
                                    style: {
                                        display: "flex",
                                        paddingVertical: 12,
                                        paddingHorizontal: 24,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 20,
                                        borderBottomWidth: 4,
                                        backgroundColor: "#FFD98B",
                                        borderColor: "#E8BC57",
                                        flexDirection: "row",
                                        minWidth: 328
                                    },
                                })],
                            onClick: () => this.chooseDialogOption(0),
                        })),
                        ui_1.UINode.if(this.option2.derive(x => x.length > 0), (0, ui_1.Pressable)({
                            children: [(0, ui_1.View)({
                                    children: [(0, ui_1.Text)({
                                            text: this.option2,
                                            style: {
                                                color: "#61470B",
                                                textAlign: "center",
                                                textAlignVertical: "center",
                                                fontFamily: "Roboto",
                                                fontSize: 24,
                                                fontWeight: "700"
                                            }
                                        })],
                                    style: {
                                        display: "flex",
                                        paddingVertical: 12,
                                        paddingHorizontal: 24,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 20,
                                        borderBottomWidth: 4,
                                        backgroundColor: "#FFD98B",
                                        borderColor: "#E8BC57",
                                        marginTop: 10,
                                        flexDirection: "row",
                                        minWidth: 328
                                    },
                                })],
                            onClick: () => this.chooseDialogOption(1),
                        })),
                        ui_1.UINode.if(this.option3.derive(x => x.length > 0), (0, ui_1.Pressable)({
                            children: [(0, ui_1.View)({
                                    children: [(0, ui_1.Text)({
                                            text: this.option3,
                                            style: {
                                                color: "#61470B",
                                                textAlign: "center",
                                                textAlignVertical: "center",
                                                fontFamily: "Roboto",
                                                fontSize: 24,
                                                fontWeight: "700"
                                            }
                                        })],
                                    style: {
                                        display: "flex",
                                        paddingVertical: 12,
                                        paddingHorizontal: 24,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 20,
                                        borderBottomWidth: 4,
                                        backgroundColor: "#FFD98B",
                                        borderColor: "#E8BC57",
                                        marginTop: 10,
                                        flexDirection: "row",
                                        minWidth: 328
                                    },
                                })],
                            onClick: () => this.chooseDialogOption(2),
                        }))
                    ],
                    style: {
                        display: "flex",
                        width: 812,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        borderRadius: 12,
                        marginTop: 13
                    }
                })
            ],
            style: {
                display: "flex",
                width: "100%",
                height: "100%",
                paddingVertical: 108,
                paddingHorizontal: 32,
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                position: "relative"
            }
        });
        return root;
    }
}
exports.Dialog_UI = Dialog_UI;
Dialog_UI.propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
};
ui_1.UIComponent.register(Dialog_UI);
