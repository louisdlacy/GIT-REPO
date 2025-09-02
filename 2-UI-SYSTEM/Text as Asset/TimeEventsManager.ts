import * as hz from 'horizon/core';

/*
Here's an example of the JSON data that will be passed in:
[
  {
    "particle_effect" : 1,
    "time_range" : [0,20],
    "seconds_passed_string": "Start of the minute"
  },
  {
    "particle_effect" : 2,
    "time_range" : [20,40],
    "seconds_passed_string": "20 seconds have passed!"
  },
  {
    "particle_effect" : 3,
    "time_range" : [40,60],
    "seconds_passed_string": "40 seconds have passed! The minute is ending"
  }
]
*/

interface JSONData {
  particle_effect: number;
  time_range: number[];
  seconds_passed_string: string;
}

class TimeEventsManager extends hz.Component<typeof TimeEventsManager> {
  static propsDefinition = {
    textAsset: { type: hz.PropTypes.Asset },

    assetDetailsTextGizmo: { type: hz.PropTypes.Entity },
    celebrationTextGizmo: { type: hz.PropTypes.Entity },
    timeTextGizmo: { type: hz.PropTypes.Entity },

    particle1Gizmo: { type: hz.PropTypes.Entity },
    particle2Gizmo: { type: hz.PropTypes.Entity },
    particle3Gizmo: { type: hz.PropTypes.Entity },
  };

  allTimedData: JSONData[] | null = null;
  date: Date | null = null;
  lastknownIndex = -1;

  // called on world start
  async start() {

    let asset = this.props.textAsset!;
    asset.fetchAsData().then((output: hz.AssetContentData) => {

      console.warn(asset.id + " \n" + asset.versionId);

      this.allTimedData = this.handleExtractAssetContentData(output);
      this.date = new Date();
      this.async.setInterval(() => {
        this.date!.setTime(Date.now()); // Update the existing Date object
        this.props.timeTextGizmo!.as(hz.TextGizmo)?.text.set(this.formatTime(this.date!));

        //Check against the JSON every second to make sure that if there is a new world state, handle it.
        this.handleUpdateTimeBehaviour(this.allTimedData!, this.date!);

      }, 1000);
      this.handleUpdateAssetDetails(asset);
    })
  }


  handleUpdateAssetDetails(asset: hz.Asset) {
    this.props.assetDetailsTextGizmo!.as(hz.TextGizmo)?.text.set("Asset ID: " + asset.id + "\nVersion ID: " + asset.versionId);
  }

  handleExtractAssetContentData(output: hz.AssetContentData) {
    var text = output.asText();
    console.log("[TimeEventsManager] Total text length: ", text.length);
    console.log("[TimeEventsManager] First 20 characters of the text for verification: ", text.substring(0, 20));
    console.log("[TimeEventsManager] ==================================");

    var jsobj = output.asJSON();
    if (jsobj == null || jsobj == undefined) {
      console.error("[TimeEventsManager] null jsobj");
      return null;
    }
    else {
      return output.asJSON<JSONData[]>();
    }
  }

  handleUpdateTimeBehaviour(allTimedData: JSONData[], date: Date) {
    const currSec = date.getSeconds()%30; //we only deal with the 30 second intervals in the minute
    const index = this.allTimedData!.findIndex((value, idx, obj) => {
      if (currSec >= value.time_range[0] && currSec < value.time_range[1]) {
        return true;
      }
      else {
        return false;
      }
    });

    if (this.lastknownIndex === index) {
      return; //skip if we have handled this transition before
    }

    console.warn("[TimeEventsManager] New index: " + index)

    this.lastknownIndex = index;
    const founddata = allTimedData[index];
    this.props.celebrationTextGizmo!.as(hz.TextGizmo)?.text.set(founddata.seconds_passed_string);

    switch (founddata.particle_effect) {
      case 1:
        this.props.particle1Gizmo!.as(hz.ParticleGizmo)?.play();
        this.props.particle2Gizmo!.as(hz.ParticleGizmo)?.stop();
        this.props.particle3Gizmo!.as(hz.ParticleGizmo)?.stop();
        break;
      case 2:
        this.props.particle1Gizmo!.as(hz.ParticleGizmo)?.stop();
        this.props.particle2Gizmo!.as(hz.ParticleGizmo)?.play();
        this.props.particle3Gizmo!.as(hz.ParticleGizmo)?.stop();
        break;
      case 3:
        this.props.particle1Gizmo!.as(hz.ParticleGizmo)?.stop();
        this.props.particle2Gizmo!.as(hz.ParticleGizmo)?.play();
        this.props.particle3Gizmo!.as(hz.ParticleGizmo)?.stop();
        break;
      default:
        break;
    }
  }

  formatTime(date: Date) {
    return `${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())}`;
  }

  padZero(value: number) {
    return (value < 10 ? '0' : '') + value;
  }

}
hz.Component.register(TimeEventsManager);
