import { Behaviour } from "Behaviour";
export declare class NpcTuner extends Behaviour<typeof NpcTuner> {
    static propsDefinition: {
        npcType: {
            type: "string";
            default: string;
        };
        maxVisionDistance: {
            type: "number";
            default: number;
        };
        walkSpeed: {
            type: "number";
            default: number;
        };
        runSpeed: {
            type: "number";
            default: number;
        };
        maxAttackDistance: {
            type: "number";
            default: number;
        };
        maxAttachReach: {
            type: "number";
            default: number;
        };
        attackLandDelay: {
            type: "number";
            default: number;
        };
        minAttackDamage: {
            type: "number";
            default: number;
        };
        maxAttackDamage: {
            type: "number";
            default: number;
        };
        attacksPerSecond: {
            type: "number";
            default: number;
        };
        minHp: {
            type: "number";
            default: number;
        };
        maxHp: {
            type: "number";
            default: number;
        };
        minBulletDamage: {
            type: "number";
            default: number;
        };
        maxBulletDamage: {
            type: "number";
            default: number;
        };
        minAxeDamage: {
            type: "number";
            default: number;
        };
        maxAxeDamage: {
            type: "number";
            default: number;
        };
        hitStaggerSeconds: {
            type: "number";
            default: number;
        };
        knockbackMinDamage: {
            type: "number";
            default: number;
        };
        knockbackMultiplier: {
            type: "number";
            default: number;
        };
        lootTable: {
            type: "Entity";
        };
    };
    Start(): void;
}
