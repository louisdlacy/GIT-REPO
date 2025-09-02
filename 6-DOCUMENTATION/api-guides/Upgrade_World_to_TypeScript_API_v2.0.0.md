# Upgrade World to TypeScript API v2.0.0

If you have created a world using a previous version of the TypeScript API, we strongly recommend upgrading to API v2.0.0 for the following reasons:
- All new API features land in v2.0.0 first.
- Future development and bug fixes are focused on v2.0.0.
- Previous versions are no longer updated.

This doc outlines changes to address most issues during upgrade.  
See official Meta documentation: **Meta Horizon TypeScript V2 changes**.

---

## Upgrading Your World

### Steps
1. Clone your world. Append **v2.0.0** to the name.  
   Example: *My World v2.0.0*  
2. Open in the desktop editor.  
3. Click the scripts icon.  
4. In the Scripts panel, click the **Settings** icon.  
5. Note all API modules from prior versions.  
   > ⚠️ These remain enabled after switching to v2.0.0. Map them to v2.0.0 equivalents and disable old ones.  
6. Select **2.0.0** from the API version list.  
7. Enable required API modules.  
8. Click **Apply**.  

---

## Fixing Script Validation Errors

### Recommended Workflow
- Fix errors file by file.  
- Start with simple/testable files.  
- Comment out old lines, add updated code.  

### Fix Imports

**General**
- Search: `@early_access_api/`  
- Replace: `horizon/`  

**Example**
```ts
// Prior
import { UIComponent, View, Text } from "@early_access_api/ui";
// New
import { UIComponent, View, Text } from "horizon/ui";
```

**/v1 → /core**
- Search: `horizon/v1`  
- Replace: `horizon/core`  

**Example**
```ts
// Prior
import * as hz from 'horizon/v1';
// New
import * as hz from 'horizon/core';
```

---

### Fix Props and Class Declarations
- Remove type declarations outside class.  
- Use `<typeof MyClassName>` in class.  
- No type info needed in `propsDefinition`.  

**Prior**
```ts
type UIComponentGetCandyProps = {
  triggerZone: hz.Entity
};

class UIComponentGetCandy extends UIComponent {
  static propsDefinition: hz.PropsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }
  };
}
```

**API v2.0.0**
```ts
class UIComponentGetCandy extends UIComponent<typeof UIComponentGetCandy> {
  static propsDefinition = {
    triggerZone: { type: hz.PropTypes.Entity }
  };
}
```

---

### Fix Property References
In v2.0.0, property references cannot be passed directly. Capture first:

**Prior**
```ts
myVar = myFunction(this.props.triggerZone);
```

**New**
```ts
let mv: hz.Entity | undefined = this.props.triggerZone;
myVar = myFunction(mv);
```

---

### Upgrade Events
Event names have changed. `HorizonEvent` type removed. Use `LocalEvent` or `NetworkEvent`.

| Previous Event             | API v2.0.0 Event         |
|-----------------------------|--------------------------|
| sendNetworkEntityEvent      | sendNetworkEvent         |
| sendEntityEvent             | sendLocalEvent           |
| connectEntityEvent          | connectLocalEvent        |
| connectBroadcastEvent       | connectLocalBroadcastEvent |
| sendBroadcastEvent          | sendLocalBroadcastEvent  |

---

## Iterate and Test
- Above changes fix most validation errors.  
- Debug/test remaining errors.  
- Test scripts individually as you fix.  
- Add test code/debugger logs to confirm proper execution.  
