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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraEvents = void 0;
const hz = __importStar(require("horizon/core"));
const camera_1 = __importDefault(require("horizon/camera"));
exports.CameraEvents = {
    firstPerson: new hz.NetworkEvent('firstPerson'),
    thirdPerson: new hz.NetworkEvent('thirdPerson'),
    attachPerson: new hz.NetworkEvent('attachPerson'),
    panPerson: new hz.NetworkEvent('panPerson'),
};
class PlayerCamera extends hz.Component {
    preStart() {
        this.owner = this.entity.owner.get();
        if (this.owner === this.world.getServerPlayer()) {
            return;
        }
        this.connectNetworkEvent(this.owner, exports.CameraEvents.firstPerson, () => this.firstPerson());
        this.connectNetworkEvent(this.owner, exports.CameraEvents.thirdPerson, () => this.thirdPerson());
        this.connectNetworkEvent(this.owner, exports.CameraEvents.attachPerson, (data) => this.attachPerson(data.target));
        this.connectNetworkEvent(this.owner, exports.CameraEvents.panPerson, () => this.panPerson());
    }
    start() {
    }
    firstPerson() {
        // Logic to switch to first person camera
        console.log('Switching to first person camera');
        const options = { delay: 1, duration: 3 };
        camera_1.default.setCameraModeFirstPerson(options);
    }
    thirdPerson() {
        // Logic to switch to third person camera
        console.log('Switching to third person camera');
        const options = { delay: 1, duration: 3 };
        camera_1.default.setCameraModeThirdPerson(options);
    }
    attachPerson(target) {
        // Logic to switch to attach person camera
        console.log('Switching to attach person camera');
        const options = { delay: 1, duration: 3 };
        const attachOption = { translationSpeed: 10, rotationSpeed: 1 };
        camera_1.default.setCameraModeAttach(target, attachOption && options);
    }
    panPerson() {
        // Logic to switch to pan camera
        console.log('Switching to pan camera');
        const panOption = { positionOffset: new hz.Vec3(0, 10, 0), translationSpeed: .25, };
        camera_1.default.setCameraModePan(panOption);
    }
}
PlayerCamera.propsDefinition = {};
hz.Component.register(PlayerCamera);
