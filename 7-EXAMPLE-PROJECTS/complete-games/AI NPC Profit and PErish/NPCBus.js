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
exports.NPCBus = void 0;
const BaseComponent_1 = require("./BaseComponent");
const NPC_Base_1 = require("./NPC_Base");
const hz = __importStar(require("horizon/core"));
const BaseLogger_1 = require("BaseLogger");
const Events_1 = require("Events");
const GameConsts_1 = require("GameConsts");
/**
 * A class that acts as a central manager for all NPCs in the scene.
 * It provides methods to interact with NPCs collectively.
 */
class NPCBus extends BaseComponent_1.BaseComponent {
    constructor() {
        super(...arguments);
        /**
         * All NPCs registered with the bus
         */
        this.npcs = [];
    }
    /**
     * Gets the singleton instance of the NPCBus
     */
    static get instance() {
        return NPCBus._instance;
    }
    /**
     * Initializes the NPCBus and sets up event listeners
     */
    preStart() {
        this.enableLogging = GameConsts_1.CONSOLE_LOG_NPC_BUS;
        // Check if an instance already exists
        if (NPCBus._instance) {
            this.log(`NPCBus instance already exists. Removing duplicate instance on entity: ${this.entity.name.get()}`, true, BaseLogger_1.LogLevel.Warn);
            // Remove this component to prevent duplicate singletons
            this.dispose();
            return; // Stop further processing of this instance
        }
        // Set this as the singleton instance
        NPCBus._instance = this;
        // Listen for NPC join world events to register NPCs
        this.connectLocalBroadcastEvent(Events_1.Events.onNpcJoinWorld, (data) => {
            this.registerNPC(data.npc);
        });
        // Listen for global context events to set context for all NPCs
        this.connectLocalBroadcastEvent(Events_1.Events.onGloballyPerceivedEvent, (data) => {
            this.log(`Received global context event: ${data.description}`);
            this.addPerceivedEventForAll(data.description);
        });
    }
    /**
     * Registers an NPC with the bus
     * @param npc - The NPC to register
     */
    registerNPC(npc) {
        if (!this.npcs.includes(npc)) {
            this.npcs.push(npc);
            this.log(`Registered NPC: ${npc.name}`);
        }
    }
    /**
     * Starts the NPCBus and finds all NPCs in the scene
     */
    start() {
        super.start();
        this.findAllNPCs();
        this.log(`NPCBus initialized with ${this.npcs.length} NPCs`);
    }
    /**
     * Finds all entities in the scene that have the NPC_Base component
     */
    findAllNPCs() {
        this.npcs = [];
        // Get all entities with the "npc" tag
        const npcEntities = this.findAllComponents(NPC_Base_1.NPC_Base);
        this.log(`Found ${npcEntities.length} NPC objects`);
        // Find the first NPC_Base component in each entity
        for (const npc of npcEntities) {
            if (npc && !this.npcs.includes(npc)) {
                this.npcs.push(npc);
                this.log(`Found NPC: ${npc.name}`);
            }
        }
        this.log(`Found ${this.npcs.length} NPCs`);
    }
    /**
     * Adds a perceived event description to all NPCs.
     * @param description - The description of the perceived event to add.
     */
    addPerceivedEventForAll(description) {
        if (this.npcs.length === 0) {
            this.log("No NPCs found to set context for", true, BaseLogger_1.LogLevel.Warn);
            return;
        }
        this.npcs.forEach(npc => {
            npc.addPerception(description);
        });
    }
    /**
     * Sets a context entry for all NPCs
     * @param key - The context key to set
     * @param value - The value to associate with the key
     * @param elicitResponse - Whether to trigger an LLM response immediately
     */
    setContextEntryForAll(key, value, elicitResponse = false) {
        if (this.npcs.length === 0) {
            this.log("No NPCs found to set context for", true, BaseLogger_1.LogLevel.Warn);
            return;
        }
        this.npcs.forEach(npc => {
            npc.setContextEntry(key, value, elicitResponse);
            this.log(`Set context for NPC ${npc.name}: ${key}=${value}${elicitResponse ? " (eliciting response)" : ""}`);
        });
    }
    /**
     * Clears a context entry for all NPCs
     * @param key - The context key to clear
     */
    clearContextEntryForAll(key) {
        if (this.npcs.length === 0) {
            this.log("No NPCs found to clear context for", true, BaseLogger_1.LogLevel.Warn);
            return;
        }
        this.npcs.forEach(npc => {
            npc.clearContextEntry(key);
            this.log(`Cleared context for NPC ${npc.name}: ${key}`);
        });
    }
    /**
     * Sets a context entry for a specific NPC by name
     * @param npcName - The name of the NPC to set context for
     * @param key - The context key to set
     * @param value - The value to associate with the key
     * @param elicitResponse - Whether to trigger an LLM response immediately
     * @returns True if the NPC was found and context was set, false otherwise
     */
    setContextEntryForNPC(npcName, key, value, elicitResponse = false) {
        const npc = this.getNPCByName(npcName);
        if (!npc) {
            this.log(`NPC with name ${npcName} not found`, true, BaseLogger_1.LogLevel.Warn);
            return false;
        }
        npc.setContextEntry(key, value, elicitResponse);
        this.log(`Set context for NPC ${npcName}: ${key}=${value}${elicitResponse ? " (eliciting response)" : ""}`);
        return true;
    }
    /**
     * Clears a context entry for a specific NPC by name
     * @param npcName - The name of the NPC to clear context for
     * @param key - The context key to clear
     * @returns True if the NPC was found and context was cleared, false otherwise
     */
    clearContextEntryForNPC(npcName, key) {
        const npc = this.getNPCByName(npcName);
        if (!npc) {
            this.log(`NPC with name ${npcName} not found`, true, BaseLogger_1.LogLevel.Warn);
            return false;
        }
        npc.clearContextEntry(key);
        this.log(`Cleared context for NPC ${npcName}: ${key}`);
        return true;
    }
    /**
     * Gets an NPC by name
     * @param name - The name of the NPC to find
     * @returns The NPC with the given name, or undefined if not found
     */
    getNPCByName(name) {
        return this.npcs.find(npc => npc.name === name);
    }
    /**
     * Gets all NPCs
     * @returns An array of all NPCs
     */
    getAllNPCs() {
        return [...this.npcs];
    }
    /**
     * Gets the number of NPCs
     * @returns The number of NPCs
     */
    getNPCCount() {
        return this.npcs.length;
    }
    /**
     * Gets the current list of registered NPCs
     * @returns The number of NPCs currently registered
     */
    logNPCCount() {
        this.log(`Currently registered NPCs: ${this.npcs.length}`);
    }
}
exports.NPCBus = NPCBus;
NPCBus.propsDefinition = {
    ...BaseComponent_1.BaseComponent.propsDefinition,
};
hz.Component.register(NPCBus);
