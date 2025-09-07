"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueChapter = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const FtueManager_1 = require("FtueManager");
const core_1 = require("horizon/core");
class FtueChapter extends core_1.Component {
    constructor() {
        super();
        this.tasks = new Map();
        this.taskNames = [];
        this.playerIndices = new Map();
    }
    start() {
        console.log('FtueChapter started');
        if (this.props.ftueManager) {
            this.ftueManager = this.props.ftueManager.getComponents(FtueManager_1.FtueManager)[0];
            this.ftueManager.addChapter(this);
        }
        // Get the task order based on children order in the editor
        let nameSet = new Set();
        this.entity.children.get().forEach((child) => {
            let taskName = child.name.get();
            if (nameSet.has(taskName)) {
                console.error("start(): Task name already taken: ", taskName);
                return;
            }
            nameSet.add(taskName);
            this.taskNames.push(taskName);
        });
    }
    getChapterId() {
        return this.props.chapterId;
    }
    addTask(task) {
        let taskName = task.entity.name.get();
        if (this.tasks.has(taskName)) {
            console.error("addTask(): Task name already taken: ", taskName);
            return;
        }
        this.tasks.set(taskName, task);
    }
    startChapter(player) {
        this.playerIndices.set(player, -1);
        this.nextTask(player);
    }
    completeTask(player, taskId) {
        this.ftueManager.completeTask(player, taskId);
        this.nextTask(player);
    }
    nextTask(player) {
        // Invalid
        if (!this.playerIndices.has(player)) {
            return;
        }
        let taskIndex = this.playerIndices.get(player) + 1;
        // Finished last task, complete chapter
        if (taskIndex >= this.taskNames.length) {
            this.ftueManager.completeChapter(player, this.props.chapterId);
            this.playerIndices.delete(player);
            return;
        }
        this.playerIndices.set(player, taskIndex);
        this.tasks.get(this.taskNames[taskIndex]).startTask(player);
    }
    forceCompleteChapter(player) {
        this.ftueManager.completeChapter(player, this.props.chapterId);
        this.playerIndices.delete(player);
    }
}
exports.FtueChapter = FtueChapter;
FtueChapter.propsDefinition = {
    chapterId: { type: core_1.PropTypes.String },
    ftueManager: { type: core_1.PropTypes.Entity },
    testArray: { type: core_1.PropTypes.EntityArray },
};
core_1.Component.register(FtueChapter);
