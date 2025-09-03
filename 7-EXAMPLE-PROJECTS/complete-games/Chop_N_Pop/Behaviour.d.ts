import { Component, ComponentWithConstructor, Entity, Player, SerializableState, Vec3 } from 'horizon/core';
export declare class Behaviour<TBehaviour extends ComponentWithConstructor<Record<string, unknown>>, TSerializableState extends SerializableState = SerializableState> extends Component<TBehaviour> {
    private updateListener;
    private grabStartListener;
    private grabEndListener;
    private entityCollisionListener;
    private playerCollistionListener;
    protected enableDebugLogging: boolean;
    preStart(): void;
    start(): void;
    dispose(): void;
    protected Awake(): void;
    protected Start(): void;
    protected Update(deltaTime: number): void;
    protected Dispose(): void;
    protected OnGrabStart(isRightHand: boolean, player: Player): void;
    protected OnGrabEnd(player: Player): void;
    protected OnEntityCollision(collidedWith: Entity, collisionAt: Vec3, normal: Vec3, relativeVelocity: Vec3, localColliderName: string, otherColliderName: string): void;
    protected OnPlayerCollision(collidedWith: Player, collisionAt: Vec3, normal: Vec3, relativeVelocity: Vec3, localColliderName: string, otherColliderName: string): void;
}
export declare class BehaviourFinder extends Component<typeof BehaviourFinder> {
    private static entityMap;
    start(): void;
    static RegisterEntity(id: bigint, behaviour: Behaviour<ComponentWithConstructor<Record<string, unknown>>, SerializableState>): void;
    static GetBehaviour<TBehaviour>(entity: Entity | undefined | null): TBehaviour | undefined;
}
