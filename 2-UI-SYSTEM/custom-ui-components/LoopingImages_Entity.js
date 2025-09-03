"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const UtilArray_Func_1 = require("UtilArray_Func");
class AnimatedLogo extends core_1.Component {
    constructor() {
        super(...arguments);
        this.textures = [];
        this.index = 0;
    }
    start() {
        this.addTextureToArray(this.props.texture0);
        this.addTextureToArray(this.props.texture1);
        this.addTextureToArray(this.props.texture2);
        this.addTextureToArray(this.props.texture3);
        this.addTextureToArray(this.props.texture4);
        this.addTextureToArray(this.props.texture5);
        this.addTextureToArray(this.props.texture6);
        this.addTextureToArray(this.props.texture7);
        this.addTextureToArray(this.props.texture8);
        this.addTextureToArray(this.props.texture9);
        this.addTextureToArray(this.props.texture10);
        this.addTextureToArray(this.props.texture11);
        this.addTextureToArray(this.props.texture12);
        this.addTextureToArray(this.props.texture13);
        this.addTextureToArray(this.props.texture14);
        this.addTextureToArray(this.props.texture15);
        const meshEntity = this.entity.as(core_1.MeshEntity);
        if (meshEntity) {
            if (this.props.runOnStart) {
                this.loop(meshEntity);
            }
            this.async.setInterval(() => { this.loop(meshEntity); }, this.props.speedMs);
        }
        else {
            console.log('AnimatedLogo: meshEntity returned undefined');
        }
    }
    loop(meshEntity) {
        this.index = (this.index + 1) % this.textures.length;
        const newTexture = this.props.isRandom ?
            UtilArray_Func_1.arrayUtils.getRandomItemFromArray(this.textures)
            :
                this.textures[this.index];
        if (newTexture) {
            meshEntity.setTexture(newTexture);
        }
    }
    addTextureToArray(prop) {
        if (prop) {
            this.textures.push(prop.as(core_1.TextureAsset));
        }
    }
}
AnimatedLogo.propsDefinition = {
    speedMs: { type: core_1.PropTypes.Number, default: 30 },
    isRandom: { type: core_1.PropTypes.Boolean, default: false },
    runOnStart: { type: core_1.PropTypes.Boolean, default: false },
    texture0: { type: core_1.PropTypes.Asset },
    texture1: { type: core_1.PropTypes.Asset },
    texture2: { type: core_1.PropTypes.Asset },
    texture3: { type: core_1.PropTypes.Asset },
    texture4: { type: core_1.PropTypes.Asset },
    texture5: { type: core_1.PropTypes.Asset },
    texture6: { type: core_1.PropTypes.Asset },
    texture7: { type: core_1.PropTypes.Asset },
    texture8: { type: core_1.PropTypes.Asset },
    texture9: { type: core_1.PropTypes.Asset },
    texture10: { type: core_1.PropTypes.Asset },
    texture11: { type: core_1.PropTypes.Asset },
    texture12: { type: core_1.PropTypes.Asset },
    texture13: { type: core_1.PropTypes.Asset },
    texture14: { type: core_1.PropTypes.Asset },
    texture15: { type: core_1.PropTypes.Asset },
};
core_1.Component.register(AnimatedLogo);
