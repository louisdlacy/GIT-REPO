"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Arrow_Data_1 = require("Arrow_Data");
const Events_Data_1 = require("Events_Data");
const core_1 = require("horizon/core");
class ArrowManager_Entity extends core_1.Component {
    preStart() {
        this.connectNetworkEvent(this.entity, Events_Data_1.events.networked.requestArrow, (payload) => { this.arrowRequested(payload.requester); });
    }
    start() {
    }
    arrowRequested(requester) {
        const index = (Arrow_Data_1.arrow_Data.lastIndex + 1) % Arrow_Data_1.arrow_Data.arrows.length;
        Arrow_Data_1.arrow_Data.lastIndex = index;
        const arrow = Arrow_Data_1.arrow_Data.arrows[index];
        this.sendNetworkEvent(requester, Events_Data_1.events.networked.yourArrowIs, { arrow: arrow });
    }
}
ArrowManager_Entity.propsDefinition = {};
core_1.Component.register(ArrowManager_Entity);
