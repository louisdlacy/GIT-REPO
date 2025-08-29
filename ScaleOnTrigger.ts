// Import the necessary modules from the Horizon Worlds core API.
import * as hz from 'horizon/core';

class ScaleOnTrigger extends hz.Component<typeof ScaleOnTrigger> {
    static propsDefinition = {
        targetEntity: { type: hz.PropTypes.Entity },
        targetScale: { type: hz.PropTypes.Vec3, default: new hz.Vec3(1, 0.5, 1) },
        duration: { type: hz.PropTypes.Number, default: 0.25 },
        returnToStartScale: { type: hz.PropTypes.Boolean, default: true },
        triggerType: { type: hz.PropTypes.String, default: "Player Only" },
    };

    private originalScale!: hz.Vec3;
    private triggerGizmo!: hz.TriggerGizmo;

    start() {
        this.triggerGizmo = this.entity.as(hz.TriggerGizmo);
        if (!this.triggerGizmo || !this.props.targetEntity) {
            console.error("[ScaleOnTrigger] HALTED: Script must be on a Trigger Gizmo with a valid Target Entity.");
            return;
        }

        // --- STEP 1: SCRIPT INITIALIZATION LOGS ---
        console.log("------------------------------------");
        console.log("[ScaleOnTrigger] LOG: Script is starting up...");
        console.log(`[ScaleOnTrigger] LOG: Attached to Trigger Gizmo: ${this.entity.name.get()}`);
        console.log(`[ScaleOnTrigger] LOG: Watching Target Entity: ${this.props.targetEntity.name.get()}`);
        console.log(`[ScaleOnTrigger] LOG: Trigger Type set to: "${this.props.triggerType}"`);
        
        this.originalScale = this.props.targetEntity.scale.get();

        // Connect events to handler functions
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnEntityEnterTrigger, this.handleEntityEnter.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnEntityExitTrigger, this.handleEntityExit.bind(this));
        
        console.log("[ScaleOnTrigger] LOG: Now listening for entity trigger events.");
        console.log("------------------------------------");
    }

    private handleEntityEnter(enteredBy: hz.Entity) {
        // --- STEP 2: TRIGGER FIRING LOG ---
        console.log(`[ScaleOnTrigger] EVENT FIRED: Entity '${enteredBy.name.get()}' entered the trigger zone.`);
        
        const triggerType = this.getTriggerTypeFromString(this.props.triggerType);
        
        if (triggerType !== 1 && triggerType !== 2) {
            console.log(`[ScaleOnTrigger] CHECK FAILED: Ignoring entry because triggerType is not "Entity Only" or "Both".`);
            return;
        }

        if (enteredBy.id === this.props.targetEntity!.id) {
            console.log(`[ScaleOnTrigger] CHECK PASSED: Entered entity matches target. Starting scale animation.`);
            this.animateScale(this.props.targetScale);
        } else {
            console.log(`[ScaleOnTrigger] CHECK FAILED: The entered entity ('${enteredBy.name.get()}') does not match the target entity ('${this.props.targetEntity!.name.get()}').`);
        }
    }
    
    private handleEntityExit(exitedBy: hz.Entity) {
        console.log(`[ScaleOnTrigger] EVENT FIRED: Entity '${exitedBy.name.get()}' exited the trigger zone.`);
        const triggerType = this.getTriggerTypeFromString(this.props.triggerType);

        if ((triggerType === 1 || triggerType === 2) && exitedBy.id === this.props.targetEntity!.id && this.props.returnToStartScale) {
            console.log(`[ScaleOnTrigger] CHECK PASSED: Target entity exited. Resetting scale.`);
            this.animateScale(this.originalScale);
        }
    }

    private animateScale(newTargetScale: hz.Vec3) {
        // --- STEP 3: ANIMATION LOG ---
        console.log(`[ScaleOnTrigger] ACTION: Starting animation to scale: ${newTargetScale.toString()}`);
        // ... (animation code remains the same)
        const startScale = this.props.targetEntity!.scale.get();
        let elapsedTime = 0;

        const updateSubscription = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data: {deltaTime: number}) => {
            elapsedTime += data.deltaTime;
            let progress = Math.min(elapsedTime / this.props.duration, 1.0);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentScale = hz.Vec3.lerp(startScale, newTargetScale, easedProgress);
            this.props.targetEntity!.scale.set(currentScale);

            if (progress >= 1.0) {
                updateSubscription.disconnect();
            }
        });
    }
    
    private getTriggerTypeFromString(triggerType: string): number {
        const lowerCaseType = triggerType.toLowerCase().trim();
        switch (lowerCaseType) {
            case "entity only": return 1;
            case "both": return 2;
            case "player only":
            default: return 0;
        }
    }
}

hz.Component.register(ScaleOnTrigger);