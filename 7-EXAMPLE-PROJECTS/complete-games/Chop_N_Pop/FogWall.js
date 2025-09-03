"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FogWall = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class FogWall extends Behaviour_1.Behaviour {
    hide() {
        this.props.fogVfx1?.as(core_1.ParticleGizmo).stop();
        this.props.fogVfx2?.as(core_1.ParticleGizmo).stop();
        this.props.fogVfx3?.as(core_1.ParticleGizmo).stop();
    }
    show() {
        this.props.fogVfx1?.as(core_1.ParticleGizmo).play();
        this.props.fogVfx2?.as(core_1.ParticleGizmo).play();
        this.props.fogVfx3?.as(core_1.ParticleGizmo).play();
    }
}
exports.FogWall = FogWall;
FogWall.propsDefinition = {
    fogVfx1: { type: core_1.PropTypes.Entity },
    fogVfx2: { type: core_1.PropTypes.Entity },
    fogVfx3: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(FogWall);
