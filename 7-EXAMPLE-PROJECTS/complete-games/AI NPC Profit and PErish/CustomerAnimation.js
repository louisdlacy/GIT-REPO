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
exports.CustomerAnimation = void 0;
const hz = __importStar(require("horizon/core"));
const BaseNPCAnimationComponent_1 = require("BaseNPCAnimationComponent");
const GameConsts_1 = require("./GameConsts");
/**
 * An animation class specifically for Customers, which have a limited range of emotions.
 */
class CustomerAnimation extends BaseNPCAnimationComponent_1.BaseNPCAnimationComponent {
    constructor() {
        super(...arguments);
        this.availableEmotions = [
            GameConsts_1.Emotions.Angry,
            GameConsts_1.Emotions.Happy,
            GameConsts_1.Emotions.Neutral,
        ];
    }
    start() {
        super.start();
    }
    reset() {
        super.reset();
    }
}
exports.CustomerAnimation = CustomerAnimation;
CustomerAnimation.propsDefinition = {
    ...BaseNPCAnimationComponent_1.BaseNPCAnimationComponent.propsDefinition,
};
hz.Component.register(CustomerAnimation);
