import { type UITextureProps } from "GameUtils";
import { Color, ComponentWithConstructor, Entity, SerializableState } from "horizon/core";
import { Binding, UIComponent } from "horizon/ui";
export declare class UiComponentsRegistry {
    private static componentMap;
    static RegisterComponent(id: bigint, behaviour: UIComponent<ComponentWithConstructor<Record<string, unknown>>, SerializableState>): void;
    static GetComponent<TComponent>(entity: Entity | undefined | null): TComponent | undefined;
}
export declare class AmmoHud extends UIComponent<UITextureProps> {
    panelHeight: number;
    panelWidth: number;
    static propsDefinition: {
        textureAsset: {
            type: "Asset";
        };
    };
    strPlayerAmmoTotal: Binding<string>;
    colorAmmo: Binding<Color>;
    updateAmmo(ammo: number, color: Color): void;
    initializeUI(): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
}
export declare class HealthHud extends UIComponent<UITextureProps> {
    panelHeight: number;
    panelWidth: number;
    static propsDefinition: {
        textureAsset: {
            type: "Asset";
        };
    };
    strPlayerAmmoTotal: Binding<string>;
    colorAmmo: Binding<Color>;
    updateHealth(hp: number, color: Color): void;
    initializeUI(): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
}
