import * as hz from "horizon/core";
import { Npc } from "horizon/npc";

class AiVoice extends hz.Component<typeof AiVoice> {
  static propsDefinition = {
    npcGizmo: { type: hz.PropTypes.Entity },
    questionsTrigger: { type: hz.PropTypes.Entity },
    infoTrigger: { type: hz.PropTypes.Entity },
    factsTrigger: { type: hz.PropTypes.Entity },
    textGizmo: { type: hz.PropTypes.Entity },
  };
  npc: Npc | undefined;
  questionList: string[] = [
    "How is your day going?",
    "What are you working on?",
    "What do you like to do for fun?",
    "Do you have any hobbies?",
    "What is your favorite book or movie?",
    "What is your favorite food?",
    "Do you have any pets?",
    "What is your favorite place to visit?",
    "What is your dream job?",
    "What is something you are passionate about?",
  ];
  infoList: string[] = [
    "What can you do as an AI assistant?",
    "How were you created?",
    "What is your main purpose?",
    "Can you learn new things?",
    "How do you process information?",
    "Are you always available to help?",
    "What makes you different from a human?",
    "Can you understand emotions?",
    "How do you keep my information private?",
    "What are your limitations as an AI?",
  ];
  factsList: string[] = [
    "Can you tell me a random fun fact?",
    "What's an interesting fact I might not know?",
    "Do you know any surprising facts?",
    "Share a cool science fact with me.",
    "What's a weird fact about animals?",
    "Tell me a fact about space.",
    "Do you have a historical fact to share?",
    "What's a fact that sounds fake but is true?",
    "Give me a fact about food.",
    "What's a record-breaking fact?",
  ];
  start() {
    this.npc = this.props.npcGizmo!.as(Npc);
    if (this.npc == undefined) {
      console.error("ComputerFriend: npc is undefined.");
      return;
    }

    // if (!this.npc.isConversationEnabled()) {
    //   console.error("ComputerFriend: conversation not enabled");
    //   return;
    // }

    this.connectCodeBlockEvent(
      this.props.questionsTrigger! as hz.TriggerGizmo,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        this.onPlayerEnterTrigger(player, "questions");
      }
    );
    this.connectCodeBlockEvent(
      this.props.infoTrigger! as hz.TriggerGizmo,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        this.onPlayerEnterTrigger(player, "info");
      }
    );
    this.connectCodeBlockEvent(
      this.props.factsTrigger! as hz.TriggerGizmo,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        this.onPlayerEnterTrigger(player, "facts");
      }
    );
  }

  onPlayerEnterTrigger(player: hz.Player, category: string) {
    let question: string;
    switch (category) {
      case "questions":
        question =
          this.questionList[
            Math.floor(Math.random() * this.questionList.length)
          ];
        break;
      case "info":
        question =
          this.infoList[Math.floor(Math.random() * this.infoList.length)];
        break;
      case "facts":
        question =
          this.factsList[Math.floor(Math.random() * this.factsList.length)];
        break;
      default:
        question = "How can I help you today?";
    }
    this.props.textGizmo!.as(hz.TextGizmo).text.set(question);

    this.npc!.conversation!.elicitResponse(question);
  }
}
hz.Component.register(AiVoice);
