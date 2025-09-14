/*
  Station 8: JSON as Datasource for custom UIs

  This station demonstrates how you can use uploaded Text assets in JSON form as source data for a set of similar custom UIs. In this case, they are information kiosks.

  This script is attached to a Trigger Zone gizmo. When the player enters the trigger, the custom UI inside the gizmo is populated with the appropriate data. The appropriate
  data is specified in a row in the jsonRowID property in the Properties panel. To populate, the code scans the AssetReferenceRows[] for the jsonRowID value and then 
  uses the values in that row to populate the custom UI objects.

  The code executes as follows:
  1. initializeUI() - this method is executed when the simulation begins. This sets up the data structures. By default, the custom UI is empty.
  2. start() - this method is executed when the player enters the simulation. This creates the onPlayerEnterTrigger() event listener, which fires when the player enters the trigger zone.
    Note that we are counting on this start() method to execute after the other start() methods,
    including the one that reads in the data, under the assumption that the first custom UI is some distance from the SpawnPoint.
  3.refresh() - when the player enters the trigger zone, the AssetReferenceRows[] array is scanned for the proper row and, if found, populates the custom UI with the correct data.
    This occurs after the player enters the trigger zone, meaning the player is in close proximity to the custom UI.

*/

// Imported components from the APIs.
import * as hz from 'horizon/core';

import {
  UIComponent,
  View,
  Text,
  ViewStyle,
  Callback,
  Pressable,
  Binding,
  UINode,
  Image,
  ImageSource,
  ImageStyle,
} from "horizon/ui";

// Imported components from the Loadcustom UI script. These are exportable data objects that are populated by the time the player approaches any of the custom UIs (we hope).
import {CUIRecordData, CUIRowData, AssetReferenceRows, AssetReferencesCount, keyCount} from 'Station08-LoadCustomUIData';

// style object for the logo
const logoImage2Style: ImageStyle = { width: 117, height: 12}; // 5%


export type UIJSONProps = {
  jsonRowID: string;
  triggerZone: hz.Entity;
  /*
  MetaLogo: hz.Asset;
    Since the logo asset ID is maintained in the JSON for each record, this Prop is unnecessary. However, if all your custom UIs use the same image, it may be easier
    to reference it from here, which is defined in one place. Your choice.
  */
  };


class Station08DisplayCUI extends UIComponent<UIJSONProps> {
static propsDefinition = {
  jsonRowID: { type: hz.PropTypes.String },
  triggerZone: {type: hz.PropTypes.Entity}
};


  panelHeight = 800;
  panelWidth = 1200;

  /*
    Following is the schema for the JSON file, which is helpful to include here so that you can build the code to support it.
    JSON record information should match the information in the exported type CUIRowData (see below):
          "CUIId": "3",
          "enabled": true,
          "titleText": "Winning the Game",
          "subTitleText": "",
          "bodyText": "To win the game, you need to hunt and kill the Wumpus. I feel a draft....",
          "logoAssetId": "3640063222903226"
  */
  bndCUIId = new Binding<string>('-1');
  bndenabled = new Binding<string>('');
  bndTitleText = new Binding<string>('');
  bndSubTitleText = new Binding<string>('');
  bndbodyText = new Binding<string>('');

  // For the image object, you must create a new ImageSource entity, which is used as the initial value of the Binding. If the Binding does not have a valid ImageSource initial value,
  // an error is generated. In this case, we create the placeholder text as a reference to the asset that is used in the JSON, but you can override this value with your own asset Ids in the JSON.
  imgSourcePlaceHolderTexture: ImageSource = ImageSource.fromTextureAsset(new hz.Asset(BigInt(3640063222903226)))
  bndLogoSource = new Binding<ImageSource>(this.imgSourcePlaceHolderTexture); // assetId here is a placeholder. It can be assigned as needed through the JSON. 

  initializeUI() {

    return View({
      children: [
        View({
          children: [
            Text({ text: this.bndTitleText,
              style: {
                color: "black",
                fontSize: 72,
                fontWeight: "800",
              }
            }),
            Image({
              source: this.bndLogoSource,
              style: logoImage2Style
              })
            ],
            style: {
              flexDirection: "row",
              flexWrap: "wrap",
              alignContent: "flex-end",
              justifyContent: "space-between",
            },
        }),
        View({
          children: [
            Text({  text: this.bndSubTitleText,
                    style: {color: "black", fontSize: 36, fontWeight: "600"}
            }),
            Text({  text: this.bndbodyText,
                    style: {color: "black", fontSize: 36}
            }),
          ],
          style: {
            flexDirection: "column",
            paddingTop: 18,
          },
        })
      ],

      // These style elements apply to the entire custom UI panel.
      style: { backgroundColor: "white",
        borderColor: "#00008B", // dark blue in RGB hex value
        borderWidth: 12,
        borderRadius: 25,
        padding: 20,
        flexDirection: "column",
        alignItems: "stretch",
      },
    });
  };

/*
  When the simulation begins (Play button in Desktop Editor), the start() method is executed.

  For this script, start() sets up the listener for the onPlayerEnterTrigger CodeBlockEvent.

  When that event fires, the refresh() method is called, using the value of this.props.jsonRowID, 
  which identifies the JSON row data to use to populate the custom UI.
*/
  start() {
    this.connectCodeBlockEvent(this.props.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {
      let r: string = this.props.jsonRowID
      this.refresh([enteredBy], r);
    })
  }

/*
  The refresh() method is called when the onPlayerEnterTrigger event fires. This method populates 
  the custom UI with data from the appropriate JSON record. Correct record
  is specified as a property (jsonRowId) on the Property panel of the custom UI.
*/
  refresh(thisPlayer: hz.Player[], myJSONRowId: string): void {
    let r: number = 0
    for (r=0; r < AssetReferencesCount; r++){
      let thisRow: CUIRowData = AssetReferenceRows[r];
      if ((thisRow.CUIId.valueOf() == myJSONRowId) && (thisRow.enabled == true)){
        // If thisRow (AssetReferenceRows[r]) is enabled and matches the value for the myJSONRowId parameter, 
        // we set() the values for the bindings of the custom UI based on the row's data.
        this.bndTitleText.set(thisRow.titleText.valueOf())
        this.bndSubTitleText.set(thisRow.subTitleText.valueOf())
        this.bndbodyText.set(thisRow.bodyText.valueOf())

        // The following converts the value of the logoAssetId field to a Number, which is used to create 
        // a reference to an hz.Asset. This asset is used as the input parameter for the ImageSource object.
        // The ImageSource object is bound to the bndLogoSource Binding, which is part of the custom UI definition.
        let lid:bigint = BigInt(+thisRow.logoAssetId)
        let myLogo = new hz.Asset(lid)
        let myLogoSource: ImageSource = ImageSource.fromTextureAsset(myLogo)
        this.bndLogoSource.set(myLogoSource)
        break;
      }
    }
    if (r >= AssetReferencesCount) {
      console.error ("Cannot find JSON rowID: " + myJSONRowId)
    }
  }

};
UIComponent.register(Station08DisplayCUI);
