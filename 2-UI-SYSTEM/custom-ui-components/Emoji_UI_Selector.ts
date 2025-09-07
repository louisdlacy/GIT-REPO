//--- SCRIPT: Emoji_UI_Selector.ts ---//
// Functionality: Builds and manages the entire emoji selection interface.
// Type: Local UI Component
// Placement: Contained within the dynamically spawned PlayerController asset.
// Responsibilities:
// - Receives all configuration data(themes, categories, assets, player data) from the server.
// - Dynamically builds the UI, including category tabs and the emoji grid, using DynamicList components.
// - Manages the state of the preferences panel, including the theme dropdown.
// - Handles all local player interactions and sends selection / preference events to the server.
// - Implements a client - side cooldown with visual feedback after an emoji is selected.

// See: (FORUM LINK)


import * as hz from 'horizon/core';
import { Color } from 'horizon/core';
import { UIComponent, View, Text, Pressable, UINode, Binding, Image, ImageSource, AnimatedBinding, Animation, Easing, DynamicList, ScrollView } from 'horizon/ui';
import {
    ToggleSelectorEvent,
    EmojiSelectedEvent,
    CategoryData,
    UpdateFavouritesEvent,
    InitializeClientDataEvent,
    FavouriteData,
    ClientReadyForData,
    SelectorThemeData,
    ClearFavouritesEvent,
    InitializeClientPrefsEvent,
    PlayerPrefs,
    UpdatePlayerPrefsEvent,
    InitializeAssetDataEvent,
    EmojiAssetInfo,
    InitializeClientConfigEvent,
    InitializeClientThemesEvent
} from 'Emoji_Globals';

