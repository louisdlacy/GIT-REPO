"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigBox_UI_ToastHud_1 = require("BigBox_UI_ToastHud");
const core_1 = require("horizon/core");
class BigBox_ToastTriggerExample extends core_1.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendNetworkBroadcastEvent(BigBox_UI_ToastHud_1.BigBox_ToastEvents.textToast, {
                player: player,
                text: this.props.message // This message can be anything you want!
            });
        });
    }
}
BigBox_ToastTriggerExample.propsDefinition = {
    message: { type: core_1.PropTypes.String, default: "Hello Horizon World" },
};
core_1.Component.register(BigBox_ToastTriggerExample);
