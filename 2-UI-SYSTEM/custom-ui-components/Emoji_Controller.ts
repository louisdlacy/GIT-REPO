//--- SCRIPT: Emoji_Controller.ts ---//
// Functionality: The central brain of the asset.
// Type: Server Script
// Placement: Attached to a single, static gizmo in the world.
// Responsibilities:
// - Finds all Emoji_CategoryDefinition and Emoji_ThemeDefinition components at startup.
// - Builds the complete UI configuration from the found components.
// - Manages persistent player data for Favourites and Preferences.
// - Spawns and manages PlayerController assets for each player.
// - Distributes all configuration and data to clients via network events.
// - Spawns the displayContainerAsset when a player selects an emoji.

// See: (FORUM LINK)

import * as hz from 'horizon/core';
import { ImageSource } from 'horizon/ui';
import { Emoji_CategoryDefinition } from './Emoji_CategoryDefinition';
import { Emoji_ThemeDefinition } from './Emoji_ThemeDefinition';
import {
    EmojiSelectedEvent,
    InitializePopupEvent,
    UpdateFavouritesEvent,
    InitializeClientDataEvent,
    FavouriteData,
    ClientReadyForData,
    InitializeClientConfigEvent,
    ClearFavouritesEvent,
    InitializeClientPrefsEvent,
    PlayerPrefs,
    UpdatePlayerPrefsEvent,
    InitializeAssetDataEvent,
    EmojiAssetInfo,
    CategoryData,
    InitializeClientThemesEvent,
    SelectorThemeData
} from './Emoji_Globals';

export class Emoji_Controller extends hz.Component<typeof Emoji_Controller> {
    // --- PUBLIC PROPERTIES --- //
    static propsDefinition = {

        // -- Core Configuration -- //
        playerControllerAsset: { type: hz.PropTypes.Asset },
        displayContainerAsset: { type: hz.PropTypes.Asset },
        prefsButtonIcon: { type: hz.PropTypes.Asset },
        closeButtonIcon: { type: hz.PropTypes.Asset },
        selectorToggleInputAction: { type: hz.PropTypes.Number, default: hz.PlayerInputAction.LeftGrip },
        selectorToggleInputIcon: { type: hz.PropTypes.Number, default: hz.ButtonIcon.Speak },
        selectorToggleInputPosition: { type: hz.PropTypes.Number, default: hz.ButtonPlacement.Default },

        // -- Save & Preferences -- //
        saveDataEnabled: { type: hz.PropTypes.Boolean, default: false },
        saveIntervalSeconds: { type: hz.PropTypes.Number, default: 10 },
        prefsEnabled: { type: hz.PropTypes.Boolean, default: true },
        defaultTheme: { type: hz.PropTypes.String, default: 'dark' },
        defaultSortAll: { type: hz.PropTypes.Boolean, default: false },
        defaultDurationSeconds: { type: hz.PropTypes.Number, default: 5 },
        defaultRotationSpeed: { type: hz.PropTypes.Number, default: 3.5 },

        // -- Animation & Display -- //
        selectorCooldownSeconds: { type: hz.PropTypes.Number, default: 0.5 },
        displayStartAnimationSeconds: { type: hz.PropTypes.Number, default: 0.6 },
        displayEndAnimationSeconds: { type: hz.PropTypes.Number, default: 0.5 },
        displayImageScale: { type: hz.PropTypes.Number, default: 0.65 },
        displayRestHeightPosition: { type: hz.PropTypes.Number, default: 0.6 },
        displayExitHeightPosition: { type: hz.PropTypes.Number, default: 1 },
        displayDriftDistance: { type: hz.PropTypes.Number, default: 0.5 },
        displayShowBackground: { type: hz.PropTypes.Boolean, default: true },
    };

    // --- PRIVATE STATE --- //
    private playerControllers = new Map<hz.Player, hz.Entity>();
    private playerData = new Map<hz.Player, FavouriteData[]>();
    private playerPrefs = new Map<hz.Player, PlayerPrefs>();
    private dirtyPlayers = new Set<hz.Player>();
    private readonly persistentDataKey = "Emoji:Data";
    private readonly persistentPrefsKey = "Emoji:Prefs";
    private defaultPrefs!: PlayerPrefs;
    private emojiAssets: EmojiAssetInfo[] = [];
    private categoryData: CategoryData[] = [];
    private themeData: SelectorThemeData[] = [];
    private nextEmojiId = 1;
    private _prefsIconAssetInfo: EmojiAssetInfo | null = null;
    private _closeIconAssetInfo: EmojiAssetInfo | null = null;

