import * as hz from 'horizon/core';
import { Npc, Viseme, NpcEvents } from 'horizon/npc';

class NpcTest extends hz.Component<typeof NpcTest> {
  static propsDefinition = {
    npcGizmo: { type: hz.PropTypes.Entity },
    meshObject: { type: hz.PropTypes.Entity },

    mouthClosed: { type: hz.PropTypes.Asset },
    mm_viseme: { type: hz.PropTypes.Asset },
    ff_viseme: { type: hz.PropTypes.Asset },
    dd_viseme: { type: hz.PropTypes.Asset },
    ee_viseme: { type: hz.PropTypes.Asset },
    ch_viseme: { type: hz.PropTypes.Asset },
    aa_viseme: { type: hz.PropTypes.Asset },
    E_viseme: { type: hz.PropTypes.Asset },
    oh_viseme: { type: hz.PropTypes.Asset },
    ou_viseme: { type: hz.PropTypes.Asset },
  };

  private npc: Npc | undefined;

  start() {

    this.npc = this.props.npcGizmo!.as(Npc);
    if (this.npc == undefined) {
      console.error("ComputerFriend: npc is undefined.");
      return;
    }

    if (!this.npc.isConversationEnabled()) {
      console.error("ComputerFriend: conversation not enabled");
      return;
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onPlayerEnterTrigger(player);
    });

    this.connectNetworkEvent(this.npc, NpcEvents.OnNpcVisemeChanged, (data) => {
      this.textureSwap(data.viseme);
    });
  }

  textureSwap(viseme: Viseme) {
    let mesh = this.props.meshObject!.as(hz.MeshEntity);

    const closedMouth : Viseme[] = [Viseme.sil];
    const mmMouth : Viseme[] = [Viseme.PP];
    const ffMouth : Viseme[] = [Viseme.FF];
    const ddMouth : Viseme[] = [Viseme.TH, Viseme.DD, Viseme.nn];
    const eeMouth : Viseme[] = [Viseme.kk, Viseme.SS, Viseme.ih];
    const chMouth : Viseme[] = [Viseme.CH, Viseme.RR];
    const aaMouth : Viseme[] = [Viseme.aa];
    const EMouth : Viseme[] = [Viseme.E];
    const ohMouth : Viseme[] = [Viseme.oh];
    const ouMouth : Viseme[] = [Viseme.ou];

    if (closedMouth.includes(viseme)){
      mesh.setTexture(this.props.mouthClosed!)
    }else if (mmMouth.includes(viseme)){
      mesh.setTexture(this.props.mm_viseme!)
    }else if (ffMouth.includes(viseme)){
      mesh.setTexture(this.props.ff_viseme!)
    }else if (ddMouth.includes(viseme)){
      mesh.setTexture(this.props.dd_viseme!)
    }else if (eeMouth.includes(viseme)){
      mesh.setTexture(this.props.ee_viseme!)
    }else if (chMouth.includes(viseme)){
      mesh.setTexture(this.props.ch_viseme!)
    }else if (aaMouth.includes(viseme)){
      mesh.setTexture(this.props.aa_viseme!)
    }else if (EMouth.includes(viseme)){
      mesh.setTexture(this.props.E_viseme!)
    }else if (ohMouth.includes(viseme)){
      mesh.setTexture(this.props.oh_viseme!)
    }else if (ouMouth.includes(viseme)){
      mesh.setTexture(this.props.ou_viseme!)
    }
  }

  onPlayerEnterTrigger(player: hz.Player) {
    this.npc!.conversation!.elicitResponse("Introduce yourself to player");
  }
}
hz.Component.register(NpcTest);
