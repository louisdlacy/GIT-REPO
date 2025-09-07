"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class CustomAssetSpawner extends core_1.Component {
    preStart() {
        const asset = this.props.myAsset;
        if (!asset) {
            console.error('No asset provided for spawning.');
            return;
        }
        this.spawnController = new core_1.SpawnController(asset, core_1.Vec3.zero, core_1.Quaternion.zero, core_1.Vec3.one);
        this.spawnController.spawn()
            .then(() => {
            // Access spawned entities via this.spawnController.rootEntities.get()
            const entities = this.spawnController?.rootEntities.get();
            console.log('Spawned entities:', entities);
        })
            .catch((error) => {
            console.error('Error spawning entity:', error);
        });
    }
    start() { }
}
CustomAssetSpawner.propsDefinition = {
    myAsset: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(CustomAssetSpawner);
