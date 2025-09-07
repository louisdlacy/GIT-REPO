import * as hz from "horizon/core";

class TimeOfDaySky extends hz.Component<typeof TimeOfDaySky>
{
  static propsDefinition =
  {
    // Entities references
    skyDome: { type: hz.PropTypes.Entity },
    horizonBand: { type: hz.PropTypes.Entity },
    starSphere: { type: hz.PropTypes.Entity },

    sunTrack: { type: hz.PropTypes.Entity },
    sunQuad: { type: hz.PropTypes.Entity },

    moonTrack: { type: hz.PropTypes.Entity },
    moonQuad: { type: hz.PropTypes.Entity },

    cloudRing1: { type: hz.PropTypes.Entity },
    cloudDisc: { type: hz.PropTypes.Entity },

    // Global time controls
    autoProgressTime: { type: hz.PropTypes.Boolean, default: true },
    dayLengthSeconds: { type: hz.PropTypes.Number,  default: 300 },
    defaultStartingHour: { type: hz.PropTypes.Number,  default: 9 },
    defaultStartingDay: { type: hz.PropTypes.Number,  default: 1 },

    // Sun/Moon path
    sunMoonAreOpposite: { type: hz.PropTypes.Boolean, default: true },
    sunTiltDeg: { type: hz.PropTypes.Number,  default: 0 },
    sunPhaseOffsetDeg: { type: hz.PropTypes.Number, default: 180 },
    sunAzimuthYawDeg: { type: hz.PropTypes.Number, default: 0 },

    // Stars
    starsEnabled: { type: hz.PropTypes.Boolean, default: true },
    starsNightStartHour: { type: hz.PropTypes.Number,  default: 20 },
    starsNightEndHour: { type: hz.PropTypes.Number,  default: 6.5 },
    starsNightFadeMinutes: { type: hz.PropTypes.Number,  default: 30 },
    starsRotationSpeed: { type: hz.PropTypes.Number,  default: 2 },

    // Clouds
    cloudsEnabled:     { type: hz.PropTypes.Boolean, default: true },
    cloudRingRotationSpeed:{ type: hz.PropTypes.Number,  default: 1.0 },
    cloudCeilingRotationSpeed:{ type: hz.PropTypes.Number,  default: -1.0 },

    // Horizon band
    horizonSunsetBoost:{ type: hz.PropTypes.Number,  default: 0.6 },

    // Colors
    // SKY (Night, Dawn, Noon, Dusk)
    skyDawnColor: { type: hz.PropTypes.Color, default: "#FF0081" },
    skyNoonColor: { type: hz.PropTypes.Color, default: "#3076DB" },
    skyDuskColor: { type: hz.PropTypes.Color, default: "#FF1000" },
    skyNightColor: { type: hz.PropTypes.Color, default: "#040026" },

    // HORIZON
    horizonDawnColor: { type: hz.PropTypes.Color, default: "#FF8600" },
    horizonNoonColor: { type: hz.PropTypes.Color, default: "#7FB8F2" },
    horizonDuskColor: { type: hz.PropTypes.Color, default: "#FF7600" },
    horizonNightColor: { type: hz.PropTypes.Color, default: "#000000ff" },

    // CLOUDS
    cloudsDawnColor: { type: hz.PropTypes.Color, default: "#FF4D98" },
    cloudsNoonColor: { type: hz.PropTypes.Color, default: "#FFFFFF" },
    cloudsDuskColor: { type: hz.PropTypes.Color, default: "#DE130A" },
    cloudsNightColor: { type: hz.PropTypes.Color, default: "#0B0B2A" },

    // SUN
    sunDawnColor: { type: hz.PropTypes.Color, default: "#FFB700" },
    sunNoonColor: { type: hz.PropTypes.Color, default: "#FFEF62" },
    sunDuskColor: { type: hz.PropTypes.Color, default: "#FF1B00" },
    sunNightColor: { type: hz.PropTypes.Color, default: "#000000ff" },

    // MOON
    moonDawnColor: { type: hz.PropTypes.Color, default: "#EBEDBF" },
    moonNoonColor: { type: hz.PropTypes.Color, default: "#EBEDBF" },
    moonDuskColor: { type: hz.PropTypes.Color, default: "#EBEDBF" },
    moonNightColor: { type: hz.PropTypes.Color, default: "#EBEDBF" },

    // Debug clock
    clockText: { type: hz.PropTypes.Entity },
    use24HourClock: { type: hz.PropTypes.Boolean, default: false },
  };

