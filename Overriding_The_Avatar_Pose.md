# Overriding the Avatar Pose

You can programmatically override the avatar pose on a grabbable item at runtime.  
This lets you play a different set of animations.  

**Example use case:** Use a gun in melee by switching to the sword set.

---

## Methods
- `setAvatarGripPoseOverride`  
- `clearAvatarGripPoseOverride`  

Available poses are defined in the **AvatarGripPose** enumeration.

---

## Example
```ts
fireGun(player: hz.Player) {
  // Switch back to the default animation set
  player.clearAvatarPoseOverride();
  player.playAvatarPoseAnimationByName(AvatarPoseAnimationNames.Fire);
}

meleeAttack(player: Player) {
  // Switch to using the sword animation set
  player.setAvatarPoseOverride(AvatarPose.Sword);
  player.playAvatarPoseAnimationByName(AvatarPoseAnimationNames.Fire);
}
```
