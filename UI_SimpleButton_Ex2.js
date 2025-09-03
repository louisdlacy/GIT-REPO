"use strict";
// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const UI_SimpleButtonEvent_1 = require("UI_SimpleButtonEvent");
class UI_SimpleButton_Ex2 extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isWaving = false;
    }
    preStart() {
        if (this.props.cat == null || this.props.catWave == null) {
            console.error("Cat or catWave asset is not defined");
            return;
        }
        this.connectNetworkEvent(this.entity, UI_SimpleButtonEvent_1.simpleButtonEvent, (data) => {
            console.log("Received simpleButtonEvent:", data);
            this.swapChest();
        });
    }
    start() {
    }
    swapChest() {
        this.isWaving = !this.isWaving;
        const meshEntity = this.entity.as(core_1.MeshEntity);
        const assetToUse = this.isWaving ? this.props.catWave : this.props.cat;
        const textureAsset = assetToUse?.as(core_1.TextureAsset);
        if (textureAsset) {
            meshEntity.setTexture(textureAsset);
        }
    }
}
UI_SimpleButton_Ex2.propsDefinition = {
    cat: { type: core_1.PropTypes.Asset },
    catWave: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(UI_SimpleButton_Ex2);
