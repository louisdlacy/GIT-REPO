// Import the necessary modules from the Horizon Worlds core API.
import * as hz from 'horizon/core';

/**
 * A powerful, all-in-one component to trigger sound, particle, and/or trail
 * effects when a player or a specific entity enters its trigger zone.
 */
class EffectOnTrigger extends hz.Component<typeof EffectOnTrigger> {
    // -- PROPERTIES --
    static propsDefinition = {
        // --- Effect Toggles & Gizmos ---
        enableSound: { type: hz.PropTypes.Boolean, default: true },
        soundEffect: { type: hz.PropTypes.Entity },
        enableParticles: { type: hz.PropTypes.Boolean, default: false },
        particleEffect: { type: hz.PropTypes.Entity },
        enableTrail: { type: hz.PropTypes.Boolean, default: false },
        trailEffect: { type: hz.PropTypes.Entity },

        // --- Trigger Logic ---
        // MODIFIED: Now a String. e.g., "Player Only", "Entity Only", "Both".
        triggerType: { type: hz.PropTypes.String, default: "Player Only" },
        triggeringEntity: { type: hz.PropTypes.Entity },

        // --- Behavior Controls ---
        // MODIFIED: Now a String. e.g., "Everyone", "Triggering Player Only".
        playEffectFor: { type: hz.PropTypes.String, default: "Everyone" },
        allowRetrigger: { type: hz.PropTypes.Boolean, default: false },
        playOnExit: { type: hz.PropTypes.Boolean, default: false }
    };

    // -- STATE VARIABLES --
    private triggerGizmo!: hz.TriggerGizmo;
    private soundGizmo?: hz.AudioGizmo;
    private particleGizmo?: hz.ParticleGizmo;
    private trailGizmo?: hz.TrailGizmo;
    private canPlay: boolean = true;

    start() {
        this.triggerGizmo = this.entity.as(hz.TriggerGizmo);

        if (this.props.enableSound && this.props.soundEffect) this.soundGizmo = this.props.soundEffect.as(hz.AudioGizmo);
        if (this.props.enableParticles && this.props.particleEffect) this.particleGizmo = this.props.particleEffect.as(hz.ParticleGizmo);
        if (this.props.enableTrail && this.props.trailEffect) this.trailGizmo = this.props.trailEffect.as(hz.TrailGizmo);

        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.handlePlayerEnter.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnEntityEnterTrigger, this.handleEntityEnter.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnPlayerExitTrigger, this.handleExit.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnEntityExitTrigger, this.handleExit.bind(this));
    }

    private handlePlayerEnter(player: hz.Player) {
        const triggerType = this.getTriggerTypeFromString(this.props.triggerType);
        if (triggerType === 0 || triggerType === 2) {
            if (this.canPlay) {
                if (!this.props.allowRetrigger) this.canPlay = false;
                this.triggerEffects(player);
            }
        }
    }

    private handleEntityEnter(enteredEntity: hz.Entity) {
        const triggerType = this.getTriggerTypeFromString(this.props.triggerType);
        if (triggerType === 1 || triggerType === 2) {
            if (this.props.triggeringEntity && this.props.triggeringEntity.id === enteredEntity.id) {
                if (this.canPlay) {
                    if (!this.props.allowRetrigger) this.canPlay = false;
                    this.triggerEffects(); // Entity effects are always global
                }
            }
        }
    }

    private handleExit(exitedBy: hz.Entity | hz.Player) {
        this.canPlay = true; // Always reset on exit
        if (this.props.playOnExit) {
            const player = exitedBy instanceof hz.Player ? exitedBy : undefined;
            this.triggerEffects(player);
        }
    }

    private triggerEffects(player?: hz.Player) {
        const playEffectFor = this.getPlayEffectForFromString(this.props.playEffectFor);
        const isPlayerSpecific = playEffectFor === 1 && player;
        
        if (this.soundGizmo) {
            const options: hz.AudioOptions = { fade: 0 };
            if (isPlayerSpecific) options.players = [player!];
            this.soundGizmo.play(options);
        }

        if (this.particleGizmo) {
            const options: hz.ParticleFXPlayOptions = {};
            if (isPlayerSpecific) options.players = [player!];
            this.particleGizmo.play(options);
        }

        if (this.trailGizmo) {
            this.trailGizmo.play();
        }
    }

    // --- STRING CONVERSION HELPERS ---
    private getTriggerTypeFromString(triggerType: string): number {
        const lowerCaseType = triggerType.toLowerCase().trim();
        switch (lowerCaseType) {
            case "entity only": return 1;
            case "both": return 2;
            case "player only": default: return 0;
        }
    }

    private getPlayEffectForFromString(playFor: string): number {
        const lowerCasePlayFor = playFor.toLowerCase().trim();
        if (lowerCasePlayFor === "triggering player only") {
            return 1;
        }
        return 0; // Default to "Everyone"
    }
}

hz.Component.register(EffectOnTrigger);