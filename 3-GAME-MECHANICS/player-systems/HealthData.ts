import { Binding, AnimatedBinding } from 'horizon/ui';

export const healthData = {
    isVisible: new Binding(true),
    animationValueBinding: new AnimatedBinding(1),
    healthValueBinding: new Binding(1),
    currentHealth: 100,
    maxHealth: 100
}