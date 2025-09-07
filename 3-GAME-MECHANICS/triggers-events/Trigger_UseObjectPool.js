"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class UseObjectPool extends core_1.Component {
    constructor() {
        super(...arguments);
        this.objects = new Map();
        this.poolPosition = core_1.Vec3.zero;
    }
    preStart() {
        this.poolPosition = this.entity.position.get();
        //Make sure to tag the entities you want to use with "Object"
        //Find all tagged entities
        const taggedEntities = this.world.getEntitiesWithTags(['Object']);
        // Iterate through each tagged entity
        for (const entity of taggedEntities) {
            // Add the entity to the object pool
            this.objects.set(entity, { inUse: false });
            // Set the entity's position to the pool position
            entity.position.set(this.poolPosition);
            entity.rotation.set(core_1.Quaternion.zero);
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExitTrigger.bind(this));
    }
    start() { }
    onPlayerEnterTrigger(player) {
        // Check if there are any available objects in the pool
        const availableObject = Array.from(this.objects.entries()).find(([_, data]) => !data.inUse);
        if (availableObject) {
            const [entity, data] = availableObject;
            // Mark the object as in use
            data.inUse = true;
            this.objects.set(entity, data);
            // Move the object to the pool position
            const inFrontOfPlayer = player.position.get().add(player.forward.get());
            entity.position.set(inFrontOfPlayer);
            return;
        }
        console.log('No available objects in the pool');
    }
    onPlayerExitTrigger(player) {
        // Check if there are any objects in use
        const usedObject = Array.from(this.objects.entries()).find(([_, data]) => data.inUse);
        if (usedObject) {
            const [entity, data] = usedObject;
            // Mark the object as not in use
            data.inUse = false;
            this.objects.set(entity, data);
            // Move the object back to the pool position
            entity.position.set(this.poolPosition);
            entity.rotation.set(core_1.Quaternion.zero);
            return;
        }
    }
}
core_1.Component.register(UseObjectPool);
