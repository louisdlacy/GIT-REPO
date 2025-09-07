"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const Sublevel_Data_1 = require("Sublevel_Data");
const UtilMotionOverTime_Func_1 = require("UtilMotionOverTime_Func");
class LevelLoadingManager_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.curIndex = 0;
    }
    start() {
        this.preLoadSublevel();
        this.async.setInterval(() => { this.loadNextSublevelLoop(); }, 2000);
    }
    loadNextSublevelLoop() {
        this.previousSublevel?.unload();
        this.curSublevel?.activate();
        this.curIndex = (this.curIndex + 1) % Sublevel_Data_1.sublevel_Data.sublevels.length;
        this.preLoadSublevel();
    }
    preLoadSublevel() {
        this.previousSublevel = this.curSublevel;
        this.curSublevel = Sublevel_Data_1.sublevel_Data.sublevels[this.curIndex];
        this.curSublevel.position.set(new core_1.Vec3((Math.random() * 10) - 5, 0.5, (Math.random() * 10) - 5));
        this.async.setTimeout(() => {
            this.curSublevel?.load();
        }, 25);
        this.async.setTimeout(() => {
            if (this.previousSublevel) {
                UtilMotionOverTime_Func_1.overTime.moveTo.start(this.previousSublevel, core_1.Vec3.zero, 800);
            }
        }, 800);
    }
}
LevelLoadingManager_Entity.propsDefinition = {};
core_1.Component.register(LevelLoadingManager_Entity);
