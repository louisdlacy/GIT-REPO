# Per Platform Scripting

You can use TypeScript to identify the type of device that the user is playing on.  
Use the **Player.deviceType** property with the **PlayerDeviceType** enum in a switch block.

## Example
```ts
switch (player.deviceType.get()) {
  case PlayerDeviceType.VR:
    // Logic for VR players
    break;
  case PlayerDeviceType.Desktop:
    // Logic for Desktop players
    break;
  case PlayerDeviceType.Mobile:
    // Logic for Mobile players
    break;
  default:
    // Logic for unknown or fallback
    break;
}
```
