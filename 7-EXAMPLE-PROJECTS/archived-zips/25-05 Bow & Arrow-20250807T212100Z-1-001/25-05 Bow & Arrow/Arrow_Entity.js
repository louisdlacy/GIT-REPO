"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arrow_Data_1 = require("Arrow_Data");
const core_1 = require("horizon/core");
class Arrow_Entity extends core_1.Component {
    preStart() {
        Arrow_Data_1.arrow_Data.arrows.push(this.entity);
    }
    start() {
    }
}
Arrow_Entity.propsDefinition = {};
core_1.Component.register(Arrow_Entity);
