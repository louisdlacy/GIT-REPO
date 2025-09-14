import { Events } from "Events";
import * as hz from "horizon/core";
import {
  UIComponent,
  Binding,
  AnimatedBinding,
  UINode,
  View,
  Animation,
} from "horizon/ui";
import { triviaDisplay } from "triviaDisplay";
import { gameManager } from "gameManager";
let revealAnswerCounts = 0;
export class TriviaUITemplate extends UIComponent<typeof TriviaUITemplate> {
  static propsDefinition = {
    spawnPoint: { type: hz.PropTypes.Entity },
    buttonPress: { type: hz.PropTypes.Entity },
    vfxpress: { type: hz.PropTypes.Entity },
  };
  questionBinding = new Binding<string>("Welcome To Brain Games Trivia?");

  // Bindings for the answers
  answerABinding = new Binding<string>("Answer A");
  answerBBinding = new Binding<string>("Answer B");
  answerCBinding = new Binding<string>("Answer C");
  answerDBinding = new Binding<string>("Answer D");

  currentAnswer: number | undefined = undefined;
  currentPlayer: hz.Player | undefined = undefined;

  scaleA = new AnimatedBinding(1);
  scaleB = new AnimatedBinding(1);
  scaleC = new AnimatedBinding(1);
  scaleD = new AnimatedBinding(1);
  genericBinding = new AnimatedBinding(1);

  initializeUI(): UINode {
    return View({});
  }

  preStart() {
    this.connectLocalBroadcastEvent(
      Events.displayQuestion,

      ({ question, answerA, answerB, answerC, answerD }) => {
        this.displayNewQuestion(question, answerA, answerB, answerC, answerD);
        console.log("Screen Recv'd");
      }
    );

    this.initiateRevealAnswerSubscription();
  }

  initiateRevealAnswerSubscription() {
    this.connectLocalBroadcastEvent(Events.revealanswer, ({ answer }) => {
      if (!this.currentPlayer) {
        return;
      }
      revealAnswerCounts++;
      console.warn(
        "number of times that reveal answer was called",
        revealAnswerCounts,
        this.entity.id.toString()
      );

      console.log("Player answered", this.currentAnswer, answer);
      let result = "incorrect";
      if (this.currentAnswer === answer) {
        result = "correct";
        console.log("Player answered correctly", this.currentPlayer.name.get());
      } else {
        console.log(
          "Player answered incorrectly",
          this.currentPlayer.name.get(),
          this.currentAnswer,
          answer
        );
        gameManager.s_instance.playerElimination(this.currentPlayer);
        this.currentPlayer = undefined;
        this.currentAnswer = undefined;
      }
      this.world.ui.showPopupForEveryone(result, 5);
      this.pointAssigner(answer);
    });
  }

  processAnswer(
    player: hz.Player | undefined,
    scaleBinding: AnimatedBinding,
    answerID: number
  ) {
    if (!player) {
      console.warn("Player is null");
      return;
    }
    triviaDisplay.s_instance.processAnswer(player, answerID);
    scaleBinding.set(
      Animation.sequence(
        Animation.timing(1.2, { duration: 200 }), // Scale up
        Animation.timing(1, { duration: 200 }) // Scale back down
      ),
      (finished) => {},
      [player] //Optional callback function that tells the animation has ended
    );

    this.currentPlayer = player;
    this.currentAnswer = answerID;
  }

  pointAssigner(answer: number) {}

  displayNewQuestion(
    question: string,
    answerA: string,
    answerB: string,
    answerC: string,
    answerD: string
  ) {
    console.warn("New question received:", question);
    this.questionBinding.set(question);
    this.answerABinding.set(answerA);
    this.answerBBinding.set(answerB);
    this.answerCBinding.set(answerC);
    this.answerDBinding.set(answerD);
    this.currentAnswer = undefined;
    this.showMobileUI();
  }

  public showMobileUI() {}
}
