"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingTextManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class FloatingTextManager extends Behaviour_1.Behaviour {
    Awake() {
        FloatingTextManager.instance = this;
    }
    async createFloatingText(text, position, color = this.props.color) {
        if (this.props.floatingTextAsset === undefined)
            return;
        this.world.spawnAsset(this.props.floatingTextAsset, position).then((spawns) => {
            spawns.forEach((spawn) => {
                var floatingText = Behaviour_1.BehaviourFinder.GetBehaviour(spawn);
                floatingText?.setText(text, this.props.floatSpeed, this.props.rotationSpeed, this.props.duration);
                position.y = this.props.yPos;
                spawn.position.set(position);
                spawn.color.set(color);
            });
        });
    }
}
exports.FloatingTextManager = FloatingTextManager;
FloatingTextManager.propsDefinition = {
    floatingTextAsset: { type: core_1.PropTypes.Asset, default: undefined },
    yPos: { type: core_1.PropTypes.Number, default: 2 },
    floatSpeed: { type: core_1.PropTypes.Number, default: 0.5 },
    rotationSpeed: { type: core_1.PropTypes.Number, default: 360 },
    duration: { type: core_1.PropTypes.Number, default: 2.0 },
    color: { type: core_1.PropTypes.Color, default: new core_1.Color(1, 1, 1) }
};
core_1.Component.register(FloatingTextManager);
