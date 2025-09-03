"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class FetchAsData extends core_1.Component {
    preStart() {
        const assetId = 0; // Replace with your asset ID
        const asset = new core_1.Asset(BigInt(assetId));
        const skipCache = true;
        asset.fetchAsData({
            skipCache: skipCache
        })
            .then((data) => {
            const parsedData = data.asJSON();
            if (!parsedData) {
                console.error('Failed to parse data');
            }
            else {
                console.log('Fetched data:', parsedData.message);
            }
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }
    start() { }
}
core_1.Component.register(FetchAsData);
