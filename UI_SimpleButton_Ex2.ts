// Copyright (c) Dave Mills (RocketTrouble). Released under the MIT License.

import { Component, MeshEntity, PropTypes, TextureAsset } from "horizon/core";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";

class UI_SimpleButton_Ex2 extends Component<typeof UI_SimpleButton_Ex2> {
  static propsDefinition = {
    cat: {type: PropTypes.Asset},
    catWave: {type: PropTypes.Asset},
  };

  private isWaving: boolean = false;

  preStart() {
    if (this.props.cat == null || this.props.catWave == null) {
      console.error("Cat or catWave asset is not defined");
      return;
    }
    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      console.log("Received simpleButtonEvent:", data);
      this.swapChest();
    });
  }
  
  start(){
  }
  
  swapChest(){
    this.isWaving = !this.isWaving;
    const meshEntity = this.entity.as(MeshEntity);
    const assetToUse = this.isWaving ? this.props.catWave : this.props.cat;
    const textureAsset = assetToUse?.as(TextureAsset);
    if (textureAsset) {
      meshEntity.setTexture(textureAsset);
    }
  }
}
Component.register(UI_SimpleButton_Ex2);