import { FtueTask } from 'FtueTask';
import { EventSubscription, Player } from 'horizon/core';
export declare class FtueTaskGoTo extends FtueTask<typeof FtueTaskGoTo> {
    static propsDefinition: any;
    updateListener: EventSubscription | null;
    player: Player | null;
    constructor();
    start(): void;
    onTaskStart(player: Player): void;
    onTaskComplete(player: Player): void;
    update(deltaTime: number): void;
    private setPosition;
}