// Helper function to create an rgba string from a Color object and an opacity value.
const toRgbaString = (color: Color, opacity: number = 1): string => {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity})`;
};

// A default theme to ensure the UI can always render immediately on load.
const defaultTheme: SelectorThemeData = {
    name: 'default',
    panelWidth: 500,
    panelHeight: 280,
    panelBackgroundColor: new Color(0.117, 0.117, 0.117),
    panelBackgroundOpacity: 0.9,
    categoryTabColorDefault: new Color(0, 0, 0),
    categoryTabOpacityDefault: 0.0,
    categoryTabColorHover: new Color(0.133, 0.133, 0.133),
    categoryTabOpacityHover: 1.0,
    categoryTabColorActive: new Color(0.2, 0.2, 0.2),
    categoryTabOpacityActive: 1.0,
    emojiButtonColorDefault: new Color(0.266, 0.266, 0.266),
    emojiButtonOpacityDefault: 1.0,
    emojiButtonColorHover: new Color(0.333, 0.333, 0.333),
    emojiButtonOpacityHover: 1.0,
    emojiButtonColorPressed: new Color(0, 0.667, 1),
    emojiButtonOpacityPressed: 1.0,
    categoryTabTextSize: 18,
    emojiButtonSize: 64,
    emojiIconSize: 50,
    primaryTextColor: new Color(1, 1, 1),
    secondaryTextColor: new Color(0.8, 0.8, 0.8),
    prefsButtonColorDefault: new Color(0.266, 0.266, 0.266),
    prefsButtonColorHover: new Color(0.333, 0.333, 0.333),
    prefsButtonColorPressed: new Color(0, 0.667, 1),
    prefsButtonDisabledColor: new Color(0.15, 0.15, 0.15),
    // FIXED (v0.18.4): Added missing properties to the default theme definition.
    displayBackgroundColor: new Color(0.1, 0.1, 0.1),
    displayBackgroundOpacity: 0.7,
};

export class Emoji_UI_Selector extends UIComponent<typeof Emoji_UI_Selector> {
    static propsDefinition = {
        buttonClickSound: { type: hz.PropTypes.Entity },
    };

    // --- PRIVATE STATE --- //
    private readonly prefsPanelWidth = 300;
    private categoryData: CategoryData[] = [];
    private serverCategoryData: CategoryData[] = [];

    private isVisible: boolean = false;
    private isPreferencesVisible: boolean = false;
    private favouritesArray: FavouriteData[] = [];
    private _currentCategoryIndex: number = 0;
    private isSaveDataEnabled: boolean = true;
    private _clearConfirmTimeout: number | null = null;
    private _isConfirmingClearState: boolean = false;
    private _currentPrefs: PlayerPrefs = { theme: 'default', muteSounds: false, displayDuration: 5, spinSpeed: 3.5, hideOthers: false, sortAll: false };

    private _hasAssetDataLoaded: boolean = false;
    private _hasClientDataLoaded: boolean = false;
    private _hasThemeDataLoaded: boolean = false;
    private emojiAssetData: EmojiAssetInfo[] = [];
    private _allThemes: SelectorThemeData[] = [];

    private _isSelectionOnCooldown: boolean = false;
    private _selectionCooldownDuration: number = 0.5;

    // --- BINDINGS --- //
    private _isReadyToRender = new Binding<boolean>(false);
    private _themeBinding = new Binding<SelectorThemeData>(defaultTheme);
    private _saveDataEnabledBinding = new Binding<boolean>(true);
    private _prefsEnabledBinding = new Binding<boolean>(true);
    private _activeCategoryIndex = new Binding<number>(0);
    private _currentEmojiIds = new Binding<number[]>([]);
    private _hoveredCategoryIndex = new Binding<number | null>(null);
    private _hoveredEmojiId = new Binding<number | null>(null);
    private _pressedEmojiId = new Binding<number | null>(null);
    private _visibilityAnim = new AnimatedBinding(0);
    private _isCloseButtonHovered = new Binding<boolean>(false);
    private _isCloseButtonPressed = new Binding<boolean>(false);
    private _isGearButtonHovered = new Binding<boolean>(false);
    private _isGearButtonPressed = new Binding<boolean>(false);
    private _preferencesPanelAnim = new AnimatedBinding(0);
    private _clearButtonText = new Binding<string>("Clear Favourites");
    private _isClearButtonHovered = new Binding<boolean>(false);
    private _isClearButtonPressed = new Binding<boolean>(false);
    private _isThemeDropdownOpen = new Binding<boolean>(false);
    private _selectedThemeName = new Binding<string>('default');
    private _isMuted = new Binding<boolean>(false);
    private _displayDuration = new Binding<number>(5);
    private _spinSpeed = new Binding<number>(3.5);
    private _hideOthers = new Binding<boolean>(false);
    private _sortAll = new Binding<boolean>(false);
    private _categoryDataBinding = new Binding<CategoryData[]>([]);
    private _isSelectionOnCooldownBinding = new Binding<boolean>(false);
    private _showThemeDropdown = new Binding<boolean>(false);
    private _allThemesBinding = new Binding<SelectorThemeData[]>([]);
    private _prefsIconSource = new Binding<ImageSource | null>(null);
    private _closeIconSource = new Binding<ImageSource | null>(null);


    preStart() {
        this.entity.visible.set(false);
    }

    start() {
        const parentEntity = this.entity.parent.get();
        if (parentEntity) {
            this.connectLocalEvent(parentEntity, ToggleSelectorEvent, () => {
                this.toggleVisibility()
            });

            this.connectNetworkEvent(parentEntity, InitializeClientConfigEvent, (data) => {
                this._selectionCooldownDuration = data.emojiSelectionCooldown;

                if (data.prefsIconAssetInfo) {
                    try {
                        const asset = new hz.Asset(data.prefsIconAssetInfo.assetId, data.prefsIconAssetInfo.versionId);
                        this._prefsIconSource.set(ImageSource.fromTextureAsset(asset.as(hz.TextureAsset)));
                    } catch (e) {
                        console.error(`Emoji_UI_Selector: Failed to create ImageSource from prefsIconAssetInfo. Error: ${e}`);
                    }
                }
                if (data.closeIconAssetInfo) {
                    try {
                        const asset = new hz.Asset(data.closeIconAssetInfo.assetId, data.closeIconAssetInfo.versionId);
                        this._closeIconSource.set(ImageSource.fromTextureAsset(asset.as(hz.TextureAsset)));
                    } catch (e) {
                        console.error(`Emoji_UI_Selector: Failed to create ImageSource from closeIconAssetInfo. Error: ${e}`);
                    }
                }
            });

            this.connectNetworkEvent(parentEntity, InitializeClientThemesEvent, (data) => {
                if (data.themes && data.themes.length > 0) {
                    this._allThemes = data.themes;
                } else {
                    this._allThemes = [defaultTheme];
                }
                this._allThemesBinding.set(this._allThemes);
                this._showThemeDropdown.set(this._allThemes.length > 1);
                this._hasThemeDataLoaded = true;
                this.updateBindingsFromPrefs(this._currentPrefs);
            });

            this.connectNetworkEvent(parentEntity, InitializeAssetDataEvent, (data) => {
                this.emojiAssetData = data.emojiAssets;
                this.serverCategoryData = data.categoryData;
                this._hasAssetDataLoaded = true;
                this.processAndDisplayCategories();
            });

            this.connectNetworkEvent(parentEntity, InitializeClientDataEvent, (data) => {
                this.isSaveDataEnabled = data.saveDataAvailable;
                this._saveDataEnabledBinding.set(data.saveDataAvailable);
                this._prefsEnabledBinding.set(data.prefsEnabled);

                if (data.usageData && Array.isArray(data.usageData)) {
                    this.favouritesArray = data.usageData;
                }

                this._hasClientDataLoaded = true;
                this.processAndDisplayCategories();
            });

            this.connectNetworkEvent(parentEntity, InitializeClientPrefsEvent, (data) => {
                this._currentPrefs = data.prefs;
                if (this._hasThemeDataLoaded) {
                    this.updateBindingsFromPrefs(data.prefs);
                }
            });

            this.sendNetworkEvent(parentEntity, ClientReadyForData, {});
        } else {
            console.error("Emoji_UI_Selector: Could not find parent entity!");
        }
    }

    private processAndDisplayCategories() {
        if (!this._hasAssetDataLoaded || !this._hasClientDataLoaded) {
            return;
        }

        let finalCategories = [...this.serverCategoryData];
        if (this.isSaveDataEnabled) {
            if (!finalCategories.some(c => c.categoryName === "Favourites")) {
                finalCategories.unshift({ categoryId: -1, categoryName: "Favourites", emojiIds: [] });
            }
        }

        this.categoryData = finalCategories;
        this._categoryDataBinding.set(finalCategories);
        this.initializeFirstCategory();
        this._isReadyToRender.set(true);
    }

    private initializeFirstCategory() {
        if (this.categoryData.length > 0) {
            this.setActiveCategory(0);
        }
    }

    private playClickSound() {
        if (!this._currentPrefs.muteSounds && this.props.buttonClickSound) {
            const owner = this.entity.owner.get();
            this.props.buttonClickSound.as(hz.AudioGizmo).play({ fade: 0, players: [owner] });
        }
    }

    private updateBindingsFromPrefs(prefs: PlayerPrefs) {
        if (!this._hasThemeDataLoaded) {
            return;
        }

        const themeName = prefs.theme.toLowerCase();
        const theme = this._allThemes.find(t => t.name.toLowerCase() === themeName) || this._allThemes[0];

        this._themeBinding.set(theme);
        if (!this._allThemes.some(t => t.name.toLowerCase() === themeName)) {
            this._currentPrefs.theme = theme.name;
        }

        this._selectedThemeName.set(prefs.theme);
        this._isMuted.set(prefs.muteSounds);
        this._displayDuration.set(prefs.displayDuration);
        this._spinSpeed.set(prefs.spinSpeed);
        this._hideOthers.set(prefs.hideOthers);
        this._sortAll.set(prefs.sortAll);
    }

    private sendPrefsUpdate() {
        const parent = this.entity.parent.get();
        if (parent) {
            this.sendNetworkEvent(parent, UpdatePlayerPrefsEvent, { prefs: this._currentPrefs });
        }
    }

    private getUsageCount(emojiId: number): number {
        const emojiData = this.favouritesArray.find(fav => fav.id === emojiId);
        return emojiData ? emojiData.count : 0;
    }

    initializeUI(): UINode {
        if (this.entity.owner.get() === this.world.getServerPlayer()) return View({});

        const mainPanelWidthBinding = this._themeBinding.derive(t => t.panelWidth);
        const mainPanelHeightBinding = this._themeBinding.derive(t => t.panelHeight);

        return UINode.if(this._isReadyToRender, View({
            style: {
                width: '100%',
                height: '100%',
                position: 'absolute',
            },
            children: [
                View({
                    style: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: mainPanelHeightBinding,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    },
                    children: [
                        View({
                            style: {
                                width: mainPanelWidthBinding,
                                height: mainPanelHeightBinding,
                                backgroundColor: this._themeBinding.derive(t => toRgbaString(t.panelBackgroundColor, t.panelBackgroundOpacity)),
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                flexDirection: 'column',
                                paddingTop: 3,
                                paddingBottom: 3,
                                paddingLeft: 5,
                                paddingRight: 5,
                                justifyContent: 'flex-start',
                                opacity: this._visibilityAnim.interpolate([0, 1], [0, 1]),
                                transform: [{ translateY: this._visibilityAnim.interpolate([0, 1], [50, 0]) }]
                            },
                            children: [this.renderCategoryTabs(), ScrollView({ style: { flex: 1, marginTop: 5 }, children: [this.renderEmojiGrid()] })]
                        }),
                    ]
                }),
                View({
                    style: {
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        height: mainPanelHeightBinding,
                        justifyContent: 'flex-end',
                        transform: [{
                            translateX: this._themeBinding.derive(theme => theme.panelWidth / 2)
                        }]
                    },
                    children: [
                        this.renderPreferencesPanel()
                    ]
                })
            ]
        }));
    }

    private renderEmojiGrid(): UINode {
        return DynamicList({
            data: this._currentEmojiIds,
            renderItem: (emojiId: number) => {
                const assetInfo = this.emojiAssetData.find(a => a.id === emojiId);
                if (!assetInfo) return View({});

                const asset = new hz.Asset(assetInfo.assetId, assetInfo.versionId);
                let source: ImageSource | null = null;
                try {
                    source = ImageSource.fromTextureAsset(asset.as(hz.TextureAsset));
                } catch (e) {
                    console.error(`Emoji_UI_Selector: Failed to create ImageSource for emojiId ${emojiId}. Error: ${e}`);
                    return View({});
                }
                if (!source) return View({});

                const emojiBgColor = Binding.derive(
                    [this._hoveredEmojiId, this._pressedEmojiId, this._themeBinding, this._isSelectionOnCooldownBinding],
                    (hoveredId, pressedId, theme, onCooldown) => {
                        if (onCooldown) {
                            return toRgbaString(theme.emojiButtonColorDefault, theme.emojiButtonOpacityDefault);
                        }
                        if (pressedId === emojiId) return toRgbaString(theme.emojiButtonColorPressed, theme.emojiButtonOpacityPressed);
                        if (hoveredId === emojiId) return toRgbaString(theme.emojiButtonColorHover, theme.emojiButtonOpacityHover);
                        return toRgbaString(theme.emojiButtonColorDefault, theme.emojiButtonOpacityDefault);
                    }
                );

                const emojiScale = this._pressedEmojiId.derive(pressedId => pressedId === emojiId ? 0.95 : 1.0);
                const shouldShowCount = this._saveDataEnabledBinding.derive(saveDataEnabled => this.getUsageCount(emojiId) > 0 && saveDataEnabled);
                const buttonOpacity = this._isSelectionOnCooldownBinding.derive(onCooldown => onCooldown ? 0.5 : 1.0);

                return Pressable({
                    onClick: () => {
                        if (!this._isSelectionOnCooldown) {
                            this.playClickSound();
                            this.selectEmoji(emojiId);
                        }
                    },
                    onPress: () => {
                        if (!this._isSelectionOnCooldown) this._pressedEmojiId.set(emojiId);
                    },
                    onRelease: () => this._pressedEmojiId.set(null),
                    onEnter: () => {
                        if (!this._isSelectionOnCooldown) this._hoveredEmojiId.set(emojiId);
                    },
                    onExit: () => {
                        this._hoveredEmojiId.set(null);
                        this._pressedEmojiId.set(null);
                    },
                    style: {
                        width: this._themeBinding.derive(t => t.emojiButtonSize),
                        height: this._themeBinding.derive(t => t.emojiButtonSize),
                        margin: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: emojiBgColor,
                        borderRadius: 10,
                        transform: [{ scale: emojiScale }],
                        opacity: buttonOpacity,
                    },
                    children: [
                        Image({ source: source, style: { width: this._themeBinding.derive(t => t.emojiIconSize), height: this._themeBinding.derive(t => t.emojiIconSize) } }),
                        UINode.if(shouldShowCount,
                            Text({
                                text: this.getUsageCount(emojiId).toString(),
                                style: {
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 4,
                                    color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)),
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    textShadowColor: 'black',
                                    textShadowOffset: [1, 1],
                                    textShadowRadius: 1,
                                }
                            })
                        )
                    ]
                });
            },
            style: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'flex-start', paddingTop: 5 },
        });
    }

    private renderCategoryTabs(): UINode {
        const closeButtonBgColor = Binding.derive([this._isCloseButtonHovered, this._isCloseButtonPressed, this._themeBinding], (isHovered, isPressed, theme) => {
            if (isPressed) return toRgbaString(theme.prefsButtonColorPressed);
            if (isHovered) return toRgbaString(theme.prefsButtonColorHover);
            return 'transparent';
        });

        const gearButtonBgColor = Binding.derive([this._isGearButtonHovered, this._isGearButtonPressed, this._themeBinding], (isHovered, isPressed, theme) => {
            if (isPressed) return toRgbaString(theme.prefsButtonColorPressed);
            if (isHovered) return toRgbaString(theme.prefsButtonColorHover);
            return 'transparent';
        });

        const showGearButton = Binding.derive([this._saveDataEnabledBinding, this._prefsEnabledBinding], (saveEnabled, prefsEnabled) => {
            return saveEnabled || prefsEnabled;
        });

        return View({
            style: { flexDirection: 'row', borderBottomWidth: 2, borderColor: '#555555', marginBottom: 5, justifyContent: 'space-between', alignItems: 'center' },
            children: [
                ScrollView({
                    horizontal: true, style: { flex: 1, flexDirection: 'row', marginRight: 10 },
                    children: [
                        DynamicList({
                            data: this._categoryDataBinding,
                            renderItem: (category: CategoryData, index?: number) => {
                                return this.renderSingleTab(category, index!);
                            },
                            style: { flexDirection: 'row' }
                        })
                    ]
                }),
                View({
                    style: { flexDirection: 'row' },
                    children: [
                        UINode.if(showGearButton,
                            Pressable({
                                onClick: () => { this.playClickSound(); this.togglePreferencesPanel(); },
                                onEnter: () => this._isGearButtonHovered.set(true), onExit: () => this._isGearButtonHovered.set(false),
                                onPress: () => this._isGearButtonPressed.set(true), onRelease: () => this._isGearButtonPressed.set(false),
                                style: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: this._themeBinding.derive(t => toRgbaString(t.secondaryTextColor)), backgroundColor: gearButtonBgColor, marginRight: 5 },
                                children: UINode.if(
                                    this._prefsIconSource.derive(s => s !== null),
                                    Image({
                                        source: this._prefsIconSource as Binding<ImageSource>,
                                        style: { width: '80%', height: '80%' }
                                    }),
                                    Text({ text: "*", style: { fontSize: 24, color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)) } })
                                )
                            })
                        ),
                        Pressable({
                            onClick: () => { this.playClickSound(); this.toggleVisibility(); },
                            onEnter: () => this._isCloseButtonHovered.set(true), onExit: () => this._isCloseButtonHovered.set(false),
                            onPress: () => this._isCloseButtonPressed.set(true), onRelease: () => this._isCloseButtonPressed.set(false),
                            style: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: this._themeBinding.derive(t => toRgbaString(t.secondaryTextColor)), backgroundColor: closeButtonBgColor, },
                            children: UINode.if(
                                this._closeIconSource.derive(s => s !== null),
                                Image({
                                    source: this._closeIconSource as Binding<ImageSource>,
                                    style: { width: '70%', height: '70%' }
                                }),
                                Text({ text: "x", style: { fontSize: 18, color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)), fontWeight: 'bold' } })
                            )
                        })
                    ]
                })
            ]
        });
    }

    private renderPreferencesPanel(): UINode {
        const clearButtonBgColor = Binding.derive(
            [this._isClearButtonHovered, this._isClearButtonPressed, this._themeBinding],
            (isHovered, isPressed, theme) => {
                if (this._isConfirmingClearState) return '#ff6666';
                if (isPressed) return toRgbaString(theme.prefsButtonColorPressed);
                if (isHovered) return toRgbaString(theme.prefsButtonColorHover);
                return toRgbaString(theme.prefsButtonColorDefault);
            }
        );

        return View({
            style: {
                width: this.prefsPanelWidth,
                height: this._themeBinding.derive(t => t.panelHeight),
                backgroundColor: this._themeBinding.derive(t => toRgbaString(t.panelBackgroundColor, t.panelBackgroundOpacity)),
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                flexDirection: 'column',
                padding: 10,
                justifyContent: 'flex-start',
                alignItems: 'center',
                opacity: this._preferencesPanelAnim.interpolate([0, 1], [0, 1]),
                transform: [{ translateX: this._preferencesPanelAnim.interpolate([0, 1], [this.prefsPanelWidth, 0]) }]
            },
            children: [
                Text({ text: "Preferences", style: { fontSize: 20, fontWeight: 'bold', color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)), marginBottom: 10, width: '100%', textAlign: 'center' } }),
                UINode.if(this._saveDataEnabledBinding,
                    Pressable({
                        onClick: () => { this.playClickSound(); this.handleClearClick(); },
                        onEnter: () => this._isClearButtonHovered.set(true),
                        onExit: () => this._isClearButtonHovered.set(false),
                        onPress: () => this._isClearButtonPressed.set(true),
                        onRelease: () => this._isClearButtonPressed.set(false),
                        style: {
                            width: '100%',
                            backgroundColor: clearButtonBgColor,
                            padding: 8,
                            borderRadius: 5,
                            marginBottom: 10,
                            alignItems: 'center'
                        },
                        children: [Text({ text: this._clearButtonText, style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)) } })]
                    })
                ),
                UINode.if(this._prefsEnabledBinding,
                    ScrollView({
                        style: { width: '100%', flex: 1 },
                        children: [
                            this.renderThemeDropdown(),
                            this.renderToggleRow("Mute Sounds", this._isMuted, (v) => { this._currentPrefs.muteSounds = v; this.sendPrefsUpdate(); }),
                            this.renderSliderRow("Display Duration", this._displayDuration, 3, 15, 1, "s", (v) => { this._currentPrefs.displayDuration = v; this.sendPrefsUpdate(); }),
                            this.renderSliderRow("Spin Speed", this._spinSpeed, 1, 10, 0.5, "", (v) => { this._currentPrefs.spinSpeed = v; this.sendPrefsUpdate(); }),
                            this.renderToggleRow("Hide Others' Emojis", this._hideOthers, (v) => { this._currentPrefs.hideOthers = v; this.sendPrefsUpdate(); }),
                            this.renderToggleRow("Sort All Categories", this._sortAll, (v) => {
                                this._currentPrefs.sortAll = v;
                                this.sendPrefsUpdate();
                                this.setActiveCategory(this._currentCategoryIndex);
                            }),
                        ]
                    })
                ),
            ]
        });
    }

    private renderToggleRow(label: string, binding: Binding<boolean>, onToggle: (newValue: boolean) => void): UINode {
        const toggleBgColor = Binding.derive([binding, this._themeBinding], (v, theme) => {
            return v ? '#4CAF50' : toRgbaString(theme.prefsButtonColorDefault);
        });
        const toggleText = binding.derive(v => v ? 'ON' : 'OFF');

        return View({
            style: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingVertical: 5 },
            children: [
                Text({ text: label, style: { color: this._themeBinding.derive(t => toRgbaString(t.secondaryTextColor)), fontSize: 16 } }),
                Pressable({
                    onClick: () => {
                        this.playClickSound();
                        binding.set(v => {
                            const newValue = !v;
                            onToggle(newValue);
                            return newValue;
                        });
                    },
                    style: { backgroundColor: toggleBgColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5, width: 60, alignItems: 'center' },
                    children: [Text({ text: toggleText, style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)), fontWeight: 'bold' } })]
                })
            ]
        });
    }

    private renderSliderRow(label: string, binding: Binding<number>, min: number, max: number, step: number, unit: string = "", onUpdate: (newValue: number) => void): UINode {
        return View({
            style: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingVertical: 5 },
            children: [
                Text({ text: label, style: { color: this._themeBinding.derive(t => toRgbaString(t.secondaryTextColor)), fontSize: 16 } }),
                View({
                    style: { flexDirection: 'row', alignItems: 'center' },
                    children: [
                        Pressable({
                            onClick: () => {
                                this.playClickSound();
                                binding.set(v => {
                                    const newValue = Math.max(min, v - step);
                                    onUpdate(newValue);
                                    return newValue;
                                });
                            },
                            style: { backgroundColor: this._themeBinding.derive(t => toRgbaString(t.prefsButtonColorDefault)), width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
                            children: [Text({ text: '-', style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)), fontSize: 20 } })]
                        }),
                        Text({ text: binding.derive(v => `${v.toFixed(1)}${unit}`), style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)), fontSize: 16, marginHorizontal: 10, width: 50, textAlign: 'center' } }),
                        Pressable({
                            onClick: () => {
                                this.playClickSound();
                                binding.set(v => {
                                    const newValue = Math.min(max, v + step);
                                    onUpdate(newValue);
                                    return newValue;
                                });
                            },
                            style: { backgroundColor: this._themeBinding.derive(t => toRgbaString(t.prefsButtonColorDefault)), width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
                            children: [Text({ text: '+', style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)), fontSize: 20 } })]
                        })
                    ]
                })
            ]
        });
    }

    private renderThemeDropdown(): UINode {
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

        return UINode.if(
            this._showThemeDropdown,
            View({
                style: { width: '100%', marginBottom: 10, zIndex: 10 },
                children: [
                    View({
                        style: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
                        children: [
                            Text({ text: "Theme", style: { color: this._themeBinding.derive(t => toRgbaString(t.secondaryTextColor)), fontSize: 16 } }),
                            Pressable({
                                onClick: () => { this.playClickSound(); this._isThemeDropdownOpen.set(v => !v); },
                                style: {
                                    width: 120, padding: 8, backgroundColor: this._themeBinding.derive(t => toRgbaString(t.prefsButtonColorDefault)), borderRadius: 5,
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                },
                                children: [
                                    Text({ text: this._selectedThemeName.derive(capitalize), style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)) } }),
                                    Text({ text: this._isThemeDropdownOpen.derive(v => v ? '^' : 'v'), style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)) } })
                                ]
                            }),
                        ]
                    }),
                    UINode.if(
                        this._isThemeDropdownOpen,
                        View({
                            style: {
                                position: 'absolute', top: 40, right: 0, width: 120,
                                backgroundColor: this._themeBinding.derive(t => toRgbaString(t.prefsButtonColorPressed)), borderRadius: 5, padding: 5, zIndex: 20,
                            },
                            children: [
                                ScrollView({
                                    style: { maxHeight: 100 },
                                    children: [
                                        DynamicList({
                                            data: this._allThemesBinding,
                                            renderItem: (theme: SelectorThemeData) => {
                                                return Pressable({
                                                    onClick: () => { this.playClickSound(); this.selectTheme(theme.name); },
                                                    style: { padding: 8, width: '100%' },
                                                    children: [Text({ text: capitalize(theme.name), style: { color: this._themeBinding.derive(t => toRgbaString(t.primaryTextColor)) } })]
                                                });
                                            }
                                        })
                                    ]
                                })
                            ]
                        })
                    )
                ]
            })
        );
    }

    private selectTheme(themeName: string) {
        const theme = this._allThemes.find(t => t.name.toLowerCase() === themeName.toLowerCase());
        if (theme) {
            this._themeBinding.set(theme);
            this._selectedThemeName.set(themeName);
            this._isThemeDropdownOpen.set(false);
            this._currentPrefs.theme = themeName;
            this.sendPrefsUpdate();
        }
    }

    private renderSingleTab(category: CategoryData, index: number): UINode {
        const tabBackgroundColor = Binding.derive([this._activeCategoryIndex, this._hoveredCategoryIndex, this._themeBinding], (activeIndex, hoveredIndex, theme) => {
            if (activeIndex === index) return toRgbaString(theme.categoryTabColorActive, theme.categoryTabOpacityActive);
            if (hoveredIndex === index) return toRgbaString(theme.categoryTabColorHover, theme.categoryTabOpacityHover);
            return toRgbaString(theme.categoryTabColorDefault, theme.categoryTabOpacityDefault);
        });

        const tabTextColor = Binding.derive([this._activeCategoryIndex, this._hoveredCategoryIndex, this._themeBinding], (activeIndex, hoveredIndex, theme) => {
            if (activeIndex === index) return toRgbaString(theme.primaryTextColor);
            if (hoveredIndex === index) return toRgbaString(theme.primaryTextColor, 0.8);
            return toRgbaString(theme.secondaryTextColor);
        });

        return Pressable({
            onClick: () => { this.playClickSound(); this.setActiveCategory(index); },
            onEnter: () => this._hoveredCategoryIndex.set(index),
            onExit: () => this._hoveredCategoryIndex.set(null),
            style: { padding: 8, marginRight: 8, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: tabBackgroundColor, },
            children: Text({ text: category.categoryName, style: { fontSize: this._themeBinding.derive(t => t.categoryTabTextSize), color: tabTextColor } })
        });
    }

    private handleClearClick() {
        if (this._isConfirmingClearState) {
            if (this._clearConfirmTimeout !== null) {
                this.async.clearTimeout(this._clearConfirmTimeout);
                this._clearConfirmTimeout = null;
            }
            this.favouritesArray = [];
            this.setActiveCategory(this._currentCategoryIndex);
            const parent = this.entity.parent.get();
            if (parent) {
                this.sendNetworkEvent(parent, ClearFavouritesEvent, {});
            }
            this._isConfirmingClearState = false;
            this._clearButtonText.set("Clear Favourites");
        } else {
            this._isConfirmingClearState = true;
            this._clearButtonText.set("Confirm?");
            this._clearConfirmTimeout = this.async.setTimeout(() => {
                this._isConfirmingClearState = false;
                this._clearButtonText.set("Clear Favourites");
                this._clearConfirmTimeout = null;
            }, 5000);
        }
    }

    private toggleVisibility() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.entity.visible.set(true);
            this._visibilityAnim.set(Animation.timing(1, { duration: 300, easing: Easing.out(Easing.cubic) }));
            this.async.setTimeout(() => {
                this.setActiveCategory(this._currentCategoryIndex);
            }, 50);
        } else {
            if (this.isPreferencesVisible) {
                this.togglePreferencesPanel();
            }
            this._visibilityAnim.set(Animation.timing(0, { duration: 300, easing: Easing.in(Easing.cubic) }), (finished) => {
                if (finished) {
                    this.entity.visible.set(false);
                }
            });
        }
    }

    private togglePreferencesPanel() {
        this.isPreferencesVisible = !this.isPreferencesVisible;
        if (this.isPreferencesVisible) {
            this._preferencesPanelAnim.set(Animation.timing(1, { duration: 250, easing: Easing.out(Easing.cubic) }));
        } else {
            this._preferencesPanelAnim.set(Animation.timing(0, { duration: 250, easing: Easing.in(Easing.cubic) }));
            this._isThemeDropdownOpen.set(false);
        }
    }

    private setActiveCategory(index: number) {
        this._activeCategoryIndex.set(index);
        this._currentCategoryIndex = index;
        const selectedCategory = this.categoryData[index];
        if (!selectedCategory) return;

        let finalEmojiIds: number[];

        if (selectedCategory.categoryName === "Favourites") {
            this.favouritesArray.sort((a, b) => b.count - a.count);
            finalEmojiIds = this.favouritesArray.map(fav => fav.id);
        } else {
            const emojiIdsCopy = [...selectedCategory.emojiIds];
            if (this._currentPrefs.sortAll) {
                emojiIdsCopy.sort((a, b) => this.getUsageCount(b) - this.getUsageCount(a));
            }
            finalEmojiIds = emojiIdsCopy;
        }

        this._currentEmojiIds.set(finalEmojiIds);
    }

    private selectEmoji(emojiId: number) {
        if (this._isSelectionOnCooldown) {
            return;
        }

        const parent = this.entity.parent.get();
        if (parent) {
            this.sendNetworkEvent(parent, EmojiSelectedEvent, {
                emojiId: emojiId,
                displayDuration: this._currentPrefs.displayDuration,
                spinSpeed: this._currentPrefs.spinSpeed
            });

            if (this.isSaveDataEnabled) {
                this.sendNetworkEvent(parent, UpdateFavouritesEvent, { emojiId: emojiId });
                const emojiEntry = this.favouritesArray.find(item => item.id === emojiId);
                if (emojiEntry) {
                    emojiEntry.count++;
                } else {
                    this.favouritesArray.push({ id: emojiId, count: 1 });
                }
                this.setActiveCategory(this._currentCategoryIndex);
            }

            this._isSelectionOnCooldown = true;
            this._isSelectionOnCooldownBinding.set(true);
            this.async.setTimeout(() => {
                this._isSelectionOnCooldown = false;
                this._isSelectionOnCooldownBinding.set(false);
            }, this._selectionCooldownDuration * 1000);
        }
    }
}
hz.Component.register(Emoji_UI_Selector);
