"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class HatManager_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hatMap = new Map();
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
    }
    start() {
    }
    async playerEnterWorld(player) {
        if (this.props.defaultHatAsset && !this.hatMap.has(player)) {
            const hatSpawned = await this.world.spawnAsset(this.props.defaultHatAsset, new core_1.Vec3(0, -1, 0), core_1.Quaternion.one, core_1.Vec3.one);
            hatSpawned[0].as(core_1.AttachableEntity).attachToPlayer(player, core_1.AttachablePlayerAnchor.Head);
            this.hatMap.set(player, hatSpawned[0]);
        }
    }
    playerExitWorld(player) {
        const hat = this.hatMap.get(player);
        this.hatMap.delete(player);
        if (hat) {
            this.world.deleteAsset(hat);
        }
    }
}
HatManager_Entity.propsDefinition = {
    defaultHatAsset: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(HatManager_Entity);
