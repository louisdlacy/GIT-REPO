import { Component, PropTypes, Vec3 } from "horizon/core";
import { NavMeshAgent } from "horizon/navmesh";
import { AssetBundleGizmo } from "horizon/unity_asset_bundles";

class UABNPC_Entity extends Component<typeof UABNPC_Entity> {
  static propsDefinition = {
    destination: { type: PropTypes.Entity },
  };

  start() {
    this.entity.as(NavMeshAgent).destination.set(this.props.destination?.position.get() ?? Vec3.zero);
    this.entity.as(AssetBundleGizmo).getRoot().setAnimationParameterBool('Moving', true);
  }
}
Component.register(UABNPC_Entity);