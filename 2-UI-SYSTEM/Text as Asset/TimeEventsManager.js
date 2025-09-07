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
class TimeEventsManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.allTimedData = null;
        this.date = null;
        this.lastknownIndex = -1;
    }
    // called on world start
    async start() {
        let asset = this.props.textAsset;
        asset.fetchAsData().then((output) => {
            console.warn(asset.id + " \n" + asset.versionId);
            this.allTimedData = this.handleExtractAssetContentData(output);
            this.date = new Date();
            this.async.setInterval(() => {
                this.date.setTime(Date.now()); // Update the existing Date object
                this.props.timeTextGizmo.as(hz.TextGizmo)?.text.set(this.formatTime(this.date));
                //Check against the JSON every second to make sure that if there is a new world state, handle it.
                this.handleUpdateTimeBehaviour(this.allTimedData, this.date);
            }, 1000);
            this.handleUpdateAssetDetails(asset);
        });
    }
    handleUpdateAssetDetails(asset) {
        this.props.assetDetailsTextGizmo.as(hz.TextGizmo)?.text.set("Asset ID: " + asset.id + "\nVersion ID: " + asset.versionId);
    }
    handleExtractAssetContentData(output) {
        var text = output.asText();
        console.log("[TimeEventsManager] Total text length: ", text.length);
        console.log("[TimeEventsManager] First 20 characters of the text for verification: ", text.substring(0, 20));
        console.log("[TimeEventsManager] ==================================");
        var jsobj = output.asJSON();
        if (jsobj == null || jsobj == undefined) {
            console.error("[TimeEventsManager] null jsobj");
            return null;
        }
        else {
            return output.asJSON();
        }
    }
    handleUpdateTimeBehaviour(allTimedData, date) {
        const currSec = date.getSeconds() % 30; //we only deal with the 30 second intervals in the minute
        const index = this.allTimedData.findIndex((value, idx, obj) => {
            if (currSec >= value.time_range[0] && currSec < value.time_range[1]) {
                return true;
            }
            else {
                return false;
            }
        });
        if (this.lastknownIndex === index) {
            return; //skip if we have handled this transition before
        }
        console.warn("[TimeEventsManager] New index: " + index);
        this.lastknownIndex = index;
        const founddata = allTimedData[index];
        this.props.celebrationTextGizmo.as(hz.TextGizmo)?.text.set(founddata.seconds_passed_string);
        switch (founddata.particle_effect) {
            case 1:
                this.props.particle1Gizmo.as(hz.ParticleGizmo)?.play();
                this.props.particle2Gizmo.as(hz.ParticleGizmo)?.stop();
                this.props.particle3Gizmo.as(hz.ParticleGizmo)?.stop();
                break;
            case 2:
                this.props.particle1Gizmo.as(hz.ParticleGizmo)?.stop();
                this.props.particle2Gizmo.as(hz.ParticleGizmo)?.play();
                this.props.particle3Gizmo.as(hz.ParticleGizmo)?.stop();
                break;
            case 3:
                this.props.particle1Gizmo.as(hz.ParticleGizmo)?.stop();
                this.props.particle2Gizmo.as(hz.ParticleGizmo)?.play();
                this.props.particle3Gizmo.as(hz.ParticleGizmo)?.stop();
                break;
            default:
                break;
        }
    }
    formatTime(date) {
        return `${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())}`;
    }
    padZero(value) {
        return (value < 10 ? '0' : '') + value;
    }
}
TimeEventsManager.propsDefinition = {
    textAsset: { type: hz.PropTypes.Asset },
    assetDetailsTextGizmo: { type: hz.PropTypes.Entity },
    celebrationTextGizmo: { type: hz.PropTypes.Entity },
    timeTextGizmo: { type: hz.PropTypes.Entity },
    particle1Gizmo: { type: hz.PropTypes.Entity },
    particle2Gizmo: { type: hz.PropTypes.Entity },
    particle3Gizmo: { type: hz.PropTypes.Entity },
};
hz.Component.register(TimeEventsManager);
