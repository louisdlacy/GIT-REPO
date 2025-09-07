"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class CUI_AvatarEmoji_Entity extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.imageBinding = new ui_1.Binding(ui_1.ImageSource.fromTextureAsset(new core_1.TextureAsset(BigInt('663879485972130'))));
    }
    initializeUI() {
        return (0, ui_1.Image)({
            source: this.imageBinding,
            style: {
                height: '100%',
                width: '100%',
            },
        });
    }
    preStart() {
        if (this.props.trigger) {
            this.connectCodeBlockEvent(this.props.trigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
        }
    }
    start() {
        const owner = this.entity.owner.get();
        if (owner !== this.world.getServerPlayer()) {
            this.randomEmoji(owner);
        }
    }
    playerEnterTrigger(player) {
        this.entity.owner.set(player);
        this.randomEmoji(player);
    }
    randomEmoji(player) {
        if (Math.random() > 0.4) {
            this.imageBinding.set(ui_1.ImageSource.fromPlayerAvatarExpression(player, ui_1.AvatarImageExpressions.Waving), [player]);
        }
        else if (Math.random() > 0.4) {
            this.imageBinding.set(ui_1.ImageSource.fromPlayerAvatarExpression(player, ui_1.AvatarImageExpressions.Congrats), [player]);
        }
        else if (Math.random() > 0.3) {
            this.imageBinding.set(ui_1.ImageSource.fromPlayerAvatarExpression(player, ui_1.AvatarImageExpressions.Shocked), [player]);
        }
        else if (Math.random() > 0.3) {
            this.imageBinding.set(ui_1.ImageSource.fromPlayerAvatarExpression(player, ui_1.AvatarImageExpressions.TeeHee), [player]);
        }
        else {
            this.imageBinding.set(ui_1.ImageSource.fromPlayerAvatarExpression(player, ui_1.AvatarImageExpressions.Happy), [player]);
        }
    }
}
CUI_AvatarEmoji_Entity.propsDefinition = {
    trigger: { type: core_1.PropTypes.Entity },
};
ui_1.UIComponent.register(CUI_AvatarEmoji_Entity);
