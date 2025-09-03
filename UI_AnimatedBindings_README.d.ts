/**
 * # UI_AnimatedBindings
 *
 * A hands-on demo of Horizon Custom UI animations using `AnimatedBinding`.
 * It showcases:
 * - **Translate** (Y), **Rotate**, **Scale**, and **Opacity**
 * - **Sequences & delays** with `Animation.sequence` / `Animation.delay`
 * - **Easing** variants (normal / `Easing.in` / `Easing.inOut`)
 * - A pressable **“Animate Bindings”** button with tap feedback
 * - Optional compatibility with **UI_SimpleButtonEvent** to cycle easing types live
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Drop-in component: attach to an Entity and assign a texture to `animatedImg`.
 * - Auto-plays an animation **on player enter** (via `CodeBlockEvents.OnPlayerEnterWorld`).
 * - Clean examples of `AnimatedBinding.set(...)` using:
 *   - `Animation.timing(...)` for translate/rotate/scale
 *   - `Animation.sequence(...)` + `Animation.delay(...)` for opacity
 * - Built-in **easing explorer**: hook up the `UI Simple Button` and quickly cycle
 *   through `linear`, `ease`, `quad`, `cubic`, `poly(4)`, `sin`, `exp`, `circle`,
 *   `bounce`, `back`, and `elastic(2)`.
 * - Centered, square UI container with helpful layout patterns (`layoutOrigin`, `aspectRatio`, absolute positioning).
 *
 * -----------------------------------------------------
 * ⚡ Quick Start
 * -----------------------------------------------------
 * 1) Add **UI_AnimatedBindings** to an Entity.
 * 2) In **Props**, set:
 *    - `enabled`: `true`
 *    - `animatedImg`: a Texture asset to animate (required)
 * 3) Press **Play**. You’ll see:
 *    - The image **translates up**, **rotates**, **scales**, and **fades** using a sequence.
 *    - A green **“Animate Bindings”** button that replays the full sequence on press.
 *
 * -----------------------------------------------------
 * 🔁 Optional: Easing Explorer (UI Simple Button)
 * -----------------------------------------------------
 * This script listens for `simpleButtonEvent` and cycles the easing mode each time it’s received.
 * Connect the **UI Simple Button** asset (by RocketTrouble) to this entity:
 *
 * - In the **UI Simple Button** inspector, set **Target Entity** to the entity running **UI_AnimatedBindings**.
 * - Each press will:
 *   - Cycle the easing **type** (through `easeTypes`)
 *   - Cycle the easing **variation**: normal → `Easing.in(...)` → `Easing.inOut(...)`
 *   - Display the current easing label in the orange pill at the bottom of the screen
 *   - Trigger a **spin** using the selected easing
 *
 *
 * -----------------------------------------------------
 * 🧩 Props
 * -----------------------------------------------------
 * | Prop         | Type                 | Default | Description                                  |
 * |--------------|----------------------|---------|----------------------------------------------|
 * | `enabled`    | `boolean`            | `true`  | Toggles the UI on/off for this component.    |
 * | `animatedImg`| `Asset` (Texture)    | —       | The texture to animate (required).           |
 *
 * -----------------------------------------------------
 * 🛠 Public Behavior (callable if needed)
 * -----------------------------------------------------
 * - `startAnimation(player: Player)`: Resets bindings, then runs the demo:
 *   translate (Y), rotate (0→360), scale (1→2), opacity sequence (1→0.5→1).
 * - `swapEaseType(player: Player)`: Advances to the next easing type/variation, updates the on-screen label, then calls `spin(...)`.
 * - `spin(player: Player, ease: Easing, easeVariation: number)`: Runs a 0→360 rotation with the selected easing.
 *
 *
 * -----------------------------------------------------
 * 🎛 Customization Tips
 * -----------------------------------------------------
 * - **Speed & feel**: change `duration` and `easing` on each `Animation.timing(...)`.
 * - **Distance**: adjust the translate target (e.g., `-100` → `-200` for more travel).
 * - **Scale**: tweak `1 → 2` to any range (e.g., `0.75 → 1.5`).
 * - **Opacity rhythm**: modify the sequence order or add more steps/delays.
 * - **Layout**: the root view uses `aspectRatio: 1`, `layoutOrigin: [0.5, 0.5]`,
 *   and `position: "absolute"` centered at `left: "50%"`, `top: "50%"`.
 *   Change these if you want a non-square or non-centered demo.
 * - **Pressed feedback**: the green button uses a quick scale-down then reset;
 *   edit the `setTimeout` and scale values for snappier or gentler feedback.
 *
 * -----------------------------------------------------
 * 🧯 Troubleshooting
 * -----------------------------------------------------
 * - **Nothing visible / no motion**: Ensure `animatedImg` is assigned, and `enabled` is `true`.
 * - **Easing label never appears**: The label is shown only after `swapEaseType(...)` runs.
 *   Use the **UI Simple Button** or call `swapEaseType(player)` yourself.
 * - **UI overlaps other elements unexpectedly**: The container is `position: "absolute"` and centered.
 *   Adjust `position`, `left/top`, or remove `aspectRatio` to fit your layout.
 *
 * -----------------------------------------------------
 * 📚 Related Docs
 * -----------------------------------------------------
 * Meta Horizon Worlds — Custom UI Animations:
 * https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/custom-ui/animations-for-custom-ui
 *
 * -----------------------------------------------------
 * 🧾 License
 * -----------------------------------------------------
 * MIT © Dave Mills (RocketTrouble)
 */
