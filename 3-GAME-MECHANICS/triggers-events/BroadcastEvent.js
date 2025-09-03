"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const TestEvent = new core_1.LocalEvent();
class BroadcastSender extends core_1.Component {
    preStart() {
    }
    start() {
        this.async.setTimeout(() => {
            this.sendLocalBroadcastEvent(TestEvent, {});
        }, 3000);
    }
}
core_1.Component.register(BroadcastSender);
class BroadcastReceiver extends core_1.Component {
    preStart() {
        this.connectLocalBroadcastEvent(TestEvent, this.doSomething);
    }
    start() {
    }
    doSomething() {
        console.log("Received event in BroadcastReceiver");
    }
}
core_1.Component.register(BroadcastReceiver);
class BroadcastReceiver2 extends core_1.Component {
    preStart() {
        this.connectLocalBroadcastEvent(TestEvent, this.doSomething);
    }
    start() {
    }
    doSomething() {
        console.log("Received event in BroadcastReceiver2");
    }
}
core_1.Component.register(BroadcastReceiver2);
