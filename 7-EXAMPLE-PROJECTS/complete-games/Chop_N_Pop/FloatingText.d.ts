import { Behaviour } from 'Behaviour';
export declare class FloatingText extends Behaviour<typeof FloatingText> {
    static propsDefinition: {};
    private floatSpeed;
    private rotateSpeed;
    private currentTime;
    private maxTime;
    private rotationEuler;
    private deleted;
    setText(text: string, floatSpeed: number, rotateSpeed: number, maxTime: number): void;
    protected Update(deltaTime: number): void;
}
