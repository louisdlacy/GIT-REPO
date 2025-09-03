import * as hz from "horizon/core";
import { UIComponent, Binding, AnimatedBinding, UINode } from "horizon/ui";
export declare class TriviaUITemplate extends UIComponent<typeof TriviaUITemplate> {
    static propsDefinition: {
        spawnPoint: {
            type: "Entity";
        };
        buttonPress: {
            type: "Entity";
        };
        vfxpress: {
            type: "Entity";
        };
    };
    questionBinding: Binding<string>;
    answerABinding: Binding<string>;
    answerBBinding: Binding<string>;
    answerCBinding: Binding<string>;
    answerDBinding: Binding<string>;
    currentAnswer: number | undefined;
    currentPlayer: hz.Player | undefined;
    scaleA: AnimatedBinding;
    scaleB: AnimatedBinding;
    scaleC: AnimatedBinding;
    scaleD: AnimatedBinding;
    genericBinding: AnimatedBinding;
    initializeUI(): UINode;
    preStart(): void;
    initiateRevealAnswerSubscription(): void;
    processAnswer(player: hz.Player | undefined, scaleBinding: AnimatedBinding, answerID: number): void;
    pointAssigner(answer: number): void;
    displayNewQuestion(question: string, answerA: string, answerB: string, answerC: string, answerD: string): void;
    showMobileUI(): void;
}
