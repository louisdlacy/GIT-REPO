# Grabbable Entities on Mobile and Web

A Grabbable entity is an entity that has **Motion** set to *Interactive*, and **Interaction** set to *Grabbable* or *Both*. Examples: guns and handheld devices. They require small adjustments to function correctly on Web and Mobile.

---

## Adjustments Needed

### Set the Avatar Pose
- Defines position/animation when holding grabbable.  
- Found in **Properties > More > Avatar Pose**.

### Play Avatar Animations
- Use `Trigger grip animation for player` CodeBlock.  
- Animation names: **Fire** and **Reload**.  
- Example: *Sword* plays swing animation on Fire.

### Grab Anchors
- If item is held incorrectly: enable **Use HWXS Grab Anchor** in properties.  
- Allows setting grab anchor position/rotation.  
- Overrides behavior for web/mobile only.

### Disable Physics While Grabbed
- Prevents hand collision issues.  
- In properties: set Motion = *Interactive*, Interaction = *Physics and Grabbable*.  
- Enable **Disable physics while grabbed**.  

#### Example: Programmatically Control Physics
```ts
import * as hz from 'horizon/core';

class PhysicsGrabbable extends hz.Component<typeof PhysicsGrabbable> {
  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, () => {
      this.entity.interactionMode.set(hz.EntityInteractionMode.Grabbable);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, () => {
      this.entity.interactionMode.set(hz.EntityInteractionMode.Both);
    });
  }
}

hz.Component.register(PhysicsGrabbable);
```

---

### Set the Aim Direction
- Use **GrabbableAim property** to define true firing direction.  
- Ensures bullets align with reticle center.  
- Works only if projectile launcher ownership is assigned to player.

### Set the Action Button Icons
- Controls what icons appear on mobile.  
- Found in **Properties > Primary/Secondary/Tertiary Action Icon**.  
- Defaults: trigger = Fire, Secondary = Button 1, Tertiary = Button 2.  
- Can set to specific icons or *None*.  

#### Hide by Default
- Hide all action buttons globally via **Player Settings**.  
- Only explicitly set icons will show.

#### Manage Button Presses
- Each button triggers a CodeBlock event when pressed while entity held.

---

### Crosshair Selection
- Default: dot.  
- Options: None, Dot, Cross, Spread.  
- Set via **Crosshair Type property**.

---

## Configurable Interaction Range

Controls how close a player must be to interact. Helps balance accessibility and precision.

### Options
- **Targeting Delay After Release**: Wait time before retarget allowed.  
- **Perfect Rank Distance**: Ideal distance = highest priority.  
- **Max Distance**: Beyond = no targeting.  
- **Distance Rank Multiplier**: Scales distance importance.  
- **Perfect Rank Angle**: Ideal angle for targeting.  
- **Max Angle**: Outside this angle = ignored.  
- **Angle Rank Multiplier**: Scales angle importance.  
- **Bypass Line of Sight**: Allows targeting without LOS.  
- **Use Raycast Direction**: Use raycast instead of fixed shoulder-to-hand direction.  
- **Use Grab Anchors**: Use predefined anchor points.  

### Setting Interaction Range
- Found in **Properties > Interactable Entity**.  
- Customize effective distance for grabbing.  
