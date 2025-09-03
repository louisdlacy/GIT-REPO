"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const core_1 = require("horizon/core");
class FtueManager extends core_1.Component {
    constructor() {
        super();
        this.ftueChapters = new Map();
        this.player = undefined;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        console.log("FtueManager: onPlayerEnterWorld");
        this.player = player;
        // NOTE - EXAMPLE!! PLease remove this for your own project.
        this.startChapter(player, "TheOne");
        // ---------------------------------------------------------
    }
    addChapter(chapter) {
        this.ftueChapters.set(chapter.getChapterId(), chapter);
    }
    startChapter(player, chapterId) {
        if (!this.player) {
            console.error("FtueManager: startChapter - player not set");
            return;
        }
        if (!this.ftueChapters.has(chapterId)) {
            console.error("FtueManager: startChapter - chapter not found: ", chapterId);
            return;
        }
        console.log("FtueManager: startChapter - id: ", chapterId);
        this.ftueChapters.get(chapterId).startChapter(this.player);
    }
    completeTask(player, taskId) {
        console.log("FtueManager: completeTask - id: ", taskId);
        this.sendNetworkBroadcastEvent(FtueManager.TaskCompleteEvent, { player: player, taskId: taskId });
    }
    completeChapter(player, chapterId) {
        console.log("FtueManager: completeChapter - id: ", chapterId);
        this.sendNetworkBroadcastEvent(FtueManager.ChapterCompleteEvent, { player: player, chapterId: chapterId });
    }
}
exports.FtueManager = FtueManager;
FtueManager.propsDefinition = {};
FtueManager.ChapterCompleteEvent = new core_1.NetworkEvent('ftueChapterComplete');
FtueManager.TaskCompleteEvent = new core_1.NetworkEvent('ftueTaskComplete');
core_1.Component.register(FtueManager);
