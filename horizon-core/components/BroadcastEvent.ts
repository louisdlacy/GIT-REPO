
import { Component, LocalEvent } from "horizon/core";

const TestEvent = new LocalEvent();

class BroadcastSender extends Component<typeof BroadcastSender> {
    preStart() {
    }

    start() {
        this.async.setTimeout(() => {
            this.sendLocalBroadcastEvent(
                TestEvent,
                {}
            );
        }, 3000);
    }
}
Component.register(BroadcastSender);

class BroadcastReceiver extends Component<typeof BroadcastReceiver> {
    preStart() {
        this.connectLocalBroadcastEvent(
            TestEvent,
            this.doSomething
        )
    }

    start() {
    }

    doSomething() {
        console.log("Received event in BroadcastReceiver");
    }
}
Component.register(BroadcastReceiver);

class BroadcastReceiver2 extends Component<typeof BroadcastReceiver2> {
    preStart() {
        this.connectLocalBroadcastEvent(
            TestEvent,
            this.doSomething
        )
    }

    start() {
    }

    doSomething() {
        console.log("Received event in BroadcastReceiver2");
    }
}
Component.register(BroadcastReceiver2);