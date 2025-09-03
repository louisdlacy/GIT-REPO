"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class CollisionDetector extends core_1.Component {
    constructor() {
        super(...arguments);
        this.debounce = false;
    }
    start() { }
    preStart() {
        // Set up collision handlers
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityCollision, this.onCollide.bind(this));
    }
    onCollide(other) {
        if (!this.debounce) {
            // Ignore collisions if debounce is active
            return;
        }
        console.log(`Collision detected with ${other.name.get()}`);
        this.debounce = true;
        // Reset the debounce after 1 second
        this.async.setTimeout(() => {
            this.debounce = false;
        }, 1000); // Adjust the debounce time as needed
    }
}
core_1.Component.register(CollisionDetector);
