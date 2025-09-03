import { Behaviour } from "Behaviour";
import { NpcTuner } from "NpcTuner";
export declare class NpcConfigStore extends Behaviour<typeof NpcConfigStore> {
    static instance: NpcConfigStore;
    private npcConfigs;
    Awake(): void;
    addNpcConfig(npcId: string, npcTuner: NpcTuner): void;
    getNpcConfig(npcId: string): any;
}
