"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HapticFeedback = exports.hapticConfig = exports.HapticType = exports.HapticHand = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
// Original code by SketeDavidson: https://horizon.meta.com/profile/10158917081718438
const core_1 = require("horizon/core");
var HapticHand;
(function (HapticHand) {
    HapticHand[HapticHand["Left"] = -1] = "Left";
    HapticHand[HapticHand["Both"] = 0] = "Both";
    HapticHand[HapticHand["Right"] = 1] = "Right";
})(HapticHand || (exports.HapticHand = HapticHand = {}));
var HapticType;
(function (HapticType) {
    HapticType["reload"] = "reload";
    HapticType["pickup"] = "pickup";
    HapticType["empty"] = "empty";
    HapticType["damage"] = "damage";
    HapticType["death"] = "death";
    HapticType["healthAdded"] = "healthAdded";
    HapticType["playerHit"] = "playerHit";
    HapticType["hitObject"] = "hitObject";
    HapticType["hitPlayerBody"] = "hitPlayerBody";
    HapticType["hitPlayerHead"] = "hitPlayerHead";
    HapticType["gunShot"] = "gunShot";
})(HapticType || (exports.HapticType = HapticType = {}));
// Define haptic feedback for different hit scenarios
// Hit Object
const simulateHitObject = [
    { duration: 50, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Soft, delayToNext: 30 },
    { duration: 30, strength: core_1.HapticStrength.VeryLight, sharpness: core_1.HapticSharpness.Soft, delayToNext: 20 },
    { duration: 30, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Soft, delayToNext: 0 },
];
// Hit Player's Body
const simulateHitPlayerBody = [
    { duration: 60, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 40 },
    { duration: 40, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 30 },
    { duration: 50, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 0 },
];
// Hit Player's Head
const simulateHitPlayerHead = [
    { duration: 80, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 50 },
    { duration: 60, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 40 },
    { duration: 70, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 0 },
];
const simulateWeaponReload = [
    { duration: 100, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 150 },
    { duration: 150, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 100 },
    { duration: 100, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 100 },
];
const simulatePickupWeapon = [
    { duration: 30, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 50 },
    { duration: 40, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 75 },
    { duration: 60, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 75 },
];
const simulateShootingEmpty = [
    { duration: 30, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 50 },
    { duration: 50, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 75 },
    { duration: 100, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Soft, delayToNext: 0 },
];
const simulateDamage = [
    { duration: 60, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 80 },
    { duration: 100, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 90 },
    { duration: 60, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Soft, delayToNext: 0 },
];
const simulateDeath = [
    { duration: 300, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 150 },
    { duration: 400, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 200 },
    { duration: 300, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 0 },
];
const simulateHealthAdded = [
    { duration: 50, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Soft, delayToNext: 60 },
    { duration: 50, strength: core_1.HapticStrength.Light, sharpness: core_1.HapticSharpness.Soft, delayToNext: 50 },
    { duration: 50, strength: core_1.HapticStrength.VeryLight, sharpness: core_1.HapticSharpness.Soft, delayToNext: 0 },
];
const simulatePlayerHit = [
    { duration: 30, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 40 },
    { duration: 20, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 30 },
    { duration: 30, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 0 },
];
const gunShot = [
    { duration: 40, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 10 },
    { duration: 30, strength: core_1.HapticStrength.Strong, sharpness: core_1.HapticSharpness.Coarse, delayToNext: 0 },
    { duration: 20, strength: core_1.HapticStrength.Medium, sharpness: core_1.HapticSharpness.Sharp, delayToNext: 0 },
];
exports.hapticConfig = new Map([
    ["reload", simulateWeaponReload],
    ["pickup", simulatePickupWeapon],
    ["empty", simulateShootingEmpty],
    ["damage", simulateDamage],
    ["death", simulateDeath],
    ["healthAdded", simulateHealthAdded],
    ["playerHit", simulatePlayerHit],
    ["hitObject", simulateHitObject],
    ["hitPlayerBody", simulateHitPlayerBody],
    ["hitPlayerHead", simulateHitPlayerHead],
    ["gunShot", gunShot],
]);
class HapticFeedback {
    static playPattern(player, pattern, hand, component) {
        if (hand <= HapticHand.Both) {
            this.playPatternStage(exports.hapticConfig.get(pattern), 0, player.leftHand, component);
        }
        if (hand >= HapticHand.Both) {
            this.playPatternStage(exports.hapticConfig.get(pattern), 0, player.rightHand, component);
        }
    }
    static playPatternStage(pattern, index, hand, component) {
        if (index < pattern.length) {
            const { duration, strength, sharpness, delayToNext } = pattern[index];
            hand.playHaptics(duration, strength, sharpness);
            component.async.setTimeout(() => this.playPatternStage(pattern, index + 1, hand, component), delayToNext);
        }
    }
}
exports.HapticFeedback = HapticFeedback;
