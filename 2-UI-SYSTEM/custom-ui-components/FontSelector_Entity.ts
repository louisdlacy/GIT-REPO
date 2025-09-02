import { Component, PropTypes, TextGizmo } from "horizon/core";


class FontSelector_Entity extends Component<typeof FontSelector_Entity> {
  static propsDefinition = {
    bangers: { type: PropTypes.Boolean, default: false },
    anton: { type: PropTypes.Boolean, default: false },
    electronicHighwaySign: { type: PropTypes.Boolean, default: false },
    oswaldBold: { type: PropTypes.Boolean, default: false },
    robotoBold: { type: PropTypes.Boolean, default: false },
  };

  start() {
    let displayMe = this.entity.as(TextGizmo).text.get();

    if (this.props.bangers) {
      displayMe = '<font=bangers sdf>' + displayMe;
    }
    else if (this.props.anton) {
      displayMe = '<font=anton sdf>' + displayMe;
    }
    else if (this.props.electronicHighwaySign) {
      displayMe = '<font=electronic highway sign sdf>' + displayMe;
    }
    else if (this.props.oswaldBold) {
      displayMe = '<font=oswald bold sdf>' + displayMe;
    }
    else if (this.props.robotoBold) {
      displayMe = '<font=roboto-bold sdf>' + displayMe;
    }

    this.entity.as(TextGizmo).text.set(displayMe);
  }
}
Component.register(FontSelector_Entity);