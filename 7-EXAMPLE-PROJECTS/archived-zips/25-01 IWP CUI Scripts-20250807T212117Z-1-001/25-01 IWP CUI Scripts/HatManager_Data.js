"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hatManager_Data = void 0;
const core_1 = require("horizon/core");
const allHats = [
    {
        name: 'Pointy Hat',
        id: '0001PointyHat',
        assetReference: new core_1.Asset(BigInt(576590921758615)),
        assetIcon: new core_1.Asset(BigInt(580134664725514)),
        assetPrice: 5,
    },
    {
        name: 'Chef Hat',
        id: '0002ChefHat',
        assetReference: new core_1.Asset(BigInt(2254848671534421)),
        assetIcon: new core_1.Asset(BigInt(1276693623442951)),
        assetPrice: 5,
    },
    {
        name: 'Chef Hat Unlit',
        id: '0003ChefHatUnlit',
        assetReference: new core_1.Asset(BigInt(1349110486460787)),
        assetIcon: new core_1.Asset(BigInt(1276693623442951)),
        assetPrice: 1,
    },
];
const defaultHat = allHats[0];
const hatMap = new Map();
exports.hatManager_Data = {
    defaultHat,
    allHats,
    hatMap,
};
