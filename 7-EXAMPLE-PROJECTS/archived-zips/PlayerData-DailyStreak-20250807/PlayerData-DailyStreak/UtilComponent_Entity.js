"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const UtilComponent_Data_1 = require("UtilComponent_Data");
class UtilComponent_Entity extends core_1.Component {
    preStart() {
        UtilComponent_Data_1.componentUtil_Data.component = this;
    }
    start() {
    }
}
UtilComponent_Entity.propsDefinition = {};
core_1.Component.register(UtilComponent_Entity);
