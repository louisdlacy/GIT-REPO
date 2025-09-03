"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtueTaskDialog = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const FtueTask_1 = require("FtueTask");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class FtueTaskDialog extends FtueTask_1.FtueTaskUI {
    constructor() {
        super(...arguments);
        this.panelWidth = 720;
        this.panelHeight = 720;
        this.titleBinding = new ui_1.Binding("TITLE");
        this.descriptionBinding = new ui_1.Binding("DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION ");
        this.imageBinding = new ui_1.Binding(ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt(745435914391408))));
        this.hasImage = new ui_1.Binding(true);
    }
    start() {
        super.start();
        this.entity.visible.set(false);
    }
    onTaskStart(player) {
        this.entity.visible.set(true);
        this.props.dialogAppearSfx?.as(core_1.AudioGizmo).play();
        this.player = player;
        this.titleBinding.set(this.props.titleText, [player]);
        this.descriptionBinding.set(this.props.messageText, [player]);
        if (this.props.imageAssetId.length > 0) {
            this.imageBinding.set(ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt(this.props.imageAssetId))), [player]);
            this.hasImage.set(true, [player]);
        }
        else {
            this.hasImage.set(false, [player]);
        }
    }
    onTaskComplete(player) {
        this.entity.visible.set(false);
    }
    completeTaskWithPlayer() {
        this.complete(this.player);
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({ text: this.titleBinding, style: titleTextStyle }),
                ui_1.UINode.if((this.props.imageAssetId.length > 0), (0, ui_1.Image)({ source: this.imageBinding, style: imageStyle })),
                (0, ui_1.Text)({ text: this.descriptionBinding, style: descriptionTextStyle }),
                (0, ui_1.Pressable)({
                    children: (0, ui_1.Text)({
                        text: this.props.buttonText,
                    }),
                    onClick: this.completeTaskWithPlayer.bind(this),
                    style: buttonStyle,
                })
            ],
            style: viewStyle
        });
    }
}
exports.FtueTaskDialog = FtueTaskDialog;
FtueTaskDialog.propsDefinition = {
    ...FtueTask_1.FtueTaskUI.propsDefinition,
    titleText: { type: core_1.PropTypes.String },
    messageText: { type: core_1.PropTypes.String },
    imageAssetId: { type: core_1.PropTypes.String },
    buttonText: { type: core_1.PropTypes.String },
    dialogAppearSfx: { type: core_1.PropTypes.Entity },
};
ui_1.UIComponent.register(FtueTaskDialog);
// Custom UI code
const viewStyle = {
    top: '5%',
    left: '20%',
    width: '60%',
    height: '90%',
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'beige',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 7,
};
const textStyle = {
    color: "black",
    textAlign: "center",
    fontFamily: 'Roboto',
    fontWeight: "bold",
    position: "relative",
    margin: 6
};
const titleTextStyle = {
    ...textStyle,
    fontSize: 80,
};
const descriptionTextStyle = {
    ...textStyle,
    fontSize: 50,
};
const imageStyle = {
    position: "relative",
    height: "50%",
    aspectRatio: 1 / 1,
};
const buttonStyle = {
    ...textStyle,
    position: "relative",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "black",
    backgroundColor: "gray",
    height: "10%",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
};
