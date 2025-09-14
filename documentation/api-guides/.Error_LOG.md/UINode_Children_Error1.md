# Error Log & Best Practices - UINode Children Errors

## Horizon Worlds UI Component Best Practices

### UINode Children Error

**Error**: `Prop 'children' of View component must be a UINode, an array of UINodes, or undefined`

**Problem**:

- Using `Binding.derive()` directly as a child of a View component
- The `derive` method returns `Binding<UINode>`, but View expects actual `UINode` instances
- Passing single UINode to components expecting arrays
- Mixing static and binding-derived children inconsistently

**Common Causes**:

1. **Direct derive as child**:

```typescript
// ❌ WRONG: Using derive directly as a child
children: [
  someBinding.derive((value) => Text({ text: value })), // This causes the error
];
```

2. **Single component instead of array**:

```typescript
// ❌ WRONG: Single component passed directly
ScrollView({
  children: DynamicList({ data: items }), // This causes the error
});
```

3. **Inconsistent return types from derive**:

```typescript
// ❌ WRONG: Returning UINode instead of UINode[]
someBinding.derive((value) => {
  return View({ children: [...] }); // Returns UINode directly
})
```

**Solutions**:

### 1. Container Pattern (Recommended)

```typescript
// ✅ CORRECT: Wrap in container and use derive on children property
View({
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

### 2. Array Wrapping Pattern

```typescript
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

### 3. Component-Level Conditional Rendering (Ultimate Solution)

```typescript
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

**When to Use Each Pattern**:

- **Container Pattern**: For simple conditional rendering within existing layouts
- **Array Wrapping**: For single components that need to be in arrays
- **Component-Level**: For complex conditional UI that changes layout significantly
- **Method-Based**: For extracting complex UI logic into separate render methods

**Testing Checklist**:

- [ ] All derive callbacks return arrays `[UINode, ...]`
- [ ] No derive calls directly in children arrays
- [ ] Single components wrapped in arrays where needed
- [ ] Interactive components (Pressable, Button) use array children
- [ ] Mixed static/binding content uses consistent patterns
- [ ] Complex conditional rendering uses component-level patterns
