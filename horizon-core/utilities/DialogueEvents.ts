import { Entity, LocalEvent, NetworkEvent } from "horizon/core";

export const AddPromptEvent = new NetworkEvent<{ target: Entity }>("AddPromptEvent");

export const RemovePromptEvent = new NetworkEvent("RemovePromptEvent");

export const UpdatePromptVisibilityEvent = new LocalEvent("UpdatePromptVisibility");

export const TalkEvent = new LocalEvent<{ target: Entity }>("TalkEvent");