import { Component, NetworkEvent, Player } from 'horizon/core';
import { FtueChapter } from 'FtueChapter';
export declare class FtueManager extends Component<typeof FtueManager> {
    static propsDefinition: {};
    static ChapterCompleteEvent: NetworkEvent<{
        player: Player;
        chapterId: string;
    }>;
    static TaskCompleteEvent: NetworkEvent<{
        player: Player;
        taskId: string;
    }>;
    private ftueChapters;
    private player;
    constructor();
    preStart(): void;
    start(): void;
    private onPlayerEnterWorld;
    addChapter(chapter: FtueChapter): void;
    startChapter(player: Player, chapterId: string): void;
    completeTask(player: Player, taskId: string): void;
    completeChapter(player: Player, chapterId: string): void;
}
