"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingText = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class FloatingText extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.floatSpeed = 1;
        this.rotateSpeed = 360;
        this.currentTime = 0;
        this.maxTime = 2;
        this.rotationEuler = new core_1.Vec3(0, 0, 0);
        this.deleted = false;
    }
    setText(text, floatSpeed, rotateSpeed, maxTime) {
        this.entity.as(core_1.TextGizmo).text.set(text);
        this.floatSpeed = floatSpeed;
        this.rotateSpeed = rotateSpeed;
        this.maxTime = maxTime;
    }
    Update(deltaTime) {
        if (this.deleted)
            return;
        this.currentTime += deltaTime;
        if (this.currentTime > this.maxTime) {
            this.world.deleteAsset(this.entity);
            this.deleted = true;
        }
        this.entity.position.set(this.entity.position.get().add(new core_1.Vec3(0, this.floatSpeed * deltaTime, 0)));
        this.rotationEuler.y += this.rotateSpeed * deltaTime % 360;
        this.entity.rotation.set(core_1.Quaternion.fromEuler(this.rotationEuler));
    }
}
exports.FloatingText = FloatingText;
FloatingText.propsDefinition = {};
core_1.Component.register(FloatingText);