  private _autoPlay!: boolean;
  private _dayLenSec!: number;
  private _timeHrs!: number;
  private _t01 = 0;
  private _absHours = 0;
  private _dayNum   = 1;

  private _updateSub?: any; // EventSubscription

  preStart()
  {
    // subscribe to world update
    this._updateSub = this.connectLocalBroadcastEvent(
      hz.World.onUpdate,
      (data: { deltaTime: number }) => this.tick(data.deltaTime || 0)
    );
  }

  start()
  {
    // take copies from props ONCE
    this._autoPlay = !!this.props.autoProgressTime;
    this._dayLenSec = Math.max(1, Number(this.props.dayLengthSeconds));
    this._timeHrs   = this.wrap24(Number(this.props.defaultStartingHour));
    this._t01 = this._timeHrs / 24;
    this._absHours = this._timeHrs;
    this._dayNum   = Math.max(1, (this.props.defaultStartingDay|0) || 1);
    this.updateClockText();      

    this.applyTransforms(0);
    this.applyVisuals(0);
  }

  onDestroy()
  {
    // try common detach methods; optional chaining so it compiles even if not present
    this._updateSub?.disconnect?.();
    this._updateSub?.unsubscribe?.();
    this._updateSub?.remove?.();
    this._updateSub = undefined;
  }

  private tick(dt: number)
  {
    if (this._autoPlay)
    {
      const hoursPerSec = 24 / this._dayLenSec;
      this._absHours += hoursPerSec * dt;
      this._dayNum = (this.props.defaultStartingDay|0) + Math.floor(this._absHours / 24);
      this._timeHrs = this.wrap24(this._absHours);
      this._t01 = this._timeHrs / 24;
    }
    this.applyTransforms(dt);
    this.applyVisuals(dt);
    this.updateClockText();
  }

  update(dt: number)
  {
    if (this._autoPlay) {
      const hoursPerSec = 24 / this._dayLenSec;
      this._timeHrs = this.wrap24(this._timeHrs + hoursPerSec * dt);
      this._t01 = this._timeHrs / 24;
    }
    this.applyTransforms(dt);
    this.applyVisuals(dt);
  }

  // public API for creators
  setTime(hours: number)
  {
    this._timeHrs = this.wrap24(hours);
    this._absHours = Math.floor(this._absHours / 24) * 24 + this._timeHrs;
    this._t01 = this._timeHrs / 24;
    this.applyTransforms(0);
    this.applyVisuals(0);
    this.updateClockText();
  }

  setDay(dayNumber: number)
  {
    this._dayNum = Math.max(1, dayNumber|0);
    const dayZero = (this.props.defaultStartingDay|0);
    const offsetDays = this._dayNum - dayZero;
    this._absHours = offsetDays * 24 + this._timeHrs;
    this.updateClockText();
  }
  setAutoPlay(on: boolean) { this._autoPlay = !!on; }
  setDayLength(seconds: number) { this._dayLenSec = Math.max(1, seconds|0); }

  // ---------- transforms ----------
  private applyTransforms(dt: number)
  {
    const sunAngle = this._t01 * 360 + this.props.sunPhaseOffsetDeg;

    // Sun: spin around X, keep fixed Z tilt
    this.setEuler(this.props.sunTrack,  {x: sunAngle, y: this.props.sunAzimuthYawDeg, z: this.props.sunTiltDeg});

    // Moon: opposite on the same great circle
    const moonAngle = (sunAngle) % 360;
    this.setEuler(this.props.moonTrack, {x: moonAngle, y: this.props.sunAzimuthYawDeg, z: this.props.sunTiltDeg});

    // Stars + Clouds
    this.addRoll(this.props.starSphere, this.props.starsRotationSpeed * dt);
    if (this.props.cloudsEnabled) {
      this.addYaw(this.props.cloudRing1, this.props.cloudRingRotationSpeed * dt);
      this.addYaw(this.props.cloudDisc,  this.props.cloudCeilingRotationSpeed * dt);
    }
  }

