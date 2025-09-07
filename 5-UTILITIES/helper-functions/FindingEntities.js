"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
//Documentation:
//https://developers.meta.com/horizon-worlds/reference/2.0.0/core_world
//https://developers.meta.com/horizon-worlds/reference/2.0.0/core_entitynamematchoperation
//https://developers.meta.com/horizon-worlds/reference/2.0.0/core_entitytagmatchoperation
//https://github.com/Gausroth/HorizonWorldsTutorials/blob/main/FindingEntities.ts
class FindingEntities extends core_1.Component {
    constructor() {
        super(...arguments);
        this.spheres = [];
        this.sphereBs = [];
    }
    start() {
        // returns an entity with a matching name. Will error if more than one is found.
        this.sphereA = this.world.findEntity("SphereA");
        // retuns all entities where its name matches the name string and match operation.
        this.spheres = this.world.findEntities("Sphere", { rootEntity: undefined, matchOperation: core_1.EntityNameMatchOperation.Exact });
        // retuns all entities where its tag(s) match the tag name string array and math operation.
        this.sphereBs = this.world.getEntitiesWithTags(["Sphere"], core_1.EntityTagMatchOperation.HasAnyExact);
        if (this.sphereA)
            console.log(this.sphereA.name.get());
        console.log(this.spheres.length);
        console.log(this.sphereBs.length);
    }
}
FindingEntities.propsDefinition = {};
core_1.Component.register(FindingEntities);
