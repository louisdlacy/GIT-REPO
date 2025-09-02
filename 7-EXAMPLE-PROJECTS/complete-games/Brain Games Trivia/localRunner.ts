import { Events } from "Events";
import { Camera } from "horizon/camera";
import { Component, PropTypes } from "horizon/core";

class localRunner extends Component<typeof localRunner> {
    static propsDefinition = {
        cameraRefPostion: { type: PropTypes.Entity },
    };

    private camera = new Camera();

    preStart() {
        if (!this.props.cameraRefPostion) {
            throw new Error("cameraRefPostion is not set");
        }

        const plid = this.world.getLocalPlayer();

        if (plid === this.world.getServerPlayer()) {
            return;
        }

        this.connectNetworkBroadcastEvent(Events.setCameratoViewMode, (data) => {
            if (plid === data.player) {
                this.camera.setCameraModeAttach(this.props.cameraRefPostion!);
            }
        });

        this.connectNetworkEvent(plid, Events.setCameraPlayerview, () => {
            this.camera.setCameraModeThirdPerson();
        });
    }

    start() { }
}
Component.register(localRunner);
