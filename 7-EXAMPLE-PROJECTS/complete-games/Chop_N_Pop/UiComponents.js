"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthHud = exports.AmmoHud = exports.UiComponentsRegistry = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const GameUtils_1 = require("GameUtils");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class UiComponentsRegistry {
    static RegisterComponent(id, behaviour) {
        UiComponentsRegistry.componentMap.set(id, behaviour);
    }
    static GetComponent(entity) {
        if (entity == undefined || entity == null) {
            console.log("GetBehaviour: Entity is undefined or null");
            return undefined;
        }
        return UiComponentsRegistry.componentMap.get(entity.id);
    }
}
exports.UiComponentsRegistry = UiComponentsRegistry;
(() => {
    UiComponentsRegistry.componentMap = new Map();
})();
///////////////////////////////////////////////////////////////////////////////
class AmmoHud extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 80;
        this.panelWidth = 200;
        this.strPlayerAmmoTotal = new ui_1.Binding('0');
        this.colorAmmo = new ui_1.Binding(core_1.Color.white);
    }
    updateAmmo(ammo, color) {
        this.strPlayerAmmoTotal.set(ammo.toString());
        this.colorAmmo.set(color);
    }
    initializeUI() {
        UiComponentsRegistry.RegisterComponent(this.entity.id, this);
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, GameUtils_1.loadImageFromTexture)(this.props.textureAsset, { height: 64, width: 64 }),
                    ],
                    style: {
                        display: 'flex',
                        width: 80,
                    },
                }),
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({ text: this.strPlayerAmmoTotal, style: {
                                fontFamily: "Optimistic",
                                color: this.colorAmmo,
                                fontWeight: "700",
                                fontSize: 40,
                            } }),
                    ],
                    style: {
                        display: 'flex',
                        flexGrow: 1,
                    },
                })
            ],
            style: {
                position: 'absolute',
                height: 70,
                width: 120,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#rgba(0,0,0,0)',
                left: 40,
                top: '20%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                transform: [{ scale: 1.0 }],
            },
        });
    }
}
exports.AmmoHud = AmmoHud;
AmmoHud.propsDefinition = {
    textureAsset: { type: core_1.PropTypes.Asset },
};
ui_1.UIComponent.register(AmmoHud);
///////////////////////////////////////////////////////////////////////////////
class HealthHud extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.panelHeight = 80;
        this.panelWidth = 200;
        this.strPlayerAmmoTotal = new ui_1.Binding('100');
        this.colorAmmo = new ui_1.Binding(core_1.Color.white);
    }
    updateHealth(hp, color) {
        this.strPlayerAmmoTotal.set(hp.toString());
        this.colorAmmo.set(color);
    }
    initializeUI() {
        UiComponentsRegistry.RegisterComponent(this.entity.id, this);
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({ text: this.strPlayerAmmoTotal, style: {
                                fontFamily: "Optimistic",
                                color: this.colorAmmo,
                                fontWeight: "700",
                                fontSize: 40,
                            } }),
                    ],
                    style: {
                        display: 'flex',
                        flexGrow: 1,
                        paddingRight: 10,
                    },
                }),
                (0, ui_1.View)({
                    children: [
                        (0, GameUtils_1.loadImageFromTexture)(this.props.textureAsset, { height: 64, width: 64 }),
                    ],
                    style: {
                        display: 'flex',
                        width: 80,
                    },
                })
            ],
            style: {
                position: 'absolute',
                height: 70,
                width: 120,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#rgba(0,0,0,0)',
                right: 30,
                top: '20%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                transform: [{ scale: 1.0 }],
            },
        });
    }
}
exports.HealthHud = HealthHud;
HealthHud.propsDefinition = {
    textureAsset: { type: core_1.PropTypes.Asset },
};
ui_1.UIComponent.register(HealthHud);
