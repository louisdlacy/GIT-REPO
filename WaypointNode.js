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
exports.WaypointNode = void 0;
// Import the necessary modules from the Horizon Worlds core API.
const hz = __importStar(require("horizon/core"));
/**
 * A data container for a single point in an AdvancedPathMover sequence.
 * This script is attached to waypoint entities to define per-segment behavior.
 */
class WaypointNode extends hz.Component {
    start() {
        // This script is only for storing data, so the start function is empty.
    }
}
exports.WaypointNode = WaypointNode;
// -- PROPERTIES --
WaypointNode.propsDefinition = {
    nextWaypoint: { type: hz.PropTypes.Entity }, // Link to the next WaypointNode in the sequence.
    isEndPoint: { type: hz.PropTypes.Boolean, default: false }, // Mark this as the final node in the path.
    durationToHere: { type: hz.PropTypes.Number, default: 3.0 }, // Time in seconds to travel TO this node.
    pauseHere: { type: hz.PropTypes.Number, default: 1.0 }, // Time in seconds to pause AT this node.
    easingType: { type: hz.PropTypes.String, default: "Ease" }, // "Ease", "Bounce", "Linear"
};
hz.Component.register(WaypointNode);
