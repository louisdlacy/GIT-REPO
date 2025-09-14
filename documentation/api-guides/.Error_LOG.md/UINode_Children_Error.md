# Error Log & Best Practices

## Horizon Worlds UI Component Best Practices

### 1. View Component Children Error

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`

**Problem**:

- Using `Binding.derive()` directly as a child of a View component
- The `derive` method returns `Binding<UINode>`, but View expects actual `UINode` instances

**Solution**:

```typescript
// ❌ WRONG: Using derive directly as a child
return View({
  children: [
    someBinding.derive((value) => Text({ text: value })), // This causes the error
  ],
});

// ✅ CORRECT: Wrap in container and use derive on children property
return View({
  children: [
    View({
      style: { flex: 1 },
      children: someBinding.derive((value) => [
        Text({ text: value }), // Always return array of UINodes
      ]),
    }),
  ],
});
```

**Best Practices**:

1. **Always return arrays** from `derive` callbacks, even for single elements: `[Text(...)]`
2. **Use container Views** when you need conditional rendering with bindings
3. **Place `derive` calls on the `children` property** of the immediate parent, not as direct children
4. **Test UI components** in isolation to catch these runtime errors early

### 1.1 ScrollView Children Error (Related)

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`
(Same error but different cause)

**Problem**:

- Passing a single UINode directly to ScrollView's `children` property
- ScrollView expects an array of UINodes, not a single component

**Solution**:

```typescript
// ❌ WRONG: Single component passed directly
ScrollView({
  children: DynamicList({
    data: this.shopItems,
    renderItem: this.renderShopItem,
  }), // This causes the error
});

// ✅ CORRECT: Wrap single component in array
ScrollView({
  children: [
    DynamicList({
      data: this.shopItems,
      renderItem: this.renderShopItem,
    }),
  ], // Array of UINodes
});
```

**Best Practices**:

1. **Always wrap single components in arrays** when the parent expects `UINode[]`
2. **Check component documentation** for children property expectations
3. **Use arrays consistently** even for single children to avoid type issues
4. **Apply this pattern to all container components** (ScrollView, View, etc.)

### 1.2 Derive Call Returning Components vs Arrays (Advanced)

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`
(Same error message, different root cause)

**Problem**:

- Using `derive` calls that return complete UINode components instead of arrays
- The component system expects consistent array returns from derive callbacks
- Mixing direct component returns with array expectations

**Solution**:

```typescript
// ❌ WRONG: Derive returning complete components as direct children
children: [
  someBinding.derive((value) => {
    if (value) {
      return View({ children: [...] }); // Returns UINode directly
    }
    return View({ children: [...] }); // Returns UINode directly
  })
]

// ✅ CORRECT: Container with derive on children property returning arrays
View({
  style: { flex: 1 },
  children: someBinding.derive((value) => {
    if (value) {
      return [Text({ text: "Option A" })]; // Returns array of UINodes
    }
    return [ScrollView({ children: [...] })]; // Returns array of UINodes
  }),
})
```

**Best Practices**:

1. **Never use derive calls as direct children** - always put them on a container's children property
2. **Always return arrays from derive callbacks** - even for single components: `[Component()]`
3. **Use the container pattern consistently** - `View({ children: binding.derive(...) })`
4. **Maintain consistency in return types** - all branches should return arrays of the same structure
5. **Test conditional rendering thoroughly** - ensure all code paths work correctly

### 1.3 Summary of UINode Children Patterns

**The Golden Rules**:

1. **Container Pattern**: Always use `View({ children: binding.derive(...) })` for conditional rendering
2. **Array Returns**: Derive callbacks must always return `UINode[]`, never single `UINode`
3. **No Direct Derives**: Never put `derive()` calls directly in children arrays
4. **Consistent Wrapping**: Wrap single components in arrays when required by parent
5. **Interactive Components**: Apply array wrapping to ALL components - View, ScrollView, Pressable, Button, etc.
6. **Mixed Content**: Use consistent container wrapping when mixing static and binding-derived children

**Universal Pattern for All Components**:

```typescript
// ✅ Always use this pattern for ANY component with children:
AnyComponent({
  // ... props
  children: [ChildComponent1(), ChildComponent2()], // Always an array, even for single children
});
```

**Common Mistake Pattern**:

```typescript
// ❌ This pattern causes UINode children errors:
children: [
  binding.derive(() => Component()), // Direct derive as child
  Component2(),
];

