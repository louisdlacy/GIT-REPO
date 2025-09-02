# Holster Icon Menu

The holster icon menu is a UI menu showing icons for items attached to a player’s avatar.  
Players can use these icons to **switch between and equip items**.  
Icons represent grabbable entities attached to the player.

> **Note:** The holster button appears if a player has more than one grabbable entity attached.

---

## Attaching a Grabbable Entity to a Player
For an item to appear in the holster icon menu when not equipped, attach it to the player:

```ts
this.entity
  .as(hz.AttachableEntity)
  .attachToPlayer(player, AttachablePlayerAnchor.Torso);
```

Combine with input action for controlled attachment:

```ts
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnIndexTriggerUp,
  (player: Player) => {
    this.entity
      .as(hz.AttachableEntity)
      .attachToPlayer(player, AttachablePlayerAnchor.Torso);
  },
);
```

---

## Configure Entity Appearance in Holster Icon Menu

- **Default value**: Shows default slot number.  
- **Action icon value**: Shows selected action icon.  
- **None**: Excludes entity from holster menu.  

### To exclude an entity:
- Select **None** in Holster Icon property.  
- Or set **Who Can Grab?** property to an empty array of Script assignees.  

---

## Available Action Icons
Examples of icons selectable for controls (Web & Mobile):  

- Shoot  
- Reload  
- Jump  
- Unholster  
- Drop  
- Special  
- Grab  
- Interact  
- Throw  
- Ability  
- Rocket  
- Airstrike  
- Swing  
- Swap  
- Inspect  
- Open Door  
- Shield  
- Aim  
- Dual Wield  
- Sprint  
- Crouch  
- Eat  
- Drink  
- Speak  
- Purchase  
- Place  
- Heal  
