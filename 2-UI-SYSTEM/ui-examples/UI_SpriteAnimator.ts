import { PropTypes, Vec3 } from "horizon/core";
import { Binding, Image, ImageSource, UIComponent, UINode, View } from "horizon/ui";
import { sysEvents } from "sysEvents";

//region type definition
type SpriteAnimationSettings = {
  animID: string;
  firstFrame: number;
  lastFrame: number;
  yRow: number;
  xOffset: number;
  loop: boolean;
};

//region Mon1 anim defined
//cellCountX: 8, cellCountY: 8
export const Mon1: Record<string, SpriteAnimationSettings> = {
  Idle: { animID: "Mon1_Idle", firstFrame: 0, lastFrame: 3, yRow: 0, xOffset: 0, loop: true },
  Walk: { animID: "Mon1_Walk", firstFrame: 0, lastFrame: 4, yRow: 1, xOffset: 0, loop: true },
  Attack: { animID: "Mon1_Attack", firstFrame: 1, lastFrame: 5, yRow: 2, xOffset: 0, loop: false },
  Hurt: { animID: "Mon1_Hurt", firstFrame: 1, lastFrame: 2, yRow: 3, xOffset: 0, loop: false },
  Dead: { animID: "Mon1_Dead", firstFrame: 0, lastFrame: 7, yRow: 3, xOffset: 0, loop: false },
  Jump: { animID: "Mon1_Jump", firstFrame: 0, lastFrame: 7, yRow: 5, xOffset: 0, loop: false },
};

//region Mon4 anim defined
//cellCountX: 16, cellCountY: 8,
export const Mon4: Record<string, SpriteAnimationSettings> = {
  Idle: { animID: "Mon4_Idle", firstFrame: 0, lastFrame: 3, yRow: 0, xOffset: 0, loop: true },
  Jump: { animID: "Mon4_Jump", firstFrame: 0, lastFrame: 8, yRow: 1, xOffset: 0, loop: false },
  Attack: { animID: "Mon4_Attack", firstFrame: 0, lastFrame: 4, yRow: 2, xOffset: 0, loop: false },
  RangeAttack: { animID: "Mon4_RangeAttack", firstFrame: 0, lastFrame: 13, yRow: 3, xOffset: 0, loop: false },
  Hurt: { animID: "Mon4_Hurt", firstFrame: 1, lastFrame: 2, yRow: 4, xOffset: 0, loop: false },
  Dead: { animID: "Mon4_Dead", firstFrame: 0, lastFrame: 7, yRow: 4, xOffset: 0, loop: false },
};

//region Pig anim defined
//cellCountX: 6, cellCountY: 5
export const Pig: Record<string, SpriteAnimationSettings> = {
  Idle: { animID: "Pig_Idle", firstFrame: 0, lastFrame: 3, yRow: 0, xOffset: 0, loop: true },
  Ready: { animID: "Pig_Ready", firstFrame: 0, lastFrame: 3, yRow: 1, xOffset: 0, loop: true },
  Run: { animID: "Pig_Run", firstFrame: 0, lastFrame: 5, yRow: 2, xOffset: 0, loop: true },
  Attack: { animID: "Pig_Attack", firstFrame: 0, lastFrame: 5, yRow: 3, xOffset: 0, loop: false },
  Dead: { animID: "Pig_Dead", firstFrame: 0, lastFrame: 5, yRow: 4, xOffset: 0, loop: false },
};

//region CharMap defined
//CharacterMapKey should match one string
export const CharacterMap: Record<string, Record<string, SpriteAnimationSettings>> = {
  Mon1: Mon1,
  Mon4: Mon4,
  Pig: Pig,
};

//region -BeginClass
/**
 * A flexible sprite-sheet animator for Horizon Custom UI. Feed it a sprite sheet,
 * point it to a character’s animation map (Idle, Walk, Attack, etc.), and it will animate
 * by shifting a single `Image` across the sheet. Non-looping clips (e.g., Attack, Hurt)
 * automatically return to `Idle` when finished.
 */
export class UI_SpriteAnimator extends UIComponent<typeof UI_SpriteAnimator> {
  static propsDefinition = {
    enabled: { type: PropTypes.Boolean, default: true },
    characterMapKey: { type: PropTypes.String, default: "Mon1" },
    animatedImg: { type: PropTypes.Asset },
    //total # of columns that make up the entire sprite sheet (blank included)
    cellCountX: { type: PropTypes.Number, default: 10 },
    //total # of rows that make up the entire sprite sheet (blank included)
    cellCountY: { type: PropTypes.Number, default: 10 },
    //frames per second
    fps: { type: PropTypes.Number, default: 4 },
    //starting size of the sprite
    panelWidth: { type: PropTypes.Number, default: 500 },
    //starting position of the sprite, Z is the start for a scale binding
    offset: { type: PropTypes.Vec3, default: new Vec3(50, 50, 1) },

    //Uncomment if youre a developer figuring out sprite sheet dimensions
    // useTestValues: { type: PropTypes.Boolean, default: true },
    // firstFrame: { type: PropTypes.Number, default: 0 },
    // lastFrame: { type: PropTypes.Number, default: 4 },
    // yOffset: { type: PropTypes.Number, default: 0 },
    // xOffset: { type: PropTypes.Number, default: 0 },
    // loop: { type: PropTypes.Boolean, default: true },
    // zIndex: { type: PropTypes.Number, default: 10 },
  };

