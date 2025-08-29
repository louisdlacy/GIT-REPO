// Import the necessary modules from the Horizon Worlds core API.
import * as hz from 'horizon/core';

/**
 * A data container for a single point in an AdvancedPathMover sequence.
 * This script is attached to waypoint entities to define per-segment behavior.
 */
export class WaypointNode extends hz.Component<typeof WaypointNode> {
    // -- PROPERTIES --
    static propsDefinition = {
        nextWaypoint: { type: hz.PropTypes.Entity }, // Link to the next WaypointNode in the sequence.
        isEndPoint: { type: hz.PropTypes.Boolean, default: false }, // Mark this as the final node in the path.
        durationToHere: { type: hz.PropTypes.Number, default: 3.0 }, // Time in seconds to travel TO this node.
        pauseHere: { type: hz.PropTypes.Number, default: 1.0 }, // Time in seconds to pause AT this node.
        easingType: { type: hz.PropTypes.String, default: "Ease" }, // "Ease", "Bounce", "Linear"
    };

    start() {
        // This script is only for storing data, so the start function is empty.
    }
}
hz.Component.register(WaypointNode);