import { Component, PropTypes, Entity, NetworkEvent, PlayerControls, PlayerInputAction, ButtonIcon, PlayerInput } from 'horizon/core';

// Define the network events that will be sent to the target entity
export const IncreaseSpeedEvent = new NetworkEvent('increaseSpeed');
export const DecreaseSpeedEvent = new NetworkEvent('decreaseSpeed');

class SpeedController extends Component<typeof SpeedController> {
  static propsDefinition = {
    // The entity that will receive the speed control events
    targetEntity: { type: PropTypes.Entity },
  };

  // This must be set to Local in the editor for input to work
  static executionMode = 'local';

  private yAxisInput?: PlayerInput;

  override start() {
    // This script should only run on the client, not the server.
    if (this.entity.owner.get().id === this.world.getServerPlayer().id) {
      return;
    }

    this.setupInputs();
  }

  private setupInputs() {
    if (!this.props.targetEntity) {
      console.error("SpeedController: targetEntity is not set. Cannot send events.");
      return;
    }

    // Connect to the LeftYAxis which handles 'W'/'UpArrow' and 'S'/'DownArrow'
    this.yAxisInput = PlayerControls.connectLocalInput(
      PlayerInputAction.LeftYAxis,
      ButtonIcon.None,
      this
    );

    // Register a callback to handle the input presses
    this.yAxisInput.registerCallback((action, pressed) => {
      if (!this.yAxisInput) return;

      const axisValue = this.yAxisInput.axisValue.get();

      // Check for 'Up' or 'W' key press
      if (pressed && axisValue > 0.5) {
        this.sendIncreaseSpeedEvent();
      }
      // Check for 'Down' or 'S' key press
      else if (pressed && axisValue < -0.5) {
        this.sendDecreaseSpeedEvent();
      }
    });
  }

  private sendIncreaseSpeedEvent() {
    if (this.props.targetEntity) {
      console.log("Sending increaseSpeed event");
      this.sendNetworkEvent(this.props.targetEntity, IncreaseSpeedEvent, {});
    }
  }

  private sendDecreaseSpeedEvent() {
    if (this.props.targetEntity) {
      console.log("Sending decreaseSpeed event");
      this.sendNetworkEvent(this.props.targetEntity, DecreaseSpeedEvent, {});
    }
  }

  override dispose() {
    // The PlayerInput connections are automatically cleaned up because we passed 'this'
    // as the disposableObject when calling connectLocalInput.
  }
}

Component.register(SpeedController);