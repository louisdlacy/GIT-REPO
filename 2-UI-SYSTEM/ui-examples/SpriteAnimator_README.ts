/**
 * // Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.
 *
 * # UI_SpriteAnimator — README
 *
 * A flexible sprite-sheet animator for Horizon Custom UI. Feed it a sprite sheet,
 * point it to a character’s animation map (Idle, Walk, Attack, etc.), and it will animate
 * by shifting a single `Image` across the sheet. Non-looping clips (e.g., Attack, Hurt)
 * automatically return to `Idle` when finished.
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Sprite-sheet animation via UI bindings (translateX / translateY).
 * - Character/animation catalogs (`CharacterMap`) with per-clip settings.
 * - Auto-fallback to `Idle` after non-looping clips.
 * - Programmatic control: move, face direction (flip X), play arbitrary clips.
 * - Lightweight timing with `async.setTimeout`; slight randomization to stagger updates.
 *
 * -----------------------------------------------------
 * 🧩 Props
 * -----------------------------------------------------
 * - `enabled: boolean` — Toggle visibility & logic.
 * - `characterMapKey: "Mon1" | "Mon4" | "Pig" | string` — Which character to load.
 * - `animatedImg: TextureAsset` — Sprite sheet texture.
 * - `cellCountX: number` — Total columns in the sheet (including blanks).
 * - `cellCountY: number` — Total rows in the sheet (including blanks).
 * - `fps: number` — Frames per second.
 * - `panelWidth: number` — Pixel width of a single cell (also used to compute shifts).
 * - `offset: Vec3` — UI position & scale: `(x%, y%, zScale)`.  
 *   - `x`/`y` expressed as percentages of the screen; `z` is used as **scale**.
 *
 * -----------------------------------------------------
 * 🗂️ Character & Animation Maps
 * -----------------------------------------------------
 * Each animation is defined as:
 * ```ts
 * type SpriteAnimationSettings = {
 *   animID: string;      // Unique animation identifier
 *   firstFrame: number;  // Inclusive start frame index
 *   lastFrame: number;   // Inclusive end frame index
 *   yRow: number;        // Row index on the sheet (0 = top row)
 *   xOffset: number;     // Horizontal frame offset (columns to skip before firstFrame)
 *   loop: boolean;       // Should the clip loop?
 * };
 * ```
 * - Frames are **0-based** and `lastFrame` is **inclusive**.
 * - `yRow` selects the horizontal strip; `xOffset` shifts the clip start within that row.
 * - Add new characters by extending `CharacterMap` with your own `Record<string, SpriteAnimationSettings>`.
 *
 * -----------------------------------------------------
 * 🚀 Quick Start
 * -----------------------------------------------------
 * 1) Assign your sprite sheet texture to `animatedImg` and set the correct `cellCountX/Y`.
 * 2) Choose a `characterMapKey` that exists in `CharacterMap` (e.g., "Mon1").
 * 3) At `start()`, the first animation key (typically `Idle`) auto-plays.
 *
 * Example (programmatic control):
 * ```ts
 * // Play a specific clip from another script:
 * const animator = this.findComponent(UI_SpriteAnimator);
 * animator?.tryPlaySprite("Mon4", "Attack");
 *
 * // Move and face right; auto-plays Walk if available, else Jump; Idle when isIdle=true:
 * animator?.moveSprite(new Vec3(10, 0, 15), isIdle= false, plusXFacing= true);
 *
 * // Change scale at runtime:
 * animator?.setCharScale(1.25);
 * ```
 *
 * Example (trigger via networked button event):
 * ```ts
 * // This component is already listening for: sysEvents.simpleButtonEvent
 * // Each press cycles through the current character's animation keys.
 * // (Useful for quick testing of all clips.)
 * ```
 *
 * -----------------------------------------------------
 * 🔧 Public API (most relevant)
 * -----------------------------------------------------
 * - `moveSprite(position: Vec3, isIdle: boolean, plusXFacing: boolean): void`
 *   - Updates on-screen position (as %), flips horizontally when `plusXFacing=false`,
 *     and plays `Walk` (or `Jump` fallback) when `isIdle=false`, else `Idle`.
 *
 * - `tryPlaySprite(charMap: string, animID: string): void`
 *   - Plays a specific animation by character & clip ID (e.g., `"Pig", "Attack"`).
 *
 * - `setCharScale(scale: number): void`
 *   - Adjusts runtime scale; initial scale also comes from `offset.z`.
 *
 * -----------------------------------------------------
 * 🧠 How the Animation Works
 * -----------------------------------------------------
 * - Renders a single `Image` whose size is the full sheet (`cellCountX * 100%`, `cellCountY * 100%`).
 * - A viewport container (with `overflow: "hidden"`) masks to one cell.
 * - On each tick, the script shifts the image by whole-cell widths/heights:
 *   - `translateX = -((currentFrame - firstFrame) + xOffset) * panelWidth`
 *   - `translateY = -(yRow * panelWidth)` — assuming square cells (panelWidth × panelWidth).
 * - When a non-looping clip completes, `Idle` is auto-played (if present).
 *
 * -----------------------------------------------------
 * 🧭 Coordinate Helpers (optional)
 * -----------------------------------------------------
 * - `roundPosition(Vec3)`: rounds XYZ to integers (helps grid-snapping).
 * - `convertPosWorldToScreen(Vec3)`: converts a world position to % screen coords.
 *
 * -----------------------------------------------------
 * 🐞 Troubleshooting
 * -----------------------------------------------------
 * - **Sprite misaligned / wrong frame:** Verify `panelWidth`, `cellCountX/Y`, and that your
 *   cells are square. Check `firstFrame/lastFrame/yRow/xOffset` against your sheet.
 * - **Nothing animates:** Ensure `enabled=true`, a valid `animatedImg` is set, and `characterMapKey`
 *   exists in `CharacterMap`. Check console for "not found" errors.
 * - **Non-looping clips feel “stuck”:** By design, the component prevents interrupting a
 *   currently playing non-looping clip. It will return to `Idle` on completion.
 *
 * -----------------------------------------------------
 * 📦 Extending with Your Own Character
 * -----------------------------------------------------
 * ```ts
 * export const MyHero: Record<string, SpriteAnimationSettings> = {
 *   Idle:   { animID: "MyHero_Idle",   firstFrame: 0, lastFrame: 3, yRow: 0, xOffset: 0, loop: true },
 *   Walk:   { animID: "MyHero_Walk",   firstFrame: 0, lastFrame: 5, yRow: 1, xOffset: 0, loop: true },
 *   Attack: { animID: "MyHero_Attack", firstFrame: 0, lastFrame: 7, yRow: 2, xOffset: 0, loop: false },
 * };
 *
 * export const CharacterMap = {
 *   ...CharacterMap,
 *   MyHero,
 * };
 * ```
 *
 * -----------------------------------------------------
 * ⚙️ Performance Notes
 * -----------------------------------------------------
 * - Keep `fps` modest (e.g., 6–12) for UI friendliness.
 * - Use the provided random offset to slightly desync many animators on screen.
 * - Prefer compact sheets; large textures cost memory and layout time.
 *
 * -----------------------------------------------------
 * ✅ Known Good Defaults
 * -----------------------------------------------------
 * - `fps: 6–10`
 * - `panelWidth`: the exact pixel width of one cell
 * - `offset`: e.g., `(50, 50, 1)` to center & use 1× scale
 *
 * Enjoy animating! 🐷⚔️
 */
