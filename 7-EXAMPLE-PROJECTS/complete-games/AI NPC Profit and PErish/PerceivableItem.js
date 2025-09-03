"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
const NPC_Base_1 = require("NPC_Base");
const ContextComponent_1 = require("ContextComponent");
const GameConsts_1 = require("GameConsts");
const GRAB = "GRAB";
/**
 * This class can represent items that can be perceived by NPCs.
 *
 * It tracks NPCs that enter its trigger zone, updates their context when grabbed/released,
 * and moves the trigger in parallel with the object.
 */
class PerceivableItem extends ContextComponent_1.ContextComponent {
    constructor() {
        super(...arguments);
        this.triggeringNPCs = new Map();
        this.heldByRightHand = false;
        this.heldDescription = ``;
        this.lostDescription = ``;
        this.freeDescription = ``;
    }
    preStart() {
        this.enableLogging = GameConsts_1.CONSOLE_LOG_ITEM_PERCEPTION;
        this.heldDescription = `You can see a ${this.props.itemName}. Description: ${this.props.itemDescription}.`; //text about being held added lower down
        this.lostDescription = `You can no longer see the ${this.props.itemName}.`;
        this.freeDescription = `You can see a ${this.props.itemName} it isn't being held by anyone. Description: ${this.props.itemDescription}.`;
        if (this.props.perceptionTrigger) {
            this.connectCodeBlockEvent(this.props.perceptionTrigger, core_1.CodeBlockEvents.OnEntityEnterTrigger, this.addNpcToTriggerList.bind(this));
            this.connectCodeBlockEvent(this.props.perceptionTrigger, core_1.CodeBlockEvents.OnEntityExitTrigger, this.removeNpcFromTriggerList.bind(this));
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
    tellNpcsAboutGrab(isRight, player) {
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
                npc.setContextEntry(this.key + GRAB, this.props.itemName + ` was grabbed by  ${this.playerHoldingItem.name}.`);
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
    tellNpcsAboutRelease(player) {
        let playerName = this.playerHoldingItem.name;
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
    addNpcToTriggerList(entity) {
        let npc = this.findComponentInChildren(entity, NPC_Base_1.NPC_Base);
        if (!npc)
            return;
        let name = npc.entity.parent.get() ? npc.entity.parent.get()?.name.get() : npc.entity.name.get();
        this.log(`Entity ${name} entered the ${this.props.itemName} trigger.`);
        this.triggeringNPCs.set(entity, npc);
        if (this.key == null || this.description == null)
            return;
        if (this.playerHoldingItem) {
            npc.setContextEntry(this.key, this.heldDescription + `\nIt is being held by ${this.playerHoldingItem.name}.`);
        }
        else {
            npc.setContextEntry(this.key, this.freeDescription);
        }
        this.log(`Set context for NPC ${name}: ${this.key}`);
    }
    /**
     * Removes an NPC from the trigger list when they exit the item's trigger zone.
     *
     * @param entity - The entity representing the NPC exiting the trigger zone.
     */
    removeNpcFromTriggerList(entity) {
        let npc = this.triggeringNPCs.get(entity);
        if (!npc)
            return;
        npc.setContextEntry(this.key, this.lostDescription, false);
        this.triggeringNPCs.delete(entity);
        this.log(`Entity ${npc.entity.name.get()} left the ${this.props.itemName} trigger.`);
    }
}
PerceivableItem.propsDefinition = {
    ...ContextComponent_1.ContextComponent.propsDefinition,
    itemName: { type: hz.PropTypes.String, default: "Item" },
    peceptionDistance: { type: hz.PropTypes.Number, default: 10.0 },
    perceptionTrigger: { type: hz.PropTypes.Entity },
    /**
     * When true, the NPC will comment about item being grabbed or released.
     */
    elicitResponseOnGrabChange: { type: hz.PropTypes.Boolean, default: true }
};
hz.Component.register(PerceivableItem);
