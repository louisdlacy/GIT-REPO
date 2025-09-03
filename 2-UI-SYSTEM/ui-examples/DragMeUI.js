"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
class DragMeUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 500;
        this.panelWidth = 500;
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: "Drag Me",
                    style: {
                        fontSize: 100,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        height: this.panelHeight,
                        width: this.panelWidth,
                    }
                })
            ],
            style: {
                backgroundColor: 'black',
                flex: 1
            }
        });
    }
}
DragMeUI.propsDefinition = {};
ui_1.UIComponent.register(DragMeUI);
class OwnershipManager extends core_1.Component {
    start() {
        this.local = this.props.local;
        this.serverPlayer = this.world.getServerPlayer();
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.local?.owner.set(player);
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (this.local?.owner.get() === player) {
                this.local?.owner.set(this.serverPlayer);
            }
        });
    }
}
OwnershipManager.propsDefinition = {
    local: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(OwnershipManager);
