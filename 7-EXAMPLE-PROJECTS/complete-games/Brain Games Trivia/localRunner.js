"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("Events");
const camera_1 = require("horizon/camera");
const core_1 = require("horizon/core");
class localRunner extends core_1.Component {
    constructor() {
        super(...arguments);
        this.camera = new camera_1.Camera();
    }
    preStart() {
        if (!this.props.cameraRefPostion) {
            throw new Error("cameraRefPostion is not set");
        }
        const plid = this.world.getLocalPlayer();
        if (plid === this.world.getServerPlayer()) {
            return;
        }
        this.connectNetworkBroadcastEvent(Events_1.Events.setCameratoViewMode, (data) => {
            if (plid === data.player) {
                this.camera.setCameraModeAttach(this.props.cameraRefPostion);
            }
        });
        this.connectNetworkEvent(plid, Events_1.Events.setCameraPlayerview, () => {
            this.camera.setCameraModeThirdPerson();
        });
    }
    start() { }
}
localRunner.propsDefinition = {
    cameraRefPostion: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(localRunner);
