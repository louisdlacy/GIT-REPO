"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueTaskNetworkEvent = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const FtueTask_1 = require("FtueTask");
const core_1 = require("horizon/core");
class FtueTaskNetworkEvent extends FtueTask_1.FtueTask {
    onTaskStart(player) {
        this.connectNetworkEvent(this.entity, new core_1.NetworkEvent(this.props.eventName), () => {
            this.complete(player);
        });
    }
    onTaskComplete(player) {
    }
}
exports.FtueTaskNetworkEvent = FtueTaskNetworkEvent;
FtueTaskNetworkEvent.propsDefinition = {
    ...FtueTask_1.FtueTask.propsDefinition,
    eventName: { type: core_1.PropTypes.String },
};
core_1.Component.register(FtueTaskNetworkEvent);
