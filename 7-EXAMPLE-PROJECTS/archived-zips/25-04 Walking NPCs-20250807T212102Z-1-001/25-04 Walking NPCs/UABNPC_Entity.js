"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const navmesh_1 = require("horizon/navmesh");
const unity_asset_bundles_1 = require("horizon/unity_asset_bundles");
class UABNPC_Entity extends core_1.Component {
    start() {
        this.entity.as(navmesh_1.NavMeshAgent).destination.set(this.props.destination?.position.get() ?? core_1.Vec3.zero);
        this.entity.as(unity_asset_bundles_1.AssetBundleGizmo).getRoot().setAnimationParameterBool('Moving', true);
    }
}
UABNPC_Entity.propsDefinition = {
    destination: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(UABNPC_Entity);
