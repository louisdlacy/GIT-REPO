import {
  Component,
  PropTypes,
  Entity,
  LocalEvent,
  CodeBlockEvents,
  Player,
  PlayerVisibilityMode,
  TextGizmo,
} from "horizon/core";
import * as hz from "horizon/core";

export class HintManager extends Component<typeof HintManager> {
  static propsDefinition = {
    // Entity-based (world) hints
    hint1: { type: PropTypes.Entity },
    hint2: { type: PropTypes.Entity },
    hint3: { type: PropTypes.Entity },
    hint4: { type: PropTypes.Entity },

    // Text-hint mode (visibility only; we do NOT set text content here)
    useTextHints: { type: PropTypes.Boolean, default: true},
    textGizmo: { type: PropTypes.Entity },
 

    // Purchase SKU (single trigger)
    hintAccessSku: { type: PropTypes.String, default: "hint_access_pass" },

    // Testing toggle: if TRUE, do NOT hide the text gizmo at world start
    testingKeepTextVisible: { type: PropTypes.Boolean, default: false },
  };

  private currentRiddleIndex: number = 0; // set by RiddlePanel

  start() {
    
    this.hideAllHints(); // will skip hiding text gizmo if testingKeepTextVisible=true

    // Track current riddle index (from RiddlePanel)
    this.connectLocalEvent(
      this.entity,
      new hz.LocalEvent<{ riddle: number }>("SetHintIndex"),
      (payload) => {
        this.currentRiddleIndex = payload.riddle;
      }
    );

    // Purchases
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnItemPurchaseComplete,
      (player: Player, skuId: string, success: boolean) =>
        this.onPurchaseHintAccess(skuId, success, player)
    );
  }

  private hideAllHints() {
    // Hide world/mesh hints
    this.getAllHints().forEach((hint) => hint?.visible.set(false));

    // Text gizmo visibility management (no text setting)
    if (this.props.useTextHints && this.props.textGizmo) {
      const tg = this.props.textGizmo.as(TextGizmo);
      if (tg) {
        if (this.props.testingKeepTextVisible) {
          // Testing: do NOT hide it at start
          tg.visible.set(true);
        } else {
          // Normal: start hidden
          tg.visible.set(false);
        }
      }
    }
  }

  private onPurchaseHintAccess(skuId: string, success: boolean, player: Player) {
    if (!success) return;
    if (skuId !== this.props.hintAccessSku) {
      console.warn(`[HintManager] Ignored purchase of unrelated SKU: ${skuId}`);
      return;
    }

    const index = this.currentRiddleIndex;
    if (index < 1 || index > 4) {
      console.warn(`[HintManager] Invalid or unset riddle index (${index}). Cannot show hint.`);
      return;
    }

    // Show the selected entity hint to the purchasing player
    this.showHintEntityToPlayer(index, player);

    // Text-hint visibility (no content changes)
    if (this.props.useTextHints && this.props.textGizmo) {
      const tg = this.props.textGizmo.as(TextGizmo);
      if (tg) {
        if (this.props.testingKeepTextVisible) {
          // Testing: keep it visible for everyone; do nothing
          tg.visible.set(true);
        } else {
          // Normal: show to the purchasing player only
          tg.visible.set(true);
          tg.setVisibilityForPlayers([player], PlayerVisibilityMode.VisibleTo);
        }
      }
    }

    // Optional notify
    const event = new hz.LocalEvent<{ riddle: number; player: Player }>("RevealHint");
    this.sendLocalEvent(player, event, { riddle: index, player });
  }

  private showHintEntityToPlayer(index: number, player: Player) {
    this.getAllHints().forEach((hint, i) => {
      if (!hint) return;
      const isTarget = i === index - 1;

      // Make the hint visible globally first (engine often requires this)
      hint.visible.set(true);

      // Then gate per-player
      hint.setVisibilityForPlayers(
        [player],
        isTarget ? PlayerVisibilityMode.VisibleTo : PlayerVisibilityMode.HiddenFrom
      );
    });
  }

  private getAllHints(): (hz.Entity | undefined)[] {
    return [this.props.hint1, this.props.hint2, this.props.hint3, this.props.hint4];
  }
}

hz.Component.register(HintManager);
