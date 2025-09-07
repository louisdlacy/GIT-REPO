import { FtueTaskUI } from 'FtueTask';
import { Player } from 'horizon/core';
import { ImageSource, UINode, Binding } from "horizon/ui";
export declare class FtueTaskDialog extends FtueTaskUI<typeof FtueTaskDialog> {
    static propsDefinition: any;
    panelWidth: number;
    panelHeight: number;
    titleBinding: Binding<string>;
    descriptionBinding: Binding<string>;
    imageBinding: Binding<ImageSource>;
    hasImage: Binding<boolean>;
    private player;
    start(): void;
    onTaskStart(player: Player): void;
    onTaskComplete(player: Player): void;
    completeTaskWithPlayer(): void;
    initializeUI(): UINode<import("horizon/ui").ViewProps>;
}
