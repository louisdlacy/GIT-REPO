import { healthData } from 'HealthData';
import { DamageEvent } from 'HealthEvents';
import { Component, PropTypes, AudioGizmo, ParticleGizmo } from 'horizon/core';
import { Animation, Easing } from 'horizon/ui';

class Chicken extends Component<typeof Chicken> {
  static propsDefinition = {
    hitSfx: { type: PropTypes.Entity },
    deathSfx: { type: PropTypes.Entity },
    deathVfx: { type: PropTypes.Entity }
  };

  hitSfx?: AudioGizmo;

  deathSfx?: AudioGizmo;
  deathVfx?: ParticleGizmo;

  preStart() {
    this.hitSfx = this.props.hitSfx?.as(AudioGizmo);
    this.deathSfx = this.props.deathSfx?.as(AudioGizmo);
    this.deathVfx = this.props.deathVfx?.as(ParticleGizmo);

    // Listen for damage events
    this.connectNetworkEvent(this.entity, DamageEvent, this.onDamage);
  }

  start() { }

  private onDamage = (data: { amount: number }) => {
    this.receiveDamage(data.amount);

    this.hitSfx?.play();

    if (healthData.currentHealth === 0) {
      this.onDeath();
    }
  }

  private onDeath = () => {
    this.deathSfx?.play();
    this.deathVfx?.play();

    this.entity.collidable.set(false);
    this.entity.visible.set(false);

    this.async.setTimeout(() => {
      healthData.isVisible.set(false);
    }, 600);

    this.async.setTimeout(() => {
      this.revive();
    }, 3000); //3 seconds before revival
  }

  private revive = () => {
    console.log('Reviving chicken...');
    this.entity.collidable.set(true);
    this.entity.visible.set(true);

    healthData.currentHealth = healthData.maxHealth;
    healthData.healthValueBinding.set(1);
    healthData.animationValueBinding.set(1);
    healthData.isVisible.set(true);
  }

  receiveDamage = (amount: number) => {
    if (healthData.currentHealth <= 0) return;
    healthData.currentHealth -= amount;
    if (healthData.currentHealth < 0) healthData.currentHealth = 0;
    const healthRatio = healthData.currentHealth / healthData.maxHealth;
    healthData.healthValueBinding.set(healthRatio);
    healthData.animationValueBinding.set(
      Animation.timing(healthRatio, {
        duration: 500,
        easing: Easing.inOut(Easing.ease)
      })
    );
  }
}
Component.register(Chicken);