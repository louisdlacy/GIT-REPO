import { cuiInstructionStyles } from "CUI_Instructions_Styles";
import { Asset, AudioGizmo, Color, Component, PropTypes, TextureAsset, Vec3 } from "horizon/core";
import { Binding, Image, ImageSource, Pressable, Text, UIChildren, UIComponent, View } from "horizon/ui";


class Instructions extends UIComponent<typeof Instructions> {
  static propsDefinition = {
    click: { type: PropTypes.Entity },
    empty: { type: PropTypes.Asset },
    logoPage: { type: PropTypes.Asset },
    howToPlay: { type: PropTypes.Asset },
    proTips: { type: PropTypes.Asset },
    stages: { type: PropTypes.Asset },
    team: { type: PropTypes.Asset },
    community: { type: PropTypes.Asset },
    keepItKind: { type: PropTypes.Asset },
  };

  readonly backgroundImage = new Binding<ImageSource>('');

  index = 0;
  readonly textures: TextureAsset[] = [];

  orgPos = Vec3.zero;

  preStart() {

  }

  addTextureToArray(texture: Asset | undefined) {
    const t = texture?.as(TextureAsset);
    if (t) { this.textures.push(t); }
  }

  start() {
    this.orgPos = this.entity.position.get();

    this.backgroundImage.set(ImageSource.fromTextureAsset(this.textures[this.index]));
  }

  initializeUI() {
    this.addTextureToArray(this.props.logoPage);
    this.addTextureToArray(this.props.howToPlay);
    this.addTextureToArray(this.props.proTips);
    this.addTextureToArray(this.props.stages);
    this.addTextureToArray(this.props.team);
    this.addTextureToArray(this.props.community);
    this.addTextureToArray(this.props.keepItKind);

    this.backgroundImage.set(ImageSource.fromTextureAsset(this.textures[this.index]));

    return View({
      children: [
        Image({
          source: ImageSource.fromTextureAsset(this.props.empty!),
          style: cuiInstructionStyles.imageStyle,
        }),
        Image({
          source: this.backgroundImage,
          style: cuiInstructionStyles.imageStyle,
        }),
        View({
          children: [...this.buttons],
          style: cuiInstructionStyles.buttonsStyle,
        }),
      ],
      style: { ...cuiInstructionStyles.containerStyle, borderWidth: 4, borderColor: Color.black },
    });
  }

  createButton(buttonText: string, goUp: boolean): UIChildren {
    return Pressable({
      children: Text({
        text: buttonText,
        style: cuiInstructionStyles.buttonText,
      }),
      onClick: () => { this.updateIndex(goUp); }, //put function call here
      style: cuiInstructionStyles.buttonBackground,
    });
  }

  buttons: UIChildren[] = [
    this.createButton('Back', false),
    this.createButton('Next', true),
  ];

  updateIndex(goUp: boolean) {    
      this.props.click?.position.set(this.orgPos);
      this.props.click?.as(AudioGizmo).play();

    if (goUp) {
      this.index++;
    }
    else {
      this.index += (this.textures.length - 1);
    }

    this.index = this.index % this.textures.length;

    this.backgroundImage.set(ImageSource.fromTextureAsset(this.textures[this.index]));
  }
}
Component.register(Instructions);


