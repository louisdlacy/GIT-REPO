import { BaseNPCAnimationComponent } from 'BaseNPCAnimationComponent';
import { Emotions } from "./GameConsts";
/**
 * An animation class specifically for Customers, which have a limited range of emotions.
 */
export declare class CustomerAnimation extends BaseNPCAnimationComponent<typeof CustomerAnimation> {
    static propsDefinition: any;
    protected availableEmotions: Emotions[];
    start(): void;
    reset(): void;
}