  // ---------- visuals ----------
  private applyVisuals(dt: number)
  {
    const skyRGB     = this.sampleFourPointColors(this.palette("sky"),     this._timeHrs);
    const horizonRGB = this.sampleFourPointColors(this.palette("horizon"), this._timeHrs);
    const cloudRGB   = this.sampleFourPointColors(this.palette("clouds"),  this._timeHrs);
    const sunRGB     = this.sampleFourPointColors(this.palette("sun"),     this._timeHrs);
    const moonRGB    = this.sampleFourPointColors(this.palette("moon"),    this._timeHrs);

    this.setTintRGB(this.props.skyDome, skyRGB);

    const sunElev01 = this.sunElevation01();
    const boost = this.clamp01(Number(this.props.horizonSunsetBoost) * (1 - sunElev01));
    const horizonTint = this.lerpRGB(horizonRGB, this.white(), boost);
    this.setTintRGB(this.props.horizonBand, horizonTint);

    const cloudsOn = !!this.props.cloudsEnabled;
    this.setVisible(this.props.cloudRing1, cloudsOn);
    this.setVisible(this.props.cloudDisc,  cloudsOn);
    if (cloudsOn) {
      this.setTintRGB(this.props.cloudRing1, cloudRGB);
      this.setTintRGB(this.props.cloudDisc,  cloudRGB);
    }

    this.setTintRGB(this.props.sunQuad,  sunRGB);
    this.setTintRGB(this.props.moonQuad, moonRGB);

    // Stars: visibility + brightness ramp at night
    if (this.props.starsEnabled)
      {
      const night = this.nightBrightness01(
        this._timeHrs,
        Number(this.props.starsNightStartHour),
        Number(this.props.starsNightEndHour),
        Number(this.props.starsNightFadeMinutes)
      );

      const shouldShow = night > 0.01;

      // visibility is driven directly by night factor (no latching)
      this.setVisible(this.props.starSphere, shouldShow);

      // tint brightness (night in [0..1])
      this.setTintRGB(this.props.starSphere, { r: night, g: night, b: night });
    }
    else {
      this.setVisible(this.props.starSphere, false);
    }
  }

  // ---------- color sampling ----------
  private sampleFourPointColors(palette: ReadonlyArray<HzColorOrHex>, hour: number): RGB
  {
    const C = [0,1,2,3].map(i => this.toRGB(palette[i]));

    // Centers (where you want those looks to "live")
    const DAWN_CENTER = 7.5;      // 07:30
    const DUSK_CENTER = 19.5;     // ~19:30

    // Transition window half-widths (in hours). Smaller = quicker sunrise/sunset.
    const PRE_DAWN_H  = 1.0;     // night → dawn
    const DAWN_H      = 1.7;     // dawn → noon
    const PRE_DUSK_H  = 2.0;     // noon → dusk
    const POST_DUSK_H = .5;      // dusk → night

    // Convenience (wrap 0..24)
    const h = this.wrap24(hour);

    // Window edges
    const preDawnA  = this.wrap24(DAWN_CENTER - PRE_DAWN_H);
    const preDawnB  = this.wrap24(DAWN_CENTER);
    const dawnA     = this.wrap24(DAWN_CENTER);
    const dawnB     = this.wrap24(DAWN_CENTER + DAWN_H);

    const preDuskA  = this.wrap24(DUSK_CENTER - PRE_DUSK_H);
    const preDuskB  = this.wrap24(DUSK_CENTER);
    const postDuskA = this.wrap24(DUSK_CENTER);
    const postDuskB = this.wrap24(DUSK_CENTER + POST_DUSK_H);

    // Helper to ease within a window (handles wrap)
    const easeInWindow = (ha:number, hb:number, x:number) => {
      // map hour x into [0..1] across [ha..hb] with wrapping support
      const t = this.hourLerp01(x, ha, hb);
      // smootherstep for softer shoulders
      const s = t*t*t*(t*(t*6 - 15) + 10);
      return this.clamp01(s);
    };

    // --- piecewise mixing per diagram ---
    // Night → Dawn (short)
    if (this.inHourRange(h, preDawnA, preDawnB)) {
      const t = easeInWindow(preDawnA, preDawnB, h);
      return this.lerpRGB(C[0], C[1], t); // Night -> Dawn
    }

    // Dawn → Noon (short)
    if (this.inHourRange(h, dawnA, dawnB)) {
      const t = easeInWindow(dawnA, dawnB, h);
      return this.lerpRGB(C[1], C[2], t); // Dawn -> Noon
    }

    // Noon hold (long)
    if (this.inHourRange(h, dawnB, preDuskA)) {
      return C[2];
    }

    // Noon → Dusk (short)
    if (this.inHourRange(h, preDuskA, preDuskB)) {
      const t = easeInWindow(preDuskA, preDuskB, h);
      return this.lerpRGB(C[2], C[3], t); // Noon -> Dusk
    }

    // Dusk → Night (short)
    if (this.inHourRange(h, postDuskA, postDuskB)) {
      const t = easeInWindow(postDuskA, postDuskB, h);
      return this.lerpRGB(C[3], C[0], t); // Dusk -> Night
    }

    // Night hold (long)
    return C[0];
  }

