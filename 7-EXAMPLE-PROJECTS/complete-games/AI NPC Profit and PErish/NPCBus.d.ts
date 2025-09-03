import { BaseComponent } from './BaseComponent';
import { NPC_Base } from './NPC_Base';
/**
 * A class that acts as a central manager for all NPCs in the scene.
 * It provides methods to interact with NPCs collectively.
 */
export declare class NPCBus extends BaseComponent<typeof NPCBus> {
    static propsDefinition: {};
    /**
     * Singleton instance of the NPCBus
     */
    private static _instance;
    /**
     * Gets the singleton instance of the NPCBus
     */
    static get instance(): NPCBus;
    /**
     * All NPCs registered with the bus
     */
    protected npcs: NPC_Base[];
    /**
     * Initializes the NPCBus and sets up event listeners
     */
    preStart(): void;
    /**
     * Registers an NPC with the bus
     * @param npc - The NPC to register
     */
    registerNPC(npc: NPC_Base): void;
    /**
     * Starts the NPCBus and finds all NPCs in the scene
     */
    start(): void;
    /**
     * Finds all entities in the scene that have the NPC_Base component
     */
    findAllNPCs(): void;
    /**
     * Adds a perceived event description to all NPCs.
     * @param description - The description of the perceived event to add.
     */
    addPerceivedEventForAll(description: string): void;
    /**
     * Sets a context entry for all NPCs
     * @param key - The context key to set
     * @param value - The value to associate with the key
     * @param elicitResponse - Whether to trigger an LLM response immediately
     */
    setContextEntryForAll(key: string, value: string, elicitResponse?: boolean): void;
    /**
     * Clears a context entry for all NPCs
     * @param key - The context key to clear
     */
    clearContextEntryForAll(key: string): void;
    /**
     * Sets a context entry for a specific NPC by name
     * @param npcName - The name of the NPC to set context for
     * @param key - The context key to set
     * @param value - The value to associate with the key
     * @param elicitResponse - Whether to trigger an LLM response immediately
     * @returns True if the NPC was found and context was set, false otherwise
     */
    setContextEntryForNPC(npcName: string, key: string, value: string, elicitResponse?: boolean): boolean;
    /**
     * Clears a context entry for a specific NPC by name
     * @param npcName - The name of the NPC to clear context for
     * @param key - The context key to clear
     * @returns True if the NPC was found and context was cleared, false otherwise
     */
    clearContextEntryForNPC(npcName: string, key: string): boolean;
    /**
     * Gets an NPC by name
     * @param name - The name of the NPC to find
     * @returns The NPC with the given name, or undefined if not found
     */
    getNPCByName(name: string): NPC_Base | undefined;
    /**
     * Gets all NPCs
     * @returns An array of all NPCs
     */
    getAllNPCs(): NPC_Base[];
    /**
     * Gets the number of NPCs
     * @returns The number of NPCs
     */
    getNPCCount(): number;
    /**
     * Gets the current list of registered NPCs
     * @returns The number of NPCs currently registered
     */
    logNPCCount(): void;
}
