import { FtueTask } from 'FtueTask';
import { Player } from 'horizon/core';
export declare class FtueTaskNetworkEvent extends FtueTask<typeof FtueTaskNetworkEvent> {
    static propsDefinition: any;
    onTaskStart(player: Player): void;
    onTaskComplete(player: Player): void;
}
