"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUI_Assets_Data_1 = require("CUI_Assets_Data");
const CUI_Bindings_Data_1 = require("CUI_Bindings_Data");
const CUI_ColorPicker_Data_1 = require("CUI_ColorPicker_Data");
const CUI_Hats_Styles_1 = require("CUI_Hats_Styles");
const HatManager_Func_1 = require("HatManager_Func");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const IWP_Manager_Func_1 = require("IWP_Manager_Func");
const PlayerData_Data_1 = require("PlayerData_Data");
const UtilAction_Func_1 = require("UtilAction_Func");
const UtilArray_Func_1 = require("UtilArray_Func");
const UtilOperator_Func_1 = require("UtilOperator_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
class ColorPickerUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.orgPos = core_1.Vec3.zero;
        this.itemIndexMap = new Map();
        this.itemIndexBinding = new ui_1.Binding({ index: 0, numberOfItems: CUI_ColorPicker_Data_1.colorPicker_Data.availableColorArray.length, availableColors: [...CUI_ColorPicker_Data_1.colorPicker_Data.availableColorArray] });
        this.isItemSelectedMap = new Map();
        this.isItemSelectedBinding = new ui_1.Binding(false);
        this.isSelectedItemOwnedBinding = new ui_1.Binding(false);
        this.isSelectedItemEquippedBinding = new ui_1.Binding(false);
        this.availableColorsMap = new Map();
        this.numberOfItemsMap = new Map();
        this.purchaseFailColorBinding = new ui_1.Binding(core_1.Color.white);
        this.playersFlashing = [];
        this.purchaseFailRed = new core_1.Color(0.9, 0, 0);
        this.buttons = [
            ui_1.UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected); }), this.createArrowButton(true, ui_1.ImageSource.fromTextureAsset(CUI_Assets_Data_1.cuiAssets_Data.arrows.left.as(core_1.TextureAsset))), ui_1.UINode.if(this.itemIndexBinding.derive((payload) => { return (payload.numberOfItems > 10); }), this.createArrowButton(true, ui_1.ImageSource.fromTextureAsset(CUI_Assets_Data_1.cuiAssets_Data.arrows.left.as(core_1.TextureAsset))))),
            ui_1.UINode.if(this.isItemSelectedBinding, [
                this.createButton('Exit'),
                ui_1.UINode.if(this.isSelectedItemOwnedBinding, ui_1.UINode.if(this.isSelectedItemEquippedBinding.derive((isEquipped) => { return !isEquipped; }), this.createButton('Equip')), this.createButton('Buy')),
            ]),
            ui_1.UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected); }), this.createArrowButton(false, ui_1.ImageSource.fromTextureAsset(CUI_Assets_Data_1.cuiAssets_Data.arrows.right.as(core_1.TextureAsset))), ui_1.UINode.if(this.itemIndexBinding.derive((payload) => { return (payload.numberOfItems > 10); }), this.createArrowButton(false, ui_1.ImageSource.fromTextureAsset(CUI_Assets_Data_1.cuiAssets_Data.arrows.right.as(core_1.TextureAsset))))),
        ];
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: 'Hat Shop',
                    style: CUI_Hats_Styles_1.cuiHatsStyles.titleTextStyle,
                }),
                ui_1.UINode.if(this.isItemSelectedBinding, [
                    (0, ui_1.View)({
                        style: {
                            ...CUI_Hats_Styles_1.cuiHatsStyles.imageStyle,
                            backgroundColor: this.itemIndexBinding.derive((payload) => {
                                return payload.availableColors[payload.index].color;
                            }),
                        },
                    }),
                    (0, ui_1.Text)({
                        text: this.itemIndexBinding.derive((payload) => {
                            return payload.availableColors[payload.index].name;
                        }),
                        style: CUI_Hats_Styles_1.cuiHatsStyles.imageTitleTextStyle,
                    }),
                    ui_1.UINode.if(this.isSelectedItemOwnedBinding.derive((isOwned) => { return !isOwned; }), (0, ui_1.Text)({
                        text: this.itemIndexBinding.derive((payload) => {
                            return ' ' + payload.availableColors[payload.index].price + ' Tokens';
                        }),
                        style: {
                            ...CUI_Hats_Styles_1.cuiHatsStyles.imageSubTitleTextStyle,
                            color: this.purchaseFailColorBinding,
                        },
                    }), ui_1.UINode.if(this.isSelectedItemEquippedBinding, (0, ui_1.Text)({
                        text: 'Equipped',
                        style: CUI_Hats_Styles_1.cuiHatsStyles.imageSubTitleTextStyle,
                    }), (0, ui_1.Text)({
                        text: 'Owned',
                        style: CUI_Hats_Styles_1.cuiHatsStyles.imageSubTitleTextStyle,
                    }))),
                ], [
                    (0, ui_1.View)({
                        children: [
                            this.createImageButton(0),
                            this.createImageButton(1),
                            this.createImageButton(2),
                            this.createImageButton(3),
                            this.createImageButton(4),
                            this.createImageButton(5),
                            this.createImageButton(6),
                            this.createImageButton(7),
                            this.createImageButton(8),
                            this.createImageButton(9),
                        ],
                        style: CUI_Hats_Styles_1.cuiHatsStyles.rowImagesContainerStyle,
                    })
                ]),
                (0, ui_1.View)({
                    children: [...this.buttons],
                    style: CUI_Hats_Styles_1.cuiHatsStyles.buttonsStyle,
                }),
                (0, ui_1.Text)({
                    text: CUI_Bindings_Data_1.cuiBindings_Data.tokensBinding.derive((tokens) => { return 'Token Balance:\n' + UtilOperator_Func_1.operatorUtils.toLocaleString(',', tokens); }),
                    style: CUI_Hats_Styles_1.cuiHatsStyles.tokenBalanceTextStyle,
                }),
            ],
            style: { ...CUI_Hats_Styles_1.cuiHatsStyles.containerStyle },
        });
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    }
    start() {
        this.orgPos = this.entity.position.get();
    }
    createImageButton(pageItemIndex) {
        const iconTintBinding = new ui_1.Binding(1);
        return ui_1.UINode.if(this.itemIndexBinding.derive((payload) => {
            const myIndex = (Math.floor(payload.index / 10) * 10) + pageItemIndex;
            return myIndex < payload.numberOfItems;
        }), (0, ui_1.Pressable)({
            children: [
                (0, ui_1.View)({
                    style: {
                        ...CUI_Hats_Styles_1.cuiHatsStyles.iconImageStyle,
                        backgroundColor: this.itemIndexBinding.derive((payload) => {
                            const myIndex = (Math.floor(payload.index / 10) * 10) + pageItemIndex;
                            if (myIndex < payload.numberOfItems) {
                                return payload.availableColors[myIndex].color;
                            }
                            else {
                                return core_1.Color.red;
                            }
                        }),
                        opacity: iconTintBinding,
                    },
                }),
            ],
            style: {},
            onPress: (player) => {
                UtilAction_Func_1.actionUtils.playSFX(this.props.clickSfx?.as(core_1.AudioGizmo), this.orgPos);
                const playerData = PlayerData_Data_1.playerDataMap.get(player);
                if (playerData) {
                    const indexSelected = this.itemIndexMap.get(player) ?? 0;
                    const myIndex = (Math.floor(indexSelected / 10) * 10) + pageItemIndex;
                    this.changePageBindingUpdates(player, playerData, myIndex);
                    this.isItemSelectedMap.set(player, true);
                    this.isItemSelectedBinding.set(true, [player]);
                }
                iconTintBinding.set(1, [player]);
            },
            onEnter: (player) => {
                iconTintBinding.set(0.7, [player]);
            },
            onExit: (player) => {
                iconTintBinding.set(1, [player]);
            },
        }));
    }
    createArrowButton(isLeft, source) {
        return (0, ui_1.Pressable)({
            children: [
                (0, ui_1.Image)({
                    source: source,
                    style: {
                        ...CUI_Hats_Styles_1.cuiHatsStyles.arrowImageStyle,
                        left: isLeft ? 5 : 10,
                    },
                }),
            ],
            style: CUI_Hats_Styles_1.cuiHatsStyles.buttonBackground,
            onPress: (player) => {
                UtilAction_Func_1.actionUtils.playSFX(this.props.clickSfx?.as(core_1.AudioGizmo), this.orgPos);
                let curIndex = this.itemIndexMap.get(player) ?? 0;
                const isItemSelected = this.isItemSelectedMap.get(player);
                const numberOfItems = this.numberOfItemsMap.get(player) ?? CUI_ColorPicker_Data_1.colorPicker_Data.availableColorArray.length;
                if (isLeft) {
                    if (isItemSelected) {
                        curIndex--;
                    }
                    else {
                        curIndex -= 10;
                    }
                    if (curIndex < 0) {
                        curIndex = numberOfItems - 1;
                    }
                }
                else {
                    if (isItemSelected) {
                        curIndex++;
                    }
                    else {
                        curIndex += 10;
                    }
                    if (curIndex >= numberOfItems) {
                        curIndex = 0;
                    }
                }
                const playerData = PlayerData_Data_1.playerDataMap.get(player);
                if (playerData) {
                    this.changePageBindingUpdates(player, playerData, curIndex);
                }
            },
        });
    }
    createButton(type) {
        return (0, ui_1.Pressable)({
            children: [
                (0, ui_1.Text)({
                    text: type,
                    style: {
                        height: 20,
                        width: 30 + type.length * 5,
                        position: 'absolute',
                        top: 3,
                        textAlign: 'center',
                        fontSize: 15,
                    },
                }),
            ],
            style: {
                ...CUI_Hats_Styles_1.cuiHatsStyles.buttonBackground,
                alignItems: 'center',
                justifyContent: 'center',
                width: 30 + type.length * 5,
            },
            onPress: async (player) => {
                UtilAction_Func_1.actionUtils.playSFX(this.props.clickSfx?.as(core_1.AudioGizmo), this.orgPos);
                const playerData = PlayerData_Data_1.playerDataMap.get(player);
                const curIndex = this.itemIndexMap.get(player) ?? -1;
                const purchasableColors = this.availableColorsMap.get(player);
                const purchasableColor = purchasableColors ? purchasableColors[curIndex] : undefined;
                switch (type) {
                    case "Exit":
                        this.isItemSelectedMap.set(player, false);
                        this.isItemSelectedBinding.set(false, [player]);
                        break;
                    case "Buy":
                        if (playerData && purchasableColor && !playerData.stats.purchasedColors.includes(purchasableColor.name)) {
                            if (IWP_Manager_Func_1.iwpManager_Func.chargeTokens(player, purchasableColor.price)) {
                                UtilAction_Func_1.actionUtils.playSFX(this.props.purchaseSuccessSfx, this.orgPos);
                                playerData.stats.purchasedColors.push(purchasableColor.name);
                                this.world.leaderboards.setScoreForPlayer(WorldVariableNames_Data_1.worldVariableNames.leaderboards.mostColorsOwned, player, playerData.stats.purchasedColors.length, false);
                                this.isSelectedItemOwnedBinding.set(true, [player]);
                            }
                            else {
                                UtilAction_Func_1.actionUtils.playSFX(this.props.purchaseErrorSfx, this.orgPos);
                                this.purchaseFailFlashRed(player, 3);
                            }
                        }
                        break;
                    case "Equip":
                        if (playerData && purchasableColor && playerData.stats.lastWornColor !== purchasableColor.name) {
                            this.isSelectedItemEquippedBinding.set(true, [player]);
                            HatManager_Func_1.hatManager_Func.setHatColor(player, playerData, purchasableColor.name);
                        }
                        break;
                    default:
                        console.log('Case Not Found For Type: ' + type + '. On CUI_Hats_Entity: CreateButton');
                        break;
                }
            },
        });
    }
    changePageBindingUpdates(player, playerData, curIndex) {
        const availableColors = this.availableColorsMap.get(player);
        const isEquipped = (availableColors ? availableColors[curIndex].name : '') === playerData.stats.lastWornColor;
        this.isSelectedItemEquippedBinding.set(isEquipped, [player]);
        const isOwned = playerData.stats.purchasedColors.includes(availableColors ? availableColors[curIndex].name : '');
        this.isSelectedItemOwnedBinding.set(isOwned, [player]);
        this.itemIndexMap.set(player, curIndex);
        this.itemIndexBinding.set({ index: curIndex, numberOfItems: this.numberOfItemsMap.get(player) ?? CUI_ColorPicker_Data_1.colorPicker_Data.availableColorArray.length, availableColors: this.availableColorsMap.get(player) ?? [...CUI_ColorPicker_Data_1.colorPicker_Data.availableColorArray] }, [player]);
    }
    async purchaseFailFlashRed(player, flashes) {
        if (!this.playersFlashing.includes(player)) {
            this.playersFlashing.push(player);
            let count = 0;
            while (count < flashes) {
                count++;
                this.purchaseFailColorBinding.set(this.purchaseFailRed, [player]);
                await new Promise(resolve => this.async.setTimeout(resolve, 500));
                this.purchaseFailColorBinding.set(core_1.Color.white, [player]);
                await new Promise(resolve => this.async.setTimeout(resolve, 500));
            }
            UtilArray_Func_1.arrayUtils.removeItemFromArray(this.playersFlashing, player);
        }
    }
    playerEnterWorld(player) {
        this.async.setTimeout(() => { this.delayedPlayerInitialization(player); }, 500);
    }
    delayedPlayerInitialization(player) {
        const playerData = PlayerData_Data_1.playerDataMap.get(player);
        if (playerData) {
            const availableColors = [...CUI_ColorPicker_Data_1.colorPicker_Data.availableColorArray];
            playerData.stats.purchasedColors.forEach((colorName) => {
                const purchasableColor = CUI_ColorPicker_Data_1.colorPicker_Data.allColorMap.get(colorName);
                if (purchasableColor) {
                    if (!availableColors.includes(purchasableColor)) {
                        availableColors.push(purchasableColor);
                    }
                }
            });
            this.availableColorsMap.set(player, availableColors);
            this.numberOfItemsMap.set(player, availableColors.length);
            this.changePageBindingUpdates(player, playerData, 0);
        }
    }
}
ColorPickerUI.propsDefinition = {
    clickSfx: { type: core_1.PropTypes.Entity },
    purchaseErrorSfx: { type: core_1.PropTypes.Entity },
    purchaseSuccessSfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(ColorPickerUI);
