# Custom Input API

> **Note:** Requires local scripting.

Meta Horizon Worlds custom input APIs provide support for **Web and Mobile** gameplay.  
They allow binding actions to **PC keyboard keys** and **on-screen mobile controls**.

---

## Key Classes and Methods

### PlayerControls Class
Static methods for binding and querying custom input.

### Methods
- **connectLocalInput()**  
  Connects to local player input.  
  On mobile, shows on-screen buttons.  
  Supports joystick axes: `PlayerInputAction.LeftXAxis` / `LeftYAxis`.  

- **getPlatformKeyNames()**  
  Returns the key/button names bound to an action.  

- **isInputActionSupported()**  
  Returns `true`/`false` if input action is supported.  

- **disableSystemControls() / enableSystemControls()**  
  Toggles on-screen system buttons.  

> Scripts must run in **Local mode**. The entity’s owner must be the Player.

---

## Enumeration: PlayerInputAction
Lists 15 available actions (name, index, controller button, desktop key, mobile button).  
Bindings can be changed in game settings.

---

## Example: Disable Controls

```ts
import * as hz from 'horizon/core';

class DisableControls extends hz.Component {
  start() {
    hz.PlayerControls.disableSystemControls();
  }
}
```

---

## Custom Input Example

Registers jump action (Spacebar on PC, on-screen button on Mobile).

```ts
import * as hz from 'horizon/core';

class SimpleInputAPITest extends hz.Component {
  input?: hz.PlayerInput;

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      player => this.entity.owner.set(player),
    );

    if (this.entity.owner.get().id != this.world.getServerPlayer().id) {
      const options = {preferredButtonPlacement: hz.ButtonPlacement.Center};

      if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.Jump)) {
        this.input = hz.PlayerControls.connectLocalInput(
          hz.PlayerInputAction.Jump,
          hz.ButtonIcon.Jump,
          this,
          options,
        );

        this.input.registerCallback((action, pressed) => {
          const keyName = hz.PlayerControls.getPlatformKeyNames(action)[0];
          console.log('Action pressed callback', action, keyName, pressed);
        });
      }
    }
  }
}

hz.Component.register(SimpleInputAPITest);
```

---

## Adding Custom Icons

Upload a **texture asset** and reference it as a property.  

```ts
class SimpleInputAPITest extends hz.Component<typeof SimpleInputAPITest> {
  static propsDefinition = {
    iconAsset: { type: hz.PropTypes.Asset },
  };

  input?: hz.PlayerInput;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, player => {
      this.entity.owner.set(player);
    });

    if (this.entity.owner.get().id != this.world.getServerPlayer().id) {
      const options = {
        preferredButtonPlacement: hz.ButtonPlacement.Center,
        customAssetIconId: this.props.iconAsset?.id.toString() ?? undefined,
      };

      if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.Jump)) {
        this.input = hz.PlayerControls.connectLocalInput(
          hz.PlayerInputAction.Jump,
          hz.ButtonIcon.Jump,
          this,
          options,
        );

        this.input.registerCallback((action, pressed) => {
          const keyName = hz.PlayerControls.getPlatformKeyNames(action)[0];
          console.log('Action pressed callback', action, keyName, pressed);
        });
      }
    }
  }
}

hz.Component.register(SimpleInputAPITest);
```

---

## How to Modify for Other Actions
- Change the `PlayerInputAction` enum used in:  
  - `isInputActionSupported()`  
  - `connectLocalInput()`  
  - `getPlatformKeyNames()`  
