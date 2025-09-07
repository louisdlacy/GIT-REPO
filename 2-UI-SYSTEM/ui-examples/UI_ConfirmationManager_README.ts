// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

/**
 * # UI_ConfirmationManager (TypeScript)
 *
 * A reusable confirmation dialog for Horizon UI (TypeScript) that lets any script ask
 * a specific player “Are you sure?” and receive a typed yes/no response — fully networked
 * and player-scoped.
 *
 * -----------------------------------------------------
 * ✨ Features
 * -----------------------------------------------------
 * - Strongly-typed events & handlers (TS-first).
 * - Fire-and-forget API: send `ConfirmPanelRequest`; receive `ConfirmationPanelResponse`.
 * - Player-scoped UI: shows only to the targeted `Player` (safe for multiplayer).
 * - Message routing: the original `confirmationMessage` is echoed for easy branching.
 * - Plays nicely with **UI_SimpleButtonEvent** and Code Block Events.
 *
 * -----------------------------------------------------
 * 📦 Contents
 * -----------------------------------------------------
 * - `UI_ConfirmationManager` (UIComponent)
 * - `ConfirmPanelRequest` (NetworkEvent<ConfirmPanelRequestData>)
 * - `ConfirmationPanelResponse` (NetworkEvent<ConfirmationPanelResponseData>)
 * - `button(...)` helper for consistent button visuals
 *
 * -----------------------------------------------------
 * 🧱 Types
 * -----------------------------------------------------
 * ```ts
 * import { Entity, Player } from "horizon/core";
 *
 * export interface ConfirmPanelRequestData {
 *   requester: Entity;            // Entity that will receive the response
 *   player: Player;               // Player to show the panel to
 *   confirmationMessage: string;  // Header text shown to the player
 * }
 *
 * export interface ConfirmationPanelResponseData {
 *   player: Player;               // Player who clicked Confirm/Cancel
 *   message: string;              // Echo of `confirmationMessage`
 *   accepted: boolean;            // true = Confirm, false = Cancel
 * }
 * ```
 *
 * -----------------------------------------------------
 * ⚙️ Props
 * -----------------------------------------------------
 * ```ts
 * // UI_ConfirmationManager.propsDefinition
 * hideOnStart: boolean; // default: true
 * ```
 *
 * -----------------------------------------------------
 * 🛰 Events (typed)
 * -----------------------------------------------------
 * ```ts
 * import { NetworkEvent } from "horizon/core";
 * import { ConfirmPanelRequestData, ConfirmationPanelResponseData } from "UI_ConfirmationManager";
 *
 * export const ConfirmPanelRequest = new NetworkEvent<ConfirmPanelRequestData>("ConfirmPanelRequest");
 *
 * export const ConfirmationPanelResponse = new NetworkEvent<ConfirmationPanelResponseData>("ConfirmationPanelResponse");
 * ```
 *
 * -----------------------------------------------------
 * 🧩 Setup
 * -----------------------------------------------------
 * 1) Add **UI_ConfirmationManager** to your world and (optionally) tag it:
 *    - `Tags: ["UI_ConfirmManager"]`
 *    - Keep `hideOnStart: true` unless you want it visible at spawn.
 *
 * 2) From any script, keep a reference to the manager (tag lookup or serialized reference).
 *
 * -----------------------------------------------------
 * ⚡ Usage (TypeScript)
 * -----------------------------------------------------
 * **Find the manager by tag (safe & typed)**
 * ```ts
 * import { Component, Entity, Player, PropTypes } from "horizon/core";
 *
 * class NeedsConfirm extends Component<typeof NeedsConfirm> {
 *   static propsDefinition = {
 *     confirmationManager: { type: PropTypes.Entity }, // optional serialized reference
 *   };
 *
 *   private confirmationManager!: Entity | undefined;
 *
 *   preStart(): void {
 *     if (!this.props.confirmationManager) {
 *       const managers: Entity[] = this.world.getEntitiesWithTags(["UI_ConfirmManager"]);
 *       this.confirmationManager = managers?.[0];
 *     } else {
 *       this.confirmationManager = this.props.confirmationManager;
 *     }
 *
 *     if (!this.confirmationManager) {
 *       console.error("UI_ConfirmManager not found");
 *     }
 *   }
 * }
 * ```
 *
 * **Request a confirmation**
 * ```ts
 * import { ConfirmPanelRequest } from "UI_ConfirmationManager";
 *
 * private requestConfirmation(player: Player, text: string): void {
 *   if (!this.confirmationManager) return;
 *
 *   this.sendNetworkEvent(this.confirmationManager, ConfirmPanelRequest, {
 *     requester: this.entity,
 *     player,
 *     confirmationMessage: text,
 *   });
 * }
 * ```
 *
 * **Listen for the response**
 * ```ts
 * import { ConfirmationPanelResponse, ConfirmationPanelResponseData } from "UI_ConfirmationManager";
 *
 * preStart(): void {
 *   this.connectNetworkEvent<ConfirmationPanelResponseData>(
 *     this.entity,
 *     ConfirmationPanelResponse,
 *     (data) => {
 *       const { player, message, accepted } = data;
 *       if (message === "Make the sphere red?" && accepted) {
 *         // do the thing for `player`
 *       }
 *     }
 *   );
 * }
 * ```
 *
 * **Use with UI_SimpleButtonEvent**
 * ```ts
 * import { simpleButtonEvent } from "UI_SimpleButtonEvent";
 *
 * preStart(): void {
 *   this.connectNetworkEvent(this.entity, simpleButtonEvent, ({ player }: { player: Player }) => {
 *     this.requestConfirmation(player, "Proceed with action?");
 *   });
 * }
 * ```
 *
 * -----------------------------------------------------
 * 🧪 Example (included)
 * -----------------------------------------------------
 * `UI_ConfirmationManager_Ex` demonstrates:
 * - Prompt on trigger enter (Code Block Events).
 * - Prompt on **UI_SimpleButtonEvent**.
 * - Branching behavior on `message` and `accepted`.
 *
 * Key snippet:
 * ```ts
 * private readonly sphereRedMsg: string = "Make the sphere red?";
 * private readonly sphereBlueMsg: string = "Make the sphere blue?";
 *
 * this.connectNetworkEvent(this.entity, ConfirmationPanelResponse, (data) => {
 *   switch (data.message) {
 *     case this.sphereRedMsg:
 *       if (data.accepted) this.makeSphereRed(data.player);
 *       break;
 *     case this.sphereBlueMsg:
 *       if (data.accepted) this.makeSphereBlue(data.player);
 *       break;
 *   }
 * });
 * ```
 *
 * -----------------------------------------------------
 * 🎛 Customization (typed bindings & style)
 * -----------------------------------------------------
 * - Header text comes from each request (`confirmationMessage`) and is bound to `bndHeaderText: Binding<string>`.
 * - Visibility is controlled with `bndDisplay: Binding<string>` (`"flex"` / `"none"`), scoped per player.
 * - Buttons use `button(text: Binding<string>, fontSize: Binding<number>, scale: Binding<number>)`.
 * - Panel & text styling live in `initializeUI()`; all are standard Horizon UI style props:
 *   ```ts
 *   // Example tweak: bigger panel + larger buttons
 *   // width/height, font size, lineHeight, border, etc.
 *   ```
 *
 * -----------------------------------------------------
 * 👥 Multiplayer Notes
 * -----------------------------------------------------
 * - The panel shows only to the specified `player` in the request.
 * - Internally, the manager tracks per-player state with a `Map<Player, { entity: Entity; message: string }>` to prevent collisions.
 * - Always send a stable `confirmationMessage` so your response handler can branch reliably.
 *
 * -----------------------------------------------------
 * 🧰 Troubleshooting
 * -----------------------------------------------------
 * - **No panel appears** → Ensure `player` is valid and your manager reference isn’t `undefined`.
 * - **No response** → Listen on the same `requester` entity you included in the request.
 * - **Multiple managers** → Prefer a serialized reference over tag lookup, or disambiguate by additional tags.
 * - **Z-fight/overlap** → Adjust `zIndex`, `position`, and anchoring (`layoutOrigin`, `left`, `top`).
 *
 * -----------------------------------------------------
 * 🔗 Plays Nice With
 * -----------------------------------------------------
 * - **UI_SimpleButtonEvent**: confirm user intent before executing actions.
 * - **Code Block Events**: gate trigger interactions with a confirmation.
 *
 * -----------------------------------------------------
 * 📜 License
 * -----------------------------------------------------
 * MIT © Dave Mills (uRocketLife)
 */
