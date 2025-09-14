import { TextureAsset } from "horizon/2p";
import { PropTypes } from "horizon/core";
import { Npc, NpcEvents, Viseme } from "horizon/npc";
import { Binding, Image, ImageSource, UIComponent, UINode, View } from "horizon/ui";

class VisemeTest extends UIComponent<typeof VisemeTest> {
  static propsDefinition = {
    voice: {
      type: PropTypes.Entity
    },
  };

  protected panelWidth: number = 1080;
  protected panelHeight: number = 1080;

  private moveX: Binding<number> = new Binding(0);
  private moveY: Binding<number> = new Binding(0);

  preStart(): void { }

  initializeUI(): UINode {
    return View({
      style: {
        width: this.panelWidth,
        height: this.panelHeight,
        backgroundColor: '#354600c0',
        // justifyContent: "center",
        // alignItems: "center"
      },
      children: [
        Image({
          source: ImageSource.fromTextureAsset(new TextureAsset(BigInt('1077667850961560'))),
          style: {
            width: this.panelWidth * 4,
            aspectRatio: 1,
            transform: [{ translate: [this.moveX, this.moveY] }]
          }
        })
      ]
    })
  }

  start() {
    if (this.props.voice) {
      this.connectNetworkEvent(
        this.props.voice,
        NpcEvents.OnNpcVisemeChanged,
        ({ viseme }) => this.visemeHandler(viseme)
      );

      this.voiceSpeak();

      // this.async.setInterval(() => {
      //   this.cycleTest();
      // }, 500);

    } else {
      console.warn('No voice linked to viseme UI');
    }
  }

  voiceSpeak() {
    if (this.props.voice) {
      this.props.voice.as(Npc).conversation.elicitResponse('Something so totally random to make the listener question your sanity, but it kinda makes a bit of sense').then(() => {
        this.async.setTimeout(() => {
          this.voiceSpeak();
        }, 1000);
      });
    }
  }

  visemeHandler(visemeID: Viseme) {
    console.log(`Received viseme: ${visemeID}`);

    const idX = visemeID % 4;
    const idY = Math.floor(visemeID / 4);

    // console.log(`Current tile X,Y :[${idX}, ${idY}]`);

    this.moveX.set((idX * this.panelWidth) * -1);
    this.moveY.set((idY * this.panelHeight) * -1);
  }

  private i: number = 0;
  cycleTest() {
    const idX = this.i % 4;
    const idY = Math.floor(this.i / 4);

    // console.log(`Current tile X,Y :[${idX}, ${idY}]`);

    this.moveX.set((idX * this.panelWidth) * -1);
    this.moveY.set((idY * this.panelHeight) * -1);

    this.i = (this.i + 1) % 15
  }
}
UIComponent.register(VisemeTest);