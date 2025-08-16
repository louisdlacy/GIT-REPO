
import { dialogueData, DialogueMap } from 'DialogueData';
import { AddPromptEvent, RemovePromptEvent, TalkEvent, UpdatePromptVisibilityEvent } from 'DialogueEvents';
import { ButtonIcon, Component, Entity, Player, PlayerControls, PlayerInput, PlayerInputAction, PropTypes, Vec3 } from 'horizon/core';
import { Binding, Text, UIComponent, View } from 'horizon/ui';

class LocalManager extends Component<typeof LocalManager> {
  static propsDefinition = {
    local: { type: PropTypes.Entity }
  };

  preStart() {
    this.props.local?.owner?.set(this.entity.owner.get());
  }

  start() { }
}
Component.register(LocalManager);

class DialogueUI extends UIComponent<typeof DialogueUI> {
  static propsDefinition = {
    promptUI: { type: PropTypes.Entity }
  };

  panelHeight = 800;
  panelWidth = 600;

  nameBinding = new Binding('');

  speechBinding = new Binding('');//3 new lines max, For Example, Test\nTest\nTest

  owner?: Player;

  serverPlayer?: Player;

  isTalking = false;

  input?: PlayerInput;

  dialogueKey = "";

  textArray: { messages: string[] }[] = [];

  initializeUI() {
    return View({
      children: [
        //Content
        View({
          children: [
            Text({
              text: this.speechBinding,
              style: {
                fontSize: 50,
                color: "#000",
              }
            }),
          ],
          style: {
            height: '30%',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginHorizontal: 20,
            backgroundColor: "#ffffff",
            paddingVertical: 50,
            paddingHorizontal: 50,
            borderRadius: 100,
          }
        }),
        //Name
        View({
          children: [
            Text({
              text: this.nameBinding,
              style: {
                fontSize: 50,
                color: "#000",
                backgroundColor: "#bbffbb",
                padding: 20,
                borderRadius: 200,
                marginHorizontal: 20,
              }
            }),
          ],
          style: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginBottom: -50,
          }
        })
      ],
      style: {
        flexDirection: 'column-reverse',
        position: "absolute",
        height: '100%',
        width: '100%',
        bottom: 0,
        left: 0,
      }
    });
  }

  preStart() {
    this.owner = this.entity.owner.get();
    this.serverPlayer = this.world.getServerPlayer();

    this.props.promptUI?.owner?.set(this.entity.owner.get());

    if (this.owner === this.serverPlayer) {
      return;
    }

    //console.log("Connecting events for DialogueUI");

    this.connectLocalBroadcastEvent(TalkEvent, this.onTalk);
  }

  onTalk = (data: { target: Entity }) => {
    if (this.isTalking || !this.owner) {
      return;
    }

    this.isTalking = true;

    const name = data.target.name.get();
    this.nameBinding.set(name);
    
    if (this.dialogueKey !== name) {
      this.dialogueKey = name;
      dialogueData.messageDataIndex = 0;
    }

    this.textArray = DialogueMap.get(name) ?? [];

    //console.log(textArray);
    if (this.textArray.length > 0) {
      //console.log("Dialogue Data Index", dialogueData.messageDataIndex, this.textArray.length);

      const messages = this.textArray[dialogueData.messageDataIndex].messages;

      //console.log("Messages for", name, this.messages);

      dialogueData.messageIndex = 0;

      const message = messages[dialogueData.messageIndex];

      this.speechBinding.set(message);
    } else {
      this.speechBinding.set("");
    }

    this.input = PlayerControls.connectLocalInput(PlayerInputAction.RightTrigger, ButtonIcon.RightChevron, this);
    this.input.registerCallback((action, pressed) => {
      if (pressed) {
        this.onContinue();
      }
    });

    this.entity.visible.set(true);
  }

  onContinue = () => {
    if (!this.owner) {
      return;
    }

    //console.log("Continuing dialogue", dialogueData.messageIndex === this.messages.length - 1);
    const messages = this.textArray[dialogueData.messageDataIndex].messages;

    if (dialogueData.messageIndex < messages.length - 1) {
      dialogueData.messageIndex = dialogueData.messageIndex + 1;

      const message = messages[dialogueData.messageIndex];

      this.speechBinding.set(message);
    } else {
      this.isTalking = false;

      dialogueData.messageDataIndex = (dialogueData.messageDataIndex + 1) % this.textArray.length;
      //console.log("Dialogue Data Index", dialogueData.messageDataIndex, this.textArray.length);

      this.input?.disconnect();

      this.entity.visible.set(false);

      this.sendLocalBroadcastEvent(UpdatePromptVisibilityEvent, {});
    }
  }
}
Component.register(DialogueUI);

class PromptUI extends UIComponent<typeof PromptUI> {

  owner?: Player;

  serverPlayer?: Player;

  isTalking = false;

  input?: PlayerInput;

  target?: Entity;

  preStart() {
    this.owner = this.entity.owner.get();
    this.serverPlayer = this.world.getServerPlayer();

    //this.entity.visible.set(false);

    if (this.owner === this.serverPlayer) {
      return;
    }

    //console.log("Connecting events for PromptUI");

    this.connectNetworkEvent(this.owner, AddPromptEvent, this.onAddPrompt);

    this.connectNetworkEvent(this.owner, RemovePromptEvent, this.onRemovePrompt);

    this.connectLocalBroadcastEvent(UpdatePromptVisibilityEvent, this.onUpdateVisibility);
  }

  onAddPrompt = (data: { target: Entity }) => {
    // Always update target, but don't show while talking
    this.target = data.target;
    this.updateVisibility();

    this.entity.position.set(data.target.position.get().add(Vec3.up.mul(1.5)));
    this.entity.rotation.set(data.target.rotation.get());
  }

  onRemovePrompt = () => {
    // Always clear target, even while talking
    this.target = undefined;
    this.updateVisibility();
  }

  onUpdateVisibility = () => {
    this.isTalking = false;
    this.updateVisibility();
  }

  updateVisibility = () => {
    const shouldShow = !!this.target && !this.isTalking;
    
    this.entity.visible.set(shouldShow);
    
    if (shouldShow) {
      this.connectInput();
    } else {
      this.disconnectInput();
    }
  }

  connectInput = () => {
    //console.log("Connecting input");
    this.input = PlayerControls.connectLocalInput(PlayerInputAction.RightGrip, ButtonIcon.Speak, this);
    this.input?.registerCallback((action, pressed) => {
      if (pressed && this.target) {
        this.isTalking = true;

        this.sendLocalBroadcastEvent(TalkEvent, { target: this.target });

        this.updateVisibility();
      }
    });
  }

  disconnectInput = () => {
    //console.log("Disconnecting input");
    this.input?.disconnect();
  }

  initializeUI() {
    return View({
      children: [
        Text({
          text: "Talk",
          style: {
            fontSize: 80,
            color: "#ffffff",
            textAlign: "center",
            textAlignVertical: "center",
            backgroundColor: "#000000",
            padding: "10px",
            borderRadius: 300,
            height: 400,
            width: 400,
          }
        })
      ],
      style: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }
    });
  }
}
UIComponent.register(PromptUI);