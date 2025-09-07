"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviourFinder = exports.Behaviour = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const core_1 = require("horizon/core");
class Behaviour extends core_1.Component {
    constructor() {
        super(...arguments);
        this.enableDebugLogging = false;
    }
    // Adapter methods
    preStart() {
        BehaviourFinder.RegisterEntity(this.entity.id, this);
        this.Awake();
    }
    start() {
        this.updateListener = this.connectLocalBroadcastEvent(core_1.World.onUpdate, (data) => {
            this.Update(data.deltaTime);
        });
        this.grabStartListener = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.OnGrabStart.bind(this));
        this.grabEndListener = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.OnGrabEnd.bind(this));
        this.entityCollisionListener = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityCollision, this.OnEntityCollision.bind(this));
        this.playerCollistionListener = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerCollision, this.OnPlayerCollision.bind(this));
        this.Start();
    }
    dispose() {
        this.Dispose();
    }
    // Lifecycle methods
    Awake() { }
    Start() { }
    Update(deltaTime) {
        if (this.enableDebugLogging)
            console.log("Default Update - disabling");
        this.updateListener?.disconnect();
    }
    Dispose() { }
    // Event methods
    OnGrabStart(isRightHand, player) {
        if (this.enableDebugLogging)
            console.log("Default Grab Start - disabling");
        this.grabStartListener?.disconnect();
    }
    OnGrabEnd(player) {
        if (this.enableDebugLogging)
            console.log("Default Grab End - disabling");
        this.grabEndListener?.disconnect();
    }
    OnEntityCollision(collidedWith, collisionAt, normal, relativeVelocity, localColliderName, otherColliderName) {
        if (this.enableDebugLogging)
            console.log("Default Entity Collision - disabling");
        this.entityCollisionListener?.disconnect();
    }
    OnPlayerCollision(collidedWith, collisionAt, normal, relativeVelocity, localColliderName, otherColliderName) {
        if (this.enableDebugLogging)
            console.log("Default Player Collision - disabling");
        this.playerCollistionListener?.disconnect();
    }
}
exports.Behaviour = Behaviour;
//------------------------------------------------------------------------------
class BehaviourFinder extends core_1.Component {
    start() { }
    static RegisterEntity(id, behaviour) {
        BehaviourFinder.entityMap.set(id, behaviour);
    }
    static GetBehaviour(entity) {
        if (entity == undefined || entity == null) {
            console.log("GetBehaviour: Entity is undefined or null");
            return undefined;
        }
        return BehaviourFinder.entityMap.get(entity.id);
    }
}
exports.BehaviourFinder = BehaviourFinder;
(() => {
    BehaviourFinder.entityMap = new Map();
})();
