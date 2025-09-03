"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MeshTint extends core_1.Component {
    preStart() {
        this.mesh = this.entity.as(core_1.MeshEntity);
        // Set up the mesh to be tinted
        this.mesh.style.tintColor.set(core_1.Color.red);
        this.mesh.style.tintStrength.set(1);
        // Set up the event to change the tint color
        this.async.setTimeout(() => {
            this.mesh?.style.tintColor.set(core_1.Color.fromHex("#AAFF00"));
        }, 3000);
    }
    start() {
        // Intentionally left blank
    }
}
core_1.Component.register(MeshTint);
