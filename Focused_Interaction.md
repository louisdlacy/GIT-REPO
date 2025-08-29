# Focused Interaction

> **Note:** Requires local scripting.

Focused Interaction is an interaction mode for **Web and Mobile** users.  
It replaces default input (joysticks/buttons) with **touch and click events** for direct interaction (tap, click, swipe, drag).  

---

## Functionality

### Disabled
- Avatar motion controls (joystick/WASD).  
- Controls for held items.  
- On-screen action buttons (jump, etc.).  
- Default camera and look-around.  

### Enabled
- Direct touch (mobile).  
- Mouse input (desktop).  
- Fixed camera support.  

---

## Input Events

Triggered on local scripts for objects owned by the player:  

- `PlayerControls.onFocusedInteractionInputStarted`  
- `PlayerControls.onFocusedInteractionInputMoved`  
- `PlayerControls.onFocusedInteractionInputEnded`  

Each provides an array of `InteractionInfo`:  

```ts
InteractionInfo = {
  interactionIndex: number; // First input is 0
  screenPosition: Vec3; // Normalized (0,0) to (1,1)
  worldRayOrigin: Vec3; 
  worldRayDirection: Vec3;
};
```

Supports up to **5 unique touches** (IDs 0–4).  

---

## Enter Focused Interaction Mode

```ts
player.enterFocusedInteractionMode();
```

Example with custom button:  

```ts
this.enterFocusInput = hz.PlayerControls.connectLocalInput(
  hz.PlayerInputAction.RightGrip,
  hz.ButtonIcon.Interact,
  this,
);

this.enterFocusInput.registerCallback((action, pressed) => {
  if (pressed) {
    this.entity.owner.get().enterFocusedInteractionMode();
  }
});
```

### Event Broadcast
```ts
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerEnteredFocusedInteraction,
  (player: hz.Player) => {
    // Handle player entering Focused Interaction
  },
);
```

---

## Handling Touch & Click Input

```ts
this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputStarted, (data) => {
  var firstInteraction = data.interactionInfo[0];
  if (firstInteraction.interactionIndex != 0) return;
  // Handle input start
});

this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputMoved, (data) => {
  var firstInteraction = data.interactionInfo[0];
  if (firstInteraction.interactionIndex != 0) return;
  // Handle input move
});

this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputEnded, (data) => {
  var firstInteraction = data.interactionInfo[0];
  if (firstInteraction.interactionIndex != 0) return;
  // Handle input end
});
```

---

## Exit Focused Interaction Mode

```ts
player.exitFocusedInteractionMode();
```

### Example with button
```ts
this.exitFocusInput = hz.PlayerControls.connectLocalInput(
  hz.PlayerInputAction.RightSecondary,
  hz.ButtonIcon.Drop,
  this,
);

this.exitFocusInput.registerCallback((action, pressed) => {
  if (this.isInFIMode) {
    this.entity.owner.get().exitFocusedInteractionMode();
    this.isInFIMode = false;
  }
});
```

### Event Broadcast
```ts
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerExitedFocusedInteraction,
  (player: hz.Player) => {
    // Cleanup after exit
  },
);
```

---

## Disable Exit Button

```ts
player.enterFocusedInteractionMode({ disableFocusExitButton: true });
```

Optional. Defaults to `false`.  

---

## Customize Visual Feedback

### Tap
```ts
let newTapOptions = {
  ...hz.DefaultFocusedInteractionTapOptions,
  duration: 0.25,
  startColor: hz.Color.blue,
  endColor: hz.Color.white,
  startScale: 0.5,
  endScale: 1.2,
  startOpacity: 0.8,
  endOpacity: 0,
  startRotation: 180,
  endRotation: 0,
};

player.focusedInteraction.setTapOptions(true, newTapOptions);
```

### Trail
```ts
let newTrailOptions = {
  ...hz.DefaultFocusedInteractionTrailOptions,
  length: 0.5,
  startColor: hz.Color.blue,
  endColor: hz.Color.white,
  startWidth: 0.8,
  endWidth: 0.1,
  startOpacity: 0.8,
  endOpacity: 0,
};

player.focusedInteraction.setTrailOptions(true, newTrailOptions);
```

---

## Focus Camera on Custom UI

```ts
player.focusUI(selectableEntity, {
  duration: 0.75,
  horizontalOffset: 0,
  verticalOffset: 0.5,
});
```

Unfocus UI:  
```ts
player.unfocusUI();
```
