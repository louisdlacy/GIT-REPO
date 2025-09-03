"use strict";
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
exports.Easing = exports.sysAnimation = void 0;
const hz = __importStar(require("horizon/core"));
var ValueType;
(function (ValueType) {
    ValueType[ValueType["UNKNOWN"] = 0] = "UNKNOWN";
    ValueType[ValueType["NUMBER"] = 1] = "NUMBER";
    ValueType[ValueType["VEC3"] = 2] = "VEC3";
    ValueType[ValueType["QUATERNION"] = 3] = "QUATERNION";
    ValueType[ValueType["COLOR"] = 4] = "COLOR";
})(ValueType || (ValueType = {}));
class AnimationInfo {
    constructor(_from, _to, _overMs, callback, easing = exports.Easing.linear) {
        this.complete = false;
        this.fromValue = _from;
        this.toValue = _to;
        this.overMs = _overMs;
        this.easing = easing;
        this.callback = callback;
        this.startTime = Date.now();
        this.endTime = this.startTime + this.overMs;
        const valTypeName = this.fromValue.constructor.name;
        this.valueType = (typeof (this.fromValue) === 'number') ? ValueType.NUMBER :
            (valTypeName === 'Vec3') ? ValueType.VEC3 :
                (valTypeName === 'Quaternion') ? ValueType.QUATERNION :
                    (valTypeName === 'Color') ? ValueType.COLOR : ValueType.UNKNOWN;
    }
}
class sysAnimation {
    constructor(_parentComponent) {
        this.moveTos = {};
        this.scaleTos = {};
        this.rotateTos = {};
        this.colorTos = {};
        this.animations = {};
        this.updateEvent = null;
        this.parentComponent = _parentComponent;
    }
    animateTo(fromValue, toValue, overMs, callback, easing = exports.Easing.linear) {
        const animInfo = new AnimationInfo(fromValue, toValue, overMs, callback, easing);
        const id = this.makeid(16);
        this.animations[id] = animInfo;
        if (!this.updateEvent)
            this.update();
        return id;
    }
    //color animations
    colorBy(entity, relativeColor, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        this.colorTo(entity, hz.Color.add(relativeColor, entity.color.get()), overMs, onComplete, easing);
    }
    colorTo(entity, toColor, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        let entityAnim = this.colorTos[entity.id.toString()];
        if (entityAnim !== undefined) {
            this.cancel(entityAnim.animID);
            delete this.colorTos[entity.id.toString()];
            onComplete();
        }
        this.animateTo(entity.color.get().clone(), toColor, overMs, (value, pctComplete) => {
            entity.color.set(value);
            if (pctComplete === 1) {
                onComplete();
            }
        }, easing);
    }
    //rotation animations
    rotateBy(entity, relativeRotation, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        this.rotateTo(entity, hz.Quaternion.mul(relativeRotation, entity.rotation.get()), overMs, onComplete, easing);
    }
    rotateTo(entity, toRotation, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        let entityAnim = this.rotateTos[entity.id.toString()];
        if (entityAnim !== undefined) {
            this.cancel(entityAnim.animID);
            delete this.rotateTos[entity.id.toString()];
            onComplete();
        }
        this.animateTo(entity.rotation.get().clone(), toRotation, overMs, (value, pctComplete) => {
            entity.rotation.set(value);
            if (pctComplete === 1) {
                onComplete();
            }
        }, easing);
    }
    //move animations
    moveBy(entity, relativePosition, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        this.moveTo(entity, hz.Vec3.add(relativePosition, entity.position.get()), overMs, onComplete, easing);
    }
    moveTo(entity, toPosition, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        let entityAnim = this.moveTos[entity.id.toString()];
        if (entityAnim !== undefined) {
            this.cancel(entityAnim.animID);
            delete this.moveTos[entity.id.toString()];
            onComplete();
        }
        this.animateTo(entity.position.get().clone(), toPosition, overMs, (value, pctComplete) => {
            entity.position.set(value);
            if (pctComplete === 1) {
                onComplete();
            }
        }, easing);
    }
    //scale animations
    scaleTo(entity, toScale, overMs, onComplete = () => { }, easing = exports.Easing.linear) {
        let entityAnim = this.scaleTos[entity.id.toString()];
        if (entityAnim !== undefined) {
            this.cancel(entityAnim.animID);
            delete this.scaleTos[entity.id.toString()];
            onComplete();
        }
        this.animateTo(entity.scale.get().clone(), toScale, overMs, (value, pctComplete) => {
            entity.scale.set(value);
            if (pctComplete === 1) {
                onComplete();
            }
        }, easing);
    }
    cancel(animationId) {
        this.animations[animationId].complete = true;
    }
    update() {
        if (!this.updateEvent) { //start loop up if not running
            this.updateEvent = this.parentComponent.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
                const keys = Object.keys(this.animations);
                //no point in continuing loop if there's no animations to run
                if (keys.length === 0) {
                    if (this.updateEvent) {
                        this.updateEvent.disconnect();
                        this.updateEvent = null;
                    }
                    return;
                }
                keys.forEach((key) => {
                    const animation = this.animations[key];
                    const elapsed = Date.now() - animation.startTime;
                    let pct = Math.min(elapsed / animation.overMs, 1);
                    let t = animation.easing(pct);
                    if (!animation.complete) {
                        //calculate
                        switch (animation.valueType) {
                            case ValueType.NUMBER:
                                this.calcNumber(animation, t);
                                break;
                            case ValueType.VEC3:
                                this.calcVec3(animation, t);
                                break;
                            case ValueType.COLOR:
                                this.calcColor(animation, t);
                                break;
                            case ValueType.QUATERNION:
                                this.calcQuaternion(animation, t);
                                break;
                            case ValueType.UNKNOWN:
                                break;
                        }
                    }
                    else {
                        //remove
                        delete this.animations[key];
                    }
                    if (pct === 1) {
                        animation.complete = true;
                    }
                });
            });
        }
    }
    calcNumber(animation, pct) {
        const _from = animation.fromValue;
        const _to = animation.toValue;
        const result = _from + ((_to - _from) * pct);
        animation.callback(result, pct);
    }
    calcVec3(animation, pct) {
        const _from = animation.fromValue;
        const _to = animation.toValue;
        const result = hz.Vec3.add(_from, hz.Vec3.mul((hz.Vec3.sub(_to, _from)), pct));
        animation.callback(result, pct);
    }
    calcColor(animation, pct) {
        const _from = animation.fromValue;
        const _to = animation.toValue;
        const result = hz.Color.add(_from, hz.Color.mul((hz.Color.sub(_to, _from)), pct));
        animation.callback(result, pct);
    }
    //https://www.anycodings.com/1questions/2083501/how-to-lerp-between-two-quaternions
    calcQuaternion(animation, pct) {
        const _from = animation.fromValue;
        let _to = animation.toValue;
        // negate second quat if dot product is negative
        const l2 = this.dot(_from, _to);
        if (l2 < 0) {
            _to = this.negate(_to);
        }
        const result = new hz.Quaternion(0, 0, 0, 0);
        result.x = _from.x - pct * (_from.x - _to.x);
        result.y = _from.y - pct * (_from.y - _to.y);
        result.z = _from.z - pct * (_from.z - _to.z);
        result.w = _from.w - pct * (_from.w - _to.w);
        animation.callback(result, pct);
    }
    dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }
    negate(a) {
        return new hz.Quaternion(-a.x, -a.y, -a.z, -a.w);
    }
    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