  // Convert Horizon Color or hex string → RGB(0..1)
  private toRGB(c: HzColorOrHex): RGB
  {
    if (!c) return { r:1, g:1, b:1 };
    if (typeof c === "string") return this.hexToRGB(c);
    const r = (c as any).r, g = (c as any).g, b = (c as any).b;
    return { r: this.clamp01(r), g: this.clamp01(g), b: this.clamp01(b) };
  }

  // Build a [Night, Dawn, Noon, Dusk] palette array from a name prefix
  private palette(prefix: "sky"|"horizon"|"clouds"|"sun"|"moon"): ReadonlyArray<HzColorOrHex>
  {
    const p:any = this.props;
    return [
      p[`${prefix}NightColor`],
      p[`${prefix}DawnColor`],
      p[`${prefix}NoonColor`],
      p[`${prefix}DuskColor`],
    ];
  }

  // ---------- time helpers ----------
  private sunElevation01(): number
  {
    const theta = this._t01 * Math.PI * 2;
    return (Math.sin(theta) + 1) * 0.5;
  }

  private nightBrightness01(hour: number, start: number, end: number, fadeMinutes: number): number
  {
    const fadeHrs = Math.max(1/60, fadeMinutes/60);
    const isNight = start < end ? (hour >= start && hour < end) : (hour >= start || hour < end);
    const fadeInStart  = this.wrap24(start),      fadeInEnd  = this.wrap24(start + fadeHrs);
    const fadeOutStart = this.wrap24(end - fadeHrs), fadeOutEnd = this.wrap24(end);
    let v = isNight ? 1 : 0;
    if (this.inHourRange(hour, fadeInStart,  fadeInEnd))  v = this.smooth01(this.hourLerp01(hour, fadeInStart,  fadeInEnd));
    if (this.inHourRange(hour, fadeOutStart, fadeOutEnd)) v = 1 - this.smooth01(this.hourLerp01(hour, fadeOutStart, fadeOutEnd));
    return this.clamp01(v);
  }

  private updateClockText()
  {
    const target = this.props.clockText;
    if (!target) return;

    const hrs = this._timeHrs;
    const h = Math.floor(hrs);
    const m = Math.floor((hrs - h) * 60 + 0.5); // round to nearest minute
    const hhmm = this.props.use24HourClock ? this.fmt24(h, m) : this.fmt12(h, m);
    const txt = `<font=bangers sdf><material=bangers sdf glow>Day ${this._dayNum}\n<font=roboto-bold sdf><material=roboto-bold sdf - drop shadow>${hhmm}`;

    this.props.clockText!.as(hz.TextGizmo)!?.text.set(txt);
  }

