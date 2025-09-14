# Throwing

A grabbable object being held by a player can be thrown using standard controls on **Web** and **Mobile** (enabled by default).  

It is possible to override these controls to customize the throwing arc.

---

## Disable Standard Throw Controls
Set **Enable Throwing Controls (Web & Mobile)** to **Off** in the entity properties.

---

## Programmatic Throwing
Use `Player.throwHeldItem()` to throw an object.  
Customize with `ThrowOptions`.  
Default values are in `DefaultThrowOptions`.

### Example
```ts
this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player: hz.Player)=> {
  // Ignore on VR devices
  if (player.deviceType.get() == hz.PlayerDeviceType.VR) {
    return;
  }

  // Setup the throw options
  let opt = {
    speed: 25,
    pitch: 30
  }

  // Calling Throw Held Item
  player.throwHeldItem(opt);
});
```