// ✅ Use this pattern instead:
children: [
  View({
    children: binding.derive(() => [Component()]), // Container with derive
  }),
  Component2(),
];
```

### 1.4 Interactive Component Children Error (Pressable, Button, etc.)

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`
(Same error message, affects interactive components)

**Problem**:

- Passing single UINode to Pressable's `children` property instead of array
- Interactive components (Pressable, Button, etc.) expect arrays just like container components
- Error can be misleading as it points to parent View rather than the actual Pressable

**Solution**:

```typescript
// ❌ WRONG: Single component passed to Pressable
Pressable({
  style: buttonStyle,
  onClick: () => handleClick(),
  children: Text({
    text: "Click me",
    style: textStyle,
  }), // This causes the error
});

// ✅ CORRECT: Wrap in array
Pressable({
  style: buttonStyle,
  onClick: () => handleClick(),
  children: [
    Text({
      text: "Click me",
      style: textStyle,
    }),
  ], // Array of UINodes
});
```

**Best Practices**:

1. **Apply array wrapping to ALL interactive components** - Pressable, Button, TouchableOpacity, etc.
2. **Check render methods carefully** - errors in DynamicList renderItem functions can be hard to trace
3. **Error location debugging** - UINode errors often point to parent containers, not the actual problem component
4. **Consistent patterns** - treat all UI components the same way regarding children arrays
5. **Test interactive elements** - click handlers and dynamic rendering can mask these errors

6. **Apply consistently** to all interactive components in your UI

### 1.5 Mixed Binding and Static Children Error (Advanced)

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`
(Same error message, caused by mixing binding-derived and static children)

**Problem**:

- Mixing static UINodes with binding-derived components in the same children array
- Inconsistent child types can cause type validation issues
- Direct Text components with bindings alongside derived Views

**Solution**:

```typescript
// ❌ WRONG: Mixing static and derived children inconsistently
View({
  children: [
    View({ children: [...] }), // Static View
    View({ children: binding.derive(...) }), // Derived View
    Text({ text: binding }), // Direct binding usage - can cause issues
  ]
});

// ✅ CORRECT: Consistent wrapping for all binding-related children
View({
  children: [
    View({ children: [...] }), // Static View
    View({ children: binding.derive(...) }), // Derived View
    View({ // Wrap binding-using components consistently
      children: [
        Text({ text: binding }),
      ]
    }),
  ]
});
```

**Best Practices**:

1. **Wrap all binding-dependent components** in container Views for consistency
2. **Maintain uniform child structure** - avoid mixing direct components with derived ones
3. **Use container pattern everywhere** when bindings are involved
4. **Test mixed content scenarios** thoroughly
5. **Consider refactoring complex mixed layouts** into separate sub-components

6. **Test all permutations** to ensure consistent behavior across different states

### 1.6 Method-Based Conditional Rendering (Recommended Solution)

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`
(Persistent errors with complex conditional rendering)

**Problem**:

- Complex inline derive logic with array returns causing persistent validation issues
- Mixing conditional rendering patterns in the same component
- TypeScript struggling with complex derive callback return types

**Solution**:

```typescript
// ❌ PROBLEMATIC: Complex inline conditional rendering
View({
  children: this.isLoading.derive((loading) => {
    if (loading) {
      return [Text({ text: "Loading..." })]; // Complex array logic
    }
    return [ScrollView({ children: [...] })]; // Mixed return types
  }),
})

// ✅ RECOMMENDED: Method-based conditional rendering
class MyComponent {
  private renderLoadingContent(): UINode {
    return Text({ text: "Loading..." });
  }

  private renderMainContent(): UINode {
    return ScrollView({ children: [...] });
  }

  render() {
    return View({
      children: [
        this.isLoading.derive((loading) => {
          return loading ? this.renderLoadingContent() : this.renderMainContent();
        }),
      ],
    });
  }
}
```

**Best Practices**:

1. **Extract complex UI logic** into separate render methods
2. **Use single UINode returns** instead of array returns when possible
3. **Simplify derive callbacks** to single ternary operations
4. **Improve code organization** and reusability
5. **Easier debugging** - each state has its own method
6. **Better TypeScript inference** with simpler return types

7. **Easier debugging** with clearer component structure

### 1.7 Component-Level Conditional Rendering (Ultimate Solution)

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`
(Persistent errors even with method-based approaches)

**Problem**:

- Even method-based conditional rendering within children arrays can cause type issues
- Complex derive calls nested inside View children properties
- TypeScript and runtime validation struggling with nested derive patterns

**Solution**:

```typescript
// ❌ STILL PROBLEMATIC: Method-based but still nested in children
View({
  children: [
    this.isLoading.derive((loading) => {
      return loading ? this.renderLoadingContent() : this.renderMainContent();
    }),
  ],
});

