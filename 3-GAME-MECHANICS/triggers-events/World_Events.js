"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const MyEvent = new core_1.LocalEvent();
//Both Scripts need to be in the same scene for this to work
//Script to send a local broadcast event
class EventSender extends core_1.Component {
    preStart() {
    }
    start() {
        this.sendLocalBroadcastEvent(MyEvent, { message: "Hello from EventSender!" });
    }
}
core_1.Component.register(EventSender);
//Script to receive a local broadcast event
class EventReceiver extends core_1.Component {
    preStart() {
        this.connectLocalBroadcastEvent(MyEvent, this.handleEvent.bind(this));
    }
    start() { }
    handleEvent(event) {
        console.log(`Received event with message: ${event.message}`);
    }
}
core_1.Component.register(EventReceiver);
