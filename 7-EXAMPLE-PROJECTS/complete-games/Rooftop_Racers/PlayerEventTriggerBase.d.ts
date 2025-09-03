/**
 * Base class that provides functionality that fires on players and entities entering and/or exiting triggers
 */
import * as hz from 'horizon/core';
export declare abstract class PlayerFireEventOnTriggerBase<TProps> extends hz.Component<TProps> {
    private onEntityEnterTriggerEvent;
    private onEntityExitTriggerEvent;
    private onPlayerEnterTriggerEvent;
    private onPlayerExitTriggerEvent;
    preStart(): void;
    start(): void;
    dispose(): void;
    protected abstract onEntityEnterTrigger(enteredBy: hz.Entity): void;
    protected abstract onEntityExitTrigger(exitedBy: hz.Entity): void;
    protected abstract onPlayerEnterTrigger(enteredBy: hz.Player): void;
    protected abstract onPlayerExitTrigger(exitedBy: hz.Player): void;
}
