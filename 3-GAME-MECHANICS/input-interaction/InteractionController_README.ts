// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.
/**
 * # InteractionController — README
 *
 * A focused-interaction & camera helper for Horizon Worlds. This component:
 * - Toggles Focused Interaction Mode via a custom input.
 * - Switches between First-Person and Third-Person cameras with easing.
 * - Listens for focused interaction input (start/move/end) and performs selection raycasts.
 * - Emits a `damageEvent` to any hit entity tagged `"damageable"`.
 *
 * -----------------------------------------------------
 * ✅ Features
 * -----------------------------------------------------
 * - **Focus Mode Toggle**: Enter/exit Focused Interaction Mode with the Simple Button asset or RightPrimary input.
 * - **Camera Modes**: Local camera transitions (first ↔ third person) using `CameraTransitionOptions`.
 * - **Raycast Selection**: Uses a provided `RaycastGizmo` to hit-test world entities from focused input rays.
 * - **Damage Pipeline**: Sends a typed `NetworkEvent` to damageable targets.
 * - **Customizable UX**: Override Focused Interaction tap/trail options via `sysEvents`.
 * - **Debug Logging**: Optional, controlled by `showDebugs`.
 *
 * -----------------------------------------------------
 * 🧩 Props
 * -----------------------------------------------------
 * - `selectionRaycast: Entity`  
 *   Entity that has/serves as a `RaycastGizmo` used for selection checks.
 *
 * -----------------------------------------------------
 * 🔁 Lifecycle Summary
 * -----------------------------------------------------
 * - `preStart()`: Early setup on local clients (no-op for server owner). Binds:
 *   - Focus mode toggle (UI_SimpleButtonEvent).
 *   - Focused Interaction input events (start/move/end).
 *   - Custom input (RightPrimary) for FP/TP camera toggle (non-VR only).
 *   - Handlers for tap/trail option updates (via `sysEvents`).
 * - `start()`: Resolves `selectionRaycast` into a `RaycastGizmo`.
 *
 * -----------------------------------------------------
 * 🎮 Controls & Interactions
 * -----------------------------------------------------
 * - **UI Simple Button**: Emits `simpleButtonEvent` to toggle Focus Mode on this controller's owner.
 * - **RightPrimary (non-VR)**: Switch between First-Person / Third-Person and auto-toggle Focus Mode.
 * - **Focused Interaction Input**:
 *   - `onFocusedInteractionInputStarted` → raycast selection; if `"damageable"`, sends `damageEvent`.
 *   - `onFocusedInteractionInputMoved` → hook point for drag/hover behaviors (currently placeholder).
 *   - `onFocusedInteractionInputEnded` → hook point for drop/commit logic (currently placeholder).
 *
 * -----------------------------------------------------
 * 🧪 Tags & Conventions
 * -----------------------------------------------------
 * - Target entities that should react to hits must include the tag: `"damageable"`.
 * - The first interaction index (`interactionIndex === 0`) is treated as the primary pointer/touch.
 *
 * -----------------------------------------------------
 * 🔔 Events
 * -----------------------------------------------------
 * - **Network Outbound**
 *   - `damageEvent: NetworkEvent<{ player: Player; damage: number }>`  
 *     Fired at the hit `"damageable"` entity on input start. Default damage = `10`.
 *
 * - **Local/Network Inbound**
 *   - `simpleButtonEvent` (from `UI_SimpleButtonEvent`) → toggles Focus Mode.
 *   - `sysEvents.OnSetFocusedInteractionTapOptions`  
 *     `{ enabled: boolean; tapOptions: Partial<FocusedInteractionTapOptions> }`
 *   - `sysEvents.OnSetFocusedInteractionTrailOptions`  
 *     `{ enabled: boolean; trailOptions: Partial<FocusedInteractionTrailOptions> }`
 *
 * -----------------------------------------------------
 * ⚙️ Setup
 * -----------------------------------------------------
 * 1) **Add the Script**
 *    Attach `InteractionController` to a user-owned entity (e.g., a player-scoped controller).
 *
 * 2) **Wire the Raycast Gizmo**
 *    - Create/assign an entity in scene with/that provides `RaycastGizmo`.
 *    - Drag that entity into `selectionRaycast` on this component.
 *
 *
 * -----------------------------------------------------
 * 🔧 Example: Listening for Damage
 * -----------------------------------------------------
 * ```ts
 * import { Component, NetworkEvent } from "horizon/core";
 * import { damageEvent } from "InteractionController";
 *
 * class Damageable extends Component<typeof Damageable> {
 *   health = 100;
 *
 *   preStart() {
 *     this.connectNetworkEvent(this.entity, damageEvent, ({ player, damage }) => {
 *       this.health = Math.max(0, this.health - damage);
 *       console.log(`Hit by ${player.name.get()} for ${damage}. Health: ${this.health}`);
 *       if (this.health === 0) {
 *         // Handle destroy/respawn/etc.
 *       }
 *     });
 *   }
 * }
 * Component.register(Damageable);
 * ```
 *
 * -----------------------------------------------------
 * ✨ Example: Toggling Focus Mode with Simple Button
 * -----------------------------------------------------
 * - Place a `UI_SimpleButtonEvent` button.
 * - Set its target to the `InteractionController` entity.
 * - Press to enter/exit Focus Mode (on the local owner).  
 *   In non-VR, the RightPrimary input also switches camera + focus.
 *
 * -----------------------------------------------------
 * 🧭 Camera Behavior
 * -----------------------------------------------------
 * - Default transition:
 *   ```ts
 *   { duration: 0.5, easing: Easing.EaseInOut }
 *   ```
 * - Non-VR only for view switching. In VR, a console error is logged.
 *
 * -----------------------------------------------------
 * 🐞 Debugging
 * -----------------------------------------------------
 * - `showDebugs: boolean = true` prints hit information and state changes.
 * - Use `debugLog(show, "...")` for conditional logging.
 *
 * -----------------------------------------------------
 * 🛡️ Gotchas
 * -----------------------------------------------------
 * - The controller early-returns on the server owner; it’s intended for **local player clients**.
 * - Ensure `selectionRaycast` resolves to a valid `RaycastGizmo`.
 * - Only the **first** focused interaction index is processed; multi-touch requires extending handlers.
 *
 * -----------------------------------------------------
 * 📦 Exports
 * -----------------------------------------------------
 * - `InteractionController` (Component)
 * - `damageEvent: NetworkEvent<{ player: Player; damage: number }>`
 * - `debugLog(show: boolean, message: string): void`
 *
 * -----------------------------------------------------
 * 🗓️ Version
 * -----------------------------------------------------
 * - v1.0 — 2025-09-04
 */
