/**
 * # UI_ProgressBar
 *
 * A multiplayer-compatible progress bar for Horizon Worlds TypeScript.
 * Each player sees their own progress (stored in a `Map<Player, number>`).
 * By default the bar auto-fills from 0 → 100% in a loop. If paired with the
 * **UI Simple Button** asset, button presses interrupt autofill and add +1%
 * to the *pressing player’s* progress per click.
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Multiplayer-aware: per-player progress via `Map<Player, number>`.
 * - Per-player UI updates using `Binding.set(value, [player])`.
 * - Auto-fill loop (100 ms tick) that wraps back to 0 after 100%.
 * - Optional button mode with `simpleButtonEvent` integration (+1% per click).
 * - Simple API: `setProgress(player, value)` and `showUI(show)`.
 * - Easy styling: change colors, size, border radius in one place.
 *
 * -----------------------------------------------------
 * ⚡ Usage
 * -----------------------------------------------------
 * 1) Adjust the component to fit your style:
 *
 *    - Modify colors, sizes, and fonts in the `hudItem` method.
 *    - Change the outer container's `style` for placement and sizing.
 *
 * 2) (Optional) Wire up the Simple Button to interrupt autofill and increment:
 *
 *    ```ts
 *    import { simpleButtonEvent } from "UI_SimpleButtonEvent";
 *    import { Player } from "horizon/core";
 *
 *    preStart() {
 *      this.connectNetworkEvent(this.entity, simpleButtonEvent, (data: { player: Player }) => {
 *        // Interrupt is handled internally; just advance this player by +1
 *        const bar = this.entity.getComponent(UI_ProgressBar);
 *        const curr = (bar as any).playerProgressMap?.get?.(data.player) ?? 0;
 *        bar.setProgress(data.player, curr);
 *      });
 *    }
 *    ```
 *
 * When a player presses the button, the event includes the `player` who pressed it.
 * The progress bar updates only for that player.
 *
 * -----------------------------------------------------
 * 🔧 API
 * -----------------------------------------------------
 * **Props**
 * - `enabled: boolean` — default `true`; hides the UI at start when `false`.
 *
 * **Methods**
 * - `setProgress(player: Player, progress: number)` — Adds +1% (wraps to 0 after 100).
 * - `showUI(show: boolean)` — Shows/hides the entire progress bar.
 *
 * **Lifecycle / Events**
 * - `OnPlayerEnterWorld` — player is added with progress `0`; autofill (re)starts.
 * - `OnPlayerExitWorld` — player entry is removed.
 * - `simpleButtonEvent` — interrupts autofill and increments the clicking player by +1%.
 *
 * -----------------------------------------------------
 * 🎛 Customization
 * -----------------------------------------------------
 * - **Colors & fonts:** edit styles in `hudItem` (fill color, label color, font).
 * - **Shape:** adjust `borderRadius` (default `20`) for the track container.
 * - **Size / placement:** outer container uses absolute positioning; tweak `width`, `height`, `left`, `marginTop`, `zIndex`.
 * - **Timing:** change the autofill tick interval (default `100 ms`) in `autoIncreaseProgress()`.
 * - **Increment logic:** inside `setProgress`, replace wrap logic with clamp if desired:
 *
 *   ```ts
 *   // Wrap → Clamp
 *   progress = Math.min(100, progress + increment);
 *   ```
 *
 * -----------------------------------------------------
 * 🧩 Multiplayer Notes
 * -----------------------------------------------------
 * - Progress is tracked per player in `playerProgressMap`.
 * - Bindings update with a player scope: `binding.set(value, [player])`.
 * - Each client only sees their own progress and label percentage.
 *
 * -----------------------------------------------------
 * 🚑 Troubleshooting
 * -----------------------------------------------------
 * - Fill/label out of sync? Ensure both bindings use `%` strings and call `set(value, [player])`.
 * - Everyone sees the same value? Pass the correct `player` to `setProgress` and binding `set`.
 * - Autofill won’t stop? Confirm the timeout is cleared when button events fire or when disabling the component.
 *
 * -----------------------------------------------------
 * 📜 License
 * -----------------------------------------------------
 * MIT © Dave Mills (RocketTrouble)
 */
