import { BigBox_ItemBaseInfo } from 'BigBox_ItemBaseInfo';
import * as hz from 'horizon/core';
/**
 * Stores the state of an instance of an item
 */
export declare class BigBox_ItemState {
    info: BigBox_ItemBaseInfo;
    player: hz.Player;
    equipped: boolean;
    private grabbable;
    private loadingInProgress;
    constructor(info: BigBox_ItemBaseInfo, player: hz.Player);
    equip(): void;
    unequip(): void;
    dispose(): void;
}
