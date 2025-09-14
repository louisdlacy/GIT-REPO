# Importing Data with JSON

In TypeScript, you can use the JavaScript `JSON.parse()` method to parse a JSON string and construct an object described by the string. This enables importing JSON data into Meta Horizon Worlds for use in scripts.

With parsed JSON, variables can be updated within TypeScript code, allowing reuse of JSON values across multiple objects in the world.

## Example
```ts
const secretIdentity =
  '{ "name":"John Smith", "age":45, "occupation": "superhero", "number":"1-800-HELPME"}';

catman = JSON.parse(secretIdentity);
console.log(catman.number);
```
