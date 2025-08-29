# Aim Assist

Aim assist helps balance competitive gameplay across different devices.  
On **mobile**, users may struggle with fast twitch controls in high stress situations. Aim assist helps them track potential targets.

---

## API Overview
Found in `horizon/core`.

### Controls
- `Player.setAimAssistTarget()`  
  Suggest a target (Player, Entity, or Vec3).  

- `Player.clearAimAssistTarget()`  
  Clears the current target.  

### Options
- `AimAssistOptions` type for configuration.  

---

## Example Usage
A system can gather all active players and periodically:  
1. Check which is closest to a player’s aiming direction.  
2. Set that as the **aim assist target**.  
3. If no valid targets, clear the list.  

Example from **Super Rumble**:  
- Continuously updates nearest player as target.  
- Clears when no nearby targets exist.  
