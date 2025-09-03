"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class AnimatedLogo extends core_1.Component {
    start() {
        if (this.props.texture) {
            this.entity.as(core_1.MeshEntity).setTexture(this.props.texture.as(core_1.TextureAsset));
        }
    }
}
AnimatedLogo.propsDefinition = {
    texture: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(AnimatedLogo);
