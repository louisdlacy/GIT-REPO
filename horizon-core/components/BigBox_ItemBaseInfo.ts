import * as hz from 'horizon/core';
import { Asset } from 'horizon/core';

/**
 * Immutable information about an item
 * Can be inherited from to create assets with additional properties
 */
export class BigBox_ItemBaseInfo extends hz.Component<typeof BigBox_ItemBaseInfo> {
  static propsDefinition = {
    id: { type: hz.PropTypes.String },  // how this item will be indentified across the game
    name: { type: hz.PropTypes.String },// user facing name
    model: { type: hz.PropTypes.Asset },// reference to visual asset that will be spawned in the world
    color: { type: hz.PropTypes.Color }
  };

  start() {
  }
}
hz.Component.register(BigBox_ItemBaseInfo);
