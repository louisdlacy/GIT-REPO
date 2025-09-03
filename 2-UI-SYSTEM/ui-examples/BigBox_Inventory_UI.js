"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBox_Inventory_UI = exports.SlotViewModel = void 0;
const BigBox_Inventory_Manager_1 = require("BigBox_Inventory_Manager");
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
const ui = __importStar(require("horizon/ui"));
// Write-only data to display information about a slot
class SlotViewModel {
    constructor() {
        this.label = new ui.Binding("");
        this.fillColor = new ui.Binding(core_1.Color.black);
        this.borderColor = new ui.Binding(core_1.Color.black);
        this.filled = false;
    }
}
exports.SlotViewModel = SlotViewModel;
class BigBox_Inventory_UI extends ui.UIComponent {
    constructor() {
        super(...arguments);
        this.allSlots = [];
    }
    start() {
        if (this.entity.owner.get() === this.world.getServerPlayer()) {
            return;
        }
        this.connectNetworkBroadcastEvent(BigBox_Inventory_Manager_1.InventoryEvents.changeSlot, (payload) => this.onDataReceived(payload.index, payload.properties, payload.selected));
    }
    /**
     * Handles incoming slot data from the server and updates the UI accordingly.
     * This method processes server updates for individual inventory slots, including
     * item data, selection state, and visual appearance.
     *
     * @param index - The slot index to update (0-based)
     * @param properties - Item data for the slot, or undefined if slot is empty
     * @param selected - Whether this slot should be visually selected
     */
    onDataReceived(index, properties, selected) {
        // Validate slot index to prevent out-of-bounds errors
        if (index >= this.allSlots.length) {
            console.error(`Attempted to update slot ${index}, but only ${this.allSlots.length} slots exist`);
            return;
        }
        const localTarget = [this.world.getLocalPlayer()];
        const slot = this.allSlots[index];
        // Update slot's filled state based on whether properties exist
        slot.filled = properties !== undefined;
        if (properties) {
            this.updateSlotWithItemData(slot, properties, localTarget);
            this.handleSlotSelection(index, selected);
        }
        else {
            this.clearSlotData(slot, localTarget);
        }
    }
    /**
     * Updates a slot with item data (name, border color, etc.)
     * @param slot - The slot view model to update
     * @param properties - The item data to apply
     * @param localTarget - Target player for the UI update
     */
    updateSlotWithItemData(slot, properties, localTarget) {
        slot.label.set(properties.name, localTarget);
        slot.borderColor.set(properties.borderColor, localTarget);
    }
    /**
     * Handles selection state changes from server updates
     * @param index - The slot index being updated
     * @param selected - Whether the slot should be selected
     */
    handleSlotSelection(index, selected) {
        if (selected) {
            // Prevent duplicate selection events from server
            if (this.selectedIndex !== index) {
                this.onSlotClicked(index);
            }
        }
        else {
            // Deselect if this was the currently selected slot
            if (this.selectedIndex === index) {
                this.selectedIndex = undefined;
                this.allSlots[index].fillColor.set(this.props.defaultColor, [this.world.getLocalPlayer()]);
            }
        }
    }
    /**
     * Clears all data from a slot and resets it to default appearance
     * @param slot - The slot view model to clear
     * @param localTarget - Target player for the UI update
     */
    clearSlotData(slot, localTarget) {
        slot.label.set("", localTarget);
        slot.fillColor.set(this.props.defaultColor, localTarget);
        slot.borderColor.set(this.props.defaultBorderColor, localTarget);
    }
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
    onSlotClicked(id) {
        const isDeselecting = id === this.selectedIndex;
        const clickedSlot = this.allSlots[id];
        // Update visual appearance of all slots
        this.updateSlotVisuals(id, isDeselecting);
        // Handle different click scenarios
        if (this.isEmptySlotClick(clickedSlot, isDeselecting)) {
            this.handleEmptySlotClick(id);
        }
        else {
            this.handleFilledSlotClick(id, isDeselecting);
        }
    }
    /**
     * Updates the visual appearance of all slots based on the current selection
     * @param selectedId - The ID of the slot that was clicked
     * @param isDeselecting - Whether we're deselecting the current slot
     */
    updateSlotVisuals(selectedId, isDeselecting) {
        const localTarget = [this.world.getLocalPlayer()];
        this.allSlots.forEach((slot, index) => {
            const shouldHighlight = !isDeselecting && index === selectedId;
            const color = shouldHighlight ? this.props.selectedColor : this.props.defaultColor;
            slot.fillColor.set(color, localTarget);
        });
    }
    /**
     * Checks if the click was on an empty slot (and not a deselection)
     * @param clickedSlot - The slot that was clicked
     * @param isDeselecting - Whether this is a deselection click
     * @returns True if this is an empty slot click
     */
    isEmptySlotClick(clickedSlot, isDeselecting) {
        return !clickedSlot.filled && !isDeselecting;
    }
    /**
     * Handles clicks on empty slots by immediately deselecting and notifying server
     * @param clickedId - The ID of the empty slot that was clicked
     */
    handleEmptySlotClick(clickedId) {
        const localTarget = [this.world.getLocalPlayer()];
        const serverTarget = [this.world.getServerPlayer()];
        // Visually reset the empty slot after a brief delay
        this.async.setTimeout(() => {
            this.allSlots[clickedId].fillColor.set(this.props.defaultColor, localTarget);
        }, 100);
        // Notify server about deselection of previously selected item
        if (this.selectedIndex !== undefined) {
            this.notifyServerOfSlotSelection(this.selectedIndex, false, serverTarget);
        }
        this.selectedIndex = undefined;
    }
    /**
     * Handles clicks on filled slots, managing selection and server communication
     * @param clickedId - The ID of the filled slot that was clicked
     * @param isDeselecting - Whether this click is deselecting the current slot
     */
    handleFilledSlotClick(clickedId, isDeselecting) {
        const serverTarget = [this.world.getServerPlayer()];
        // Notify server about the new selection state
        this.notifyServerOfSlotSelection(clickedId, !isDeselecting, serverTarget);
        if (!isDeselecting) {
            // If we had a previous selection, notify server it's being deselected
            if (this.selectedIndex !== undefined) {
                this.notifyServerOfSlotSelection(this.selectedIndex, false, serverTarget);
            }
            this.selectedIndex = clickedId;
        }
        else {
            this.selectedIndex = undefined;
        }
    }
    /**
     * Sends a network event to notify the server about slot selection changes
     * @param slotIndex - The index of the slot being selected/deselected
     * @param selected - Whether the slot is being selected (true) or deselected (false)
     * @param serverTarget - The server player target for the network event
     */
    notifyServerOfSlotSelection(slotIndex, selected, serverTarget) {
        this.sendNetworkBroadcastEvent(BigBox_Inventory_Manager_1.InventoryEvents.onSlotSelected, {
            owner: this.world.getLocalPlayer(),
            index: slotIndex,
            selected: selected
        }, serverTarget);
    }
    createAndStoreSlot() {
        let model = new SlotViewModel();
        this.allSlots.push(model);
        return model;
    }
    renderSlotFromData(i, model) {
        const text = ui.Text({
            text: model.label,
            style: {
                fontSize: 20,
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                textShadowColor: 'black',
                textShadowOffset: [2, 2],
                textShadowRadius: 1,
            }
        });
        const pressableSlot = ui.Pressable({
            children: [text],
            style: {
                alignItems: 'center',
                backgroundColor: model.fillColor,
                opacity: 0.9,
                borderRadius: 4,
                borderColor: model.borderColor,
                borderWidth: 2,
                height: this.props.slotSize,
                width: this.props.slotSize,
                justifyContent: 'center',
                flexDirection: 'column',
                marginHorizontal: 2,
            },
            onClick: () => {
                this.onSlotClicked(i);
            }
        });
        return pressableSlot;
    }
    getToolbarView() {
        let children = [];
        for (let i = 0, ii = this.props.slotCount; i < ii; i++) {
            let data = this.createAndStoreSlot();
            let newSlot = this.renderSlotFromData(i, data);
            children.push(newSlot);
        }
        return ui.View({
            children: children,
            style: {
                alignItems: 'flex-start',
                borderRadius: 24,
                flexDirection: 'row',
                width: '50%',
                alignSelf: 'center',
                height: '14%',
                justifyContent: 'center',
                opacity: 1
            }
        });
    }
    initializeUI() {
        if (this.entity.owner.get() === this.world.getServerPlayer()) {
            return ui.View({
                style: { display: "none" }
            });
        }
        const barView = this.getToolbarView();
        return ui.View({
            children: [barView],
            style: {
                position: 'absolute',
                top: "82%",
                backgroundColor: 'clear',
                alignSelf: 'center',
                height: '100%',
            }
        });
    }
}
exports.BigBox_Inventory_UI = BigBox_Inventory_UI;
BigBox_Inventory_UI.propsDefinition = {
    slotSize: { type: hz.PropTypes.Number, default: 80 },
    slotCount: { type: hz.PropTypes.Number, default: 8 },
    defaultColor: { type: hz.PropTypes.Color, default: new core_1.Color(0, 0, 0) },
    selectedColor: { type: hz.PropTypes.Color, default: new core_1.Color(1, 1, 0) },
    defaultBorderColor: { type: hz.PropTypes.Color },
};
hz.Component.register(BigBox_Inventory_UI);
