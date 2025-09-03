/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
import * as hz from 'horizon/core';
export declare enum QuestNames {
    'QuestCollect1Coin' = 0,// trade 2 gems for 1 coin in the kiosk
    'QuestCollect1Gem' = 1,// collect 1 gem.
    'QuestCollect5Gems' = 2,// collect five gems in the world
    'QuestCollect15Gems' = 3,// collect 15 total gems (requires replay)
    'Collect1RedGem' = 4
}
export declare const questComplete: hz.LocalEvent<{
    player: hz.Player;
    questName: QuestNames;
}>;
export declare const questReset: hz.LocalEvent<{
    player: hz.Player;
    questName: QuestNames;
}>;
export declare const questBoardUpdate: hz.LocalEvent<{}>;
