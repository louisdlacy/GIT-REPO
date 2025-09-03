"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hz = __importStar(require("horizon/core"));
const npc_1 = require("horizon/npc");
class NpcTest extends hz.Component {
    start() {
        this.npc = this.props.npcGizmo.as(npc_1.Npc);
        if (this.npc == undefined) {
            console.error("ComputerFriend: npc is undefined.");
            return;
        }
        if (!this.npc.isConversationEnabled()) {
            console.error("ComputerFriend: conversation not enabled");
            return;
        }
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.onPlayerEnterTrigger(player);
        });
        this.connectNetworkEvent(this.npc, npc_1.NpcEvents.OnNpcVisemeChanged, (data) => {
            this.textureSwap(data.viseme);
        });
    }
    textureSwap(viseme) {
        let mesh = this.props.meshObject.as(hz.MeshEntity);
        const closedMouth = [npc_1.Viseme.sil];
        const mmMouth = [npc_1.Viseme.PP];
        const ffMouth = [npc_1.Viseme.FF];
        const ddMouth = [npc_1.Viseme.TH, npc_1.Viseme.DD, npc_1.Viseme.nn];
        const eeMouth = [npc_1.Viseme.kk, npc_1.Viseme.SS, npc_1.Viseme.ih];
        const chMouth = [npc_1.Viseme.CH, npc_1.Viseme.RR];
        const aaMouth = [npc_1.Viseme.aa];
        const EMouth = [npc_1.Viseme.E];
        const ohMouth = [npc_1.Viseme.oh];
        const ouMouth = [npc_1.Viseme.ou];
        if (closedMouth.includes(viseme)) {
            mesh.setTexture(this.props.mouthClosed);
        }
        else if (mmMouth.includes(viseme)) {
            mesh.setTexture(this.props.mm_viseme);
        }
        else if (ffMouth.includes(viseme)) {
            mesh.setTexture(this.props.ff_viseme);
        }
        else if (ddMouth.includes(viseme)) {
            mesh.setTexture(this.props.dd_viseme);
        }
        else if (eeMouth.includes(viseme)) {
            mesh.setTexture(this.props.ee_viseme);
        }
        else if (chMouth.includes(viseme)) {
            mesh.setTexture(this.props.ch_viseme);
        }
        else if (aaMouth.includes(viseme)) {
            mesh.setTexture(this.props.aa_viseme);
        }
        else if (EMouth.includes(viseme)) {
            mesh.setTexture(this.props.E_viseme);
        }
        else if (ohMouth.includes(viseme)) {
            mesh.setTexture(this.props.oh_viseme);
        }
        else if (ouMouth.includes(viseme)) {
            mesh.setTexture(this.props.ou_viseme);
        }
    }
    onPlayerEnterTrigger(player) {
        this.npc.conversation.elicitResponse("Introduce yourself to player");
    }
}
NpcTest.propsDefinition = {
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
hz.Component.register(NpcTest);
