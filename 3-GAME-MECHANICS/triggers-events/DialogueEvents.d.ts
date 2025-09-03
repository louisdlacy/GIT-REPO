import { Entity, LocalEvent, NetworkEvent } from "horizon/core";
export declare const AddPromptEvent: NetworkEvent<{
    target: Entity;
}>;
export declare const RemovePromptEvent: NetworkEvent<Record<string, never>>;
export declare const UpdatePromptVisibilityEvent: LocalEvent<Record<string, never>>;
export declare const TalkEvent: LocalEvent<{
    target: Entity;
}>;
