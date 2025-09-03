"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class ColliderBox extends Behaviour_1.Behaviour {
    OnEntityCollision(itemHit, position, normal, velocity) {
    }
}
ColliderBox.propsDefinition = {};
core_1.Component.register(ColliderBox);
