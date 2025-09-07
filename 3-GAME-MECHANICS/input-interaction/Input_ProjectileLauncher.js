"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ProjectileLauncher extends core_1.Component {
    preStart() {
        this.projectileLauncher = this.props.projectileLauncher?.as(core_1.ProjectileLauncherGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, this.onTriggerDown.bind(this));
    }
    start() { }
    onTriggerDown() {
        if (this.projectileLauncher) {
            this.projectileLauncher.launch();
        }
    }
}
ProjectileLauncher.propsDefinition = {
    projectileLauncher: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(ProjectileLauncher);
