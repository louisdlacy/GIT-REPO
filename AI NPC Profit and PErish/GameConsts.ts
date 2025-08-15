// @ts-nocheck

//#region Debug Settings
export const CONSOLE_LOG_ITEM_PERCEPTION: boolean = false;
export const CONSOLE_LOG_NPC_BUS: boolean = false;
export const CONSOLE_LOG_LLM: boolean = false;
export const CONSOLE_LOG_LLM_EMOTION: boolean = false;
export const CONSOLE_LOG_ASYNC: boolean = false;
export const CONSOLE_LOG_UAB: boolean = false;
export const CONSOLE_LOG_ANIMATION_EVENTS: boolean = false;
export const CONSOLE_LOG_VISEMES: boolean = false;
export const CONSOLE_LOG_NAVIGATION: boolean = false;
export const CONSOLE_LOG_NPC_ANIMATION: boolean = false;
//#endregion

export const DEFAULT_NAV_TIME: number = 3; // Time in seconds for the NPC to linger on a player


//#region Boss Emotional States
export enum Emotions {
    Neutral = "Neutral",
    Happy = "Happy",
    Confused = "Confused",
    Angry = "Angry",
    Suspicious = "Suspicious",
}

export const ONLY_USE_EMOTIONS_FROM_LLM: boolean = true;
//#endregion

//#regions Customer
export const CUSTOMER_SPEED_DEFAULT: number = 1.1; // Default speed for the customer to move at
export const enum CustomerState {
    Neutral,
    Happy,
    Angry,
    Furious
}
//#endregion

//#region NPC
export enum CaptionAudience {
    None,
    PlayerOnly,
    AllPlayers
}
//#endregion