    start() {
        if (!this.props.playerControllerAsset || !this.props.displayContainerAsset) {
            console.error("Emoji_Controller: 'playerControllerAsset' and 'displayContainerAsset' must be set!");
            return;
        }

        if (this.props.prefsButtonIcon) {
            try {
                ImageSource.fromTextureAsset(this.props.prefsButtonIcon.as(hz.TextureAsset));
                this._prefsIconAssetInfo = { id: 0, assetId: this.props.prefsButtonIcon.id, versionId: this.props.prefsButtonIcon.versionId };
            } catch (e) {
                console.error(`Emoji_Controller: Failed to preload prefsButtonIcon asset. Error: ${e}`);
            }
        }

        if (this.props.closeButtonIcon) {
            try {
                ImageSource.fromTextureAsset(this.props.closeButtonIcon.as(hz.TextureAsset));
                this._closeIconAssetInfo = { id: 0, assetId: this.props.closeButtonIcon.id, versionId: this.props.closeButtonIcon.versionId };
            } catch (e) {
                console.error(`Emoji_Controller: Failed to preload closeButtonIcon asset. Error: ${e}`);
            }
        }

        this.loadCategoryDefinitions();
        this.loadThemeDefinitions();

        this.defaultPrefs = {
            theme: this.props.defaultTheme,
            muteSounds: false,
            displayDuration: this.props.defaultDurationSeconds,
            spinSpeed: this.props.defaultRotationSpeed,
            hideOthers: false,
            sortAll: this.props.defaultSortAll
        };

        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
            this.spawnControllerForPlayer(player);
        });

        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
            this.destroyControllerForPlayer(player);
        });

        if (this.props.saveDataEnabled) {
            this.async.setInterval(() => this.saveDirtyPlayerData(), this.props.saveIntervalSeconds * 1000);
        }
    }

    private loadThemeDefinitions() {
        const themeTag = "EmojiTheme";
        const themeEntities = this.world.getEntitiesWithTags([themeTag]);
        console.log(`Emoji_Controller: Found ${themeEntities.length} entities with '${themeTag}' tag.`);

        if (themeEntities.length === 0) {
            console.error(`Emoji_Controller: No entities with tag '${themeTag}' found. The UI will not have any themes.`);
            return;
        }

        for (const entity of themeEntities) {
            const comp = entity.getComponents(Emoji_ThemeDefinition)[0];
            if (comp) {
                this.themeData.push({
                    name: comp.props.Name,
                    panelWidth: comp.props.panelWidth,
                    panelHeight: comp.props.panelHeight,
                    panelBackgroundColor: comp.props.panelBackgroundColor,
                    panelBackgroundOpacity: comp.props.panelBackgroundOpacity,
                    categoryTabColorDefault: comp.props.categoryTabColorDefault,
                    categoryTabOpacityDefault: comp.props.categoryTabOpacityDefault,
                    categoryTabColorHover: comp.props.categoryTabColorHover,
                    categoryTabOpacityHover: comp.props.categoryTabOpacityHover,
                    categoryTabColorActive: comp.props.categoryTabColorActive,
                    categoryTabOpacityActive: comp.props.categoryTabOpacityActive,
                    emojiButtonColorDefault: comp.props.emojiButtonColorDefault,
                    emojiButtonOpacityDefault: comp.props.emojiButtonOpacityDefault,
                    emojiButtonColorHover: comp.props.emojiButtonColorHover,
                    emojiButtonOpacityHover: (comp.props as any).emojiButtonColorHoverOpacity || 1.0,
                    emojiButtonColorPressed: comp.props.emojiButtonColorPressed,
                    emojiButtonOpacityPressed: comp.props.emojiButtonOpacityPressed,
                    categoryTabTextSize: comp.props.categoryTabTextSize,
                    emojiButtonSize: comp.props.emojiButtonSize,
                    emojiIconSize: comp.props.emojiIconSize,
                    primaryTextColor: comp.props.primaryTextColor,
                    secondaryTextColor: comp.props.secondaryTextColor,
                    prefsButtonColorDefault: comp.props.prefsButtonColorDefault,
                    prefsButtonColorHover: comp.props.prefsButtonColorHover,
                    prefsButtonColorPressed: comp.props.prefsButtonColorPressed,
                    prefsButtonDisabledColor: comp.props.prefsButtonDisabledColor,
                    displayBackgroundColor: comp.props.displayBackgroundColor,
                    displayBackgroundOpacity: comp.props.displayBackgroundOpacity,
                });
            }
        }
        console.log(`Emoji_Controller: Successfully loaded ${this.themeData.length} themes.`);
    }

    private loadCategoryDefinitions() {
        const categoryTag = "EmojiCategory";
        const categoryEntities = this.world.getEntitiesWithTags([categoryTag]);
        console.log(`Emoji_Controller: Found ${categoryEntities.length} entities with '${categoryTag}' tag.`);

        if (categoryEntities.length === 0) {
            console.error(`Emoji_Controller: No entities with tag '${categoryTag}' found. The emoji selector will be empty.`);
            return;
        }

        const categoryComponents: Emoji_CategoryDefinition[] = [];
        for (const entity of categoryEntities) {
            const comp = entity.getComponents(Emoji_CategoryDefinition)[0];
            if (comp) {
                categoryComponents.push(comp);
            }
        }

        const tempCategories: (CategoryData & { displayOrder: number })[] = [];
        const loadedAssetIds = new Set<bigint>();

        categoryComponents.forEach((categoryComp: Emoji_CategoryDefinition, compIndex: number) => {
            const categoryEmojiIds: number[] = [];

            for (let i = 1; i <= 50; i++) {
                const propName = `emoji${i}` as keyof typeof categoryComp.props;
                const asset = categoryComp.props[propName] as hz.Asset | undefined;

                if (asset && asset.id) {
                    if (!loadedAssetIds.has(asset.id)) {
                        const newId = this.nextEmojiId++;
                        loadedAssetIds.add(asset.id);

                        try {
                            ImageSource.fromTextureAsset(asset.as(hz.TextureAsset));
                        } catch (e) {
                            console.error(`Emoji_Controller: Failed to preload asset for emoji in category '${categoryComp.props.Name}'. Error: ${e}`);
                        }

                        this.emojiAssets.push({
                            id: newId,
                            assetId: asset.id,
                            versionId: asset.versionId
                        });
                        categoryEmojiIds.push(newId);

                    } else {
                        const existingAsset = this.emojiAssets.find(a => a.assetId === asset.id);
                        if (existingAsset) {
                            categoryEmojiIds.push(existingAsset.id);
                        }
                    }
                }
            }

            if (categoryEmojiIds.length > 0) {
                tempCategories.push({
                    categoryId: compIndex,
                    categoryName: categoryComp.props.Name,
                    emojiIds: categoryEmojiIds,
                    displayOrder: categoryComp.props.DisplayOrder
                });
            }
        });

        tempCategories.sort((a, b) => a.displayOrder - b.displayOrder);

        this.categoryData = tempCategories.map((cat, index) => ({
            categoryId: index,
            categoryName: cat.categoryName,
            emojiIds: cat.emojiIds
        }));

        console.log(`Emoji_Controller: Successfully loaded ${this.emojiAssets.length} unique emojis across ${this.categoryData.length} categories.`);
    }

    private setOwnershipRecursively(entity: hz.Entity, player: hz.Player) {
        entity.owner.set(player);
        const children = entity.children.get();
        for (const child of children) {
            this.setOwnershipRecursively(child, player);
        }
    }

    private updateFavouritesCache(player: hz.Player, emojiId: number) {
        const usageData = this.playerData.get(player);
        if (usageData === undefined) return;

        const emojiEntry = usageData.find(item => item.id === emojiId);
        if (emojiEntry) {
            emojiEntry.count++;
        } else {
            usageData.push({ id: emojiId, count: 1 });
        }

        this.playerData.set(player, usageData);
        this.dirtyPlayers.add(player);
    }

    private saveDirtyPlayerData() {
        if (this.dirtyPlayers.size === 0) return;

        this.dirtyPlayers.forEach((player) => {
            const usageData = this.playerData.get(player);
            if (usageData) {
                try {
                    this.world.persistentStorage.setPlayerVariable(player, this.persistentDataKey, usageData);
                } catch (e) {
                    console.error(`Emoji_Controller: Failed to save persistent data for player ${player.name.get()}. Error: ${e}`);
                }
            }
        });
        this.dirtyPlayers.clear();
    }

    private clearPlayerFavourites(player: hz.Player) {
        if (!this.playerData.has(player)) return;
        this.playerData.set(player, []);

        if (this.props.saveDataEnabled) {
            try {
                this.world.persistentStorage.setPlayerVariable(player, this.persistentDataKey, []);
            } catch (e) {
                console.error(`Emoji_Controller: Failed to clear persistent data for player ${player.name.get()}. Error: ${e}`);
            }
        }
    }

    private updateAndSavePlayerPrefs(player: hz.Player, newPrefs: PlayerPrefs) {
        this.playerPrefs.set(player, newPrefs);
        if (this.props.saveDataEnabled && this.props.prefsEnabled) {
            try {
                this.world.persistentStorage.setPlayerVariable(player, this.persistentPrefsKey, newPrefs);
            } catch (e) {
                console.error(`Emoji_Controller: Failed to save preferences for player ${player.name.get()}. Error: ${e}`);
            }
        }
    }

    private spawnControllerForPlayer(player: hz.Player) {
        if (this.playerControllers.has(player)) return;

        let cachedUsageData: FavouriteData[] = [];
        let cachedPrefs: PlayerPrefs = { ...this.defaultPrefs };

        if (this.props.saveDataEnabled) {
            try {
                const storedData = this.world.persistentStorage.getPlayerVariable<FavouriteData[]>(player, this.persistentDataKey);
                if (storedData !== null && Array.isArray(storedData)) {
                    cachedUsageData = storedData;
                }
                if (this.props.prefsEnabled) {
                    const storedPrefs = this.world.persistentStorage.getPlayerVariable<PlayerPrefs>(player, this.persistentPrefsKey);
                    if (storedPrefs) {
                        cachedPrefs = { ...this.defaultPrefs, ...storedPrefs };
                    }
                }
            } catch (e) {
                console.error(`Emoji_Controller: Failed to load persistent data for player ${player.name.get()}. Error: ${e}`);
            }
        }

        this.playerData.set(player, cachedUsageData);
        this.playerPrefs.set(player, cachedPrefs);

        this.world.spawnAsset(this.props.playerControllerAsset!, player.head.position.get()).then(([rootEntity]) => {
            if (rootEntity) {
                this.playerControllers.set(player, rootEntity);
                this.setOwnershipRecursively(rootEntity, player);

                const attachableController = rootEntity.as(hz.AttachableEntity);
                attachableController.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);

                this.connectNetworkEvent(rootEntity, ClientReadyForData, () => {
                    this.sendNetworkEvent(rootEntity, InitializeClientConfigEvent, {
                        inputAction: this.props.selectorToggleInputAction,
                        buttonIcon: this.props.selectorToggleInputIcon,
                        buttonPlacement: this.props.selectorToggleInputPosition,
                        emojiSelectionCooldown: this.props.selectorCooldownSeconds,
                        prefsIconAssetInfo: this._prefsIconAssetInfo,
                        closeIconAssetInfo: this._closeIconAssetInfo,
                    });

                    this.sendNetworkEvent(rootEntity, InitializeClientThemesEvent, {
                        themes: this.themeData
                    });

                    this.sendNetworkEvent(rootEntity, InitializeAssetDataEvent, {
                        emojiAssets: this.emojiAssets,
                        categoryData: this.categoryData
                    });

                    this.sendNetworkEvent(rootEntity, InitializeClientDataEvent, {
                        usageData: this.playerData.get(player) || [],
                        saveDataAvailable: this.props.saveDataEnabled,
                        prefsEnabled: this.props.prefsEnabled
                    });

                    this.sendNetworkEvent(rootEntity, InitializeClientPrefsEvent, {
                        prefs: this.playerPrefs.get(player) || this.defaultPrefs
                    });
                });

                this.connectNetworkEvent(rootEntity, EmojiSelectedEvent, (data) => {
                    const selectedAssetInfo = this.emojiAssets.find(asset => asset.id === data.emojiId);

                    if (!selectedAssetInfo) {
                        console.error(`Emoji_Controller: Player ${player.name.get()} selected an emoji with ID ${data.emojiId}, but it was not found in the server's asset list.`);
                        return;
                    }

                    const senderPrefs = this.playerPrefs.get(player) || this.defaultPrefs;
                    const popupDuration = data.displayDuration * 1000;

                    const currentTheme = this.themeData.find(t => t.name.toLowerCase() === senderPrefs.theme.toLowerCase()) || this.themeData[0];
                    const panelColor = currentTheme ? currentTheme.emojiButtonColorDefault : new hz.Color(0.2, 0.2, 0.2);
                    const displayBgColor = currentTheme ? currentTheme.displayBackgroundColor : new hz.Color(0.1, 0.1, 0.1);
                    const displayBgOpacity = currentTheme ? currentTheme.displayBackgroundOpacity : 0.7;

                    this.world.spawnAsset(this.props.displayContainerAsset!, player.head.position.get()).then(([popupEntity]) => {
                        if (!popupEntity) return;

                        const imageScale = this.props.displayImageScale;
                        popupEntity.scale.set(new hz.Vec3(imageScale, imageScale, imageScale));

                        // FIXED (v0.18.3): Corrected property names to align with the final event definition.
                        this.sendNetworkEvent(popupEntity, InitializePopupEvent, {
                            playerId: player.id,
                            emojiAssetInfo: selectedAssetInfo,
                            popupDurationMilliseconds: popupDuration,
                            popupFadeInMilliseconds: this.props.displayStartAnimationSeconds * 1000,
                            popupFadeOutMilliseconds: this.props.displayEndAnimationSeconds * 1000,
                            popupRotationSpeed: data.spinSpeed,
                            popupRestingHeight: this.props.displayRestHeightPosition,
                            popupExitHeight: this.props.displayExitHeightPosition,
                            popupDriftAmount: this.props.displayDriftDistance,
                            popupShowBackground: this.props.displayShowBackground,
                            popupBackgroundColor: displayBgColor,
                            popupBackgroundOpacity: displayBgOpacity,
                            emojiPanelColor: panelColor,
                            imageScale: imageScale,
                        });

                        const totalLifetime = popupDuration + ((this.props.displayStartAnimationSeconds + this.props.displayEndAnimationSeconds) * 1000) + 500;
                        this.async.setTimeout(() => {
                            if (popupEntity.exists()) {
                                this.world.deleteAsset(popupEntity, true);
                            }
                        }, totalLifetime);
                    });
                });

                this.connectNetworkEvent(rootEntity, UpdateFavouritesEvent, (data) => {
                    if (this.props.saveDataEnabled) {
                        this.updateFavouritesCache(player, data.emojiId);
                    }
                });

                this.connectNetworkEvent(rootEntity, ClearFavouritesEvent, () => {
                    this.clearPlayerFavourites(player);
                });

                this.connectNetworkEvent(rootEntity, UpdatePlayerPrefsEvent, (data) => {
                    this.updateAndSavePlayerPrefs(player, data.prefs);
                });
            }
        });
    }

    private destroyControllerForPlayer(player: hz.Player) {
        if (this.props.saveDataEnabled && this.dirtyPlayers.has(player)) {
            const usageData = this.playerData.get(player);
            if (usageData) {
                try {
                    this.world.persistentStorage.setPlayerVariable(player, this.persistentDataKey, usageData);
                } catch (e) {
                    console.error(`Emoji_Controller: Failed to save data for exiting player ${player.name.get()}. Error: ${e}`);
                }
            }
        }

        this.dirtyPlayers.delete(player);
        this.playerPrefs.delete(player);

        const controllerEntity = this.playerControllers.get(player);
        if (controllerEntity) {
            this.world.deleteAsset(controllerEntity, true);
            this.playerControllers.delete(player);
        }
        this.playerData.delete(player);
    }
}

hz.Component.register(Emoji_Controller);

