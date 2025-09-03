"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueTaskUI = exports.FtueTask = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const FtueChapter_1 = require("FtueChapter");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
// ----------------------------------------------------------------
// NoOp class to bind the script to an empty object for export
class NoOp extends core_1.Component {
    start() { }
    ;
}
core_1.Component.register(NoOp);
class FtueTask extends core_1.Component {
    start() {
        if (this.props.taskChapter) {
            this.taskChapter = this.props.taskChapter.getComponents(FtueChapter_1.FtueChapter)[0];
        }
        this.taskChapter?.addTask(this);
    }
    startTask(player) {
        console.log('FtueTask: ' + this.entity.name + ' started');
        this.onTaskStart(player);
    }
    complete(player) {
        console.log('FtueTask: ' + this.entity.name + ' completed');
        this.onTaskComplete(player);
        if (this.parentTask) {
            this.parentTask.complete(player);
        }
        else {
            this.taskChapter?.completeTask(player, this.entity.name.get());
        }
    }
    setParentTask(parentTask) {
        this.parentTask = parentTask;
    }
    onTaskStart(player) { }
    onTaskComplete(player) { }
}
exports.FtueTask = FtueTask;
FtueTask.propsDefinition = {
    taskChapter: { type: core_1.PropTypes.Entity },
};
class FtueTaskUI extends ui_1.UIComponent {
    start() {
        if (this.props.taskChapter) {
            this.taskChapter = this.props.taskChapter.getComponents(FtueChapter_1.FtueChapter)[0];
        }
        this.taskChapter?.addTask(this);
    }
    startTask(player) {
        console.log('FtueTaskUI: ' + this.props.taskId + ' started');
        this.onTaskStart(player);
    }
    complete(player) {
        console.log('FtueTaskUI: ' + this.props.taskId + ' completed');
        this.onTaskComplete(player);
        if (this.parentTask) {
            this.parentTask.complete(player);
        }
        else {
            this.taskChapter?.completeTask(player, this.props.taskId);
        }
    }
    setParentTask(parentTask) {
        this.parentTask = parentTask;
    }
    initializeUI() { return new ui_1.UINode(); }
    onTaskStart(player) { }
    onTaskComplete(player) { }
}
exports.FtueTaskUI = FtueTaskUI;
FtueTaskUI.propsDefinition = {
    taskId: { type: core_1.PropTypes.String },
    taskChapter: { type: core_1.PropTypes.Entity },
};
