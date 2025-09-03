"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthData = void 0;
const ui_1 = require("horizon/ui");
exports.healthData = {
    isVisible: new ui_1.Binding(true),
    animationValueBinding: new ui_1.AnimatedBinding(1),
    healthValueBinding: new ui_1.Binding(1),
    currentHealth: 100,
    maxHealth: 100
};
