"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUI_Bindings_Data_1 = require("CUI_Bindings_Data");
const CUI_IWP_Styles_1 = require("CUI_IWP_Styles");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const IWP_Manager_Data_1 = require("IWP_Manager_Data");
const UtilOperator_Func_1 = require("UtilOperator_Func");
class IWP extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.orgPos = core_1.Vec3.zero;
        this.buttons = [
            this.createButton('1 Token', '330 Meta Credits'), //330
            this.createButton('7 Tokens', '1,640 Meta Credits'), //234.29
            this.createButton('17 Tokens', '3,280 Meta Credits'), //192.94
            this.createButton('50 Tokens', '8,205 Meta Credits'), //164.10
        ];
    }
    start() {
        this.orgPos = this.entity.position.get();
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [...this.buttons],
                    style: CUI_IWP_Styles_1.cuiIWPStyles.buttonsStyle,
                }),
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.View)({
                            style: {
                                position: 'absolute',
                                height: 30,
                                width: 350,
                                alignSelf: 'center',
                                backgroundColor: new core_1.Color(0.8, 0.2, 0.6),
                                borderColor: core_1.Color.white,
                                borderWidth: 2,
                                borderRadius: 15,
                            },
                        }),
                        (0, ui_1.View)({
                            style: {
                                position: 'absolute',
                                height: 26,
                                width: CUI_Bindings_Data_1.cuiBindings_Data.playerDataBinding.derive((playerData) => {
                                    return Math.floor(346 * (playerData.stats.premiumTokenProgress / IWP_Manager_Data_1.iwpManager_Data.amountToEarnAPremiumToken));
                                }),
                                alignSelf: 'center',
                                backgroundColor: new core_1.Color(1, 0.35, 0.85),
                                marginTop: 2,
                                borderRadius: 15,
                            },
                        }),
                        (0, ui_1.Text)({
                            text: CUI_Bindings_Data_1.cuiBindings_Data.playerDataBinding.derive((playerData) => {
                                return 'Next Premium Token:  ' + UtilOperator_Func_1.operatorUtils.toLocaleString(',', playerData.stats.premiumTokenProgress) + ' / ' + UtilOperator_Func_1.operatorUtils.toLocaleString(',', IWP_Manager_Data_1.iwpManager_Data.amountToEarnAPremiumToken);
                            }),
                            style: {
                                position: 'absolute',
                                textAlign: 'center',
                                fontSize: 18,
                                color: core_1.Color.white,
                                alignSelf: 'center',
                                marginTop: 3,
                            },
                        }),
                    ],
                    style: {
                        position: 'relative',
                        width: '80%',
                        height: '20%',
                        marginTop: '5%',
                    },
                }),
                (0, ui_1.Text)({
                    text: CUI_Bindings_Data_1.cuiBindings_Data.tokensBinding.derive((tokens) => { return 'Token Balance:\n' + UtilOperator_Func_1.operatorUtils.toLocaleString(',', tokens); }),
                    style: {
                        fontSize: 24,
                        fontFamily: 'Anton',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    },
                }),
            ],
            style: { ...CUI_IWP_Styles_1.cuiIWPStyles.containerStyle },
        });
    }
    createButton(buttonText, priceText) {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: buttonText,
                    style: {
                        ...CUI_IWP_Styles_1.cuiIWPStyles.buttonText,
                        textAlign: 'left',
                        fontSize: 19,
                    },
                }),
                (0, ui_1.Text)({
                    text: priceText,
                    style: {
                        ...CUI_IWP_Styles_1.cuiIWPStyles.buttonText,
                        fontSize: 12,
                        fontWeight: '100',
                        textAlign: 'left',
                    },
                }),
            ],
            style: {
                ...CUI_IWP_Styles_1.cuiIWPStyles.buttonBackground,
                width: 185,
            },
        });
    }
}
IWP.propsDefinition = {};
core_1.Component.register(IWP);
