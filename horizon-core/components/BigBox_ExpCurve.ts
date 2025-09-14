import { Component, PropTypes } from 'horizon/core';

export class BigBox_ExpCurve extends Component<typeof BigBox_ExpCurve>{
  static propsDefinition = {
    base: { type: PropTypes.Number, default: 100.0 },
    curveSteepness: { type: PropTypes.Number, default: 1.0 },
  };

  static instance: BigBox_ExpCurve;

  public ExpToCurrentLevel(exp: number): number {
    var level = Math.log(exp / this.props.base + 1) / Math.log(2 * this.props.curveSteepness);
    level = Math.floor(level) + 1;
    return level;
  }

  public ExpToPercentToNextLevel(exp: number): number {
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
Component.register(BigBox_ExpCurve);
