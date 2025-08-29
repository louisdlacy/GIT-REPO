import { BaseComponent } from 'BaseComponent';
import { AssetBundleGizmo, AssetBundleInstanceReference, unityAnimationEvent } from 'horizon/unity_asset_bundles';
import * as GC from "./GameConsts";
import { Events } from "./Events";
const INTERVAL_ASSETBUNDLE_TIMER: string = "abTimer";
const INTERVAL_ASSETBUNDLE = 0.1;
const INTERVAL_ASSETBUNDLE_TIMEOUT = 5;
const EPI = 0.01;

export enum AssetBundleParameterType {
  Boolean,
  Integer,
  Float,
  Trigger,
}

type ParamValue = {
  type: AssetBundleParameterType,
  value: boolean | number
}

/**
 * This class helps manage linksto the Unity Asset Bundles.
 */
export class BaseAssetBundleComponent<T> extends BaseComponent<typeof BaseAssetBundleComponent & T> {
  private initCallbacks: (() => void)[] = [];

  protected assetBundleGizmo: AssetBundleGizmo | null = null;
  private assetBundleRoot: AssetBundleInstanceReference | undefined;
  private cachedValues: Map<string, ParamValue> = new Map();
  public pauseAnimation: boolean = false

  prefabs: string[] = [];

  start() {
    super.start();
    this.initAssetBundle();

    // Connect to UAB animation events
    this.connectNetworkBroadcastEvent(unityAnimationEvent, (data) => {
      if (bigintIdsMatch(this.entity.id, data.entityId)) {
        this.handleAnimationEvent(data.eventName);
      }
    });

    this.connectLocalBroadcastEvent(Events.onStartUabAnimation, () => {
      this.startUabAnimation();
    });
  }

  // Initialize asset bundle
  private initAssetBundle() {
    this.assetBundleGizmo = this.entity.as(AssetBundleGizmo);

    this.startInterval(INTERVAL_ASSETBUNDLE_TIMER, INTERVAL_ASSETBUNDLE, INTERVAL_ASSETBUNDLE_TIMEOUT, {
      checkToEnd: () => {
        return this.assetBundleGizmo != null && this.assetBundleGizmo.isLoaded();
      },
      onEnd: (endedByCondition: boolean) => { // The condition is the asset bundle is loaded
        if (endedByCondition) {
          this.onAssetBundleLoaded();
        } else {
          console.error(`Asset bundle failed to load ${this.entity.name.get()}`);
        }
      }
    });
  }

  // Loads UAB values for easy access
  protected onAssetBundleLoaded(): void {
    this.log("UAB INITIALIZED", GC.CONSOLE_LOG_UAB);
    this.assetBundleRoot = this.assetBundleGizmo!.getRoot();
    this.prefabs = this.assetBundleGizmo!.getPrefabNames()!;
    for (let callback of this.initCallbacks) {
      callback();
    }
  }

  // Add callback to be called when asset bundle is loaded
  protected addAssetBundleLoadedCallback(callback: () => void) {
    this.initCallbacks.push(callback);
  }

  // Check if it is actually possible to apply a change to an asset bundle animation parameter
  protected isSafeToUpdate() {
    return this.assetBundleRoot != undefined && this.entity.visible.get();
  }

  // Check wheter update is possible and necessary
  private shouldUpdate(paramName: string, value?: boolean | number, force: boolean = false) {
    if (!this.isSafeToUpdate() || this.pauseAnimation) {
      return false;
    }
    if (force) {
      return true;
    }
    if (value === undefined) {
      return true;
    }
    if (this.cachedValues.has(paramName)) {
      return this.cachedValues.get(paramName)!.value !== value;
    }
    return true;
  }

  protected loadPrefab(name: string) {
    this.assetBundleGizmo!.loadPrefab(name);
  }

  // Set asset bundle value
  protected setAnimationParameter(paramType: AssetBundleParameterType, paramName: string, value?: boolean | number, force: boolean = false) {
    if (this.shouldUpdate(paramName, value, force)) {
      // Set value based on parameter type
      switch (paramType) {
        case AssetBundleParameterType.Boolean:
          this.assetBundleRoot!.setAnimationParameterBool(paramName, value as boolean);
          this.cachedValues.set(paramName, { value: value as boolean, type: AssetBundleParameterType.Boolean });
          break;
        case AssetBundleParameterType.Integer:
          this.assetBundleRoot!.setAnimationParameterInteger(paramName, value as number);
          this.cachedValues.set(paramName, { value: value as number, type: AssetBundleParameterType.Integer });
          break;
        case AssetBundleParameterType.Float:
          // Epsilon value is necessary to make sure very small values are set to 0 otherwise animation events will keep on triggering
          if (Math.abs(value as number) <= EPI) {
            value = 0;
          }
          this.assetBundleRoot!.setAnimationParameterFloat(paramName, value as number);
          this.cachedValues.set(paramName, { value: value as number, type: AssetBundleParameterType.Float });
          break;
        case AssetBundleParameterType.Trigger:
          this.assetBundleRoot!.setAnimationParameterTrigger(paramName);
          break;
      }
    }
  }

  /**
   /**
    * Triggers the underlying asset bundle gizmo to update a given material.
    * @param objectName - The name of the object whose material is to be updated.
    * @param materialName - The name of the new material to apply.
    */
  protected setMaterial(objectName: string, materialName: string): void {
    let obj = this.assetBundleGizmo?.getReference(objectName, false);
    if (obj) {
      obj.setMaterial(materialName);
    } else {
      this.log(`UAB reference object not found: ${objectName}`);
    }
  }

  /**
   * The signature used to handle animation events.
   * This method is intended to be optionally implemented by child classes.
   * @param eventName - The name of the animation event to handle.
   */
  protected handleAnimationEvent(eventName: string) {
    this.log(`handleAnimationEvent ${eventName}`, GC.CONSOLE_LOG_ANIMATION_EVENTS);
  }

  /**
   * Starts the Unity Asset Bundle (UAB) animation by setting all cached animation parameters.
   */
  private startUabAnimation(): void {
    this.cachedValues.forEach((item, key) => {
      this.setAnimationParameter(item.type, key, item.value, true);
    });
  }
}

/*
 * ID comparison function to work around the fact that Horizon Worlds is suffering from number precision loss
 * Any number over 10 digits will lose 3 digits and then be compared.
 * A bit of a nasty solution to overcome this Horizon Worlds bug for the moment.
 */
function bigintIdsMatch(id1: bigint, id2: bigint) {
  let threshold = 9999999999; // 10 digits

  let id1number = Number(id1);
  let id2number = Number(id2);

  if (id1number > threshold) {
    id1number = Math.floor(id1number / 1000);
  }

  if (id2number > threshold) {
    id2number = Math.floor(id2number / 1000);
  }

  return id1number == id2number;
}
