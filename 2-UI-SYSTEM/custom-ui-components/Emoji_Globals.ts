//--- SCRIPT: Emoji_Globals.ts ---//
// Type: Definition Script (Not a component)
// Placement: Not attached to any entity; it is imported as a module by other scripts.
// Responsibilities: Contains all shared custom data types and defines all NetworkEvents and LocalEvents.

// See: (FORUM LINK)

import * as hz from 'horizon/core';
import { Color } from 'horizon/core';
import { LocalEvent, NetworkEvent } from 'horizon/core';

// --- THEME DEFINITIONS --- //
export type SelectorThemeData = {
    name: string;
    panelWidth: number;
    panelHeight: number;
    panelBackgroundColor: Color;
    panelBackgroundOpacity: number;
    categoryTabColorDefault: Color;
    categoryTabOpacityDefault: number;
    categoryTabColorHover: Color;
    categoryTabOpacityHover: number;
    categoryTabColorActive: Color;
    categoryTabOpacityActive: number;
    emojiButtonColorDefault: Color;
    emojiButtonOpacityDefault: number;
    emojiButtonColorHover: Color;
    emojiButtonOpacityHover: number;
    emojiButtonColorPressed: Color;
    emojiButtonOpacityPressed: number;
    categoryTabTextSize: number;
    emojiButtonSize: number;
    emojiIconSize: number;
    primaryTextColor: Color;
    secondaryTextColor: Color;
    prefsButtonColorDefault: Color;
    prefsButtonColorHover: Color;
    prefsButtonColorPressed: Color;
    prefsButtonDisabledColor: Color;
    // REVISED (v0.18): Renamed for clarity. These control the pop-up emoji's background.
    displayBackgroundColor: Color;
    displayBackgroundOpacity: number;
};


// --- DATA STRUCTURES --- //

export type EmojiAssetDefinition = {
    id: number;
    asset: hz.Asset;
};

export type CategoryDefinition = {
    categoryName: string;
    emojis: EmojiAssetDefinition[];
};

export type CategoryData = {
    categoryId: number;
    categoryName: string;
    emojiIds: number[];
};

export type FavouriteData = {
    id: number;
    count: number;
};

export type PlayerPrefs = {
    theme: string;
    muteSounds: boolean;
    displayDuration: number;
    spinSpeed: number;
    hideOthers: boolean;
    sortAll: boolean;
};

export type EmojiAssetInfo = {
    id: number;
    assetId: bigint;
    versionId: bigint;
};


// --- CLIENT-ONLY EVENTS --- //

export const ToggleSelectorEvent = new LocalEvent<{}>('ToggleSelectorEvent');

// --- NETWORK EVENTS --- //

export const InitializeClientThemesEvent = new NetworkEvent<{
    themes: SelectorThemeData[];
}>('InitializeClientThemesEvent');

export const EmojiSelectedEvent = new NetworkEvent<{
    emojiId: number,
    displayDuration: number;
    spinSpeed: number;
}>('EmojiSelectedEvent');

// REVISED (v0.18): Standardized on 'popup' prefix for pop-up specific properties.
export const InitializePopupEvent = new NetworkEvent<{
    playerId: number;
    emojiAssetInfo: EmojiAssetInfo;
    imageScale: number;
    popupDriftAmount: number;
    popupDurationMilliseconds: number;
    popupFadeInMilliseconds: number;
    popupFadeOutMilliseconds: number;
    popupRotationSpeed: number;
    popupRestingHeight: number;
    popupExitHeight: number;
    popupShowBackground: boolean;
    popupBackgroundColor: Color;
    popupBackgroundOpacity: number;
    emojiPanelColor: Color;
}>('InitializePopupEvent');

// REVISED (v0.18): Standardized on 'popup' prefix for pop-up specific properties.
export const RelayInitializePopupEvent = new NetworkEvent<{
    emojiAssetInfo: EmojiAssetInfo;
    imageScale: number;
    popupDriftAmount: number;
    popupDurationMilliseconds: number;
    popupFadeInMilliseconds: number;
    popupFadeOutMilliseconds: number;
    popupShowBackground: boolean;
    popupBackgroundColor: Color;
    popupBackgroundOpacity: number;
    emojiPanelColor: Color;
    startPosition: hz.Vec3;
    restingPosition: hz.Vec3;
    exitPosition: hz.Vec3;
}>('RelayInitializePopupEvent');


export const UpdateFavouritesEvent = new NetworkEvent<{ emojiId: number }>('UpdateFavouritesEvent');

export const InitializeClientDataEvent = new NetworkEvent<{
    usageData: FavouriteData[];
    saveDataAvailable: boolean;
    prefsEnabled: boolean;
}>('InitializeClientDataEvent');

export const InitializeClientConfigEvent = new NetworkEvent<{
    inputAction: hz.PlayerInputAction;
    buttonIcon: hz.ButtonIcon;
    buttonPlacement: hz.ButtonPlacement;
    emojiSelectionCooldown: number;
    prefsIconAssetInfo: EmojiAssetInfo | null;
    closeIconAssetInfo: EmojiAssetInfo | null;
}>('InitializeClientConfigEvent');

export const InitializeAssetDataEvent = new NetworkEvent<{
    emojiAssets: EmojiAssetInfo[];
    categoryData: CategoryData[];
}>('InitializeAssetDataEvent');

export const ClientReadyForData = new NetworkEvent<{}>('ClientReadyForData');

export const ClearFavouritesEvent = new NetworkEvent<{}>('ClearFavouritesEvent');

export const InitializeClientPrefsEvent = new NetworkEvent<{ prefs: PlayerPrefs }>('InitializeClientPrefsEvent');

export const UpdatePlayerPrefsEvent = new NetworkEvent<{ prefs: PlayerPrefs }>('UpdatePlayerPrefsEvent');

export class Emoji_Globals extends hz.Component<typeof Emoji_Globals> {
    static propsDefinition = {};

    start() {
        // This component is a data container. No active logic is needed on start.
    }
}

hz.Component.register(Emoji_Globals);