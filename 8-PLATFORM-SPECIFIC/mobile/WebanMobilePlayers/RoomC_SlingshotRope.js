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
class RoomC_SlingshotRope extends hz.Component {
    start() {
        this.defaultScale = this.entity.scale.get();
        this.async.setInterval(() => {
            this.update();
        }, 15);
    }
    update() {
        const anchor = this.props.anchor;
        const pouch = this.props.pouch;
        if (anchor === undefined || pouch === undefined)
            throw new Error('SlingshotRope: Anchor or rope not found!');
        // Scale the rope between the anchor and the pouch
        const deltaVector = pouch.position.get().sub(anchor.position.get());
        const midpoint = anchor.position.get().add(deltaVector.div(2));
        this.entity.position.set(midpoint); // move to midpoint
        this.entity.lookAt(pouch.position.get()); // rotate in correct direction
        this.entity.scale.set(new hz.Vec3(this.defaultScale.x, this.defaultScale.y, deltaVector.magnitude())); // stretch between the two points
    }
}
RoomC_SlingshotRope.propsDefinition = {
    anchor: { type: hz.PropTypes.Entity },
    pouch: { type: hz.PropTypes.Entity },
};
hz.Component.register(RoomC_SlingshotRope);
