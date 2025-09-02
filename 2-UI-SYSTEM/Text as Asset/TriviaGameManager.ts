import * as hz from 'horizon/core';
/*
Here's an example of the JSON data that will be passed in:
[
  {
    "qns_type": "boolean",
    "difficulty": "medium",
    "category": "General Knowledge",
    "question": "Why did the chicken cross the road",
    "correct_answer": "False",
    "incorrect_answers": [
      "True"
    ]
  },
  {
    "qns_type": "boolean",
    "difficulty": "medium",
    "category": "General Knowledge",
    "question": "Why did the cow go moo.",
    "correct_answer": "True",
    "incorrect_answers": [
      "False"
    ]
  }
]
*/

interface JSONData {
  qns_type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export const Events = {
  answeredQns: new hz.LocalEvent<{
    answer: boolean;
  }>('answeredQuestion'),
}

class TriviaGameManager extends hz.Component<typeof TriviaGameManager> {
  static propsDefinition = {
    textAsset: { type: hz.PropTypes.Asset },

    questionTextGizmo: { type: hz.PropTypes.Entity },
    scoreTextGizmo: { type: hz.PropTypes.Entity },
    assetDetailsTextGizmo: { type: hz.PropTypes.Entity }

  };

  currQnsData: JSONData | null = null;
  allQnsData: JSONData[] | null = null;
  currQnsNum: number = 0;
  score: number = 0;

 preStart(){
  this.connectLocalBroadcastEvent(Events.answeredQns, (data) => {

    if (this.currQnsData && this.allQnsData) {
      console.log(
        this.currQnsData.question +
        "answered as : " + data.answer +
        " --> correct answer: " + this.currQnsData.correct_answer);

      const wasAnswerRight =
      ((data.answer && this.currQnsData.correct_answer == "True") ||
      (!data.answer && this.currQnsData.correct_answer == "False")) ? true : false;

      if (wasAnswerRight) {
        this.score++;
      }
      this.handleUpdateScore(this.score);

      this.world.ui.showPopupForEveryone(
        wasAnswerRight ? "Correct!" : "Incorrect!",
        2,
        {
          backgroundColor: wasAnswerRight ? hz.Color.green : hz.Color.red,
          fontColor: hz.Color.white,
          fontSize: 3,
          showTimer: false,
          playSound: true,
          position: hz.Vec3.zero,
        }
      );

      ++this.currQnsNum;
      this.currQnsData = this.allQnsData[this.currQnsNum];

      this.handleUpdateQns(
        this.props.questionTextGizmo!,
        this.currQnsData? this.currQnsData.question : "no Question!");
    }
  });
 }

  // called on world start
  async start() {

    let asset = this.props.textAsset!;
    asset.fetchAsData().then((output: hz.AssetContentData) => {
      console.warn("[TriviaGameManager] FetchAssetData: " + asset.id + " \n" + asset.versionId);
      this.allQnsData = this.handleExtractAssetContentData(output);
      console.log("[TriviaGameManager] allQnsData: Data loaded.");

      this.currQnsData = this.allQnsData ? this.allQnsData[0] : null;
      console.log("[TriviaGameManager] currQnsData: Get first question: " + this.currQnsData);

      this.handleUpdateQns(this.props.questionTextGizmo!, this.currQnsData? this.currQnsData.question : "Game Over!");
      this.handleUpdateScore(this.score);
      this.handleUpdateAssetDetails(asset);
    })
  }

  handleUpdateAssetDetails(asset: hz.Asset) {
    this.props.assetDetailsTextGizmo!.as(hz.TextGizmo)?.text.set("Asset ID: " + asset.id + "\nVersion ID: " + asset.versionId);
  }

  handleUpdateScore(score : number){
    (this.props.scoreTextGizmo!.as(hz.TextGizmo))?.text.set("Score: " + score);
  }

  handleUpdateQns(textGiz: hz.Entity, question: string) {
    console.warn("[TriviaGameManager] " + question);
    (textGiz.as(hz.TextGizmo))?.text.set(question);
  }

  handleAnswerQns(currentQns: JSONData, answer: boolean): boolean {
    if (answer && currentQns.correct_answer == "True" ||
      !answer && currentQns.correct_answer == "False") {
      return true;
    }
    else {
      return false;
    }
  }

  handleExtractAssetContentData(output: hz.AssetContentData) {
    var text = output.asText();
    console.log("[TriviaGameManager] Total text length: ", text.length);
    console.log("[TriviaGameManager] First 10 characters of the text for verification: ", text.substring(0, 10));
    console.log("[TriviaGameManager] ==================================");

    var jsobj = output.asJSON();
    if (jsobj == null || jsobj == undefined) {
      console.error("[TriviaGameManager] null jsobj");
      return null;
    }
    else {
      return output.asJSON<JSONData[]>();
    }
  }
}

// This tells the UI that your component can be attached to an entity
hz.Component.register(TriviaGameManager);


class TriviaAnswerTrigger extends hz.Component<typeof TriviaAnswerTrigger> {

  static propsDefinition = {
    answerType : { type: hz.PropTypes.Boolean }

  };

start() {

  this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {

    console.log("[TriviaGameManager] answered: " + this.props.answerType);

    this.sendLocalBroadcastEvent(Events.answeredQns, {answer: this.props.answerType});

  });
}

}
hz.Component.register(TriviaAnswerTrigger);
