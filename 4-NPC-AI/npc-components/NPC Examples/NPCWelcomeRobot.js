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
const WelcomeTriggerBox_1 = require("WelcomeTriggerBox");
const hz = __importStar(require("horizon/core"));
const NPCAgent_1 = require("NPCAgent");
class NPCWelcomeRobot extends NPCAgent_1.NPCAgent {
    constructor() {
        super(...arguments);
        this.players = [];
        this.playersToGreet = [];
        this.nextStateTimer = 0;
        this.initialRotaiton = hz.Quaternion.one;
    }
    start() {
        super.start();
        this.connectLocalBroadcastEvent(WelcomeTriggerBox_1.WelcomeTriggerBox.welcomeTriggerZoneEvent, (data) => {
            if (data.entered) {
                this.onPlayerEnterWelcomeZone(data.player);
            }
            else {
                this.onPlayerExitWelcomeZone(data.player);
            }
        });
        this.initialRotaiton = this.entity.rotation.get();
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.nextStateTimer -= deltaTime;
        if (this.nextStateTimer <= 0) {
            if (this.playersToGreet.length > 0) {
                this.greetPlayer(this.playersToGreet.shift());
                this.nextStateTimer = NPCWelcomeRobot.greetAnimationDuration;
            }
            else {
                // 20 percent chance to point at a random player.
                if (Math.random() < 0.2) {
                    if (this.players.length > 0) {
                        const randomIndex = Math.floor(Math.random() * this.players.length);
                        this.playerToLookAt = this.players[randomIndex];
                        this.triggerEmoteAnimation(NPCAgent_1.NPCAgentEmote.Point);
                    }
                    this.nextStateTimer = NPCWelcomeRobot.pointAnimationDuration;
                }
                else {
                    this.nextStateTimer = NPCWelcomeRobot.idleDuration;
                }
            }
        }
        if (this.playerToLookAt != undefined) {
            const delta = this.playerToLookAt.head.position
                .get()
                .sub(this.entity.position.get());
            const lookRotation = hz.Quaternion.lookRotation(delta, hz.Vec3.up);
            const newRotation = hz.Quaternion.slerp(this.entity.rotation.get(), lookRotation, 0.2);
            this.entity.rotation.set(newRotation);
            this.lookAt = this.playerToLookAt.head.position.get();
        }
        else {
            const newRotation = hz.Quaternion.slerp(this.entity.rotation.get(), this.initialRotaiton, 0.2);
            this.entity.rotation.set(newRotation);
            this.lookAt = undefined;
        }
    }
    onPlayerEnterWelcomeZone(player) {
        this.players.push(player);
        this.playersToGreet.push(player);
    }
    onPlayerExitWelcomeZone(player) {
        // Remove from the players list
        {
            const index = this.players.indexOf(player, 0);
            if (index > -1) {
                this.players.splice(index, 1);
            }
        }
        // Remove from the players to greet list
        {
            const index = this.playersToGreet.indexOf(player, 0);
            if (index > -1) {
                this.playersToGreet.splice(index, 1);
            }
        }
        if (player == this.playerToLookAt) {
            this.playerToLookAt = undefined;
        }
    }
    greetPlayer(player) {
        this.playerToLookAt = player;
        this.navMeshAgent?.destination.set(player.head.position.get());
        this.triggerEmoteAnimation(NPCAgent_1.NPCAgentEmote.Celebration);
    }
}
NPCWelcomeRobot.propsDefinition = {
    ...NPCAgent_1.NPCAgent.propsDefinition,
};
NPCWelcomeRobot.greetAnimationDuration = 3;
NPCWelcomeRobot.pointAnimationDuration = 2;
NPCWelcomeRobot.idleDuration = 1;
hz.Component.register(NPCWelcomeRobot);
