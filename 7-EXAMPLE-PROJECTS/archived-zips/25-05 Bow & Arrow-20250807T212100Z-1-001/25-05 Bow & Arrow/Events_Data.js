"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
const core_1 = require("horizon/core");
exports.events = {
    networked: {
        requestArrow: new core_1.NetworkEvent('requestArrow'),
        yourArrowIs: new core_1.NetworkEvent('yourArrowIs'),
    },
    local: {},
};
