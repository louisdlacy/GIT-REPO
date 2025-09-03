"use strict";
// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.
/**
 * # UI_SimpleButtonEvent
 *
 * A simple, reusable UI button component that can trigger networked events on any target entity.
 * Useful for testing or triggering actions in scripts that normally require more complex event handling.
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Easily create a clickable UI button in Horizon.
 * - Sends a network event (`simpleButtonEvent`) to a target entity.
 * - Provides visual feedback when pressed (button scales down and resets).
 * - Configurable: toggle visibility, specify target entity.
 * - Example script included to show how to listen and respond.
 * - Example2 script included to demonstrate retargeting recipient.
 *
 * -----------------------------------------------------
 * ⚡ Usage
 * -----------------------------------------------------
 * 1. Import the `simpleButtonEvent` where you want to listen for it:
 *
 *    ```ts
 *    import { simpleButtonEvent } from "UI_SimpleButtonEvent";
 *    ```

 * 2. Subscribe to the event in another script:
 *
 *    ```ts
 *    preStart() {
 *      this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
 *        console.log("Received simpleButtonEvent:", data);
 *        // Do something when the button is pressed
 *      });
 *    }
 *    ```
 *
 * When a player presses the button, the event is sent along with the `player` who pressed it.
 *
 * -----------------------------------------------------
 * 🧪 Example
 * -----------------------------------------------------
 * Example_UISimpleButton.ts toggles the background color when the button is pressed:
 *
 * ```ts
 * preStart() {
 *   this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
 *     console.log("Received simpleButtonEvent:", data);
 *     this.isWhite = !this.isWhite;
 *     this.bndColor.set(this.isWhite ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)");
 *   });
 * }
 * ```
 *
 * -----------------------------------------------------
 * 🎛 Customization
 * -----------------------------------------------------
 * - Change the `Text` and `Pressable` styles for visuals.
 * - Adjust `right`, `bottom`, `width`, `height` for positioning.
 * - Modify press feedback (scale, animation, audio).
 *
 * -----------------------------------------------------
 * 📜 License
 * -----------------------------------------------------
 * MIT © Dave Mills (RocketTrouble)
 */
