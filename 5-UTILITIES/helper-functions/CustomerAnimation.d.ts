import { BaseNPCAnimationComponent } from 'BaseNPCAnimationComponent';
/**
 * An animation class specifically for Customers, which have a limited range of emotions.
 */
export declare class CustomerAnimation extends BaseNPCAnimationComponent<typeof CustomerAnimation> {
    static propsDefinition: any;
    protected availableEmotions: any[];
    start(): void;
    reset(): void;
}