  private fmt12(h: number, m: number): string
  {
    const am = h < 12 || h === 24;
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    const mm = m.toString().padStart(2, "0");
    return `${h12}:${mm} ${am ? "AM" : "PM"}`;
  }

  private fmt24(h: number, m: number): string
  {
    const hh = Math.floor(h).toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // ---------- ENGINE BINDINGS (swap to exact Horizon calls) ----------
  private getEuler(entity: any): {x:number;y:number;z:number}
  {
    if (!entity) return {x:0,y:0,z:0};
    try {
      const q = entity.rotation?.get?.();
      if (q?.toEuler) {
        const e = q.toEuler(hz.EulerOrder.YXZ);
        return { x: e.x, y: e.y, z: e.z };
      }
    } catch {}
    return {x:0,y:0,z:0};
  }

  private setEuler(entity: any, e: {x:number;y:number;z:number})
  {
    if (!entity) return;
    try {
      const q = hz.Quaternion.fromEuler(new hz.Vec3(e.x, e.y, e.z), hz.EulerOrder.YXZ);
      entity.rotation?.set?.(q);
    } catch (err) {
      console.warn("[ToD] rotation.set failed on", entity, err);
    }
  }

  private addYaw(entity: any, addDeg: number)
  {
    if (!entity || !addDeg) return;
    const e = this.getEuler(entity);
    this.setEuler(entity, { x: e.x, y: e.y + addDeg, z: e.z });
  }

  private addRoll(entity: any, addDeg: number)
  {
    if (!entity || !addDeg) return;
    const e = this.getEuler(entity);
    this.setEuler(entity, { x: e.x, y: e.y, z: e.z + addDeg});
  }

  private setTintRGB(target: any, rgb: RGB) {
    if (!target) return;

    let mesh: any;
    try { mesh = target.as(hz.MeshEntity); } catch {}
    if (!mesh?.style?.tintColor) return;

    const c = this.clampRGB(rgb);
    try {
      const ts = mesh.style.tintStrength;
      if (ts?.get && ts?.set) {
        const cur = this.clamp01(ts.get() ?? 0);
        if (cur <= 0) ts.set(1);
      }
    } catch {}

    // apply color (0..1)
    mesh.style.tintColor.set(new hz.Color(c.r, c.g, c.b));
  }

  private setVisible(entity: any, vis: boolean)
  {
    if (!entity) return;
    if (entity.visible?.set) entity.visible.set(vis);
    else if (entity.setVisible) entity.setVisible(vis);
  }

  // ---------- math/color utils ----------
  private clamp01(v:number){ return Math.max(0, Math.min(1, v)); }
  private clampRGB(c: RGB): RGB { return { r: this.clamp01(c.r), g: this.clamp01(c.g), b: this.clamp01(c.b) }; }
  private white(): RGB { return { r:1, g:1, b:1 }; }
  private lerpRGB(a: RGB, b: RGB, t: number): RGB {t = this.clamp01(t); return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };}
  private smooth01(t: number) { t = this.clamp01(t); return t*t*(3-2*t); }
  private invLerp(a: number, b: number, v: number) { return this.clamp01((v - a) / (b - a)); }
  private hexToRGB(hex: string): RGB {const h = hex.replace("#",""); return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255, b: parseInt(h.slice(4,6),16)/255 };}
  private wrap24(h: number) { let x = h % 24; if (x < 0) x += 24; return x; }
  private inHourRange(h: number, a: number, b: number) { h=this.wrap24(h); a=this.wrap24(a); b=this.wrap24(b); return a<=b ? (h>=a&&h<b) : (h>=a||h<b); }
  private hourLerp01(h: number, a: number, b: number) {
    h=this.wrap24(h); a=this.wrap24(a); b=this.wrap24(b);
    if (a<=b) return this.invLerp(a,b,h);
    const span=(24-a)+b, pos= h>=a ? (h-a):(24-a+h);
    return this.clamp01(pos/span);
  }
}

type RGB = { r:number; g:number; b:number };
type HzColor = { r:number; g:number; b:number };
type HzColorOrHex = HzColor | string;

hz.Component.register(TimeOfDaySky);
