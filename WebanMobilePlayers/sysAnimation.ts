import * as hz from 'horizon/core';

enum ValueType {
  UNKNOWN,
  NUMBER,
  VEC3,
  QUATERNION,
  COLOR,
}

type validTypes = number | hz.Vec3 | hz.Color | hz.Quaternion;

class AnimationInfo {
  fromValue: validTypes;
  toValue: validTypes;
  overMs: number;
  valueType: ValueType;
  startTime: number;
  endTime: number;
  complete: boolean = false;
  easing: (t: number) => number;
  callback: (value: validTypes, pctComplete: number) => void;
  constructor(_from: validTypes, _to: validTypes, _overMs: number, callback: (value: validTypes, pctComplete: number) => void, easing: (t: number) => number = Easing.linear) {
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
type EntityAnim = {
  entity: hz.Entity,
  animID: string,
}

export class sysAnimation {
  private moveTos: Record<string, EntityAnim> = {}
  private scaleTos: Record<string, EntityAnim> = {}
  private rotateTos: Record<string, EntityAnim> = {}
  private colorTos: Record<string, EntityAnim> = {}
  public animations: Record<string, AnimationInfo> = {};
  private updateEvent: hz.EventSubscription | null = null;
  private parentComponent: hz.Component;

  constructor(_parentComponent: hz.Component) {
    this.parentComponent = _parentComponent;
  }

  public animateTo(fromValue: validTypes, toValue: validTypes, overMs: number, callback: (value: validTypes, pctComplete: number) => void, easing: (t: number) => number = Easing.linear): string {
    const animInfo = new AnimationInfo(fromValue, toValue, overMs, callback, easing);
    const id = this.makeid(16)
    this.animations[id] = animInfo;
    if (!this.updateEvent) this.update();
    return id;
  }

  //color animations
  public colorBy(entity: hz.Entity, relativeColor: hz.Color, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    this.colorTo(entity, hz.Color.add(relativeColor, entity.color.get()), overMs, onComplete, easing);
  }

  public colorTo(entity: hz.Entity, toColor: hz.Color, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    let entityAnim = this.colorTos[entity.id.toString()];
    if (entityAnim !== undefined) {
      this.cancel(entityAnim.animID);
      delete this.colorTos[entity.id.toString()];
      onComplete();
    }

    this.animateTo(entity.color.get().clone(), toColor, overMs, (value, pctComplete: number) => {
      entity.color.set(value as hz.Color);
      if (pctComplete === 1) {
        onComplete();
      }
    }, easing);
  }

  //rotation animations
  public rotateBy(entity: hz.Entity, relativeRotation: hz.Quaternion, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    this.rotateTo(entity, hz.Quaternion.mul(relativeRotation, entity.rotation.get()), overMs, onComplete, easing);
  }
  public rotateTo(entity: hz.Entity, toRotation: hz.Quaternion, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    let entityAnim = this.rotateTos[entity.id.toString()];
    if (entityAnim !== undefined) {
      this.cancel(entityAnim.animID);
      delete this.rotateTos[entity.id.toString()];
      onComplete();
    }
    this.animateTo(entity.rotation.get().clone(), toRotation, overMs, (value, pctComplete: number) => {
      entity.rotation.set(value as hz.Quaternion);
      if (pctComplete === 1) {
        onComplete();
      }
    }, easing);
  }

  //move animations
  public moveBy(entity: hz.Entity, relativePosition: hz.Vec3, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    this.moveTo(entity, hz.Vec3.add(relativePosition, entity.position.get()), overMs, onComplete, easing);
  }
  public moveTo(entity: hz.Entity, toPosition: hz.Vec3, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    let entityAnim = this.moveTos[entity.id.toString()];
    if (entityAnim !== undefined) {
      this.cancel(entityAnim.animID);
      delete this.moveTos[entity.id.toString()];
      onComplete();
    }
    this.animateTo(entity.position.get().clone(), toPosition, overMs, (value, pctComplete: number) => {
      entity.position.set(value as hz.Vec3);
      if (pctComplete === 1) {
        onComplete();
      }
    }, easing);
  }

  //scale animations
  public scaleTo(entity: hz.Entity, toScale: hz.Vec3, overMs: number, onComplete: () => void = () => { }, easing: (t: number) => number = Easing.linear) {
    let entityAnim = this.scaleTos[entity.id.toString()];
    if (entityAnim !== undefined) {
      this.cancel(entityAnim.animID);
      delete this.scaleTos[entity.id.toString()];
      onComplete();
    }
    this.animateTo(entity.scale.get().clone(), toScale, overMs, (value, pctComplete: number) => {
      entity.scale.set(value as hz.Vec3);
      if (pctComplete === 1) {
        onComplete();
      }
    }, easing);
  }

  private cancel(animationId: string) {
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

        keys.forEach((key: string) => {
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
          } else {
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

  private calcNumber(animation: AnimationInfo, pct: number) {
    const _from = animation.fromValue as number;
    const _to = animation.toValue as number;
    const result = _from + ((_to - _from) * pct);
    animation.callback(result, pct);
  }
  private calcVec3(animation: AnimationInfo, pct: number) {
    const _from = animation.fromValue as hz.Vec3;
    const _to = animation.toValue as hz.Vec3;
    const result = hz.Vec3.add(_from, hz.Vec3.mul((hz.Vec3.sub(_to, _from)), pct));
    animation.callback(result, pct);
  }
  private calcColor(animation: AnimationInfo, pct: number) {
    const _from = animation.fromValue as hz.Color;
    const _to = animation.toValue as hz.Color;
    const result = hz.Color.add(_from, hz.Color.mul((hz.Color.sub(_to, _from)), pct))
    animation.callback(result, pct);
  }

  //https://www.anycodings.com/1questions/2083501/how-to-lerp-between-two-quaternions
  private calcQuaternion(animation: AnimationInfo, pct: number) {
    const _from = animation.fromValue as hz.Quaternion;
    let _to = animation.toValue as hz.Quaternion;
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

  private dot(a: hz.Quaternion, b: hz.Quaternion): number {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }

  private negate(a: hz.Quaternion) {
    return new hz.Quaternion(-a.x, -a.y, -a.z, -a.w);
  }

  private makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export const Easing = {
  linear: (t: number) => t,

  // Accelerates fast, then slows quickly towards end.
  quadratic: (t: number) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4),

  // Overshoots over 1 and then returns to 1 towards end.
  cubic: (t: number) => t * (4 * t * t - 9 * t + 6),

  // Overshoots over 1 multiple times - wiggles around 1.
  elastic: (t: number) => t * (33 * t * t * t * t - 106 * t * t * t + 126 * t * t - 67 * t + 15),

  // Accelerating from zero velocity
  inQuad: (t: number) => t * t,

  // Decelerating to zero velocity
  outQuad: (t: number) => t * (2 - t),

  // Acceleration until halfway, then deceleration
  inOutQuad: (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Accelerating from zero velocity
  inCubic: (t: number) => t * t * t,

  // Decelerating to zero velocity
  outCubic: (t: number) => (--t) * t * t + 1,

  // Acceleration until halfway, then deceleration
  inOutCubic: (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Accelerating from zero velocity
  inQuart: (t: number) => t * t * t * t,

  // Decelerating to zero velocity
  outQuart: (t: number) => 1 - (--t) * t * t * t,

  // Acceleration until halfway, then deceleration
  inOutQuart: (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  // Accelerating from zero velocity
  inQuint: (t: number) => t * t * t * t * t,

  // Decelerating to zero velocity
  outQuint: (t: number) => 1 + (--t) * t * t * t * t,

  // Acceleration until halfway, then deceleration
  inOutQuint: (t: number) => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

  // Accelerating from zero velocity
  inSine: (t: number) => -Math.cos(t * (Math.PI / 2)) + 1,

  // Decelerating to zero velocity
  outSine: (t: number) => Math.sin(t * (Math.PI / 2)),

  // Accelerating until halfway, then decelerating
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Exponential accelerating from zero velocity
  inExpo: (t: number) => Math.pow(2, 10 * (t - 1)),

  // Exponential decelerating to zero velocity
  outExpo: (t: number) => -Math.pow(2, -10 * t) + 1,

  // Exponential accelerating until halfway, then decelerating
  inOutExpo: (t: number) => {
    t /= .5;
    if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
    t--;
    return (-Math.pow(2, -10 * t) + 2) / 2;
  },

  // Circular accelerating from zero velocity
  inCirc: (t: number) => -Math.sqrt(1 - t * t) + 1,

  // Circular decelerating to zero velocity Moves VERY fast at the beginning and
  // then quickly slows down in the middle. This tween can actually be used
  // in continuous transitions where target value changes all the time,
  // because of the very quick start, it hides the jitter between target value changes.
  outCirc: (t: number) => Math.sqrt(1 - (t = t - 1) * t),

  // Circular acceleration until halfway, then deceleration
  inOutCirc: (t: number) => {
    t /= .5;
    if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
    t -= 2;
    return (Math.sqrt(1 - t * t) + 1) / 2;
  },

  inBack: (t: number) => {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },

  outBack: (t: number) => {
    const s = 1.70158;
    return ((t = t - 1) * t * ((s + 1) * t + s) + 1);
  },

  inOutBack: (t: number) => {
    let s = 1.70158;
    if ((t /= 0.5) < 1) return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
    return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
  }
}
