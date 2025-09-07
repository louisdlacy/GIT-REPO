import { Player } from "horizon/core";
export declare const iwpManager_Func: {
    increasePlayerTokenProgress: typeof increasePlayerTokenProgress;
    chargeTokens: typeof chargeTokens;
};
/**
 * Increases player token progress, if more than 100%, rolls over, can be used to increase multiple full tokens
 * @param player to increase
 * @param increaseAmount out of `iwpManager_Data.amountToEarnAPremiumToken` (default of 1000)
 */
declare function increasePlayerTokenProgress(player: Player, increaseAmount: number): void;
/**
 * Charge premium tokens to a player. Returns true if successful, false if too low of a balance.
 * @param player To Charge
 * @param cost To Charge
 * @returns `boolean` representing the success of the charge.
 */
declare function chargeTokens(player: Player, cost: number): boolean;
export {};
