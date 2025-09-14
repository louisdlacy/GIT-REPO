/**
 * PlayerTracker README and Documentation
 * Comprehensive guide for using the PlayerTracker component
 * 
 * @tags: custom-modules, utility, documentation, player, standalone
 * @import-primary: None (documentation file)
 * @cross-refs: PlayerTracker.ts (main implementation)
 */
/**
 * // Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.
 *
 * # PlayerTracker — README (drop-in comment)
 *
 * Tracks the local player's position/aiming state and drives a `UI_SpriteAnimator`
 * so a 2D sprite avatar appears to follow, idle, walk, and face the correct direction.
 * Also listens for lightweight input events (e.g., `attack`) and for trigger volumes
 * to apply damage to nearby NPCs.
 *
 * -----------------------------------------------------
 * ✨ What it does
 * -----------------------------------------------------
 * - Subscribes to `World.onUpdate` and samples player position at ~6 Hz (update throttling).
 * - Converts player world position to screen percentages and forwards it to `UI_SpriteAnimator`.
 * - Detects facing based on X movement (auto-flips horizontally).
 * - Chooses `Idle` when stationary; prefers `Walk`, then `Jump` when moving (via animator API).
 * - Listens for a custom networked input event to play attacks and damage entities in range.
 * - On attach, auto-sets a panning camera mode for the player (optional UX sugar).
 *
 * -----------------------------------------------------
 * 🧩 Props
 * -----------------------------------------------------
 * - `spriteAnimator: Entity` — Entity that has a `UI_SpriteAnimator` component. Required.
 * - `trigger: Entity` — A trigger volume that collects entities in range for attack damage.
 *
 * -----------------------------------------------------
 * 🔌 Events listened to / emitted
 * -----------------------------------------------------
 * - **Lifecycle / Ticking**
 *   - `World.onUpdate` — Internal: throttled to ~6 updates/sec.
 *
 * - **Attachment**
 *   - `AttachEvent` (from `AutoAttachListByTag`)  
 *     When fired with `{ player }`, caches the `Player` and (after 2s) sends:
 *     - `sysEvents.OnSetCameraModePan` with `{ panSpeed, positionOffset }`
 *     - `sysEvents.OnSetCameraCollisionEnabled` with `{ enabled: false }`
 *
 * - **Triggers**
 *   - `CodeBlockEvents.OnEntityEnterTrigger` on `props.trigger`  
 *     Adds entering NPCs with tags `["npc","pig"]` to an internal attack list.
 *   - `CodeBlockEvents.OnEntityExitTrigger` on `props.trigger`  
 *     Removes them when they leave.
 *
 * - **Input**
 *   - `CustomInputEvent<{ action: "attack" | "aim"; pressed: boolean }>` on `this.entity`  
 *     - `"attack"`: plays `"Attack"` on the animator (character `"Mon1"` by default) and
 *       sends `sysEvents.damageEvent` `{ damage, source }` to all entities currently in the trigger list.
 *     - `"aim"`: placeholder hook (example commented out).
 *
 * -----------------------------------------------------
 * 🚀 Quick Start
 * -----------------------------------------------------
 * 1) Drop **PlayerTracker** on any world entity that represents the local player rig/controller.
 * 2) Assign:
 *    - `spriteAnimator` → an entity with `UI_SpriteAnimator` attached (and configured).
 *    - `trigger` → a trigger volume placed around the player (or weapon) for hit detection.
 * 3) Ensure your NPCs you want damageable carry tags: `"npc"` and `"pig"` (or update the checks).
 * 4) Fire `CustomInputEvent` with `{ action:"attack", pressed:true }` to test attacks.
 *
 * Example (sending input from another script):
 * ```ts
 * this.sendNetworkEvent(playerTrackerEntity, CustomInputEvent, { action: "attack", pressed: true });
 * ```
 *
 * -----------------------------------------------------
 * 🔧 How facing & motion are decided
 * -----------------------------------------------------
 * - The component samples the player position and rounds to one decimal place (configurable).
 * - If X decreases past a small buffer (default `0.4`), face negative X; if it increases past
 *   the buffer, face positive X. No change means keep facing.
 * - If the sampled position equals the previous position → **Idle**; else → **Walk** (or **Jump** fallback)
 *   via `UI_SpriteAnimator.moveSprite(curPos, isIdle, isPlusXFacing)`.
 *
 * -----------------------------------------------------
 * 🧠 Collaborators & Dependencies
 * -----------------------------------------------------
 * - `UI_SpriteAnimator` — Drives screen position, idle/walk/jump/attack clips, and flip state.
 * - `AutoAttachListByTag.AttachEvent` — Provides the `Player` reference on spawn/attach.
 * - `sysEvents` — Camera mode pan / collision toggles, and `damageEvent` for NPCs.
 * - `CodeBlockEvents` — Trigger enter/exit hooks.
 *
 * -----------------------------------------------------
 * 🐷 About the Pig example
 * -----------------------------------------------------
 * The sample checks for `["npc","pig"]` tags and enqueues those entities for damage on attack.
 * Replace/extend this with your own faction/role tags or a health interface.
 *
 * -----------------------------------------------------
 * ⚙️ Performance Notes
 * -----------------------------------------------------
 * - Update throttling: the script increments `updateCount` each `onUpdate` and runs logic every 10 ticks
 *   (≈6 Hz @ 60 FPS). Tweak to taste if you need smoother tracking or tighter responsiveness.
 * - Keep the trigger list small and filtered (use tags!) to avoid broadcasting damage widely.
 *
 * -----------------------------------------------------
 * 🧪 Troubleshooting
 * -----------------------------------------------------
 * - **Sprite doesn’t move/flip:** Make sure `spriteAnimator` prop is assigned to the correct entity
 *   and that it actually has `UI_SpriteAnimator`. Check console for “not found” logs.
 * - **No damage dealt:** Confirm your target entities carry the expected tags and that
 *   `CustomInputEvent` with `action:"attack"` is being sent to the **PlayerTracker’s entity**.
 * - **Camera didn’t change:** Verify that `AttachEvent` is firing for the same entity where
 *   `PlayerTracker` is attached; ensure `sysEvents` camera messages are supported in your world.
 *
 * -----------------------------------------------------
 * 🧱 Extending
 * -----------------------------------------------------
 * - Replace tag checks to support multiple enemy types (e.g., `["npc","golem"]`, `["enemy"]`).
 * - Parameterize the buffer used for flip detection and the update throttle interval.
 * - Map `"aim"` to your input system and wire to reticle or animator state.
 * - Forward different movement states (Run, Dash, Fall) by inspecting velocity and selecting
 *   other animator clips (requires those clips to exist in your character maps).
 *
 * Enjoy tracking! 🎯
 */
