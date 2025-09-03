"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticInstance = void 0;
const core_1 = require("horizon/core");
//This is a static instance that can be accessed from any other component in the same scene.
class StaticInstance extends core_1.Component {
    constructor() {
        super();
        StaticInstance.instance = this;
    }
    preStart() {
    }
    start() {
    }
    doSomething() {
        console.log('StaticInstance is doing something!');
    }
}
exports.StaticInstance = StaticInstance;
core_1.Component.register(StaticInstance);
// This script goes on a different entity, but it can access the StaticInstance
class AnotherComponent extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnter.bind(this));
    }
    start() {
    }
    onPlayerEnter(player) {
        StaticInstance.instance.doSomething();
    }
}
core_1.Component.register(AnotherComponent);
