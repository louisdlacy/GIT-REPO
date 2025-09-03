import { Component, Player } from 'horizon/core';
import { UIComponent, UINode } from 'horizon/ui';
export interface IFtueTask {
    startTask(player: Player): void;
    complete(player: Player): void;
    setParentTask(parentTask: IFtueTask): void;
}
export declare class FtueTask<T> extends Component<typeof FtueTask & T> implements IFtueTask {
    static propsDefinition: {
        taskChapter: {
            type: "Entity";
        };
    };
    private taskChapter;
    private parentTask;
    start(): void;
    startTask(player: Player): void;
    complete(player: Player): void;
    setParentTask(parentTask: IFtueTask): void;
    protected onTaskStart(player: Player): void;
    protected onTaskComplete(player: Player): void;
}
export declare class FtueTaskUI<T> extends UIComponent<typeof FtueTaskUI & T> implements IFtueTask {
    static propsDefinition: {
        taskId: {
            type: "string";
        };
        taskChapter: {
            type: "Entity";
        };
    };
    private taskChapter;
    private parentTask;
    start(): void;
    startTask(player: Player): void;
    complete(player: Player): void;
    setParentTask(parentTask: IFtueTask): void;
    initializeUI(): UINode<any>;
    protected onTaskStart(player: Player): void;
    protected onTaskComplete(player: Player): void;
}
