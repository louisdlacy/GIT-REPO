/*
  Station 8: JSON as Datasource for custom UIs

  This station demonstrates how you can use uploaded Text assets in JSON form as source data for a set of similar custom UIs. In this case, they are information kiosks.

  This script loads the JSON data from your Asset Library and stores the values in an array.

  NOTE: You could add the JSON object as an Entity into your world. This basically creates a snapshot of your JSON, freezing it. However, to update it, you would
  need to remove the current one, add the new one, and update references to it in each Property panel of each custom UI. The textAsset property would need to be changed to:
  hz.Entity, too. Referencing it as an hz.Asset is easier to manage but cannot isolate it from changes.

*/

// Imported components from the APIs.
import * as hz from 'horizon/core';

/*
  This prop is used to reference the Text asset in your Assets Library that is the source JSON file.
  This script must be attached to an object, in whose Properties panel a designer can select the JSON file from the Assets library.

*/
  type Props = {
  textAsset : hz.Asset,
};

/*
  Following is the schema for the JSON file, which is helpful to include here so that you can build the code to support it.
  JSON record information should match the information in the exported type CUIRowData (see below):
        "CUIId": "3",
        "enabled": true,
        "titleText": "Winning the Game",
        "subTitleText": "Winning the Game",
        "bodyText": "To win the game, you need to hunt and kill the Wumpus. I feel a draft....",
        "logoAssetId": "3640063222903226"
*/
export type CUIRowData = {
  CUIId: string,
  enabled: Boolean,
  titleText: string,
  subTitleText: string,
  bodyText: string,
  logoAssetId: string
};
/*
  This record is the top-level array in your internal variable. While the row identifier information may be contained in the source JSON,
  you may find it easier to work with a row identifier (recordId below) created by Horizon Worlds.
*/
export type CUIRecordData = {
  recordId: string,
  row: Array<CUIRowData>,
}

export var booFilterData: Boolean = true; // set to TRUE to respect enabled=="TRUE" to prevent writing of a row.
export var AssetReferenceRows: CUIRowData[] = []; // array to hold parsed JSON data
export var AssetReferencesCount:number = 0; // count of records that are written
export var keyCount: number = 0; // count of keys in data

class Station08GetCUIData extends hz.Component<Props> {

  // reference to the textAsset property.
  static propsDefinition = {
    textAsset : { type: hz.PropTypes.Asset},
  };

  // Method is called on world start. "async" means that this method does not need to be executed immediately. The "await" keyword holds execution until the data is fetched.
  async start() {
    let ta: any = this.props.textAsset
    await ta.fetchAsData().then(
      (output: hz.AssetContentData) =>{
        // create local vars to capture the fetched JSON data
        // capture JSON fetched to "output" into a variable: JsonObj. Check if data has been captured.
        var JsonObj = output.asJSON();
        if(JsonObj == null || JsonObj == undefined){
          console.error("JSON load: null JsonObj");
          return;
        }
        else{
            // data has been captured! Extract keys from the JsonObj and use that to capture a row of data.
            var keys = Object.keys(JsonObj);
            for(const key of keys){
              // this is the top level of the JSON, which is the recordId and row data. Row data is a JSON array that needs to be unpacked.
              var rowRaw = (JsonObj as any)[key];
              const myRow: CUIRecordData = {
                recordId: key,
                row: rowRaw,
              }
              if(myRow.row == null || myRow.row == undefined){
                console.error("JSON load: null JsonObj row object");
                return;
              }
              else{
                var keys2 = Object.keys(myRow.row);
                keyCount = Object.keys(myRow.row).length;
                if ((booFilterData == false) || ((booFilterData == true) && (rowRaw.enabled.valueOf() == true))) {
                  AssetReferenceRows.push(rowRaw) // writes row data (without the RecordId key) to the storing array.
                  AssetReferencesCount = AssetReferencesCount + 1
                }
              }
            }
          }
        })
    }
}
hz.Component.register(Station08GetCUIData);