exports.sysAnimation = sysAnimation;
exports.Easing = {
    linear: (t) => t,
    // Accelerates fast, then slows quickly towards end.
    quadratic: (t) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4),
    // Overshoots over 1 and then returns to 1 towards end.
    cubic: (t) => t * (4 * t * t - 9 * t + 6),
    // Overshoots over 1 multiple times - wiggles around 1.
    elastic: (t) => t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15),
    // Accelerating from zero velocity
    inQuad: (t) => t * t,
    // Decelerating to zero velocity
    outQuad: (t) => t * (2 - t),
    // Acceleration until halfway, then deceleration
    inOutQuad: (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // Accelerating from zero velocity
    inCubic: (t) => t * t * t,
    // Decelerating to zero velocity
    outCubic: (t) => (--t) * t * t + 1,
    // Acceleration until halfway, then deceleration
    inOutCubic: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // Accelerating from zero velocity
    inQuart: (t) => t * t * t * t,
    // Decelerating to zero velocity
    outQuart: (t) => 1 - (--t) * t * t * t,
    // Acceleration until halfway, then deceleration
    inOutQuart: (t) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // Accelerating from zero velocity
    inQuint: (t) => t * t * t * t * t,
    // Decelerating to zero velocity
    outQuint: (t) => 1 + (--t) * t * t * t * t,
    // Acceleration until halfway, then deceleration
    inOutQuint: (t) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    // Accelerating from zero velocity
    inSine: (t) => -Math.cos(t * (Math.PI / 2)) + 1,
    // Decelerating to zero velocity
    outSine: (t) => Math.sin(t * (Math.PI / 2)),
    // Accelerating until halfway, then decelerating
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    // Exponential accelerating from zero velocity
    inExpo: (t) => Math.pow(2, 10 * (t - 1)),
    // Exponential decelerating to zero velocity
    outExpo: (t) => -Math.pow(2, -10 * t) + 1,
    // Exponential accelerating until halfway, then decelerating
    inOutExpo: (t) => {
        t /= .5;
        if (t < 1)
            return Math.pow(2, 10 * (t - 1)) / 2;
        t--;
        return (-Math.pow(2, -10 * t) + 2) / 2;
    },
    // Circular accelerating from zero velocity
    inCirc: (t) => -Math.sqrt(1 - t * t) + 1,
    // Circular decelerating to zero velocity Moves VERY fast at the beginning and
    // then quickly slows down in the middle. This tween can actually be used
    // in continuous transitions where target value changes all the time,
    // because of the very quick start, it hides the jitter between target value changes.
    outCirc: (t) => Math.sqrt(1 - (t = t - 1) * t),
    // Circular acceleration until halfway, then deceleration
    inOutCirc: (t) => {
        t /= .5;
        if (t < 1)
            return -(Math.sqrt(1 - t * t) - 1) / 2;
        t -= 2;
        return (Math.sqrt(1 - t * t) + 1) / 2;
    },
    inBack: (t) => {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    outBack: (t) => {
        const s = 1.70158;
        return ((t = t - 1) * t * ((s + 1) * t + s) + 1);
    },
    inOutBack: (t) => {
        let s = 1.70158;
        if ((t /= 0.5) < 1)
            return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
        return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    }
};
