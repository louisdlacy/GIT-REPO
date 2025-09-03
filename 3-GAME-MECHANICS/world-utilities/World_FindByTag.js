"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class FindByTag extends core_1.Component {
    preStart() {
        // Find all entities with the tag 'Test'. Make sure there is at least one entity with this tag in the scene.
        const foundEntities = this.world.getEntitiesWithTags(['Test']);
        // Log the names of the found entities
        foundEntities.forEach(entity => {
            console.log(`Found entity with tag 'Test': ${entity.name.get()}`);
        });
    }
    start() { }
}
core_1.Component.register(FindByTag);
