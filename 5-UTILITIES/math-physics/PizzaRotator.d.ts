import { Component } from 'horizon/core';
/**
 * This component continuously rotates the entity it is attached to on the Y-axis.
 * The speed of the rotation can be configured through the properties panel.
 */
export declare class PizzaRotator extends Component<typeof PizzaRotator> {
    static propsDefinition: {
        rotationSpeed: {
            type: "number";
            default: number;
        };
    };
    preStart(): void;
    start(): void;
    private rotateEntity;
}
