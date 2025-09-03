"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBox_ExpCurve = void 0;
const core_1 = require("horizon/core");
class BigBox_ExpCurve extends core_1.Component {
    ExpToCurrentLevel(exp) {
        var level = Math.log(exp / this.props.base + 1) / Math.log(2 * this.props.curveSteepness);
        level = Math.floor(level) + 1;
        return level;
    }
    ExpToPercentToNextLevel(exp) {
        var level = BigBox_ExpCurve.instance.ExpToCurrentLevel(exp);
        var expForLevel = this.props.base * (Math.pow(2 * this.props.curveSteepness, level - 1) - 1);
        var excessExp = exp - expForLevel;
        var totalExpForLevel = this.props.base * (Math.pow(2 * this.props.curveSteepness, level) - 1) - expForLevel;
        return excessExp / totalExpForLevel;
    }
    preStart() {
        BigBox_ExpCurve.instance = this;
    }
    start() { }
}
exports.BigBox_ExpCurve = BigBox_ExpCurve;
BigBox_ExpCurve.propsDefinition = {
    base: { type: core_1.PropTypes.Number, default: 100.0 },
    curveSteepness: { type: core_1.PropTypes.Number, default: 1.0 },
};
core_1.Component.register(BigBox_ExpCurve);
