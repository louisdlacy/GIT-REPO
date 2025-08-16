import { Text, UIComponent, UINode, View } from 'horizon/ui';
import { Component, Entity, PropTypes, CodeBlockEvents, Player } from 'horizon/core';

class DragMeUI extends UIComponent<typeof DragMeUI> {
  protected panelHeight: number = 500;
  protected panelWidth: number = 500;

  static propsDefinition = {};

  initializeUI(): UINode {
    return View({
      children: [
        Text({
          text: "Drag Me",
          style: {
            fontSize: 100,
            textAlign: 'center',
            textAlignVertical: 'center',
            height: this.panelHeight,
            width: this.panelWidth,
          }
        })
      ],
      style: {
        backgroundColor: 'black',
        flex: 1
      }
    });
  }
}
UIComponent.register(DragMeUI);

class OwnershipManager extends Component<typeof OwnershipManager> {
  static propsDefinition = {
    local: { type: PropTypes.Entity }
  }

  local?: Entity;

  serverPlayer?: Player;

  start() {
    this.local = this.props.local;

    this.serverPlayer = this.world.getServerPlayer();

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterWorld,
      (player) => {
        this.local?.owner.set(player);
      }
    )

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      (player) => {
        if (this.local?.owner.get() === player) {
          this.local?.owner.set(this.serverPlayer!);
        }
      }
    );
  }
}
Component.register(OwnershipManager);