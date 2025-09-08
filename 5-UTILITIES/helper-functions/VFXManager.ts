// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { Component, NetworkEvent, ParticleGizmo, Player, PropTypes, Quaternion, Vec3 } from "horizon/core";
import { getEntityListByTag, ManagerType } from "sysHelper";

export const PlayVFXAtPosition = new NetworkEvent<{
  vfxLabel: VFXLabel;
  visibleFor: Player[];
  position?: Vec3;
  rotation?: Quaternion;
}>("PlayVFXAtPosition");
export const StopVFX = new NetworkEvent<{ vfxLabel: VFXLabel }>("StopVFX");

export enum VFXLabel {
  explosion,
  sparkles,
  smoke,
  fire,
}

class VFXManager extends Component<typeof VFXManager> {
  static propsDefinition = {
    enabled: { type: PropTypes.Boolean, default: true },
    showDebugs: { type: PropTypes.Boolean, default: false },

    explosion: { type: PropTypes.Entity },
    sparkles: { type: PropTypes.Entity },
    smoke: { type: PropTypes.Entity },
    fire: { type: PropTypes.Entity },
  };

  preStart(): void {
    if (this.props.showDebugs) return;

    this.connectNetworkEvent(this.entity, PlayVFXAtPosition, (data) => {
      this.playVFXAtPosition(data);
    });
  }

  start() {
    if (!this.props.enabled) return;
  }

  private playVFXAtPosition(data: {
    vfxLabel: VFXLabel;
    visibleFor: Player[];
    position?: Vec3;
    rotation?: Quaternion;
  }) {
    const vfxAsset = this.getVFXAsset(data.vfxLabel);
    if (vfxAsset) {
      const vfx = vfxAsset.as(ParticleGizmo);
      if (data.position) {
        vfx.position.set(data.position);
      }
      if (data.rotation) {
        vfx.rotation.set(data.rotation);
      }
      if (data.visibleFor.length > 0) {
        vfx.play({
          players: data.visibleFor,
        });
      } else {
        vfx.play();
      }
    } else {
      console.error(`VFX asset for label ${data.vfxLabel} not found.`);
    }
  }

  //region Get VFX Asset
  private getVFXAsset(label: VFXLabel): any | null {
    const vfxMap: Record<VFXLabel, any> = {
      [VFXLabel.explosion]: this.props.explosion,
      [VFXLabel.sparkles]: this.props.sparkles,
      [VFXLabel.smoke]: this.props.smoke,
      [VFXLabel.fire]: this.props.fire,
    };
    return vfxMap[label] || null;
  }
}
Component.register(VFXManager);

export function playVFX(
  component: Component,
  vfxLabel: VFXLabel,
  visibleFor: Player[],
  position?: Vec3,
  rotation?: Quaternion
): void {
  const emptyVisibleFor: Player[] = [];
  if (visibleFor === undefined || visibleFor.length === 0 || visibleFor === null) {
    visibleFor = emptyVisibleFor;
  }
  const vfxManager = getEntityListByTag(ManagerType.VFXManager, component.world)[0];
  if (vfxManager) {
    component.sendNetworkEvent(vfxManager, PlayVFXAtPosition, {
      vfxLabel,
      visibleFor: visibleFor,
      position: position,
      rotation: rotation,
    });
  } else {
    console.error("VFXManager not found in the world.");
  }
}
