import { CodeBlockEvents, Player, PropTypes, TextureAsset } from 'horizon/core';
import { AvatarImageExpressions, Binding, Image, ImageSource, UIComponent, UINode } from 'horizon/ui';


class CUI_AvatarEmoji_Entity extends UIComponent<typeof CUI_AvatarEmoji_Entity> {
  static propsDefinition = {
    trigger: { type: PropTypes.Entity },
  };

  imageBinding = new Binding<ImageSource>(ImageSource.fromTextureAsset(new TextureAsset(BigInt('663879485972130'))));

  initializeUI(): UINode {
    return Image({
      source: this.imageBinding,
      style: {
        height: '100%',
        width: '100%',
      },
    });
  }

  preStart() {
    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
    }
  }

  start() {
    const owner = this.entity.owner.get();

    if (owner !== this.world.getServerPlayer()) {
      this.randomEmoji(owner);
    }
  }

  playerEnterTrigger(player: Player) {
    this.entity.owner.set(player);

    this.randomEmoji(player);
  }

  randomEmoji(player: Player) {
    if (Math.random() > 0.4) {
      this.imageBinding.set(ImageSource.fromPlayerAvatarExpression(player, AvatarImageExpressions.Waving), [player]);
    }
    else if (Math.random() > 0.4) {
      this.imageBinding.set(ImageSource.fromPlayerAvatarExpression(player, AvatarImageExpressions.Congrats), [player]);
    }
    else if (Math.random() > 0.3) {
      this.imageBinding.set(ImageSource.fromPlayerAvatarExpression(player, AvatarImageExpressions.Shocked), [player]);
    }
    else if (Math.random() > 0.3) {
      this.imageBinding.set(ImageSource.fromPlayerAvatarExpression(player, AvatarImageExpressions.TeeHee), [player]);
    }
    else {
      this.imageBinding.set(ImageSource.fromPlayerAvatarExpression(player, AvatarImageExpressions.Happy), [player]);
    }
  }
}
UIComponent.register(CUI_AvatarEmoji_Entity);
