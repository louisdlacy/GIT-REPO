"use strict";
// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.
/**
 * # UI_PopupManager
 *
 * A clean, reusable popup system for Horizon that shows animated, per-player popups
 * with a title, message, and an “OK” button. Built for plug-and-play use in any
 * world, it pairs perfectly with **UI_SimpleButtonEvent** to trigger popups from UI.
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Per-player popups (network-safe): each player sees only their own popup.
 * - Simple API: fire a `PopupRequest`, listen for a `PopupResponse`.
 * - Animated show/hide using `AnimatedBinding` + `Animation.sequence`.
 * - Dynamic content: set title/message per request.
 * - Optional watermark image (brand, icon, reward art).
 * - Works great with **UI_SimpleButtonEvent** (one-click demo wiring included).
 * - Example trigger & example integration scripts included.
 *
 * -----------------------------------------------------
 * 📦 What’s Included
 * -----------------------------------------------------
 * - `UI_PopupManager` (UIComponent)
 * - `PopupRequest` / `PopupResponse` NetworkEvents
 * - `UI_PopupManager_Trigger` (example trigger on player enter)
 * - `UI_PopupManager_Ex1` (example integration cycling through messages)
 * - `button(...)` helper for the “OK” pressable
 *
 * -----------------------------------------------------
 * 🧩 Props
 * -----------------------------------------------------
 * - `enabled: boolean = true` — Toggles the component on/off.
 * - `hideOnStart: boolean = false` — If true, hides the popup panel at start.
 * - `defaultWatermark: Asset` — Optional texture used as a semi-transparent watermark.
 *
 * -----------------------------------------------------
 * 🔗 Events API
 * -----------------------------------------------------
 * ```ts
 * // Request a popup for a specific player (and tell the manager who asked)
 * export const PopupRequest = new NetworkEvent<{
 *   requester: Entity;      // who wants to know when it's closed
 *   player: Player;         // who should see the popup
 *   title: string;          // popup header text
 *   message: string;        // popup body text
 * }>("PopupRequest");
 *
 * // Fired back to the requester when the player closes the popup
 * export const PopupResponse = new NetworkEvent<{ player: Player }>("PopupResponse");
 * ```
 *
 * -----------------------------------------------------
 * ⚡ Quick Start
 * -----------------------------------------------------
 * 1) **Place** a `UI_PopupManager` entity in your scene and tag it `"UI_PopupManager"`.
 * 2) **Optionally set** `defaultWatermark` and `hideOnStart` in the Inspector.
 * 3) **From any script**, send a `PopupRequest` to the manager:
 *
 * ```ts
 * // Example: find the manager by tag, then request a popup
 * preStart() {
 *   this.popupManager = this.world.getEntitiesWithTags(["UI_PopupManager"])[0];
 * }
 *
 * showCongrats(player: Player) {
 *   this.sendNetworkEvent(this.popupManager, PopupRequest, {
 *     requester: this.entity,
 *     player,
 *     title: "Level Up!",
 *     message: "Nice work — you reached the next level!"
 *   });
 * }
 * ```
 *
 * 4) **Listen for close** with `PopupResponse` on the requesting entity:
 *
 * ```ts
 * preStart() {
 *   this.connectNetworkEvent(this.entity, PopupResponse, ({ player }) => {
 *     // Do something when the player taps OK (play VFX, grant reward, etc.)
 *     console.log(`${player.name.get()} closed the popup.`);
 *   });
 * }
 * ```
 *
 * -----------------------------------------------------
 * 🖱️ Works with UI_SimpleButtonEvent
 * -----------------------------------------------------
 * Trigger a popup from a **UI Simple Button** with no extra wiring:
 *
 * ```ts
 * import { simpleButtonEvent } from "UI_SimpleButtonEvent";
 *
 * preStart() {
 *   // When the UI button is pressed, open a popup for the presser
 *   this.connectNetworkEvent(this.entity, simpleButtonEvent, ({ player }) => {
 *     this.sendNetworkEvent(this.popupManager, PopupRequest, {
 *       requester: this.entity,
 *       player,
 *       title: "Simple Button!",
 *       message: "This popup was launched by the Simple Button asset."
 *     });
 *   });
 * }
 * ```
 *
 * -----------------------------------------------------
 * 🧪 Included Examples
 * -----------------------------------------------------
 * - **UI_PopupManager_Trigger**
 *   Fires a popup when a player enters a trigger and listens for `PopupResponse`
 *   to (optionally) play a VFX.
 *
 * - **UI_PopupManager_Ex1**
 *   Cycles through several themed popups when `simpleButtonEvent` is received.
 *
 * -----------------------------------------------------
 * 🎛 Customization Tips
 * -----------------------------------------------------
 * - **Styling:** Adjust the main `View` style (borderRadius, background, width/height).
 * - **Animation:** Tweak `Easing` and `duration` values in `showPopup`/`hidePopup`.
 * - **Button:** Modify `button(...)` helper (font, border, scale feedback).
 * - **Watermark:** Set `defaultWatermark` for subtle branding; opacity/size are editable.
 * - **Layout:** Title/content positions use absolute layout; adjust `top/height/padding`.
 *
 * -----------------------------------------------------
 * 🧠 Behavior Notes
 * -----------------------------------------------------
 * - The manager keeps a `requestResponseMap` so each `PopupResponse` is routed
 *   to the correct requesting entity for the specific player who closed it.
 * - `hideOnStart`: when true, the popup panel is hidden until `showPopup` is called.
 * - All bindings (`title`, `message`, visibility) are set **per player**.
 *
 * -----------------------------------------------------
 * 🛠️ Troubleshooting
 * -----------------------------------------------------
 * - **“Popup Manager not found”** — Ensure the manager entity exists and is tagged `"UI_PopupManager"`.
 * - **No response received** — Your requesting entity must connect to `PopupResponse`
 *   *and* include itself as `requester` in the `PopupRequest`.
 * - **Watermark not visible** — Check that `defaultWatermark` is assigned and your style
 *   (opacity/width/right/bottom) isn’t hiding it.
 *
 * -----------------------------------------------------
 * 📜 License
 * -----------------------------------------------------
 * MIT © Dave Mills (RocketTrouble)
 */
