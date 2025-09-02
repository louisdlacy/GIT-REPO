// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.

/**
 * # UI_NotificationManager
 *
 * A versatile notification system for Horizon that displays animated, customizable notification messages to players.
 * Perfect for alerts, tutorials, achievement toasts, or playful in-game feedback. 
 * Can be triggered programmatically or connected to a `UI_SimpleButtonEvent` for interactive testing.
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Show notifications with text and optional image for individual players or all players.
 * - Smooth slide-in / slide-out animation with adjustable easing (supports all `Easing` types).
 * - Easily configurable panel size, colors, and visibility behavior.
 * - Compatible with `UI_SimpleButtonEvent` for quick testing or cycling through easing types in-world.
 * - Supports targeted recipients: send notifications to one player, a group, or everyone.
 *
 * -----------------------------------------------------
 * ⚡ Usage
 * -----------------------------------------------------
 * 1. **Register and Trigger Notification Events:**
 *
 *    Import `NotificationEvent` and send it to the `UI_NotificationManager` entity:
 *
 *    ```ts
 *    import { NotificationEvent } from "UI_NotificationManager";
 *
 *    this.sendNetworkEvent(notificationManagerEntity, NotificationEvent, {
 *      message: "You've unlocked Level 2!",
 *      players: [], // empty array = show to everyone
 *      imageAssetId: null, // optional image asset
 *    });
 *    ```
 *
 * 2. **Optional: Connect to a UI Simple Button for testing**
 *
 *    Assign the `UI_NotificationManager` entity to the `targetEntity` property of a `UI_SimpleButtonEvent`.
 *    Pressing the button will cycle through easing types and display them as notifications.
 *
 * -----------------------------------------------------
 * 🧪 Example
 * -----------------------------------------------------
 * Example script `UI_NotificationManager_Ex1.ts` triggers notifications when a player enters a trigger:
 *
 * ```ts
 * this.connectCodeBlockEvent(
 *   this.entity,
 *   CodeBlockEvents.OnPlayerEnterTrigger,
 *   (player) => {
 *     this.sendNetworkEvent(this.notificationManager, NotificationEvent, {
 *       message: `${player.name.get()} entered the zone!`,
 *       players: [player], // show only to this player
 *       imageAssetId: null,
 *     });
 *   }
 * );
 * ```
 *
 * -----------------------------------------------------
 * 🎛 Customization
 * -----------------------------------------------------
 * - Change `panelHeight`, `panelWidth`, background color, and border radius for a custom look.
 * - Provide a default `notificationImg` in props for a persistent icon.
 * - Customize easing behavior by modifying the `this.easing` property.
 * - Adjust animation duration, delay, and direction in `showNotification()`.
 *
 * -----------------------------------------------------
 * 📜 License
 * -----------------------------------------------------
 * MIT © Dave Mills (RocketTrouble)
 */