  //region variables
  cappedFPS = 8;

  //these shift the view of the sprite sheet to the next sprite to display
  bnd_imgShift = new Binding<number>(0); // X shift
  bnd_imgShiftY = new Binding<number>(0); // Y shift
  //these move the character on the game screen
  bnd_screenPosX = new Binding<string>("50%");
  bnd_screenPosY = new Binding<string>("50%");
  //this handles any potential runtime scaling we might do to the character
  charScale = 1;
  bnd_xScale = new Binding<number>(1); // Directional scale
  bnd_yScale = new Binding<number>(1);

  //this holds the current character's animation settings
  charRef: Record<string, SpriteAnimationSettings> = {};
  //the current animation playing
  curAnimation: SpriteAnimationSettings | null = null;
  //the keys for the current character's animations
  animKeys = Object.keys(Mon1);
  //the current index of the animation key being played [Idle, Attack, Jump, ...]
  animIndex = 0;

  initializeUI(): UINode {
    if (!this.props.enabled) this.entity.visible.set(false);

    this.bnd_screenPosX.set(`${this.props.offset.x}%`);
    this.bnd_screenPosY.set(`${100 - this.props.offset.y}%`);
    this.setCharScale(this.props.offset.z);

    return View({
      children: [
        // View({
        //   children: [
        //region spritesheet image
        Image({
          source: ImageSource.fromTextureAsset(this.props.animatedImg!),
          style: {
            width: `${this.props.cellCountX * 100}%`,
            height: `${this.props.cellCountY * 100}%`,
            transform: [{ translateX: this.bnd_imgShift }, { translateY: this.bnd_imgShiftY }, { scale: 1.0 }],
            position: "absolute",
          },
        }),
      ],
      style: {
        width: this.props.panelWidth,
        aspectRatio: 1,
        // backgroundColor: "rgba(255, 0, 0, 0.5)",
        // masks the rest of the sprite
        overflow: "hidden",
        // Remove center alignment (optional depending on needs)
        alignItems: "flex-start",
        justifyContent: "flex-start",
        position: "absolute",
        transform: [{ scaleX: this.bnd_xScale }, { scaleY: this.bnd_yScale }],
        layoutOrigin: [0.5, 0.5],
        left: this.bnd_screenPosX,
        top: this.bnd_screenPosY,
        // zIndex: this.props.zIndex,
      },
      //   }),
      // ],
      // //the
      // style: {
      //   position: "absolute",
      //   width: "100%",
      //   height: "100%",
      //   // backgroundColor: this.props.backgroundOn ? "rgba(0, 110, 0, 1)" : "transparent",
      //   zIndex: 0,
      // },
    });
  }

  //region preStart()
  preStart(): void {
    if (!this.props.enabled) return;

    //add cap to FPS
    if(this.props.fps > 8){
      console.warn("Capping FPS at 8");
    }
    this.cappedFPS = this.props.fps <=8 ? this.props.fps : 8;

    this.connectNetworkEvent(this.entity, sysEvents.simpleButtonEvent, () => {
      const key = this.animKeys[this.animIndex % this.animKeys.length];
      console.log(`Playing animation: ${key}`);
      if (!this.charRef) {
        console.error(`No character record found.`);
        return;
      }
      this.playAnimation(this.charRef[key]);
      this.animIndex = (this.animIndex + 1) % this.animKeys.length;
    });

    this.connectNetworkEvent(this.entity, sysEvents.damageEvent, (data) => {
      if (this.tryPlaySprite(this.props.characterMapKey, "Dead")) {
      } else if (this.tryPlaySprite(this.props.characterMapKey, "Dead")) {
        console.log("Character is dead");
      } else {
        console.log("No Hurt or Dead animation available");
      }
    });
  }

  //region start()
  start(): void {
    if (!this.props.enabled) return;

    switch (this.props.characterMapKey) {
      case "Mon1":
        this.charRef = CharacterMap["Mon1"];
        if (!this.charRef) {
          console.error("Character record Mon1 not found.");
        }
        break;
      case "Mon2":
        break;
      case "Mon3":
        break;
      case "Mon4":
        this.charRef = CharacterMap["Mon4"];
        if (!this.charRef) {
          console.error("Character record Mon4 not found.");
        }
        break;
      case "Pig":
        this.charRef = CharacterMap["Pig"];
        if (!this.charRef) {
          console.error("Character record Pig not found.");
        }
        break;
      default:
        console.error(`Character record ${this.props.characterMapKey} not found. Defaulting to Mon1.`);
        this.charRef = CharacterMap["Mon1"];
        break;
    }

    //init values for animation
    this.animIndex = 0;
    this.animKeys = Object.keys(this.charRef);

    //play the first key of the character: this should always be Idle
    this.playAnimation(this.charRef[this.animKeys[this.animIndex]]);

    //region testFrames
    //Example: this.playFrames(6, 17, 0, 0, true); // Plays frames from 6 to 17 on first row, no xOffset, with looping
    // if (this.props.useTestValues) {
    //   this.playFrames(
    //     this.props.firstFrame,
    //     this.props.lastFrame,
    //     this.props.yOffset,
    //     this.props.xOffset,
    //     this.props.loop
    //   );
    // }
  }

