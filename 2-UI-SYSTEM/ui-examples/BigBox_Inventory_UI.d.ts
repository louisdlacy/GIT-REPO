import * as hz from 'horizon/core';
import { Color } from 'horizon/core';
import * as ui from 'horizon/ui';
export declare class SlotViewModel {
    label: ui.Binding<string>;
    fillColor: ui.Binding<Color>;
    borderColor: ui.Binding<Color>;
    filled: boolean;
}
export type SlotContainer = {
    name: string;
    borderColor: Color;
};
export declare class BigBox_Inventory_UI extends ui.UIComponent<typeof BigBox_Inventory_UI> {
    static propsDefinition: {
        slotSize: {
            type: "number";
            default: number;
        };
        slotCount: {
            type: "number";
            default: number;
        };
        defaultColor: {
            type: "Color";
            default: hz.Color;
        };
        selectedColor: {
            type: "Color";
            default: hz.Color;
        };
        defaultBorderColor: {
            type: "Color";
        };
    };
    private allSlots;
    private selectedIndex?;
    start(): void;
    /**
     * Handles incoming slot data from the server and updates the UI accordingly.
     * This method processes server updates for individual inventory slots, including
     * item data, selection state, and visual appearance.
     *
     * @param index - The slot index to update (0-based)
     * @param properties - Item data for the slot, or undefined if slot is empty
     * @param selected - Whether this slot should be visually selected
     */
    private onDataReceived;
    /**
     * Updates a slot with item data (name, border color, etc.)
     * @param slot - The slot view model to update
     * @param properties - The item data to apply
     * @param localTarget - Target player for the UI update
     */
    private updateSlotWithItemData;
    /**
     * Handles selection state changes from server updates
     * @param index - The slot index being updated
     * @param selected - Whether the slot should be selected
     */
    private handleSlotSelection;
    /**
     * Clears all data from a slot and resets it to default appearance
     * @param slot - The slot view model to clear
     * @param localTarget - Target player for the UI update
     */
    private clearSlotData;
    /**
     * Handles slot click events and manages selection state.
     * This method processes user interactions with inventory slots, including:
     * - Single selection (clicking a new slot)
     * - Deselection (clicking the currently selected slot)
     * - Empty slot handling (clicking slots without items)
     * - Server synchronization of selection state
     *
     * @param id - The index of the clicked slot
     */
    private onSlotClicked;
    /**
     * Updates the visual appearance of all slots based on the current selection
     * @param selectedId - The ID of the slot that was clicked
     * @param isDeselecting - Whether we're deselecting the current slot
     */
    private updateSlotVisuals;
    /**
     * Checks if the click was on an empty slot (and not a deselection)
     * @param clickedSlot - The slot that was clicked
     * @param isDeselecting - Whether this is a deselection click
     * @returns True if this is an empty slot click
     */
    private isEmptySlotClick;
    /**
     * Handles clicks on empty slots by immediately deselecting and notifying server
     * @param clickedId - The ID of the empty slot that was clicked
     */
    private handleEmptySlotClick;
    /**
     * Handles clicks on filled slots, managing selection and server communication
     * @param clickedId - The ID of the filled slot that was clicked
     * @param isDeselecting - Whether this click is deselecting the current slot
     */
    private handleFilledSlotClick;
    /**
     * Sends a network event to notify the server about slot selection changes
     * @param slotIndex - The index of the slot being selected/deselected
     * @param selected - Whether the slot is being selected (true) or deselected (false)
     * @param serverTarget - The server player target for the network event
     */
    private notifyServerOfSlotSelection;
    private createAndStoreSlot;
    private renderSlotFromData;
    getToolbarView(): ui.ViewProps;
    initializeUI(): ui.UINode;
}
