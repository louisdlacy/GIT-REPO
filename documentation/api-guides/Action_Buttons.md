# Action Buttons

You can use the action icons system to determine which control icons are visible on mobile devices.  
For **grabbable entities**, select the entity and then choose the action icons for **Primary Action Icon**, **Secondary Action Icon**, and **Tertiary Action Icon**.  

- Setting action icons is optional.  
- Selecting **None** removes the control from the screen.  

---

## Hide Action Buttons by Default
Available in **Player Settings** (Desktop Editor or VR Publishing menu).

- **Toggled On**: Hide action buttons unless explicitly set in properties.  
- **Toggled Off**: All action buttons visible when holding a grabbable.  

---

## Handling Button Presses
Each action button is tied to scripting and CodeBlock events:  

| Action Button | Scripting Event              | CodeBlocks Event          |
|---------------|-------------------------------|---------------------------|
| Primary       | ScriptingIndexTriggerAction  | Trigger pressed           |
| Secondary     | ScriptingButton1Action       | Button 1 pressed          |
| Tertiary      | ScriptingButton2Action       | Button 2 pressed          |

---

## Handling Custom Inputs
> **Note:** Requires Local Script.

You can dynamically spawn icons on a bar at the bottom of the screen.  
These can trigger any scripting event.

```ts
import {
  ButtonIcon,
  ButtonPlacement,
  PlayerControls,
  PlayerInput,
  PlayerInputAction,
} from 'horizon/core';
import * as hz from 'horizon/core';

class SimpleInputAPITest extends hz.Component {
  static propsDefinition = {};

  specialAbilityInput?: PlayerInput;

  start() {
    if (PlayerControls.isInputActionSupported(PlayerInputAction.RightSecondary)) {
      // Maps to F key on desktop
      this.specialAbilityInput = PlayerControls.connectLocalInput(
        PlayerInputAction.RightSecondary,
        ButtonIcon.Special,
        this,
        {preferredButtonPlacement: hz.ButtonPlacement.Center},
      );
      this.specialAbilityInput.registerCallback((action, pressed) => {
        // Fire Special Ability
      });
    }
  }
}

hz.Component.register(SimpleInputAPITest);
```

To hide the button when not needed:
```ts
this.specialAbilityInput?.disconnect();
```

Multiple buttons can be summoned on this bar to provide a broad range of inputs for mobile.

---

## Available Action Icons
Examples of available icons:  

- Ability  
- Aim  
- Call Overlay  
- Close  
- Contract  
- Door  
- Drink  
- Drop  
- Eat  
- Emotes  
- Exit Full screen  
- Exit Meta Horizon Worlds  
- Expand  
- Fire  
- Fire Special  
- Grab  
- Home  
- Information  
- Inspect  
- Interact  
- Jump  
- Left Chevron  
- Map  
- Menu  
- Mouse Left  
- Mouse Middle  
- Mouse Right  
- Mouse Scroll  
- Pause  
- Ping  
- PUI  
- Punch  
- Purchase  
- Reload  
- Report Bug  
- Right Chevron  
- Rocket  
- Rocket Jump  
- Shield  
- Speak  
- Special  
- Sprint  
- Swap  
- Swing Weapon  
- Throw  
- Unholster  
- Use  
- World Chat  
