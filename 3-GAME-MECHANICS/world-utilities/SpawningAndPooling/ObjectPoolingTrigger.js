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
const ObjectPooling_1 = require("ObjectPooling");
const ObjectPooling_2 = require("ObjectPooling");
class ObjectPoolingTrigger extends hz.Component {
    start() {
        // console.log("ObjectPooling: trigger script called");
        if (this.props.target == undefined) {
            if (ObjectPooling_2.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.error("ObjectPooling: Trigger doesn't have a target defined");
            }
            ;
            return;
        }
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, () => {
            if (ObjectPooling_2.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.log("ObjectPooling: Player entering trigger");
            }
            ;
            if (this.props.target == undefined) {
                if (ObjectPooling_2.DISPLAY_CONSOLE_OBJECTPOOLING) {
                    console.error("ObjectPooling: target undefined on ObjectPoolingTrigger OnPlayerEnterTrigger. Unable to spawn");
                }
                ;
                return;
            }
            this.sendLocalEvent(this.props.target, ObjectPooling_1.objPoolSpawnTriggerEvent, { position: this.props.target.position.get() });
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, () => {
            if (ObjectPooling_2.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.log("ObjectPooling: Player exiting Trigger");
            }
            ;
            if (this.props.target == undefined) {
                if (ObjectPooling_2.DISPLAY_CONSOLE_OBJECTPOOLING) {
                    console.error("ObjectPooling: target undefined on ObjectPoolingTrigger OnPlayerExitTrigger. Unable to de-spawn");
                }
                ;
                return;
            }
            this.sendLocalEvent(this.props.target, ObjectPooling_1.objPoolDespawnTriggerEvent, {});
        });
    }
}
ObjectPoolingTrigger.propsDefinition = {
    // Entity/object to spawn upon trigger. This is usually an object
    // with attached SpawnManager script
    target: { type: hz.PropTypes.Entity }, // ObjectPoolingManager object, which has ObjectPooling.ts script attached and assetSpawn prop set to RedHeart
};
hz.Component.register(ObjectPoolingTrigger);
