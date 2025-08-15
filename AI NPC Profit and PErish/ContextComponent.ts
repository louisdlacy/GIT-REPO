import { BaseComponent } from 'BaseComponent';
import * as hz from 'horizon/core';
import { LogLevel } from 'BaseLogger';

/**
 * ContextComponent is an abstract base class for components that manage contextual information for NPCs.
 *
 * This class provides a foundation for components that need to store and manage
 * key-value pairs of contextual information. Each context item has a key and a description.
 * The class handles initialization, validation, and fallback logic for these properties.
 *
 * @template T - The type parameter that extends the component's properties
 * @extends BaseComponent<typeof ContextComponent & T>
 */
export abstract class ContextComponent<T> extends BaseComponent<typeof ContextComponent & T> {
  static propsDefinition = {
    ...BaseComponent.propsDefinition,
    itemKey: { type: hz.PropTypes.String },
    itemDescription: { type: hz.PropTypes.String }
  };

  key: string = '';
  description: string = '';

  start() {
    //ensure we've got something for key and value
    this.key = this.props.itemKey;
    this.description = this.props.itemDescription;

    if (this.description == this.key && this.key == null) {
      this.log(`${this.entity.name} is missing parameters`, true, LogLevel.Warn);
      return;
    }

    if (!this.description) {
      this.description = this.key;
    }
    if (!this.key) {
      this.key = this.description;
    }
  }
}
