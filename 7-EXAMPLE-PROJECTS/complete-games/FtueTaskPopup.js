"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueTaskPopup = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const FtueTask_1 = require("FtueTask");
const core_1 = require("horizon/core");
class FtueTaskPopup extends FtueTask_1.FtueTask {
    onTaskStart(player) {
        let popupOptions = core_1.DefaultPopupOptions;
        popupOptions.position = new core_1.Vec3(0, this.props.verticalPosition, 0);
        // You can add more options here from props
        this.props.popupAppearSfx?.as(core_1.AudioGizmo).play();
        this.world.ui.showPopupForPlayer(player, this.props.displayText, this.props.displayTime);
        this.async.setTimeout(() => {
            this.complete(player);
        }, this.props.displayTime * 1000);
    }
    onTaskComplete(player) {
    }
}
exports.FtueTaskPopup = FtueTaskPopup;
FtueTaskPopup.propsDefinition = {
    ...FtueTask_1.FtueTask.propsDefinition,
    displayText: { type: core_1.PropTypes.String },
    displayTime: { type: core_1.PropTypes.Number, default: 2 },
    verticalPosition: { type: core_1.PropTypes.Number, default: 0 },
    popupAppearSfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(FtueTaskPopup);
