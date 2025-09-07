"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_Data_1 = require("Events_Data");
const core_1 = require("horizon/core");
const UtilColor_Func_1 = require("UtilColor_Func");
class Hat_Entity extends core_1.Component {
    preStart() {
        this.connectLocalEvent(this.entity, Events_Data_1.Events.localEvents.colorHat, (payload) => { this.colorItems(payload.color); });
    }
    start() {
    }
    colorItems(color) {
        UtilColor_Func_1.colorUtils.tintMesh(color, this.props.colorItem1?.as(core_1.MeshEntity), 1, 0.5);
        UtilColor_Func_1.colorUtils.tintMesh(color, this.props.colorItem2?.as(core_1.MeshEntity), 1, 0.5);
    }
}
Hat_Entity.propsDefinition = {
    colorItem1: { type: core_1.PropTypes.Entity },
    colorItem2: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(Hat_Entity);
