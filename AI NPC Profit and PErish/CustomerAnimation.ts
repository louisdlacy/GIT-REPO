import * as hz from 'horizon/core';
import { BaseNPCAnimationComponent } from 'BaseNPCAnimationComponent';
import { Emotions } from "./GameConsts";

/**
 * An animation class specifically for Customers, which have a limited range of emotions.
 */
export class CustomerAnimation extends BaseNPCAnimationComponent<typeof CustomerAnimation> {
    static propsDefinition = {
        ...BaseNPCAnimationComponent.propsDefinition,
    };

    protected availableEmotions = [
        Emotions.Angry,
        Emotions.Happy,
        Emotions.Neutral,
    ]

    start() {
        super.start();
    }

    reset() {
        super.reset();
    }
}
hz.Component.register(CustomerAnimation);
