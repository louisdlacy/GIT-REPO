"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPool = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class ObjectPool extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.allocatedEntities = new Set();
        this.freeEntities = new Set();
    }
    addEntity(entity) {
        this.freeEntities.add(entity);
    }
    allocate(position, rotation, owner) {
        if (this.freeEntities.size == 0) {
            console.error("ObjectPool: no free entities");
            return null;
        }
        const entity = this.freeEntities.values().next().value;
        this.freeEntities.delete(entity);
        this.allocatedEntities.add(entity);
        var allocatable = Behaviour_1.BehaviourFinder.GetBehaviour(entity);
        allocatable?.onAllocate(position, rotation, owner);
        return entity;
    }
    free(entity) {
        if (!entity) {
            return;
        }
        if (!this.allocatedEntities.has(entity)) {
            console.warn("ObjectPool: entity is not allocated");
            return;
        }
        this.allocatedEntities.delete(entity);
        this.freeEntities.add(entity);
        var allocatable = Behaviour_1.BehaviourFinder.GetBehaviour(entity);
        allocatable?.onFree();
    }
    has(entity) {
        return !!this.allocatedEntities.has(entity) || !!this.freeEntities.has(entity);
    }
}
exports.ObjectPool = ObjectPool;
ObjectPool.propsDefinition = {};
core_1.Component.register(ObjectPool);
