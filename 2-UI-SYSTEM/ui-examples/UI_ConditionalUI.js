"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class ConditionalUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.isRightHandBinding = new ui_1.Binding(false);
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                ui_1.UINode.if(this.isRightHandBinding, (0, ui_1.Text)({
                    text: "Grabbed with Right Hand",
                }), (0, ui_1.Text)({
                    text: "Grabbed with Left Hand",
                }))
            ],
            style: {
                flex: 1
            }
        });
    }
    preStart() {
        this.grabbable = this.props.grabbable?.as(core_1.GrabbableEntity);
        if (!this.grabbable) {
            console.error("Grabbable entity is not set");
            return;
        }
        this.connectCodeBlockEvent(this.grabbable, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    start() { }
    onGrab(isRightHand) {
        this.isRightHandBinding.set(isRightHand);
    }
}
ConditionalUI.propsDefinition = {
    grabbable: { type: core_1.PropTypes.Entity }
};
ui_1.UIComponent.register(ConditionalUI);
