import { Binding, AnimatedBinding } from 'horizon/ui';
export declare const healthData: {
    isVisible: Binding<boolean>;
    animationValueBinding: AnimatedBinding;
    healthValueBinding: Binding<number>;
    currentHealth: number;
    maxHealth: number;
};
