**Horizon TypeScript APIs**
When working with TypeScript components, you'll frequently want to use Horizon's APIs, because they are designed to streamline your development process. These custom APIs define objects that represent different entities, provide libraries for common tasks, and frameworks for building scalable applications.
To use a Horizon API, import it from the `horizon/core` module.
All new Worlds use V2 of the TypeScript API by default. We strongly recommend using V2 of the API, as V1 is no longer updated with new features. You can choose between V1 and V2 of the API reference docs in the version selector dropdown at the top of the page.
**Other resources**
* View the online Horizon TypeScript API reference here. Be sure to select the correct version ( **1.0.0** or **2.0.0**) in the version selector dropdown at the top of the page. New worlds use V2 of the API by default.
* If you are new to using TypeScript modules, check out the TypeScript official module documentation.
Horizon API content class list example below:
**Note:** This is only a shapshot of the Classes available to you.
**How to import an API - option 1**

```
import {Vec3, Color} from 'horizon/core';
const v = new Vec3(1, 2, 1);
const c = new Color(1, 0, 0);
```

**How to import an API - option 2**

```
import * as hz from 'horizon/core';
const v = new hz.Vec3(1, 2, 1);
```