import * as hz from 'horizon/core';
import { BaseComponent } from "./BaseComponent";
/**
 * This class controls the overarching behavior of the customer. It is responsible for
 * managing the customer's interactions and navigation within the environment.
 */
export declare class CustomerControl extends BaseComponent<typeof CustomerControl> {
    static propsDefinition: any;
    private _inTrigger;
    private _llmControl;
    private _navigation;
    /**
     * Initializes the customer control by setting up entity references and enabling customer behavior.
     * Also connects events for player entering and exiting the trigger area.
     */
    start(): void;
    /**
     * Retrieves and verifies the necessary component references for LLM control and navigation.
     */
    getEntityReferences(): void;
    /**
     * Enables the customer by subscribing to events and resetting the LLM session.
     */
    enableCustomer(): void;
    /**
     * Resumes the customer's walking behavior by resetting the trigger state and starting navigation.
     */
    resumeWalking(): void;
    /**
     * Stops the customer's navigation and makes the customer greet the player.
     * @param player - The player who has entered the trigger area.
     */
    stopAndSayHi(player: hz.Player): void;
}
