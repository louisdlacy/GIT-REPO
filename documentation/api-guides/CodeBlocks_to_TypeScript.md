# CodeBlocks to TypeScript

## Target Audience
Creators with an intermediate level skill in codeblocks.

## Recommended Prerequisite Background Knowledge
A basic understanding of CodeBlocks & TypeScript is recommended

## Required Resources
- Quest App Download: Link  
- Microsoft Visual Studio Code: Link  

## Description
This guide aims to make TypeScript more approachable by comparing it to your current knowledge of CodeBlocks. It will guide you through the transition from CodeBlocks to TypeScript, highlighting how TypeScript can significantly improve your programming skills for more flexible and functional script environments.

---

## Learning Objectives
By reading and reviewing this written guide you will be able to:
- Understand how to setup and use TypeScript in your worlds  
- Understand TypeScript Properties, Variables, and Events  
- Translate common CodeBlock scripts into TypeScript  

---

## Part 1: Getting Started

### First Steps
1. Install Microsoft Visual Studio Code  
2. Install Meta Quest App  
3. Open and Sign into Quest App with your Meta Account  
4. Install Meta Horizon Worlds via Quest App Store  
5. Launch Desktop Editor by Clicking on the 3-little-dots ( … ) next to Meta Horizon Worlds in your Library and select **Start in Desktop Mode**  
6. Click the blue **New World** button in the top right corner  
7. Name your world, select the type, and select **Create**  

### Configuring
1. Click the down arrow for the Scripts Panel and select **Create New Script**  
2. Name this script `ExampleScript` and hit Enter.  
3. Click the gear cog icon in the Scripts Panel.  
   - **External Editor**: Default (VS Code)  
   - **External Editor Directory**: Any folder you wish to store all your world’s scripts.  
   - **API Version**: Change to **2.0.0** if not already.  
   - **Other features**: Camera and others can be enabled here.  
   - Click **Apply**.  
4. Hover over your new script, click the 3-dots, and select **Open in External Editor**.  
5. Open in VS Code, select *Yes, I trust the authors*.  

Now you’ll see the default contents of your `ExampleScript.ts`.  

---

## Part 2: Introduction to TypeScript (for CodeBlock Scripters)

| CodeBlocks Term | TypeScript Term |
|-----------------|-----------------|
| Object : Self | Object : `this` / `this.entity` |
| Script | Script |
| Variables | Properties (if read-only) / Variables (inside class) |
| Events | Functions |
| Actions | Methods |

### Example: Base Script
```ts
import * as hz from 'horizon/core';

class ExampleScript extends hz.Component<typeof ExampleScript> {
  static propsDefinition = {};
  preStart() {}

  start() {}
}

hz.Component.register(ExampleScript);
```

Explanation:  
- **Import**: Brings in Horizon API.  
- **Class**: Defines script behavior.  
- **Static propsDefinition**: Holds exposed props.  
- **preStart()**: Runs before start.  
- **start()**: Equivalent to “When world starts” in CodeBlocks.  
- **register**: Required registration.  

---

## TypeScript Properties & Variables

### Examples

- **Number**  
```ts
num: { type: hz.PropTypes.Number, default: 0 }
num: number = 0
```

- **String**  
```ts
str: { type: hz.PropTypes.String, default: 'Hello World' }
str: string = 'Hello World'
```

- **Boolean**  
```ts
bool: { type: hz.PropTypes.Boolean, default: false }
bool: boolean = false
```

- **Vec3**  
```ts
vec: { type: hz.PropTypes.Vec3, default: new hz.Vec3(0,0,0) }
vec: hz.Vec3 = new hz.Vec3(0,0,0)
```

- **Color**  
```ts
_color: { type: hz.PropTypes.Color, default: new hz.Color(0,0,0)}
_color: hz.Color = new hz.Color(0,0,0)
```

- **Entity**  
```ts
obj: { type: hz.PropTypes.Entity }
obj: hz.Entity | null = null
```

- **Quaternion**  
```ts
rot: { type: hz.PropTypes.Quaternion, default: new hz.Quaternion(0,0,0,1) }
rot: hz.Quaternion = new hz.Quaternion(0,0,0,1)
```

- **Player**  
```ts
p: { type: hz.PropTypes.Player, default: this.world.getServerPlayer()}
p: hz.Player | null = null
```

---

## Event Types

- **Built-in CodeBlocks**
```ts
this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this))
```

- **CodeBlock Events**
```ts
this.connectCodeBlockEvent(this.entity,new hz.CodeBlockEvent('codeblockEventName',[]),this.onCodeblockEventName.bind(this))
```

- **Local Events**
```ts
this.connectLocalEvent(this.entity,new hz.LocalEvent('eventName'),this.onEventName.bind(this))
```

- **Network Events**
```ts
this.connectNetworkEvent(this.entity,new hz.NetworkEvent('networkEvent'),this.onNetworkEvent.bind(this))
```

