/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
/**
  This script defines the custom UI, which is the Trading Store in the world.

  This custom UI:
  - allows trading of green gems for gold coins
  - allows trading of gold coins for a red gem
  - maintains counts of the players green gems, coins, and red gems

  Custom UI also sends the events to complete quests, which are:
  - trade 5 green gems for 1 coin
  - trade 1 coin for 1 red gem

  These events are handled in the Quest Manager.
 */
import * as hz from 'horizon/core';
import * as hzui from 'horizon/ui';
export declare class EconomyUI extends hzui.UIComponent<typeof EconomyUI> {
    static propsDefinition: {};
    protected panelHeight: number;
    protected panelWidth: number;
    COIN_COUNT: hzui.Binding<number>;
    GEM_COUNT: hzui.Binding<number>;
    RED_GEM_COUNT: hzui.Binding<number>;
    TRADE_BUTTON_HOVER: hzui.Binding<Boolean>;
    TRADE2_BUTTON_HOVER: hzui.Binding<Boolean>;
    CONFIRMATION_POPUP: hzui.Binding<Boolean>;
    CONFIRMATION2_POPUP: hzui.Binding<Boolean>;
    CANCEL_BUTTON_HOVER: hzui.Binding<Boolean>;
    CONFIRM_BUTTON_HOVER: hzui.Binding<Boolean>;
    CANCEL2_BUTTON_HOVER: hzui.Binding<Boolean>;
    CONFIRM2_BUTTON_HOVER: hzui.Binding<Boolean>;
    refresh(player: hz.Player): void;
    initializeUI(): hzui.UINode<hzui.ViewProps>;
    HandleGreenGemToCoinTransaction(player: hz.Player, GemDelta: number, CoinDelta: number): void;
    HandleCoinToRedGemTransaction(player: hz.Player, CoinDelta: number, GemDelta: number): void;
    GetGems(player: hz.Player): number;
    GetRedGems(player: hz.Player): number;
    GetCoins(player: hz.Player): number;
    start(): void;
}
