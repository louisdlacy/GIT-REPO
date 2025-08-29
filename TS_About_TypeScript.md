**About TypeScript**
This topic explains some of the basics about TypeScript and how it's used to automate entity behavior in Meta Horizon Worlds.
**Overview**
Scripting provides you with a way to add behavior to objects in your Meta Horizon World using TypeScript code. This TypeScript support gives you a way to write scripts more efficiently using traditional programming processes and tools. All you need to do is to create a new TypeScript asset in the desktop editor, type your TypeScript code in VS Code, and then attach it as a component to an object. Using TypeScript expands your development options, and helps you add safety and security to your code.
**What is TypeScript?**
TypeScript is a strongly-typed version of JavaScript. Support for strong typing provides tight integration with your IDE. For more information on the technical aspects of TypeScript, see the TypeScript homepage.
**System requirements**
* Meta Horizon Worlds requires TypeScript version 4.7.4. **Note**: TypeScript version 4.7.4 is the only version of TypeScript that is supported by Meta Horizon Worlds. While you can use other versions of TypeScript, you may encounter issues when you use them with Meta Horizon Worlds APIs.
* All names of your scripts must be unique within a given world.
**TypeScript restrictions**
Meta Horizon Worlds supports all ES2020 features, with the following exceptions:
* Using `eval()` type arrays, or Proxy is not supported
* External JavaScript libraries such as Minified JS, or usng output from a bundler are not generally supported.
* `Entity` objects support referential equality. This means comparisons such as `entity1=== entity2` work as expected.
* You are limited to 64k in script size on worlds that don't use File-Backed Scripts.
**API versions**
All new Meta Horizon worlds use TypeScript API version 2.0 by default. We strongly recommend that you upgrade to this version if you haven't already, because prior versions are no longer updated. For more information on this, see Upgrade World to TypeScript API v2.0.0.
API reference material is available in the API Reference Documentation by clicking the version selector at the top of each reference page.
**Learn more about TypeScript**
To learn more about coding in TypeScript, check-out these online resources:
* TypeScript for the new programmer - Official TypeScript tutorials for both new programmers and developers familiar with other programming languages.
* Online courses - TypeScript tutorials from Execute Program.
* TypeScript is JavaScript with syntax for types - Official TypeScript home page.
* Official TypeScript documentation.