- **Broadcast Events**
```ts
this.connectLocalBroadcastEvent(new hz.LocalEvent('localBroadcastEvent'),this.onLocalBroadcastEvent.bind(this))
this.connectNetworkBroadcastEvent(new hz.NetworkEvent('networkBroadcastEvent'),this.onNetworkBroadcastEvent.bind(this))
```

---

## Part 3: Sending Events

### basicScriptA.ts
```ts
import * as hz from 'horizon/core'

class basicScriptA extends hz.Component<typeof basicScriptA> {
  static propsDefinition = {
    exampleObject: { type: hz.PropTypes.Entity },
  }

  private exampleWriteableString: string = "Hello World! #3"

  start() {
    if(this.props.exampleObject){
      this.sendCodeBlockEvent(this.props.exampleObject, new hz.CodeBlockEvent('codeblockEventName',[]))
      this.sendCodeBlockEvent(this.props.exampleObject, new hz.CodeBlockEvent('codeblockEventNameParams',[hz.PropTypes.String]), "Hello World!")
      this.sendLocalEvent(this.props.exampleObject, new hz.LocalEvent<{s: string}>('eventNameParams2'), {s: "Hello World! #2"})
      this.sendLocalEvent(this.props.exampleObject, new hz.LocalEvent<{s: string}>('eventNameParams3'), {s: this.exampleWriteableString})
      this.sendNetworkEvent(this.props.exampleObject, new hz.NetworkEvent('networkEvent'), {})
    }
    this.sendLocalBroadcastEvent(new hz.LocalEvent('localBroadcastEvent'), {})
    this.sendNetworkBroadcastEvent(new hz.NetworkEvent('networkBroadcastEvent'), {})
  }
}

hz.Component.register(basicScriptA)
```

### basicScriptB.ts
```ts
import * as hz from 'horizon/core'

class basicScriptB extends hz.Component<typeof basicScriptB> {
  preStart(){
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this))
    this.connectCodeBlockEvent(this.entity, new hz.CodeBlockEvent('codeblockEventName',[]), this.onCodeblockEventName.bind(this))
    this.connectLocalEvent(this.entity, new hz.LocalEvent('eventName'), this.onEventName.bind(this))
    this.connectNetworkEvent(this.entity, new hz.NetworkEvent('networkEvent'), this.onNetworkEvent.bind(this))
  }

  onPlayerEnterWorld(p: hz.Player){ console.log(p.name.get() + " entered the world!") }
  onCodeblockEventName(){ console.log("codeblockEventName was triggered!") }
  onEventName(){ console.log("eventName was triggered!") }
  onNetworkEvent(){ console.log("networkEvent was triggered!") }
}

hz.Component.register(basicScriptB)
```

---

## Part 4: Basic Codeblock Conversions

### SimpleRespawnScript.ts
```ts
import * as hz from 'horizon/core';

class simpleRespawnScript extends hz.Component<typeof simpleRespawnScript> {
  static propsDefinition = { respawn: { type: hz.PropTypes.Entity } };

  preStart() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
  }

  OnPlayerEnterTrigger(p: hz.Player) {
    this.props.respawn?.as(hz.SpawnPointGizmo)?.teleportPlayer(p);
  }
}
hz.Component.register(simpleRespawnScript);
```

### SimpleObjectGrab.ts
```ts
import * as hz from 'horizon/core';

class SimpleObjectGrab extends hz.Component<typeof SimpleObjectGrab> {
  private resetTimer: number = 0
  private originalPosition: hz.Vec3 = new hz.Vec3(0, 0, 0)
  private originalRotation: hz.Quaternion = new hz.Quaternion(0, 0, 0, 1)

  preStart(){
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, this.OnGrabStart.bind(this))
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, this.OnGrabEnd.bind(this))
  }

  start() {
    this.originalPosition = this.entity.position.get()
    this.originalRotation = this.entity.rotation.get()
  }

  OnGrabStart(r: boolean, p: hz.Player ) { this.async.clearTimeout(this.resetTimer) }

  OnGrabEnd(p: hz.Player) {
    this.resetTimer = this.async.setTimeout(() => {
      this.entity.position.set(this.originalPosition)
      this.entity.rotation.set(this.originalRotation)
    }, 5000)
  }
}

hz.Component.register(SimpleObjectGrab)
```

### VIPorStageScript.ts
```ts
import * as hz from 'horizon/core';

class VIPorStageScript extends hz.Component<typeof VIPorStageScript> {
  static propsDefinition = {
    respawn: { type: hz.PropTypes.Entity },
    vipList: { type: hz.PropTypes.StringArray, default: ['SeeingBlue', 'Mutts_Mutts_Mutts', 'burnbuns', 'gausroth'] },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
  }

  OnPlayerEnterTrigger(p: hz.Player) {
    if (!this.props.vipList.includes(p.name.get())) {
      this.props.respawn?.as(hz.SpawnPointGizmo)?.teleportPlayer(p);
    }
  }
}

hz.Component.register(VIPorStageScript);
```

---

## Further Assistance
For additional support, join the **Meta Horizon Worlds Discord** or schedule a **Mentor Session** for guidance.
