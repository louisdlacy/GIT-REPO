"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class Intro extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.writingSpots = [];
        this.names = new Set();
    }
    Awake() {
        this.props.tombWritingSpots?.children.get()?.forEach((entity) => {
            if (entity) {
                this.writingSpots.push(entity.as(core_1.TextGizmo));
            }
        });
    }
    Start() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            var playerName = player.name.get();
            // Handle multiple join messages (?)
            if (this.names.has(playerName))
                return;
            this.names.add(playerName);
            var epitaph = "Here lies\n" + playerName + "\n?? - Today";
            if (this.writingSpots.length > 0) {
                var spot = this.writingSpots.pop();
                spot?.text.set(epitaph);
            }
        });
    }
}
Intro.propsDefinition = {
    tombWritingSpots: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(Intro);
