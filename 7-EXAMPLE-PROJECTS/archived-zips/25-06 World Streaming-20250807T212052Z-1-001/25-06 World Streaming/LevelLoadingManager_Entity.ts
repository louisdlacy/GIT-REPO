import { Component, Vec3 } from "horizon/core";
import { SublevelEntity } from "horizon/world_streaming";
import { sublevel_Data } from "Sublevel_Data";
import { overTime } from "UtilMotionOverTime_Func";


class LevelLoadingManager_Entity extends Component<typeof LevelLoadingManager_Entity> {
  static propsDefinition = {};

  curIndex = 0;
  curSublevel: SublevelEntity | undefined;
  previousSublevel: SublevelEntity | undefined;

  start() {
    this.preLoadSublevel();
    this.async.setInterval(() => { this.loadNextSublevelLoop(); }, 2_000);
  }

  loadNextSublevelLoop() {
    this.previousSublevel?.unload();
    this.curSublevel?.activate();

    this.curIndex = (this.curIndex + 1) % sublevel_Data.sublevels.length;
    this.preLoadSublevel();
  }

  preLoadSublevel() {
    this.previousSublevel = this.curSublevel;
    this.curSublevel = sublevel_Data.sublevels[this.curIndex];
    this.curSublevel.position.set(new Vec3((Math.random() * 10) - 5, 0.5, (Math.random() * 10) - 5));

    this.async.setTimeout(() => {
      this.curSublevel?.load();
    }, 25);

    this.async.setTimeout(() => {
      if (this.previousSublevel) {
        overTime.moveTo.start(this.previousSublevel, Vec3.zero, 800);
      }
    }, 800);
  }
}
Component.register(LevelLoadingManager_Entity);