  //region moveSprite()
  public moveSprite(position: Vec3, isIdle: boolean, plusXFacing: boolean): void {
    const roundedPos = roundPosition(position);
    const screenPos = convertPosWorldToScreen(roundedPos);
    this.bnd_screenPosX.set(`${screenPos.x}%`);
    this.bnd_screenPosY.set(`${screenPos.y}%`);
    this.bnd_xScale.set((plusXFacing ? 1 : -1) * this.charScale);
    if (isIdle) {
      // Handle moving state
      this.playAnimation(this.charRef.Idle);
    } else {
      if (this.checkAnimationAvailability(this.charRef.Walk)) {
        this.playAnimation(this.charRef.Walk);
      } else if (this.checkAnimationAvailability(this.charRef.Jump)) {
        this.playAnimation(this.charRef.Jump);
      }
    }
  }

  //region tryPlaySprite()
  public tryPlaySprite(charMap: string, animID: string): boolean {
    const charRef = CharacterMap[charMap];
    if (!charRef) {
      console.error(`Character record ${charMap} not found.`);
      return false;
    }
    const anim = charRef[animID];
    if (!anim) {
      console.error(`Animation ${animID} not found for character ${charMap}.`);
      return false;
    }
    console.log(`Playing animation: ${animID} for character: ${charMap}`);
    this.playAnimation(anim);
    return true;
  }

  //region setCharScale()
  setCharScale(scale: number) {
    this.charScale = scale;
    this.bnd_xScale.set(scale);
    this.bnd_yScale.set(scale);
  }

  //region randFPS Offset()
  randomFPSOffset() {
    // Returns a random offset (0-100 ms) to slightly stagger UI updates
    return Math.random() * 100 - 50;
  }

  //region if anim exists()
  checkAnimationAvailability(settings: SpriteAnimationSettings): boolean {
    return !!settings;
  }

  nonLoopingAnimInProgress: boolean = false;
  //region playAnimation()
  playAnimation(settings: SpriteAnimationSettings | undefined) {
    if (!settings) {
      console.error("Animation settings not found.");
      return;
    }
    if (this.curAnimation === settings || this.nonLoopingAnimInProgress) {
      return;
    }
    if (!settings.loop) {
      this.nonLoopingAnimInProgress = true;
    }

    this.curAnimation = settings;
    this.playFrames(settings.firstFrame, settings.lastFrame, settings.yRow, settings.xOffset, settings.loop);
  }

  //this is the async reference for stepping through frames
  timeoutId: number | null = null;

  //region playFrames()
  playFrames(firstFrame: number, lastFrame: number, yOffset: number, xOffset: number, loop: boolean) {
    if (this.timeoutId) {
      this.async.clearTimeout(this.timeoutId);
    }

    let currentFrame = firstFrame;

    const playNextFrame = () => {
      const frameWidth = this.props.panelWidth;
      const frameIndex = currentFrame - firstFrame + xOffset; // account for horizontal offset
      const shiftX = -frameIndex * frameWidth;
      const shiftY = -yOffset * frameWidth; // assuming square cells; adjust if height differs

      this.bnd_imgShift.set(shiftX);
      this.bnd_imgShiftY.set(shiftY);

      if (currentFrame < lastFrame) {
        currentFrame += 1;
        this.timeoutId = this.async.setTimeout(playNextFrame, 1000 / this.cappedFPS);
      } else if (loop) {
        currentFrame = firstFrame;
        this.timeoutId = this.async.setTimeout(playNextFrame, 1000 / this.cappedFPS);
      } else {
        this.timeoutId = null;
        this.nonLoopingAnimInProgress = false;
        this.playIdleIfAvailable();
      }
    };

    playNextFrame();
  }

  //region playIdelIfAvailable()
  private playIdleIfAvailable() {
    const idle = this.charRef?.Idle;
    if (idle) {
      this.playAnimation(idle);
    }
  }
}
UIComponent.register(UI_SpriteAnimator);

//region -func roundPos()
export function roundPosition(position: Vec3): Vec3 {
  return new Vec3(Math.round(position.x), Math.round(position.y), Math.round(position.z));
}

//region func worldToScrn()
export function convertPosWorldToScreen(position: Vec3): Vec3 {
  const screenX = position.x + 50;
  const screenY = 100 - (position.z + 50);
  return new Vec3(screenX, screenY, 0);
}
