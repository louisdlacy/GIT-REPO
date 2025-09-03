import { BaseComponent } from 'BaseComponent';
import { AssetBundleGizmo } from 'horizon/unity_asset_bundles';
export declare enum AssetBundleParameterType {
    Boolean = 0,
    Integer = 1,
    Float = 2,
    Trigger = 3
}
/**
 * This class helps manage linksto the Unity Asset Bundles.
 */
export declare class BaseAssetBundleComponent<T> extends BaseComponent<typeof BaseAssetBundleComponent & T> {
    private initCallbacks;
    protected assetBundleGizmo: AssetBundleGizmo | null;
    private assetBundleRoot;
    private cachedValues;
    pauseAnimation: boolean;
    prefabs: string[];
    start(): void;
    private initAssetBundle;
    protected onAssetBundleLoaded(): void;
    protected addAssetBundleLoadedCallback(callback: () => void): void;
    protected isSafeToUpdate(): any;
    private shouldUpdate;
    protected loadPrefab(name: string): void;
    protected setAnimationParameter(paramType: AssetBundleParameterType, paramName: string, value?: boolean | number, force?: boolean): void;
    /**
     /**
      * Triggers the underlying asset bundle gizmo to update a given material.
      * @param objectName - The name of the object whose material is to be updated.
      * @param materialName - The name of the new material to apply.
      */
    protected setMaterial(objectName: string, materialName: string): void;
    /**
     * The signature used to handle animation events.
     * This method is intended to be optionally implemented by child classes.
     * @param eventName - The name of the animation event to handle.
     */
    protected handleAnimationEvent(eventName: string): void;
    /**
     * Starts the Unity Asset Bundle (UAB) animation by setting all cached animation parameters.
     */
    private startUabAnimation;
}
