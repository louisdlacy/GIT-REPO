"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MeshTextureChanger extends core_1.Component {
    preStart() {
        this.mesh = this.entity.as(core_1.MeshEntity);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab() {
        //Replace with your texture ID
        const textureId = 0;
        this.mesh?.setTexture(new core_1.TextureAsset(BigInt(textureId)));
    }
}
core_1.Component.register(MeshTextureChanger);
