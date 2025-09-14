import * as hz from "horizon/core";

import { PB_AnimatedComponent } from "./PartsBasedAnimationSystem";

class EgyptianSpider extends PB_AnimatedComponent<typeof EgyptianSpider> {
  static propsDefinition = PB_AnimatedComponent.withProps({
    on: { type: hz.PropTypes.Boolean },
  });

  start() {
    if (!this.props.on) return;
    this.playAnimation({
      animationName: "Attack",
      callbacks: {
        byFrame: {},
      },
    });
  }

  protected onUpdate = (_deltaTime: number) => {
    if (!this.props.on) return;
  };
}

hz.Component.register(EgyptianSpider);
