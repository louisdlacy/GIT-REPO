"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hatManager_Func = void 0;
const CUI_ColorPicker_Data_1 = require("CUI_ColorPicker_Data");
const Events_Data_1 = require("Events_Data");
const HatManager_Data_1 = require("HatManager_Data");
const core_1 = require("horizon/core");
const UtilComponent_Data_1 = require("UtilComponent_Data");
exports.hatManager_Func = {
    spawnHat,
    setHatVisibility,
    setHatColor,
};
async function spawnHat(player, playerData, hat) {
    if (UtilComponent_Data_1.componentUtil_Data.component) {
        const currentHat = HatManager_Data_1.hatManager_Data.hatMap.get(player);
        if (currentHat) {
            UtilComponent_Data_1.componentUtil_Data.component.world.deleteAsset(currentHat);
            HatManager_Data_1.hatManager_Data.hatMap.delete(player);
        }
        playerData.stats.lastWornItem = hat.id;
        const hatSpawned = await UtilComponent_Data_1.componentUtil_Data.component.world.spawnAsset(hat.assetReference, new core_1.Vec3(0, -1, 0), core_1.Quaternion.one, core_1.Vec3.one);
        hatSpawned[0].as(core_1.AttachableEntity).attachToPlayer(player, core_1.AttachablePlayerAnchor.Head);
        HatManager_Data_1.hatManager_Data.hatMap.set(player, hatSpawned[0]);
        setHatColor(player, playerData, playerData.stats.lastWornColor);
    }
}
function setHatVisibility(player, isVisible) {
    const currentHat = HatManager_Data_1.hatManager_Data.hatMap.get(player);
    if (currentHat) {
        currentHat.visible.set(isVisible);
    }
}
function setHatColor(player, playerData, color) {
    const currentHat = HatManager_Data_1.hatManager_Data.hatMap.get(player);
    const currentColor = CUI_ColorPicker_Data_1.colorPicker_Data.allColorMap.get(color);
    if (currentHat && currentColor) {
        playerData.stats.lastWornColor = color;
        UtilComponent_Data_1.componentUtil_Data.component?.sendLocalEvent(currentHat, Events_Data_1.Events.localEvents.colorHat, { color: currentColor.color });
    }
}
