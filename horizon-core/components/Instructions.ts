import * as hz from 'horizon/core';
import { UIComponent, UINode, View, Text } from 'horizon/ui'; // Note: You will need to enable the UI module in the scripting settings to use this class.
import { InstructionConsts } from 'InstructionConsts';


class Instructions extends UIComponent {
  static propsDefinition = {
    name: {type: hz.PropTypes.String},
  }
  initializeUI() {
    return View({
      children: Text({text: InstructionConsts[this.props.name], style: {color: 'black', fontFamily: 'Optimistic', fontSize: 25}}),
      style: {backgroundColor: 'transparent'}
    });
  }
}
UIComponent.register(Instructions);
