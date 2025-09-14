import * as hz from 'horizon/core';

class HUDManager extends hz.Component<typeof HUDManager> {
  static propsDefinition = {
    hud1: { type: hz.PropTypes.Entity },
    hud2: { type: hz.PropTypes.Entity },
    hud3: { type: hz.PropTypes.Entity },
    hud4: { type: hz.PropTypes.Entity },
    hud5: { type: hz.PropTypes.Entity },
    hud6: { type: hz.PropTypes.Entity },

    // Player name properties
    name1: { type: hz.PropTypes.String, default: "" },
    name2: { type: hz.PropTypes.String, default: "" },
    name3: { type: hz.PropTypes.String, default: "" },
    name4: { type: hz.PropTypes.String, default: "" },
    name5: { type: hz.PropTypes.String, default: "" },
    name6: { type: hz.PropTypes.String, default: "" },
    name7: { type: hz.PropTypes.String, default: "" },
    name8: { type: hz.PropTypes.String, default: "" },
    name9: { type: hz.PropTypes.String, default: "" },
    name10: { type: hz.PropTypes.String, default: "" },
    name11: { type: hz.PropTypes.String, default: "" },
    name12: { type: hz.PropTypes.String, default: "" },
    name13: { type: hz.PropTypes.String, default: "" },
    name14: { type: hz.PropTypes.String, default: "" },
    name15: { type: hz.PropTypes.String, default: "" },
  };

  private attachedPlayers: Map<number, hz.Entity> = new Map(); // Stores which player has which HUD
  private originalPositions: Map<number, hz.Vec3> = new Map(); // Stores original positions of HUDs

  preStart() {
    // Store original positions of each HUD
    for (let i = 1; i <= 6; i++) {
      const hudPropName = `hud${i}` as keyof typeof this.props;
      const hudEntity = this.props[hudPropName] as hz.Entity | null; 
      if (hudEntity) {
        this.originalPositions.set(i, hudEntity.position.get());
      }
    }

    // Connect player enter and exit events
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      this.onPlayerEnterWorld(player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      this.onPlayerExitWorld(player);
    });
  }

  start() {
    // Empty implementation to satisfy the abstract class requirements
  }

  private onPlayerEnterWorld(player: hz.Player): void {
    const playerName = player.name.get();
    if (!this.isPlayerEligible(playerName) || this.attachedPlayers.has(player.id)) return;

    const availableHUD = this.findAvailableHUD();
    if (availableHUD) {
      // Attach the HUD to the player's head
      availableHUD.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Head);
      this.attachedPlayers.set(player.id, availableHUD);
      availableHUD.owner.set(player);

      // Make the HUD invisible to the player it is attached to
      availableHUD.setVisibilityForPlayers([player], hz.PlayerVisibilityMode.HiddenFrom);

      // Ensure the HUD is visible to other players
      const allPlayers = this.world.getPlayers();
      this.setHUDVisibleToOthers(availableHUD, player, allPlayers); 
    }
  }

  private setHUDVisibleToOthers(hudEntity: hz.Entity, player: hz.Player, allPlayers: hz.Player[]): void {
    // Loop through all other players and make sure the HUD is visible to them
    for (const otherPlayer of allPlayers) {
      if (otherPlayer.id !== player.id) {
        hudEntity.setVisibilityForPlayers([otherPlayer], hz.PlayerVisibilityMode.VisibleTo);  
      }
    }
  }

  private onPlayerExitWorld(player: hz.Player): void {
    const attachedHUD = this.attachedPlayers.get(player.id);
    if (attachedHUD) {
      attachedHUD.as(hz.AttachableEntity)?.detach();
      const hudIndex = this.getHUDIndex(attachedHUD);
      if (hudIndex !== undefined) {
        const originalPos = this.originalPositions.get(hudIndex);
        if (originalPos) attachedHUD.position.set(originalPos);
        attachedHUD.resetVisibilityForPlayers();
      }
      this.attachedPlayers.delete(player.id);
    }
  }

  private isPlayerEligible(playerName: string): boolean {
    for (let i = 1; i <= 15; i++) {
      const nameProp = `name${i}` as keyof typeof this.props;
      if (this.props[nameProp] === playerName) return true;
    }
    return false;
  }

  private findAvailableHUD(): hz.Entity | null {
    for (let i = 1; i <= 6; i++) {
      const hudPropName = `hud${i}` as keyof typeof this.props;
      const hudEntity = this.props[hudPropName] as hz.Entity | null;
      if (hudEntity && !Array.from(this.attachedPlayers.values()).includes(hudEntity)) return hudEntity;
    }
    return null;
  }

  private getHUDIndex(hudEntity: hz.Entity): number | undefined {
    for (let i = 1; i <= 6; i++) {
      const hudPropName = `hud${i}` as keyof typeof this.props;
      if (this.props[hudPropName] === hudEntity) return i;
    }
    return undefined;
  }
}

hz.Component.register(HUDManager);