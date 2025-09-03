import { FtueTask } from 'FtueTask';
import { Player } from 'horizon/core';
export declare class FtueTaskPopup extends FtueTask<typeof FtueTaskPopup> {
    static propsDefinition: any;
    onTaskStart(player: Player): void;
    onTaskComplete(player: Player): void;
}
