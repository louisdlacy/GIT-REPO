import * as hz from 'horizon/core';
import { CodeBlockEvents, Entity } from 'horizon/core';
import { NPC_Base } from 'NPC_Base';
import { ContextComponent } from 'ContextComponent';
import { CONSOLE_LOG_ITEM_PERCEPTION } from 'GameConsts';

const GRAB = "GRAB";

/**
 * This class can represent items that can be perceived by NPCs.
 *
 * It tracks NPCs that enter its trigger zone, updates their context when grabbed/released,
 * and moves the trigger in parallel with the object.
 */
class PerceivableItem extends ContextComponent<typeof PerceivableItem> {
  static propsDefinition = {
    ...ContextComponent.propsDefinition,
    itemName: { type: hz.PropTypes.String, default: "Item" },
    peceptionDistance: { type: hz.PropTypes.Number, default: 10.0 },
    perceptionTrigger: { type: hz.PropTypes.Entity },
    /**
     * When true, the NPC will comment about item being grabbed or released.
     */
    elicitResponseOnGrabChange: { type: hz.PropTypes.Boolean, default: true }
  };

  triggeringNPCs: Map<Entity, NPC_Base> = new Map();
  playerHoldingItem: hz.Player | undefined;
  heldByRightHand: boolean = false;

  heldDescription: string = ``;
  lostDescription: string = ``;
  freeDescription: string = ``;

  preStart() {
    this.enableLogging = CONSOLE_LOG_ITEM_PERCEPTION;

    this.heldDescription = `You can see a ${this.props.itemName}. Description: ${this.props.itemDescription}.`; //text about being held added lower down
    this.lostDescription = `You can no longer see the ${this.props.itemName}.`;
    this.freeDescription = `You can see a ${this.props.itemName} it isn't being held by anyone. Description: ${this.props.itemDescription}.`;

    if (this.props.perceptionTrigger) {
      this.connectCodeBlockEvent(this.props.perceptionTrigger!, CodeBlockEvents.OnEntityEnterTrigger, this.addNpcToTriggerList.bind(this));
      this.connectCodeBlockEvent(this.props.perceptionTrigger!, CodeBlockEvents.OnEntityExitTrigger, this.removeNpcFromTriggerList.bind(this));
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, this.tellNpcsAboutGrab.bind(this));
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, this.tellNpcsAboutRelease.bind(this));
  }

  /**
   * Notifies all tracked NPCs about the item being grabbed.
   *
   * @param isRight - Boolean indicating if the item is held by the right hand.
   * @param player - The player who grabbed the item.
   */
  tellNpcsAboutGrab(isRight: boolean, player: hz.Player) {
    this.playerHoldingItem = player;
    this.heldByRightHand = isRight;
    this.log(`${player?.name} just grabbed the ${this.props.itemName}`);

    // Set context entry for all tracked NPCs when item is grabbed and possibly elicit response
    if (this.key && this.description) {
      this.triggeringNPCs.forEach(npc => {
        if (this.props.elicitResponseOnGrabChange) {
          // First stop & clear the existing context
          npc.askLLMToStopTalking();
        }
        npc.setContextEntry(this.key + GRAB, this.props.itemName + ` was grabbed by  ${this.playerHoldingItem!.name}.`);
        npc.setContextEntry(this.key, this.description, this.props.elicitResponseOnGrabChange);
        this.log(`Set context for NPC ${npc.name}: ${this.key}=${this.description} and elicited response`);
      });
    }
  }

  /**
   * Notifies all tracked NPCs about the item being released.
   *
   * @param player - The player who released the item.
   */
  tellNpcsAboutRelease(player: hz.Player) {
    let playerName = this.playerHoldingItem!.name;
    this.playerHoldingItem = undefined;
    this.log(`${player.name} just released the ${this.props.itemName}`);

    // Set context entry for all tracked NPCs when item is released and possibly elicit response
    if (this.key && this.description) {
      this.triggeringNPCs.forEach(npc => {
        if (this.props.elicitResponseOnGrabChange) {
          // First stop & clear the existing context
          npc.askLLMToStopTalking();
        }
        npc.clearContextEntry(this.key);

        npc.setContextEntry(this.key + GRAB, this.props.itemName + ` was released by  ${playerName}.`, this.props.elicitResponseOnGrabChange);
      });
    }
  }

  /**
   * Adds an NPC to the trigger list when they enter the item's trigger zone.
   *
   * @param entity - The entity representing the NPC entering the trigger zone.
   */
  addNpcToTriggerList(entity: Entity) {
    let npc = this.findComponentInChildren<NPC_Base>(entity, NPC_Base);
    if (!npc) return;

    let name = npc.entity.parent.get() ? npc.entity.parent.get()?.name.get() : npc.entity.name.get();

    this.log(`Entity ${name} entered the ${this.props.itemName} trigger.`);

    this.triggeringNPCs.set(entity, npc);
    if (this.key == null || this.description == null) return;

    if (this.playerHoldingItem) {
      npc.setContextEntry(this.key, this.heldDescription + `\nIt is being held by ${this.playerHoldingItem!.name}.`);
    } else {
      npc.setContextEntry(this.key, this.freeDescription);
    }
    this.log(`Set context for NPC ${name}: ${this.key}`);
  }

  /**
   * Removes an NPC from the trigger list when they exit the item's trigger zone.
   *
   * @param entity - The entity representing the NPC exiting the trigger zone.
   */
  removeNpcFromTriggerList(entity: Entity) {
    let npc = this.triggeringNPCs.get(entity);

    if (!npc) return;

    npc.setContextEntry(this.key, this.lostDescription, false);
    this.triggeringNPCs.delete(entity);
    this.log(`Entity ${npc.entity.name.get()} left the ${this.props.itemName} trigger.`);
  }
}
hz.Component.register(PerceivableItem);