// ✅ ULTIMATE SOLUTION: Component-level conditional rendering
this.isLoading.derive((loading) => {
  if (loading) {
    return View({
      style: { flex: 1 },
      children: [this.renderLoadingContent()],
    });
  }
  return View({
    style: { flex: 1 },
    children: [this.renderMainContent()],
  });
});
```

**Best Practices**:

1. **Move derive to component level** - not nested in children arrays
2. **Return complete View components** from each branch
3. **Wrap render methods in proper children arrays** within each returned View
4. **Use explicit if/else structure** instead of ternary for complex logic
5. **Eliminate nested derive calls** completely
6. **Treat each conditional branch** as a separate component tree

**When to Use This Pattern**:

- When method-based approaches still cause errors
- For complex conditional UI that changes layout significantly
- When TypeScript inference fails with nested patterns
- As the most reliable fallback solution

## 2. NetworkEvent Serialization Issues

**Problem**:

- Custom interfaces not satisfying `SerializableState` constraint
- TypeScript compilation errors with NetworkEvent types

**Solution**:

```typescript
// ❌ WRONG: Interface without index signature
interface MyData {
  name: string;
  value: number;
}

// ✅ CORRECT: Add index signature for serialization
interface MyData {
  name: string;
  value: number;
  [key: string]: any; // Required for SerializableState compatibility
}
```

**Best Practices**:

1. **Add index signatures** `[key: string]: any` to all interfaces used with NetworkEvent
2. **Use strings instead of bigint** for serializable data (convert when needed)
3. **Test network events** thoroughly to ensure data serializes correctly

### 3. Asset Handling Best Practices

**Problem**:

- BigInt values not serializable over network
- TextureAsset constructor expecting bigint but receiving string

**Solution**:

```typescript
// Store as string for serialization
interface ItemData {
  thumbnailId: string; // Store as string
  thumbnailVersionId: string;
}

// Convert when creating TextureAsset
const asset = new TextureAsset(
  BigInt(item.thumbnailId),
  BigInt(item.thumbnailVersionId)
);
```

**Best Practices**:

1. **Store asset IDs as strings** in serializable data structures
2. **Convert to BigInt** only when constructing TextureAsset objects
3. **Handle null/undefined cases** with fallback values: `BigInt(id || '0')`

### 4. API Integration Best Practices

**Problem**:

- Using non-existent API methods
- Runtime errors from missing inventory functions

**Solution**:

```typescript
// ❌ WRONG: Using non-existent API
await this.world.getWorldInventory().getPlayerEntitlementQuantity(player, sku);

// ✅ CORRECT: Use placeholder with clear comments
// TODO: Replace with actual Horizon Worlds inventory API
const quantity = sku === "coins" ? 1000 : 0; // Placeholder logic
```

**Best Practices**:

1. **Verify API availability** before using methods
2. **Use clear placeholder logic** with TODO comments
3. **Implement graceful fallbacks** for missing APIs
4. **Document required integrations** for future implementation

### 5. CSS/Styling Best Practices

**Problem**:

- Using unsupported CSS properties in ViewStyle
- Runtime errors from invalid style properties

**Solution**:

```typescript
// ❌ WRONG: Using unsupported property
const style: ViewStyle = {
  borderBottomColor: "#ffffff", // Not supported in Horizon Worlds
};

// ✅ CORRECT: Remove unsupported properties with comments
const style: ViewStyle = {
  borderBottomWidth: 1,
  // Note: borderBottomColor not supported in Horizon Worlds ViewStyle
};
```

**Best Practices**:

1. **Check ViewStyle documentation** for supported properties
2. **Remove unsupported CSS properties** rather than leave them
3. **Add comments** explaining why certain styles are omitted
4. **Test styling** in the actual Horizon Worlds environment

### 6. General Debugging Workflow

1. **Read error messages carefully** - they often point to the exact line and issue
2. **Check TypeScript compilation** before runtime testing
3. **Use placeholder implementations** to isolate UI issues from API issues
4. **Test components incrementally** - start simple and add complexity
5. **Document known limitations** and workarounds for team members

### 7. Code Organization Best Practices

1. **Separate UI and server logic** into different components
2. **Use clear interface definitions** with proper serialization support
3. **Add comprehensive comments** for complex UI patterns
4. **Keep binding logic simple** and easy to debug
5. **Structure conditional rendering** clearly with container components
