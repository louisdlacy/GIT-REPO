"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const core_1 = require("horizon/core");
class Projectile extends core_1.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnProjectileHitObject, this.onProjectileHitObject.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnProjectileHitWorld, this.onProjectileHitWorld.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnProjectileHitPlayer, this.onProjectileHitPlayer.bind(this));
    }
    onProjectileHitObject(objectHit, position, normal) {
        //When the projectiles hits an object, we apply a multiplied force
        //based on the normal to the object to push it away from the projectile.
        console.log("projectile hit object");
        objectHit.as(core_1.PhysicalEntity)?.applyForceAtPosition(normal.mulInPlace(-1 * this.props.objHitForceMultipler), position, core_1.PhysicsForceMode.Impulse);
        this.onHitGeneric(position, normal);
    }
    onProjectileHitWorld(position, normal) {
        console.log("projectile hit world");
        this.onHitGeneric(position, normal);
    }
    onProjectileHitPlayer(player, position, normal, headshot) {
        console.log("projectile hit player");
        this.onHitGeneric(position, normal);
    }
    onHitGeneric(position, normal) {
        var hitSound = this.props.objHitSFX?.as(core_1.AudioGizmo);
        var hitParticles = this.props.objHitVFX?.as(core_1.ParticleGizmo);
        if (hitSound) {
            hitSound.position.set(position);
            hitSound.play();
        }
        if (hitParticles) {
            hitParticles.position.set(position);
            hitParticles.play();
        }
    }
}
Projectile.propsDefinition = {
    projectileLauncher: { type: core_1.PropTypes.Entity },
    objHitForceMultipler: { type: core_1.PropTypes.Number, default: 100 },
    objHitSFX: { type: core_1.PropTypes.Entity },
    objHitVFX: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(Projectile);
