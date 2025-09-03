"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageEvent = exports.HealthZeroEvent = void 0;
const core_1 = require("horizon/core");
// Event to broadcast when health reaches zero
exports.HealthZeroEvent = new core_1.LocalEvent();
// Event to apply damage
exports.DamageEvent = new core_1.LocalEvent();
