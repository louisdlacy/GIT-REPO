import { CameraMode } from 'horizon/camera';
import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

/**
 * Camera Change Trigger Component
 *
 * Changes the camera mode when a player enters a trigger area.
 * Supports standard camera modes and special camera effects.
 * Resets camera when player exits the trigger area.
 */
class sysCameraChangeTrigger extends hz.Component<typeof sysCameraChangeTrigger> {
  static propsDefinition = {
    cameraMode: { type: hz.PropTypes.String },
    cameraModeText: { type: hz.PropTypes.Entity },
  };

  private readonly cameraModeMap: Record<string, CameraMode> = {
    'Follow': CameraMode.Follow,
    'Pan': CameraMode.Pan,
    'Fixed': CameraMode.Fixed,
    'Attach': CameraMode.Attach,
    'Orbit': CameraMode.Orbit,
    'ThirdPerson': CameraMode.ThirdPerson,
    'FirstPerson': CameraMode.FirstPerson,
  };

  private cameraMode: string = '';

  preStart(): void {
    this.cameraMode = this.props.cameraMode;
  }

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.handlePlayerEnterTrigger.bind(this));
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, this.handlePlayerExitTrigger.bind(this));
  }

  /**
   * Handle when a player enters the trigger area
   */
  private handlePlayerEnterTrigger(player: hz.Player): void {
    const cameraMode = this.getCameraMode();

    if (cameraMode === null) {
      this.applySpecialCameraEffect(player);
      return;
    }

    this.applyStandardCameraMode(player, cameraMode);
  }

  /**
   * Apply special camera effects that aren't part of the CameraMode enum
   */
  private applySpecialCameraEffect(player: hz.Player): void {
    switch (this.props.cameraMode) {
      case "Roll":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraRoll, { rollAngle: 45 });
        this.updateTextGizmo("Camera Roll Applied");
        break;
      case "FOV":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraFOV, { newFOV: 90 });
        this.updateTextGizmo("Camera FOV Changed");
        break;
      case "PerspectiveSwitching":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraPerspectiveSwitchingEnabled, { enabled: true });
        this.updateTextGizmo("Camera Perspective Switching Enabled<br><br>Press PageUp/PageDown to change<br>between 1st person and 3rd person modes");
        break;
      case "Collision":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraCollisionEnabled, { enabled: false });
        this.updateTextGizmo("Camera collision disabled");
        break;
      default:
        this.resetToThirdPerson(player);
        this.updateTextGizmo("Camera set to Third Person Mode (default)");
        break;
    }
  }

  /**
   * Apply a standard camera mode from the CameraMode enum
   */
  private applyStandardCameraMode(player: hz.Player, cameraMode: CameraMode): void {
    switch (cameraMode) {
      case CameraMode.FirstPerson:
        this.sendNetworkEvent(player, sysEvents.OnSetCameraModeFirstPerson, null);
        this.updateTextGizmo("Camera set to First Person Mode");
        break;
      case CameraMode.ThirdPerson:
        this.resetToThirdPerson(player);
        this.updateTextGizmo("Camera set to Third Person Mode");
        break;
      case CameraMode.Follow:
        this.sendNetworkEvent(player, sysEvents.OnSetCameraModeFollow, { target: player });
        this.updateTextGizmo("Camera set to Follow Mode");
        break;
      case CameraMode.Pan:
        const panPositionOffset = new hz.Vec3(0, 1, -6);
        this.sendNetworkEvent(player, sysEvents.OnSetCameraModePan, {
          panSpeed: 1.0,
          positionOffset: panPositionOffset
        });
        this.updateTextGizmo("Camera set to Pan Mode with position offset");
        break;
      case CameraMode.Fixed:
        const fixedPosition = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 1, -5));
        const fixedRotation = hz.Quaternion.fromEuler(new hz.Vec3(0, 0, 0));
        this.sendNetworkEvent(player, sysEvents.OnSetCameraModeFixed, {
          position: fixedPosition,
          rotation: fixedRotation
        });
        this.updateTextGizmo("Camera set to Fixed Mode");
        break;
      case CameraMode.Attach:
        const positionOffset = new hz.Vec3(0, 0, -5);
        const translationSpeed = 1;
        const rotationSpeed = 1;
        this.sendNetworkEvent(player, sysEvents.OnSetCameraModeAttached, {
          target: player,
          positionOffset: positionOffset,
          translationSpeed: translationSpeed,
          rotationSpeed: rotationSpeed
        });
        this.updateTextGizmo("Camera set to Attach Mode");
        break;
      case CameraMode.Orbit:
        this.sendNetworkEvent(player, sysEvents.OnSetCameraModeOrbit, {
          target: player,
          distance: 5.0,
          orbitSpeed: 1.0
        });
        this.updateTextGizmo("Camera set to Orbit Mode");
        break;
    }
  }

  /**
   * Handle when a player exits the trigger area
   */
  private handlePlayerExitTrigger(player: hz.Player): void {
    const cameraMode = this.getCameraMode();

    if (cameraMode === null) {
      this.removeSpecialCameraEffect(player);
      return;
    }

    if (cameraMode !== CameraMode.ThirdPerson) {
      this.resetToThirdPerson(player);
    }

    this.updateTextGizmo(`${this.props.cameraMode} Camera`);
  }

  /**
   * Remove special camera effects when exiting the trigger
   */
  private removeSpecialCameraEffect(player: hz.Player): void {
    switch (this.props.cameraMode) {
      case "Roll":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraRoll, { rollAngle: 0 });
        this.updateTextGizmo("Camera Roll");
        break;
      case "FOV":
        this.sendNetworkEvent(player, sysEvents.OnResetCameraFOV, null);
        this.updateTextGizmo("Camera FOV");
        break;
      case "PerspectiveSwitching":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraPerspectiveSwitchingEnabled, { enabled: true });
        this.updateTextGizmo("Camera Perspective Switching");
        break;
      case "Collision":
        this.sendNetworkEvent(player, sysEvents.OnSetCameraCollisionEnabled, { enabled: true });
        this.updateTextGizmo("Camera collision enabled");
        break;
      default:
        console.error(`[sysCameraChangeTrigger] No matching camera mode found for ${this.props.cameraMode}`);
        this.updateTextGizmo("Camera mode not found");
        break;
    }
  }

  /**
   * Reset the camera to third person mode
   */
  private resetToThirdPerson(player: hz.Player): void {
    this.sendNetworkEvent(player, sysEvents.OnSetCameraModeThirdPerson, null);
  }

  /**
   * Update the text display with information about the current camera mode
   */
  private updateTextGizmo(text: string): void {
    SetTextGizmoText(this.props.cameraModeText, text);
  }

  /**
   * Get the CameraMode enum value from the string camera mode
   */
  getCameraMode(): CameraMode | null {
    return this.cameraModeMap[this.cameraMode] ?? null;
  }
}
hz.Component.register(sysCameraChangeTrigger);
