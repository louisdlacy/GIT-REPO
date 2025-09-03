"use strict";
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
exports.CustomerControl = void 0;
const hz = __importStar(require("horizon/core"));
const BaseComponent_1 = require("./BaseComponent");
const NPC_Base_1 = require("./NPC_Base");
const CustomerNavigation_1 = require("./CustomerNavigation");
const core_1 = require("horizon/core");
/**
 * This class controls the overarching behavior of the customer. It is responsible for
 * managing the customer's interactions and navigation within the environment.
 */
class CustomerControl extends BaseComponent_1.BaseComponent {
    constructor() {
        super(...arguments);
        this._inTrigger = false; // used to prevent trigger from hitting twice due to HW oddity
    }
    /**
     * Initializes the customer control by setting up entity references and enabling customer behavior.
     * Also connects events for player entering and exiting the trigger area.
     */
    start() {
        super.start();
        this.getEntityReferences();
        this.enableCustomer();
        this._navigation.startNavigation();
        let sub = this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.stopAndSayHi(player);
            sub.disconnect();
        });
        this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            this.resumeWalking();
        });
    }
    /**
     * Retrieves and verifies the necessary component references for LLM control and navigation.
     */
    getEntityReferences() {
        // Get references to entities
        this._llmControl = this.getAndVerifyComponent(this.props.npcControl, NPC_Base_1.NPC_Base);
        this._navigation = this.getAndVerifyComponent(this.props.navigation, CustomerNavigation_1.CustomerNavigation);
    }
    /**
     * Enables the customer by subscribing to events and resetting the LLM session.
     */
    enableCustomer() {
        this._llmControl.subscribeEvents();
        this._llmControl.resetLLMSession();
    }
    /**
     * Resumes the customer's walking behavior by resetting the trigger state and starting navigation.
     */
    resumeWalking() {
        this._inTrigger = false;
        this._llmControl?.askLLMToStopTalking();
        this._navigation?.startNavigation();
    }
    /**
     * Stops the customer's navigation and makes the customer greet the player.
     * @param player - The player who has entered the trigger area.
     */
    stopAndSayHi(player) {
        if (!this._inTrigger) {
            this._inTrigger = true;
            this._navigation?.stopNavigation();
            this.entity.lookAt(player.position.get().componentMul(new core_1.Vec3(1, 0, 1)));
            if (this.props.usePrescripted) {
                this._llmControl?.speak(`Hi ${player.name.get()}! I'm a horizon worlds N P C`, player);
            }
            else {
                this._llmControl?.elicitSpeech(`Tell the player, named ${player.name.get()} that you are a Horizon Worlds NPC. Keep it short, under 20 words.`, player);
            }
            this.world.ui.showPopupForEveryone(`NPC should be speaking now`, 1);
        }
    }
}
exports.CustomerControl = CustomerControl;
CustomerControl.propsDefinition = {
    ...BaseComponent_1.BaseComponent.propsDefinition,
    npcControl: { type: hz.PropTypes.Entity },
    navigation: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
    usePrescripted: { type: hz.PropTypes.Boolean }
};
hz.Component.register(CustomerControl);
