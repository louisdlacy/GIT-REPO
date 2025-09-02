import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class RoomB_Keypad extends hz.Component<typeof RoomB_Keypad> {
  static propsDefinition = {
    digitsText: {type: hz.PropTypes.Entity},
    correctCode: {type: hz.PropTypes.String},
    puzzleManager: {type: hz.PropTypes.Entity},
    tappingRaycast: {type: hz.PropTypes.Entity},
    relativeCameraPosition: {type: hz.PropTypes.Vec3},
    cameraRotation: {type: hz.PropTypes.Vec3},
    cameraFov: {type: hz.PropTypes.Number},
  };

  private digitCount = 0;
  private maxDigitCount = 4;
  private currentCode = "";
  private guessedCode = false;
  private enabled = true;
  private originalDigitsTextColor!: hz.Color;

  private activePlayer!: hz.Player;
  private raycastGizmo!: hz.RaycastGizmo | null;

  start() {
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), this.props.relativeCameraPosition);
    const cameraRot = hz.Quaternion.fromEuler(this.props.cameraRotation);

    if (this.props.digitsText) {
      this.originalDigitsTextColor = this.props.digitsText.color.get();
    }

    if (this.props.tappingRaycast) {
      this.raycastGizmo = this.props.tappingRaycast.as(hz.RaycastGizmo);
    }

    // Enter Focused Interaction mode when a player interacts with the object
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
        this.activePlayer = player;
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, {exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot});
        this.sendNetworkEvent(player, sysEvents.OnSetCameraFOV, {newFOV: this.props.cameraFov});
      }
    });

    // Reset status after a player exits Focused Interaction mode
    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer === data.player) {
        this.activePlayer = this.world.getServerPlayer();
        this.sendNetworkEvent(data.player, sysEvents.OnResetCameraFOV, {});
      }
    });

    // Tracking Focused Interaction inputs to check if a button was tapped
    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputEnded, (data) => {
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0 && this.raycastGizmo) {
        const hit: hz.RaycastHit | null = this.raycastGizmo.raycast(interaction.worldRayOrigin, interaction.worldRayDirection);
        if (hit && hit.targetType === hz.RaycastTargetType.Entity && hit.target) {
          this.sendNetworkEvent(hit.target, sysEvents.OnEntityTapped, null);
        }
      }
    });

    // When `OnButtonPressed` is received, update `currentCode`, check if the code is correct. If it is, notify the puzzle manager to finish the puzzle and exit Focused Interaction mode
    this.connectNetworkEvent(this.entity, sysEvents.OnButtonPressed, (data) => {
      if (!this.enabled || this.guessedCode) return;

      ++this.digitCount;
      this.currentCode += data.number + " ";
      this.UpdateDigitsText(this.currentCode);

      if (this.digitCount === this.maxDigitCount) {
        this.guessedCode = this.CheckCode();

        if (this.guessedCode) {
          this.props.digitsText?.color.set(hz.Color.green);
          // Notify the puzzle manager that the puzzle is finished
          if (this.props.puzzleManager) this.sendNetworkEvent(this.props.puzzleManager, sysEvents.OnFinishPuzzle, {});
        } else {
          this.props.digitsText?.color.set(hz.Color.red);
          this.enabled = false;
          this.async.setTimeout(() => this.ResetKeypad(), 1500);
        }
      }
    });
  }

  private ResetKeypad() {
    this.digitCount = 0;
    this.currentCode = "";
    this.UpdateDigitsText(this.currentCode);
    this.props.digitsText?.color.set(this.originalDigitsTextColor);
    this.enabled = true;
  }

  private UpdateDigitsText(newDigitsText: string) {
    this.props.digitsText?.as(hz.TextGizmo)?.text.set("<align=left>" + newDigitsText);
  }

  private CheckCode(): boolean {
    return this.currentCode.replace(/ /g, "") === this.props.correctCode.replace(/ /g, "");
  }
}
hz.Component.register(RoomB_Keypad);
