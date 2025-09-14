import { ButtonIcon, Component, Entity, Player, PlayerControls, PlayerInputAction, PropTypes, World } from 'horizon/core';
import { Binding, DynamicList, Text, UIComponent, UINode, View } from 'horizon/ui';

const inputData = new Binding<InputData[]>([]);

type InputData = {
  name: string;
  timestamp: number;
}

class InputViewer extends Component<typeof InputViewer> {
  static propsDefinition = {
    ui: { type: PropTypes.Entity }
  };

  inputBuffer: InputData[] = [];

  owner?: Player;

  preStart() {
    this.owner = this.entity.owner.get();

    this.props.ui?.owner.set(this.owner);

    if (this.owner === this.world.getServerPlayer()) {
      return;
    }

    // Create input callbacks for all possible PlayerInputAction values
    const inputActions = [
      PlayerInputAction.Jump,
      PlayerInputAction.RightPrimary,
      PlayerInputAction.RightSecondary,
      PlayerInputAction.RightTertiary,
      PlayerInputAction.RightGrip,
      PlayerInputAction.RightTrigger,
      PlayerInputAction.RightXAxis,
      PlayerInputAction.RightYAxis,
      PlayerInputAction.LeftPrimary,
      PlayerInputAction.LeftSecondary,
      PlayerInputAction.LeftTertiary,
      PlayerInputAction.LeftGrip,
      PlayerInputAction.LeftTrigger,
      PlayerInputAction.LeftXAxis,
      PlayerInputAction.LeftYAxis
    ];

    // Connect each input action and register callbacks
    inputActions.forEach(action => {
      const input = PlayerControls.connectLocalInput(action, ButtonIcon.None, this);
      input.registerCallback((inputAction, pressed) => {
        if (pressed) {
          let inputNameArray = PlayerControls.getPlatformKeyNames(inputAction);

          // Check if it's an axis input and value is over 0, then use index 1
          const isAxis = inputAction === PlayerInputAction.RightXAxis ||
            inputAction === PlayerInputAction.RightYAxis ||
            inputAction === PlayerInputAction.LeftXAxis ||
            inputAction === PlayerInputAction.LeftYAxis;

          console.log(isAxis, input.axisValue);

          let inputName = inputNameArray[0];
          if (isAxis) {
            const text = inputName.split("/");
            if (input.axisValue.get() > 0) {
              inputName = text[1];
            } else {
              inputName = text[0];
            }
          }

          inputName = `${PlayerInputAction[inputAction]} - ${inputName}`;

          this.inputBuffer.push({ name: inputName, timestamp: Date.now() });
          
          // Force remove the top (oldest) input if there are over 10 inputs
          if (this.inputBuffer.length > 10) {
            this.inputBuffer.shift();
          }
          
          inputData.set([...this.inputBuffer]);
        }
      });
    });

    this.connectLocalBroadcastEvent(World.onUpdate, this.onUpdate)
  }

  start() { }

  onUpdate = (data: { deltaTime: number }) => {
    // After 3 seconds, clear from the input buffer
    const now = Date.now();
    const filteredBuffer = this.inputBuffer.filter(input => now - input.timestamp < 3000);

    // Only update if the buffer changed
    if (filteredBuffer.length !== this.inputBuffer.length) {
      this.inputBuffer = filteredBuffer;
      inputData.set([...this.inputBuffer]);
    }
  }
}
Component.register(InputViewer);


class InputViewerUI extends UIComponent<typeof InputViewer> {
  protected panelWidth: number = 800;
  protected panelHeight: number = 600;

  static propsDefinition = {};

  initializeUI(): UINode {
    return View({
      children: [
        View({
          children: [
            Text({
              text: "Input\nViewer",
              style: {
                fontSize: 20,
                fontWeight: "bold",
                color: "#000",
                marginBottom: 16,
                textAlign: "center",
                marginTop: 150
              }
            }),
            DynamicList({
              data: inputData,
              renderItem: (item) => {
                return this.showInput(item);
              },
              style: {
                flex: 1
              }
            })
          ],
          style: {
            flex: 1
          }
        }),
        View({
          style: {
            flex: 6,
          }
        })
      ],
      style: {
        flex: 1,
        flexDirection: "row",
      }
    });
  }

  showInput(item: InputData): UINode {
    return View({
      children: [
        Text({
          text: item.name,
          style: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#000"
          }
        })
      ],
      style: {
        padding: 8,
        width: "100%",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
      }
    });
  }
}
UIComponent.register(InputViewerUI);
