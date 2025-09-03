"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadeEffect = exports.OverTime = exports.OverTimeLocal = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
// Original code by SketeDavidson: https://horizon.meta.com/profile/10158917081718438
const core_1 = require("horizon/core");
/**
 * Represents a class that handles animations over time for a specific component.
 */
class OverTimeLocal {
    constructor(component) {
        this.component = component;
    }
    /**
     * Starts an animation over time.
     * @param params - The animation parameters.
     * @returns A promise that resolves when the animation is done.
     * @throws An error if no entity is provided for the animation.
     */
    startAnimation(params) {
        const { entity, targetLocalPosition, targetLocalRotation, durationMS } = params;
        if (!entity) {
            throw new Error("No entity provided for animation.");
        }
        const startLocalPosition = entity.transform.localPosition.get();
        const startLocalRotation = entity.transform.localRotation.get();
        let elapsedMS = 0;
        let animationDone = () => { };
        const promise = new Promise((resolve) => {
            animationDone = resolve;
        });
        const onUpdateSubscription = this.component.connectLocalBroadcastEvent(core_1.World.onUpdate, ({ deltaTime }) => {
            elapsedMS += deltaTime * 1000;
            const fraction = Math.min(1, elapsedMS / durationMS);
            if (targetLocalPosition) {
                const interpolatedPosition = core_1.Vec3.lerp(startLocalPosition, targetLocalPosition, fraction);
                entity.transform.localPosition.set(interpolatedPosition);
            }
            if (targetLocalRotation) {
                const interpolatedRotation = core_1.Quaternion.slerp(startLocalRotation, targetLocalRotation, fraction);
                entity.transform.localRotation.set(interpolatedRotation);
            }
            if (fraction >= 1) {
                onUpdateSubscription.disconnect();
                animationDone();
            }
        });
        return promise;
    }
}
exports.OverTimeLocal = OverTimeLocal;
class OverTime {
    constructor(owner) {
        this.owner = owner;
        this.moveTo = this.fn('position', 'to');
        this.moveBy = this.fn('position', 'by');
        this.rotateTo = this.fn('rotation', 'to');
        this.rotateBy = this.fn('rotation', 'by');
        this.scaleTo = this.fn('scale', 'to');
        this.scaleBy = this.fn('scale', 'by');
        this.interpolations = new WeakMap();
    }
    fn(key, mode) {
        return (entity, value, durationSec) => {
            const endTime = Date.now() + durationSec * 1000;
            const entry = { value, mode, endTime, appliedFrac: 0 };
            return this.registerOverTimeAction(entity, key, entry);
        };
    }
    registerOverTimeAction(entity, key, entry) {
        let data = this.interpolations.get(entity);
        if (!data) {
            data = {
                targets: {},
                unsubscribe: this.owner.connectLocalBroadcastEvent(core_1.World.onUpdate, ({ deltaTime }) => {
                    this.tick(entity, deltaTime);
                }).disconnect,
            };
            this.interpolations.set(entity, data);
        }
        data.targets[key] = entry;
    }
    tick(entity, deltaTime) {
        const data = this.interpolations.get(entity);
        if (data) {
            const now = Date.now();
            for (const key of ['position', 'scale', 'rotation']) {
                const entry = data.targets[key];
                if (entry) {
                    const { value, endTime, mode, appliedFrac } = entry;
                    const timeFrac = Math.min(1, (deltaTime * 1000) / (endTime - now));
                    const current = entity[key].get();
                    const dt = timeFrac * (1 - appliedFrac);
                    entry.appliedFrac = Math.min(1, Math.max(0, appliedFrac + dt));
                    if (key === 'rotation') {
                        if (mode === 'to') {
                            entity[key].set(core_1.Quaternion.slerp(current, value, timeFrac));
                        }
                        else {
                            const step = core_1.Quaternion.slerp(core_1.Quaternion.one, value, dt);
                            entity[key].set(step.mul(current));
                        }
                    }
                    else {
                        if (mode === 'to') {
                            entity[key].set(core_1.Vec3.lerp(current, value, timeFrac));
                        }
                        else {
                            const step = value.mul(dt);
                            entity[key].set(current.add(step));
                        }
                    }
                    if (timeFrac >= 1 || entry.appliedFrac >= 1) {
                        delete data.targets[key];
                    }
                }
            }
            if (Object.keys(data.targets).length === 0) {
                data.unsubscribe();
                this.interpolations.delete(entity);
            }
        }
    }
}
exports.OverTime = OverTime;
class FadeEffect {
    constructor(component, textElement, colors, interval = 100) {
        this.num = 0;
        this.component = component;
        this.textElement = textElement;
        this.colors = colors;
        this.interval = interval;
        this.fadeIndex = 0;
        this.fadeDirection = 1;
        this.fadeInterval = undefined;
    }
    start() {
        if (!this.fadeInterval) {
            this.fadeInterval = this.component.async.setInterval(() => {
                const currentColor = this.colors[this.fadeIndex];
                this.textElement?.as(core_1.TextGizmo)?.text.set(`<color=${currentColor}>${this.num}</color>`);
                this.fadeIndex += this.fadeDirection;
                // Reverse direction at the ends
                if (this.fadeIndex === this.colors.length - 1 || this.fadeIndex === 0) {
                    this.fadeDirection *= -1;
                }
            }, this.interval); // Adjust the interval as needed for smooth fading
        }
    }
    stop() {
        if (this.fadeInterval) {
            this.component.async.clearInterval(this.fadeInterval);
            this.fadeInterval = undefined;
        }
    }
}
exports.FadeEffect = FadeEffect;
