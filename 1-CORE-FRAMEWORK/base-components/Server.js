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
const PlayerCamera_1 = require("./PlayerCamera");
class Server extends hz.Component {
    preStart() {
        if (this.props.firstPersonTrigger)
            this.connectCodeBlockEvent(this.props.firstPersonTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.firstPerson(player));
        if (this.props.thirdPersonCamera)
            this.connectCodeBlockEvent(this.props.thirdPersonCamera, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.thirdPerson(player));
        if (this.props.attachPersonCamera)
            this.connectCodeBlockEvent(this.props.attachPersonCamera, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.attachPerson(player));
        if (this.props.panCamera)
            this.connectCodeBlockEvent(this.props.panCamera, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.panPerson(player));
    }
    start() {
    }
    firstPerson(player) {
        // Handle first person camera logic here
        this.sendNetworkEvent(player, PlayerCamera_1.CameraEvents.firstPerson, {});
    }
    thirdPerson(player) {
        // Handle third person camera logic here
        this.sendNetworkEvent(player, PlayerCamera_1.CameraEvents.thirdPerson, {});
    }
    attachPerson(player) {
        // Handle attach person camera logic here
        if (this.props.attachObject)
            this.sendNetworkEvent(player, PlayerCamera_1.CameraEvents.attachPerson, { target: this.props.attachObject });
    }
    panPerson(player) {
        // Handle pan camera logic here
        this.sendNetworkEvent(player, PlayerCamera_1.CameraEvents.panPerson, {});
    }
}
Server.propsDefinition = {
    firstPersonTrigger: {
        type: hz.PropTypes.Entity
    },
    thirdPersonCamera: {
        type: hz.PropTypes.Entity
    },
    attachPersonCamera: {
        type: hz.PropTypes.Entity
    },
    attachObject: {
        type: hz.PropTypes.Entity
    },
    panCamera: {
        type: hz.PropTypes.Entity
    }
};
hz.Component.register(Server);
