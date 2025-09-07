"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveVisualizer = exports.Curve = exports.Pool = exports.PlayerGameStatus = exports.GameState = void 0;
exports.msToMinutesAndSeconds = msToMinutesAndSeconds;
exports.timedIntervalActionFunction = timedIntervalActionFunction;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Game-wide enums and constants. Advanced curve functions and their visualizer
 */
const hz = __importStar(require("horizon/core"));
var GameState;
(function (GameState) {
    GameState[GameState["ReadyForMatch"] = 0] = "ReadyForMatch";
    GameState[GameState["StartingMatch"] = 1] = "StartingMatch";
    GameState[GameState["PlayingMatch"] = 2] = "PlayingMatch";
    GameState[GameState["EndingMatch"] = 3] = "EndingMatch";
    GameState[GameState["CompletedMatch"] = 4] = "CompletedMatch";
})(GameState || (exports.GameState = GameState = {}));
var PlayerGameStatus;
(function (PlayerGameStatus) {
    PlayerGameStatus[PlayerGameStatus["Lobby"] = 0] = "Lobby";
    PlayerGameStatus[PlayerGameStatus["Standby"] = 1] = "Standby";
    PlayerGameStatus[PlayerGameStatus["Playing"] = 2] = "Playing";
})(PlayerGameStatus || (exports.PlayerGameStatus = PlayerGameStatus = {}));
// Pool Class
class Pool {
    constructor() {
        this.all = [];
        this.available = [];
        this.active = [];
    }
    hasAvailable() {
        return this.available.length > 0;
    }
    hasActive() {
        return this.active.length > 0;
    }
    isAvailable(t) {
        return this.available.includes(t);
    }
    getNextAvailable() {
        if (this.hasAvailable()) {
            const available = this.available.shift();
            if (!this.active.includes(available)) {
                this.active.push(available);
            }
            return available;
        }
        else {
            return null;
        }
    }
    getRandomAvailable() {
        if (this.hasAvailable()) {
            const rand = Math.floor(Math.random() * this.available.length);
            const available = this.available.splice(rand, 1)[0];
            if (!this.active.includes(available)) {
                this.active.push(available);
            }
            return available;
        }
        else {
            return null;
        }
    }
    getRandomActive() {
        if (this.hasActive()) {
            const rand = Math.floor(Math.random() * this.active.length);
            const active = this.active.splice(rand, 1)[0];
            return active;
        }
        else {
            return null;
        }
    }
    addToPool(t) {
        if (!this.all.includes(t)) {
            this.all.push(t);
        }
        if (!this.available.includes(t)) {
            this.available.push(t);
        }
        if (this.active.includes(t)) {
            this.active.splice(this.active.indexOf(t), 1);
        }
    }
    removeFromPool(t) {
        if (this.active.includes(t)) {
            this.active.splice(this.active.indexOf(t), 1);
        }
        if (this.available.includes(t)) {
            this.available.splice(this.available.indexOf(t), 1);
        }
        if (this.all.includes(t)) {
            this.all.splice(this.all.indexOf(t), 1);
        }
    }
    resetAvailability() {
        this.available = this.all.slice();
    }
}
exports.Pool = Pool;
function msToMinutesAndSeconds(time) {
    const baseTime = Math.floor(time);
    let minutes = Math.floor(baseTime / 60);
    let seconds = baseTime % 60;
    let ms = time % 1;
    seconds = seconds === 60 ? 0 : seconds;
    return `${(minutes < 10 ? '0' : '') + minutes} : ${(seconds < 10 ? '0' : '') + seconds.toFixed(0)} : ${ms.toFixed(2).substring(2)}`;
}
function timedIntervalActionFunction(timerMS, component, onTickAction, // Function to be run during the timer tick
onEndAction // Function to be run at the end of the timer
) {
    let timerID = component.async.setInterval(() => {
        if (timerMS > 0) {
            onTickAction(timerMS); // Call the onTick function
            timerMS -= 1000;
        }
        else {
            if (timerID !== undefined) {
                onEndAction();
                component.async.clearInterval(timerID);
            }
        }
    }, 1000);
    return timerID;
}
class Curve {
    get controlPoints() {
        return this._controlPoints;
    }
    set controlPoints(value) {
        this._controlPoints = value;
    }
    constructor(controlPoints) {
        //not ideal as the array itself can still be changed
        this._controlPoints = [];
        this.controlPoints = controlPoints;
    }
    interpolate(t) {
        const n = this.controlPoints.length - 1;
        const index = Math.floor(t * n);
        const t0 = index > 0 ? index / n : 0;
        const t1 = (index + 1) / n;
        //console.log("index:", index);
        const p0 = this.controlPoints[Math.max(0, index > 1 ? index - 1 : 0)];
        const p0a = index > 1
            ? this.controlPoints[index - 1]
            : this.controlPoints[0].add(this.controlPoints[0].sub(this.controlPoints[1])); //deal with negative index, should project missing control points instead
        const p1 = this.controlPoints[index];
        const p2 = this.controlPoints[Math.min(n, index < n ? index + 1 : this.controlPoints.length - 1)]; //deal with out of bounds index, should project missing control points instead
        const p2a = index + 1 < n ? this.controlPoints[index + 1] : this.controlPoints[n]; //deal with negative index, should project missing control points instead
        const p3 = this.controlPoints[Math.min(n, index < n - 1 ? index + 2 : this.controlPoints.length - 1)];
        const p3a = index + 2 < n ? this.controlPoints[index + 2] : this.controlPoints[n];
        /*: this.controlPoints[n].add(
                this.controlPoints[n].sub(this.controlPoints[n - 1])
              ); //deal with negative index, should project missing control points instead*/
        const tNormalized = (t - t0) / (t1 - t0);
        return this.interpolateCatmullRom(p0a, p1, p2a, p3, tNormalized);
    }
    //0.0 to 1.0
    findClosestPointCurveProgress(target) {
        const f = (t) => {
            const point = this.interpolate(t);
            return this.calculateDistance(target, point);
        };
        const tMin = this.goldenSectionSearch(f, 0, 1, 1e-4); // adjust tolarence value as needed, smaller values increases precision and runtime cost
        return tMin;
    }
    interpolateCatmullRom(
    //uses a Catmull-Rom algorithm for the spline
    p0, p1, p2, p3, t) {
        const t2 = t * t;
        const t3 = t2 * t;
        const v0 = (p2.x - p0.x) * 0.5;
        const v1 = (p3.x - p1.x) * 0.5;
        const a = 2 * p1.x - 2 * p2.x + v0 + v1;
        const b = -3 * p1.x + 3 * p2.x - 2 * v0 - v1;
        const c = v0;
        const d = p1.x;
        const x = a * t3 + b * t2 + c * t + d;
        const v0y = (p2.y - p0.y) * 0.5;
        const v1y = (p3.y - p1.y) * 0.5;
        const ay = 2 * p1.y - 2 * p2.y + v0y + v1y;
        const by = -3 * p1.y + 3 * p2.y - 2 * v0y - v1y;
        const cy = v0y;
        const dy = p1.y;
        const y = ay * t3 + by * t2 + cy * t + dy;
        const v0z = (p2.z - p0.z) * 0.5;
        const v1z = (p3.z - p1.z) * 0.5;
        const az = 2 * p1.z - 2 * p2.z + v0z + v1z;
        const bz = -3 * p1.z + 3 * p2.z - 2 * v0z - v1z;
        const cz = v0z;
        const dz = p1.z;
        const z = az * t3 + bz * t2 + cz * t + dz;
        return new hz.Vec3(x, y, z);
    }
    //Golden Section search is statistically a little more efficient than a binary seive when trying to find a number using an over/under check
    goldenSectionSearch(f, a, b, tol) {
        const gr = 1.6180339887498948482; //Aproximation of phi to avoid the classic (1+sqrt(5))/2 being called thousands of times
        let c = b - (b - a) / gr;
        let d = a + (b - a) / gr;
        while (Math.abs(b - a) > tol) {
            if (f(c) < f(d)) {
                b = d;
                d = c;
                c = b - (b - a) / gr;
            }
            else {
                a = c;
                c = d;
                d = a + (b - a) / gr;
            }
        }
        return (b + a) / 2;
    }
    calculateDistance(point1, point2) {
        return point1.sub(point2).magnitudeSquared(); //using squared to avoid unnecessary sqrt call, don't need the actual distance, just the smallest
    }
}
exports.Curve = Curve;
class CurveVisualizer extends hz.Component {
    constructor() {
        super(...arguments);
        this.splineProgress = 0;
        this.showPath = false;
    }
    preStart() {
        this.showPath = this.props.showPath;
        this.connectLocalBroadcastEvent(CurveVisualizer.SetCurve, (data) => {
            this.curve = data.curve;
        });
        this.connectLocalBroadcastEvent(CurveVisualizer.StartDrawingCurve, () => {
            this.showPath = true;
            this.entity.as(hz.TrailGizmo).play();
        });
        this.connectLocalBroadcastEvent(CurveVisualizer.StopDrawingCurve, () => {
            this.showPath = false;
            this.entity.as(hz.TrailGizmo).stop();
        });
        //For drawing the curve
        this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
            if (this.showPath && this.curve && this.props.trailRenderer) {
                this.splineProgress = this.drawTrackWithProgress(this.props.trailRenderer, this.splineProgress, data.deltaTime, this.curve);
            }
        });
    }
    start() { }
    drawTrackWithProgress(trailRenderer, splineProgress, deltaTime, curve) {
        splineProgress = (splineProgress + deltaTime * 0.1) % 1;
        // Edit mode visuals
        const interpolatedPoint = curve.interpolate(splineProgress);
        trailRenderer.position.set(interpolatedPoint); // this currently moves self, might want to split the debug visuals from the script container
        return splineProgress;
    }
}
exports.CurveVisualizer = CurveVisualizer;
// define the inputs available in the property panel in the UI as well as default values
CurveVisualizer.propsDefinition = {
    showPath: { type: hz.PropTypes.Boolean },
    trailRenderer: { type: hz.PropTypes.Entity },
};
CurveVisualizer.SetCurve = new hz.LocalEvent("SetCurve");
CurveVisualizer.StartDrawingCurve = new hz.LocalEvent("StartDrawingCurve");
CurveVisualizer.StopDrawingCurve = new hz.LocalEvent("StopDrawingCurve");
hz.Component.register(CurveVisualizer);
