# Camera

This article covers how to set up and control camera perspectives for web and mobile players using both spawn point configuration and the Camera API via TypeScript.

---

## Setting Camera Mode via Spawn Point

The spawn point can be configured to control the player’s camera when they enter your world.

**Steps:**
1. Open creator menu and select Gizmos.  
2. Select SpawnPoint.  
3. Move it into place, open ...Properties.  
4. Use **Mobile Camera** dropdown to set the mode.  

### Available Camera Modes

| Mode         | Description | Options |
|--------------|-------------|---------|
| None         | Default camera behavior. | None |
| First Person | Player POV. | None |
| Third Person | Camera follows behind player. | None |
| Orbit        | Dynamically follows, not fixed behind. | Distance |
| Pan          | Fixed position offset from player. | Position offset (X, Y, Z) |
| Follow       | Tracks player with auto-rotate. | Auto-follow delay, Continuous rotation, Horizon levelling, Rotation rate |

---

## Camera Control with the Camera API

Change camera modes and properties via TypeScript.

**Notes:**
- No effect in VR (always first person).  
- Scripts must run in **Local mode**.  
- Supports smooth transitions with easing/duration.  

### Import
```ts
import LocalCamera, {CameraTransitionOptions, Easing} from 'horizon/camera';
```

### Transition Options
```ts
const transitionOptions = {
  duration: 0.5,
  easing: Easing.EaseInOut,
};
```

---

## API Examples

### First Person
```ts
LocalCamera.setCameraModeFirstPerson();
LocalCamera.setCameraModeFirstPerson({ duration: 0.5, easing: Easing.EaseInOut });
```

### Third Person
```ts
LocalCamera.setCameraModeThirdPerson();
```

### Fixed
```ts
LocalCamera.setCameraModeFixed();
LocalCamera.setCameraModeFixed({
  position: new hz.Vec3(0, 1, -5),
  rotation: hz.Quaternion.fromEuler(new hz.Vec3(0, 0, 0)),
  duration: 0.5,
  easing: Easing.EaseInOut,
});
```

### Attach to Entity
```ts
LocalCamera.setCameraModeAttach(targetEntity);
LocalCamera.setCameraModeAttach(targetEntity, {
  positionOffset: new hz.Vec3(0, 0, -5),
  translationSpeed: 1,
  rotationSpeed: 1,
  duration: 0.5,
  easing: Easing.EaseInOut,
});
```

### Pan
```ts
LocalCamera.setCameraModePan({
  positionOffset: new hz.Vec3(25, 0, 0),
  translationSpeed: 1,
});
```

### Follow
```ts
LocalCamera.setCameraModeFollow();
LocalCamera.setCameraModeFollow({
  activationDelay: 2.0,
  cameraTurnSpeed: 1.0,
  continuousRotation: false,
  distance: 5.0,
  horizonLevelling: false,
  rotationSpeed: 0.0,
  translationSpeed: 0.0,
  verticalOffset: 0.0,
});
```

### Field of View
```ts
LocalCamera.overrideCameraFOV(72.5);
LocalCamera.overrideCameraFOV(72.5, { duration: 0.5, easing: Easing.EaseInOut });
```

### Camera Roll
```ts
LocalCamera.setCameraRollWithOptions(30);
LocalCamera.setCameraRollWithOptions(30, { duration: 0.5, easing: Easing.EaseInOut });
```

### Look At Position
```ts
let cameraLookAtPos = LocalCamera.lookAtPosition.get();
```

### Camera Collision
```ts
LocalCamera.collisionEnabled.set(true);
```

### Perspective Switching
```ts
LocalCamera.perspectiveSwitchingEnabled.set(false);
```

### Modify at Runtime
```ts
LocalCamera.getCameraModeObjectAs(AttachCameraMode)?.rotationSpeed.set(10);
```

If the requested mode doesn’t match current mode, returns null.
