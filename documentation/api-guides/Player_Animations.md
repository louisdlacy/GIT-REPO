# Player Animations

Since projectile firing is controlled programmatically, you can add hooks in code to play animations.  
Animations play only when visiting Meta Horizon Worlds on **Web** and **Mobile**.

---

## Triggering Animations
Use:
```ts
player.playAvatarGripPoseAnimationByName(AvatarGripPoseAnimationNames.Fire);
```

### AvatarGripPoseAnimationNames Enumeration
```ts
export enum AvatarGripPoseAnimationNames {
  Fire = 'Fire',
  Reload = 'Reload',
  ReadyThrow = 'ReadyThrow',
  ChargeThrow = 'ChargeThrow',
  CancelThrow = 'CancelThrow',
  Throw = 'Throw',
}
```

Some animations vary based on **pose type** (from `AvatarGripPose`).  
Example: Fire animation when holding a sword swings the sword.  
Pose type is visible in grabbable entity properties.

---

## Death / Respawn
You can trigger death and respawn animations:  

```ts
player.playAvatarGripPoseAnimationByName("Die");      // Death
player.playAvatarGripPoseAnimationByName("Respawn");  // Respawn
```

- While dead, player cannot move avatar.  
- Respawn is required to regain control.  

---

## Example Script
```ts
const playAnimationEvent = new CodeBlockEvent<
  [player: Player, animation: string]
>('playAnimation', [PropTypes.Player, PropTypes.String]);

class PlayAnimation extends Component<Props> {
  start() {
    this.connectCodeBlockEvent(
      this.entity,
      playAnimationEvent,
      (player: Player, animation: string) => {
        player.playAvatarGripPoseAnimationByName(animation);
      },
    );
  }
}

Component.register(PlayAnimation);
```
