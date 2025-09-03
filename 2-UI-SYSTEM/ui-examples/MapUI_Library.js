"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinLabelTextFormatting = exports.mapColors = exports.MapTypes = exports.spawnTag = void 0;
exports.spawnTag = 'rapidSpawn';
var MapTypes;
(function (MapTypes) {
    MapTypes[MapTypes["TRAVEL"] = 0] = "TRAVEL";
    MapTypes[MapTypes["PLAYER"] = 1] = "PLAYER";
})(MapTypes || (exports.MapTypes = MapTypes = {}));
exports.mapColors = {
    mainPanel: '#fcf9e1ff',
    travelMapWindow: '#5b9e8dff',
    playerMapWindow: '#9f5e25ff',
    pinPrimary: '#59279aff',
    pinSecondary: '#a79f4cff',
    utilityButtons: '#9e5b5bff',
};
exports.pinLabelTextFormatting = {
    fontSize: 12,
    fontFamily: "Roboto-Mono",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center"
};
