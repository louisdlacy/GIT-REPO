"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GunProjectile = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
// Original code by SketeDavidson: https://horizon.meta.com/profile/10158917081718438
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
const Throttler_1 = require("Throttler");
class GunProjectile extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.sfxDelayTimeMs = 1000;
        this.sfxDelays = new Map();
    }
    Awake() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnProjectileHitObject, this.handleHit.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnProjectileHitWorld, (position, normal) => {
            Throttler_1.Throttler.try("GunMissSFX", () => {
                this.props.missSFX?.position.set(position);
                this.props.missSFX?.as(core_1.AudioGizmo)?.play();
            }, this.sfxDelayTimeMs);
        });
        if (this.props.hitSFX)
            this.sfxDelays.set(this.props.hitSFX, false);
        if (this.props.missSFX)
            this.sfxDelays.set(this.props.missSFX, false);
    }
    handleHit(itemHit, position, normal, headshot = false) {
        if (itemHit instanceof core_1.Entity && !(itemHit instanceof core_1.Player)) {
            Throttler_1.Throttler.try("GunProjectileSFX", () => {
                this.props.hitSFX?.position.set(position);
                this.props.hitSFX?.as(core_1.AudioGizmo)?.play();
            }, this.sfxDelayTimeMs);
            this.sendNetworkEvent(itemHit, Events_1.Events.projectileHit, { hitPos: position, hitNormal: normal, fromPlayer: this.entity.parent.get().owner.get() });
            console.log("Hit! -> " + itemHit);
        }
    }
}
exports.GunProjectile = GunProjectile;
GunProjectile.propsDefinition = {
    hitSFX: { type: core_1.PropTypes.Entity },
    missSFX: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(GunProjectile);
