import * as hz from 'horizon/core';
import { moveGemToCourse, collectGem } from 'GameManager_COMPLETE';

class GemControllerExample extends hz.Component<typeof GemControllerExample> {
  static propsDefinition = {
    coursePositionRef: {type: hz.PropTypes.Entity},
  };
  private hiddenLocation = new hz.Vec3(0, -100, 0);

  start() {
    this.connectLocalEvent(
      this.entity,
      moveGemToCourse,
      () => {
        this.onMoveGemToCourseEvent();
      }
    );

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerCollision,
      (collidedWith: hz.Player) => {
        this.handleCollision();
      }
    );

    this.entity.position.set(this.hiddenLocation);
  }

  private handleCollision(): void {
    this.entity.position.set(this.hiddenLocation);
    this.sendLocalBroadcastEvent(
      collectGem,
      {gem: this.entity},
    );

  }

  private onMoveGemToCourseEvent(): void {
    this.entity.position.set(this.props.coursePositionRef!.position.get());
  }

}
hz.Component.register(GemControllerExample);
