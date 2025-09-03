"use strict";
// Copyright (c) Richard Lee (Shards632). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const core_1 = require("horizon/core");
/**
 * Events that are shared between ammo boxes, guns, and targets.
 */
exports.Events = {
    // send from ammo box when a player picks it up
    pickupAmmo: new core_1.NetworkEvent('shardsPickupAmmo'),
    // send from the gun to the target it hit
    ammoHit: new core_1.NetworkEvent('shardsAmmoHit'),
};
