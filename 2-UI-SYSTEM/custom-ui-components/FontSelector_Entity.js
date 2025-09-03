"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class FontSelector_Entity extends core_1.Component {
    start() {
        let displayMe = this.entity.as(core_1.TextGizmo).text.get();
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
        this.entity.as(core_1.TextGizmo).text.set(displayMe);
    }
}
FontSelector_Entity.propsDefinition = {
    bangers: { type: core_1.PropTypes.Boolean, default: false },
    anton: { type: core_1.PropTypes.Boolean, default: false },
    electronicHighwaySign: { type: core_1.PropTypes.Boolean, default: false },
    oswaldBold: { type: core_1.PropTypes.Boolean, default: false },
    robotoBold: { type: core_1.PropTypes.Boolean, default: false },
};
core_1.Component.register(FontSelector_Entity);
