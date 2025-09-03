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
const sysEvents_1 = require("sysEvents");
const sysAnimation_1 = require("sysAnimation");
class sysMoveObject extends hz.Component {
    constructor() {
        super(...arguments);
        this.animation = new sysAnimation_1.sysAnimation(this);
        this.originalPosition = hz.Vec3.zero;
        this.hasMoved = false;
    }
    start() {
        this.originalPosition = this.entity.position.get();
        // When the `OnMoveObject` event is received, move the object position by `offset` during `duration` seconds
        this.connectLocalEvent(this.entity, sysEvents_1.sysEvents.OnMoveObject, () => {
            if (!this.hasMoved) {
                this.hasMoved = true;
                const newPos = this.originalPosition.add(this.props.offset);
                this.animation.animateTo(0, 1, this.props.duration * 1000, (value, pct) => {
                    const currentPos = hz.Vec3.lerp(this.originalPosition, newPos, pct);
                    this.entity.position.set(currentPos);
                }, sysAnimation_1.Easing.inOutSine);
            }
        });
    }
}
sysMoveObject.propsDefinition = {
    offset: { type: hz.PropTypes.Vec3 },
    duration: { type: hz.PropTypes.Number },
};
hz.Component.register(sysMoveObject);
