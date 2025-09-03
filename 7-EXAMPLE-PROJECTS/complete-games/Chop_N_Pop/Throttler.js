"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttler = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
class Throttler {
    static try(key, functionToThrottle, delay) {
        const now = BigInt(Date.now());
        const lastTime = Throttler.throttleMap.get(key) ?? BigInt(0);
        if (now - lastTime < delay) {
            return;
        }
        Throttler.throttleMap.set(key, now);
        functionToThrottle();
    }
}
exports.Throttler = Throttler;
Throttler.propsDefinition = {};
Throttler.throttleMap = new Map();
