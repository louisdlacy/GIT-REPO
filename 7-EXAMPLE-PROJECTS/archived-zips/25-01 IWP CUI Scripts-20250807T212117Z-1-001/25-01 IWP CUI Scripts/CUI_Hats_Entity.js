"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUI_Assets_Data_1 = require("CUI_Assets_Data");
const CUI_Bindings_Data_1 = require("CUI_Bindings_Data");
const CUI_Hats_Styles_1 = require("CUI_Hats_Styles");
const HatManager_Data_1 = require("HatManager_Data");
const HatManager_Func_1 = require("HatManager_Func");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const IWP_Manager_Func_1 = require("IWP_Manager_Func");
const PlayerData_Data_1 = require("PlayerData_Data");
const UtilAction_Func_1 = require("UtilAction_Func");
const UtilArray_Func_1 = require("UtilArray_Func");
const UtilOperator_Func_1 = require("UtilOperator_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
class HatUI extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.orgPos = core_1.Vec3.zero;
        this.itemIndexMap = new Map();
        this.itemIndexBinding = new ui_1.Binding(0);
        this.isItemSelectedMap = new Map();
        this.isItemSelectedBinding = new ui_1.Binding(false);
        this.isSelectedItemOwnedBinding = new ui_1.Binding(false);
        this.isSelectedItemEquippedBinding = new ui_1.Binding(false);
        this.numberOfItems = HatManager_Data_1.hatManager_Data.allHats.length;
        this.purchaseFailColorBinding = new ui_1.Binding(core_1.Color.white);
        this.playersFlashing = [];
        this.tintColor = new core_1.Color(0.7, 0.7, 0.7);
        this.purchaseFailRed = new core_1.Color(0.9, 0, 0);
        this.buttons = [
            ui_1.UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected || this.numberOfItems > 10); }), this.createArrowButton(true, ui_1.ImageSource.fromTextureAsset(CUI_Assets_Data_1.cuiAssets_Data.arrows.left.as(core_1.TextureAsset)))),
            ui_1.UINode.if(this.isItemSelectedBinding, [
                this.createButton('Exit'),
                ui_1.UINode.if(this.isSelectedItemOwnedBinding, ui_1.UINode.if(this.isSelectedItemEquippedBinding.derive((isEquipped) => { return !isEquipped; }), this.createButton('Equip')), this.createButton('Buy')),
            ]),
            ui_1.UINode.if(this.isItemSelectedBinding.derive((isSelected) => { return (isSelected || this.numberOfItems > 10); }), this.createArrowButton(false, ui_1.ImageSource.fromTextureAsset(CUI_Assets_Data_1.cuiAssets_Data.arrows.right.as(core_1.TextureAsset)))),
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
                    (0, ui_1.Image)({
                        source: this.itemIndexBinding.derive((index) => {
                            return ui_1.ImageSource.fromTextureAsset(HatManager_Data_1.hatManager_Data.allHats[index]?.assetIcon ?? CUI_Assets_Data_1.cuiAssets_Data.missingImage.as(core_1.TextureAsset));
                        }),
                        style: CUI_Hats_Styles_1.cuiHatsStyles.imageStyle,
                    }),
                    (0, ui_1.Text)({
                        text: this.itemIndexBinding.derive((index) => {
                            return HatManager_Data_1.hatManager_Data.allHats[index].name;
                        }),
                        style: CUI_Hats_Styles_1.cuiHatsStyles.imageTitleTextStyle,
                    }),
                    ui_1.UINode.if(this.isSelectedItemOwnedBinding.derive((isOwned) => { return !isOwned; }), (0, ui_1.Text)({
                        text: this.itemIndexBinding.derive((index) => {
                            return ' ' + HatManager_Data_1.hatManager_Data.allHats[index].assetPrice + ' Tokens';
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
    }
    start() {
        this.orgPos = this.entity.position.get();
    }
    createImageButton(pageItemIndex) {
        const iconTintBinding = new ui_1.Binding(core_1.Color.white);
        return ui_1.UINode.if(this.itemIndexBinding.derive((index) => {
            const myIndex = (Math.floor(index / 10) * 10) + pageItemIndex;
            return myIndex < this.numberOfItems;
        }), (0, ui_1.Pressable)({
            children: [
                (0, ui_1.Image)({
                    source: this.itemIndexBinding.derive((index) => {
                        const myIndex = (Math.floor(index / 10) * 10) + pageItemIndex;
                        return ui_1.ImageSource.fromTextureAsset(HatManager_Data_1.hatManager_Data.allHats[myIndex]?.assetIcon ?? CUI_Assets_Data_1.cuiAssets_Data.missingImage.as(core_1.TextureAsset));
                    }),
                    style: {
                        ...CUI_Hats_Styles_1.cuiHatsStyles.iconImageStyle,
                        tintColor: iconTintBinding,
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
                iconTintBinding.set(core_1.Color.white, [player]);
            },
            onEnter: (player) => {
                iconTintBinding.set(this.tintColor, [player]);
            },
            onExit: (player) => {
                iconTintBinding.set(core_1.Color.white, [player]);
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
                if (isLeft) {
                    if (isItemSelected) {
                        curIndex--;
                    }
                    else {
                        curIndex -= 10;
                    }
                    if (curIndex < 0) {
                        curIndex = HatManager_Data_1.hatManager_Data.allHats.length - 1;
                    }
                }
                else {
                    if (isItemSelected) {
                        curIndex++;
                    }
                    else {
                        curIndex += 10;
                    }
                    if (curIndex >= HatManager_Data_1.hatManager_Data.allHats.length) {
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
                const hatAssetData = HatManager_Data_1.hatManager_Data.allHats[curIndex];
                switch (type) {
                    case "Exit":
                        this.isItemSelectedMap.set(player, false);
                        this.isItemSelectedBinding.set(false, [player]);
                        break;
                    case "Buy":
                        if (playerData && hatAssetData && !playerData.stats.purchasedItems.includes(hatAssetData.id)) {
                            if (IWP_Manager_Func_1.iwpManager_Func.chargeTokens(player, hatAssetData.assetPrice)) {
                                UtilAction_Func_1.actionUtils.playSFX(this.props.purchaseSuccessSfx, this.orgPos);
                                playerData.stats.purchasedItems.push(hatAssetData.id);
                                this.world.leaderboards.setScoreForPlayer(WorldVariableNames_Data_1.worldVariableNames.leaderboards.mostHatsOwned, player, playerData.stats.purchasedItems.length, false);
                                this.isSelectedItemOwnedBinding.set(true, [player]);
                            }
                            else {
                                UtilAction_Func_1.actionUtils.playSFX(this.props.purchaseErrorSfx, this.orgPos);
                                this.purchaseFailFlashRed(player, 3);
                            }
                        }
                        break;
                    case "Equip":
                        if (playerData && hatAssetData && playerData.stats.lastWornItem !== hatAssetData.id) {
                            this.isSelectedItemEquippedBinding.set(true, [player]);
                            await HatManager_Func_1.hatManager_Func.spawnHat(player, playerData, hatAssetData);
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
        const isEquipped = HatManager_Data_1.hatManager_Data.allHats[curIndex].id === playerData.stats.lastWornItem;
        this.isSelectedItemEquippedBinding.set(isEquipped, [player]);
        const isOwned = playerData.stats.purchasedItems.includes(HatManager_Data_1.hatManager_Data.allHats[curIndex].id);
        this.isSelectedItemOwnedBinding.set(isOwned, [player]);
        this.itemIndexMap.set(player, curIndex);
        this.itemIndexBinding.set(curIndex, [player]);
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
}
HatUI.propsDefinition = {
    clickSfx: { type: core_1.PropTypes.Entity },
    purchaseErrorSfx: { type: core_1.PropTypes.Entity },
    purchaseSuccessSfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(HatUI);
