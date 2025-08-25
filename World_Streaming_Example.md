# Example: Create a World with Sublevels

## Create sublevel worlds
1. In Horizon Desktop Editor, create `Sublevel1` and `Sublevel2` with Custom model imports.
2. Place recognizable geometry (e.g., green objects in Sublevel1, red in Sublevel2).
3. Create a new sublevel entity in each world.
4. Set type to **Exclude** and rename to "Testing Only".
5. Drag default spawn point under this entity.
6. Publish both worlds (set **Visible to the public** = off).

## Create parent world
1. Create new world `Overworld` with Custom model imports.
2. Add the sublevels to Overworld.

## Link the sublevels
- Set Sublevel Type = Deeplink.  
- Choose sublevels via world picker dialog.  

## Position sublevels
- Move using transform handles for visibility.  

## Set initial state of sublevels
- **Active**: loaded + active.  
- **Loaded**: loaded, not visible.  
- **Unloaded**: not loaded.  
