import { Behaviour } from 'Behaviour';
export declare class FogWall extends Behaviour<typeof FogWall> {
    static propsDefinition: {
        fogVfx1: {
            type: "Entity";
        };
        fogVfx2: {
            type: "Entity";
        };
        fogVfx3: {
            type: "Entity";
        };
    };
    hide(): void;
    show(): void;
}
