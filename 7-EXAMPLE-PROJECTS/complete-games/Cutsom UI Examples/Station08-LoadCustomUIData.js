"use strict";
/*
  Station 8: JSON as Datasource for custom UIs

  This station demonstrates how you can use uploaded Text assets in JSON form as source data for a set of similar custom UIs. In this case, they are information kiosks.

  This script loads the JSON data from your Asset Library and stores the values in an array.

  NOTE: You could add the JSON object as an Entity into your world. This basically creates a snapshot of your JSON, freezing it. However, to update it, you would
  need to remove the current one, add the new one, and update references to it in each Property panel of each custom UI. The textAsset property would need to be changed to:
  hz.Entity, too. Referencing it as an hz.Asset is easier to manage but cannot isolate it from changes.

*/
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
exports.keyCount = exports.AssetReferencesCount = exports.AssetReferenceRows = exports.booFilterData = void 0;
// Imported components from the APIs.
const hz = __importStar(require("horizon/core"));
exports.booFilterData = true; // set to TRUE to respect enabled=="TRUE" to prevent writing of a row.
exports.AssetReferenceRows = []; // array to hold parsed JSON data
exports.AssetReferencesCount = 0; // count of records that are written
exports.keyCount = 0; // count of keys in data
class Station08GetCUIData extends hz.Component {
    // Method is called on world start. "async" means that this method does not need to be executed immediately. The "await" keyword holds execution until the data is fetched.
    async start() {
        let ta = this.props.textAsset;
        await ta.fetchAsData().then((output) => {
            // create local vars to capture the fetched JSON data
            // capture JSON fetched to "output" into a variable: JsonObj. Check if data has been captured.
            var JsonObj = output.asJSON();
            if (JsonObj == null || JsonObj == undefined) {
                console.error("JSON load: null JsonObj");
                return;
            }
            else {
                // data has been captured! Extract keys from the JsonObj and use that to capture a row of data.
                var keys = Object.keys(JsonObj);
                for (const key of keys) {
                    // this is the top level of the JSON, which is the recordId and row data. Row data is a JSON array that needs to be unpacked.
                    var rowRaw = JsonObj[key];
                    const myRow = {
                        recordId: key,
                        row: rowRaw,
                    };
                    if (myRow.row == null || myRow.row == undefined) {
                        console.error("JSON load: null JsonObj row object");
                        return;
                    }
                    else {
                        var keys2 = Object.keys(myRow.row);
                        exports.keyCount = Object.keys(myRow.row).length;
                        if ((exports.booFilterData == false) || ((exports.booFilterData == true) && (rowRaw.enabled.valueOf() == true))) {
                            exports.AssetReferenceRows.push(rowRaw); // writes row data (without the RecordId key) to the storing array.
                            exports.AssetReferencesCount = exports.AssetReferencesCount + 1;
                        }
                    }
                }
            }
        });
    }
}
// reference to the textAsset property.
Station08GetCUIData.propsDefinition = {
    textAsset: { type: hz.PropTypes.Asset },
};
hz.Component.register(Station08GetCUIData);
