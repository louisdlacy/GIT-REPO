"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class UsePromise extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnter.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnter(player) {
        console.log(`${player.name.get()} entered the trigger`);
        this.createPromise()
            .then(() => {
            console.log("Promise resolved!");
        })
            .catch((error) => {
            console.error("Promise rejected:", error);
        });
        console.log("Promise created!");
    }
    createPromise() {
        return new Promise((resolve, reject) => {
            console.log("Creating promise...");
            // Simulate an asynchronous operation
            this.async.setTimeout(() => {
                console.log("Timeout complete...");
                // Resolve the promise after 2 seconds
                resolve();
            }, 2000);
        });
    }
}
core_1.Component.register(UsePromise);
