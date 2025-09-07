"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HealthData_1 = require("HealthData");
const HealthEvents_1 = require("HealthEvents");
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
class Chicken extends core_1.Component {
    constructor() {
        super(...arguments);
        this.onDamage = (data) => {
            this.receiveDamage(data.amount);
            this.hitSfx?.play();
            if (HealthData_1.healthData.currentHealth === 0) {
                this.onDeath();
            }
        };
        this.onDeath = () => {
            this.deathSfx?.play();
            this.deathVfx?.play();
            this.entity.collidable.set(false);
            this.entity.visible.set(false);
            this.async.setTimeout(() => {
                HealthData_1.healthData.isVisible.set(false);
            }, 600);
            this.async.setTimeout(() => {
                this.revive();
            }, 3000); //3 seconds before revival
        };
        this.revive = () => {
            console.log('Reviving chicken...');
            this.entity.collidable.set(true);
            this.entity.visible.set(true);
            HealthData_1.healthData.currentHealth = HealthData_1.healthData.maxHealth;
            HealthData_1.healthData.healthValueBinding.set(1);
            HealthData_1.healthData.animationValueBinding.set(1);
            HealthData_1.healthData.isVisible.set(true);
        };
        this.receiveDamage = (amount) => {
            if (HealthData_1.healthData.currentHealth <= 0)
                return;
            HealthData_1.healthData.currentHealth -= amount;
            if (HealthData_1.healthData.currentHealth < 0)
                HealthData_1.healthData.currentHealth = 0;
            const healthRatio = HealthData_1.healthData.currentHealth / HealthData_1.healthData.maxHealth;
            HealthData_1.healthData.healthValueBinding.set(healthRatio);
            HealthData_1.healthData.animationValueBinding.set(ui_1.Animation.timing(healthRatio, {
                duration: 500,
                easing: ui_1.Easing.inOut(ui_1.Easing.ease)
            }));
        };
    }
    preStart() {
        this.hitSfx = this.props.hitSfx?.as(core_1.AudioGizmo);
        this.deathSfx = this.props.deathSfx?.as(core_1.AudioGizmo);
        this.deathVfx = this.props.deathVfx?.as(core_1.ParticleGizmo);
        // Listen for damage events
        this.connectNetworkEvent(this.entity, HealthEvents_1.DamageEvent, this.onDamage);
    }
    start() { }
}
Chicken.propsDefinition = {
    hitSfx: { type: core_1.PropTypes.Entity },
    deathSfx: { type: core_1.PropTypes.Entity },
    deathVfx: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(Chicken);
