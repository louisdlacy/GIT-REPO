"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class HideWhenStart extends Behaviour_1.Behaviour {
    Start() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.entity.visible.set(false);
        });
    }
}
HideWhenStart.propsDefinition = {};
core_1.Component.register(HideWhenStart);
