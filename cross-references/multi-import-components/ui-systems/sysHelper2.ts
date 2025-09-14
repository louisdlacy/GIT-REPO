//Domain specific utilities for your system (e.g. getEntityListByTag, getPlayerData, getLocalizedText, etc.)
// import { AvatarAIAgent } from "horizon/avatar_ai_agent";
import {
  Asset,
  AudioGizmo,
  Entity,
  ParticleGizmo,
  Player,
  TextureAsset,
  Vec3,
  World,
} from "horizon/core";
import { ImageSource } from "horizon/ui";

//region Avatar AI Agent
export type PlayerType = "human" | "npc" | "server" | "builder" | "departed";

export function getPlayerType(player: Player, world: World): PlayerType {
  if (player === world.getServerPlayer()) {
    return "server";
  } else if (!world.getPlayers().includes(player)) {
    return "departed";
  } else if (player.isInBuildMode.get()) {
    return "builder";
  // } else if (AvatarAIAgent.getGizmoFromPlayer(player) !== undefined) {
  //   return "npc";
  } else {
    return "human";
  }
}

export function filterOutNonHumanEntityOwners(entityList: Entity[], world: World): Entity[] {
  return entityList.filter((entity) => {
    const player = entity.owner.get();
    return getPlayerType(player, world) === "human";
  });
}
//endregion Avatar AI Agent

//region Debugging 
//ex: assertAllNullablePropsSet(this, this.entity.name.get());
export function assertAllNullablePropsSet<T, String>(entity: { props: T }, name: string): void {
  for (const key in entity.props) {
    if (entity.props[key as keyof T] === undefined) {
      console.error(`Nullable prop ${key} is not set on ${name}`);
      throw new Error(`Nullable prop ${key} is not set on ${name}`);
    }
  }
}

export function debugLog(showDebug: boolean, message: string): void {
  if (showDebug) {
    console.log(message);
  }
}
//endregion Debugging


//region VFX and SFX
export function playVFXatPosition(vfx: Entity, position: Vec3): void {
  vfx.position.set(position);
  vfx.as(ParticleGizmo).play();
}

export function playSfxAtPosition(sfx: Entity, position: Vec3): void {
  sfx.position.set(position);
  sfx.as(AudioGizmo).play();
}

export function playRandSfxFromListAtPoint(sfxList: Entity[], position: Vec3): void {
  if (sfxList.length === 0) {
    console.error("No SFX found to play");
    return;
  }
  const randomIndex = Math.floor(Math.random() * sfxList.length);
  const randomSfx = sfxList[randomIndex];
  randomSfx.position.set(position);

  randomSfx.as(AudioGizmo).play();
}
//endregion VFX and SFX

//region Entity Tagging
export function getEntityListByTag(tag: string, world: World): Entity[] {
  const entityList = world.getEntitiesWithTags([tag]);
  if (entityList.length === 0) {
    console.error(`No entities found with tag: ${tag}`);
  }
  return entityList;
}

/**
 * @param entity - The entity to check for the 'Collidable' tag.
 * @returns Confirms the entity has the 'Collidable' tag. ex: DiceReactive components
 */
export function assertCollidableTag(entity: Entity): void {
  const hasTag = entity.tags.contains("Collidable");
  if (!hasTag) {
    console.error(
      `${entity.name.get()} does not have the 'Collidable' tag. It won't give collision events.`
    );
  }
}
//endregion Entity Tagging

//region ManagerRegistry
export type ManagerRegistry = Map<string, Entity>;
export enum ManagerType {
  PlayerManager = "PlayerManager",
  SaveManager = "SaveManager",
  StatsManager = "StatsManager",
  AudioManager = "AudioManager",
  VFXManager = "VFXManager",
  // SlotManager = "Slot Manager",
  // MinimonTextureRef = "MinimonTextureRef",
  // InteractionController = "InteractionCtrl",
  // UI_PopupManager = "UI_PopupManager",
  // UI_Popup_LevelUp = "UI_Popup_LevelUp",
  // UI_GameOverlay = "UI_GameOverlay",
  // UI_Payout = "UI_Payout",
  // UI_MinimonIndex = "UI_MinimonIndex",
  // UI_Shop = "UI_Shop",
}

export function buildManagerRegistry(world: World): ManagerRegistry {
  const managerRegistry: ManagerRegistry = new Map<string, Entity>();
  Object.keys(ManagerType).forEach((key) => {
    const tag = (ManagerType as any)[key];
    managerRegistry.set(
      tag,
      world.getEntitiesWithTags([tag])[0] ??
        console.error(`ManagerRegistry: Entity with tag ${tag} not found`)
    );
  });
  return managerRegistry;
}
//endregion ManagerRegistry

//region Asset Conversion
export function convertAssetToImageSource(asset: Asset): ImageSource {
  const textureAsset = asset?.as(TextureAsset);
  if (!textureAsset) {
    throw new Error(`convertAssetToImageSource: Provided asset (id: ${asset?.id}) is not a TextureAsset`);
  }
  return ImageSource.fromTextureAsset(textureAsset);
}
//endregion Asset Conversion


