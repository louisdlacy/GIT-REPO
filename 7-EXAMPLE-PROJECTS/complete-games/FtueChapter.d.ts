import { FtueTask, FtueTaskUI } from 'FtueTask';
import { Component, Player } from 'horizon/core';
export declare class FtueChapter extends Component<typeof FtueChapter> {
    static propsDefinition: {
        chapterId: {
            type: "string";
        };
        ftueManager: {
            type: "Entity";
        };
        testArray: {
            type: "Array<Entity>";
        };
    };
    private tasks;
    private taskNames;
    private playerIndices;
    private ftueManager;
    constructor();
    start(): void;
    getChapterId(): string;
    addTask(task: FtueTask<any> | FtueTaskUI<any>): void;
    startChapter(player: Player): void;
    completeTask(player: Player, taskId: string): void;
    private nextTask;
    forceCompleteChapter(player: Player): void;
}
