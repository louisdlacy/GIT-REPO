import { BaseComponent } from './BaseComponent';
import { NPC_Base } from './NPC_Base';
import * as hz from 'horizon/core';
import { LogLevel } from 'BaseLogger';
import { Events } from 'Events';
import { CONSOLE_LOG_NPC_BUS } from 'GameConsts';

/**
 * A class that acts as a central manager for all NPCs in the scene.
 * It provides methods to interact with NPCs collectively.
 */
export class NPCBus extends BaseComponent<typeof NPCBus> {
    static propsDefinition = {
        ...BaseComponent.propsDefinition,
    };

    /**
     * Singleton instance of the NPCBus
     */
    private static _instance: NPCBus;

    /**
     * Gets the singleton instance of the NPCBus
     */
    public static get instance(): NPCBus {
        return NPCBus._instance;
    }

    /**
     * All NPCs registered with the bus
     */
    protected npcs: NPC_Base[] = [];

    /**
     * Initializes the NPCBus and sets up event listeners
     */
    preStart() {
        this.enableLogging = CONSOLE_LOG_NPC_BUS;

        // Check if an instance already exists
        if (NPCBus._instance) {
            this.log(`NPCBus instance already exists. Removing duplicate instance on entity: ${this.entity.name.get()}`, true, LogLevel.Warn);
            // Remove this component to prevent duplicate singletons
            this.dispose();
            return; // Stop further processing of this instance
        }

        // Set this as the singleton instance
        NPCBus._instance = this;

        // Listen for NPC join world events to register NPCs
        this.connectLocalBroadcastEvent(Events.onNpcJoinWorld, (data: { npc: NPC_Base }) => {
            this.registerNPC(data.npc);
        });

        // Listen for global context events to set context for all NPCs
        this.connectLocalBroadcastEvent(Events.onGloballyPerceivedEvent, (data: { description: string }) => {
            this.log(`Received global context event: ${data.description}`);
            this.addPerceivedEventForAll(data.description);
        });
    }

    /**
     * Registers an NPC with the bus
     * @param npc - The NPC to register
     */
    registerNPC(npc: NPC_Base): void {
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
        const npcEntities = this.findAllComponents(NPC_Base);

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
    addPerceivedEventForAll(description: string): void {
        if (this.npcs.length === 0) {
            this.log("No NPCs found to set context for", true, LogLevel.Warn);
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
    setContextEntryForAll(key: string, value: string, elicitResponse: boolean = false): void {
        if (this.npcs.length === 0) {
            this.log("No NPCs found to set context for", true, LogLevel.Warn);
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
    clearContextEntryForAll(key: string): void {
        if (this.npcs.length === 0) {
            this.log("No NPCs found to clear context for", true, LogLevel.Warn);
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
    setContextEntryForNPC(npcName: string, key: string, value: string, elicitResponse: boolean = false): boolean {
        const npc = this.getNPCByName(npcName);
        if (!npc) {
            this.log(`NPC with name ${npcName} not found`, true, LogLevel.Warn);
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
    clearContextEntryForNPC(npcName: string, key: string): boolean {
        const npc = this.getNPCByName(npcName);
        if (!npc) {
            this.log(`NPC with name ${npcName} not found`, true, LogLevel.Warn);
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
    getNPCByName(name: string): NPC_Base | undefined {
        return this.npcs.find(npc => npc.name === name);
    }

    /**
     * Gets all NPCs
     * @returns An array of all NPCs
     */
    getAllNPCs(): NPC_Base[] {
        return [...this.npcs];
    }

    /**
     * Gets the number of NPCs
     * @returns The number of NPCs
     */
    getNPCCount(): number {
        return this.npcs.length;
    }

    /**
     * Gets the current list of registered NPCs
     * @returns The number of NPCs currently registered
     */
    logNPCCount(): void {
        this.log(`Currently registered NPCs: ${this.npcs.length}`);
    }
}

hz.Component.register(NPCBus);
