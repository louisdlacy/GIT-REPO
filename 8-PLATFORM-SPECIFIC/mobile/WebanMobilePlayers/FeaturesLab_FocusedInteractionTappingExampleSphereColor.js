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
class FeaturesLab_FocusedInteractionTappingExampleSphereColor extends hz.Component {
    constructor() {
        super(...arguments);
        this.colors = [hz.Color.black, hz.Color.blue, hz.Color.green, hz.Color.red, hz.Color.white];
        this.currentColorIndex = 0;
    }
    start() {
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnEntityTapped, () => {
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
            this.entity.as(hz.MeshEntity)?.style.tintColor.set(this.colors[this.currentColorIndex]);
            this.entity.as(hz.MeshEntity)?.style.tintStrength.set(1);
        });
    }
}
FeaturesLab_FocusedInteractionTappingExampleSphereColor.propsDefinition = {};
hz.Component.register(FeaturesLab_FocusedInteractionTappingExampleSphereColor);
