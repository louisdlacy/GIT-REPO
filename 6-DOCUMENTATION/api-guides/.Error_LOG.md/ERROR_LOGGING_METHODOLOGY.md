# Error Logging Methodology Prompt

## Overview

Use this prompt whenever you encounter errors in Horizon Worlds TypeScript development to create systematic, reusable error documentation that follows established patterns and best practices.

---

## 🎯 **PROMPT FOR AI ASSISTANT**

````
I need help creating systematic error logs for my Horizon Worlds TypeScript project. Please analyze the code issues and create error documentation following this methodology:

### ERROR LOGGING REQUIREMENTS:

1. **FOLDER STRUCTURE**:
   - **PRIMARY LOCATION**: Store ALL logs in Git Repo's `.Error_LOG.md/` folder
   - **LOCAL COPY**: Maintain copy in local `error_logs/` folder for immediate reference
   - Files should be named by ERROR TYPE, not component name
   - Format: `[Error_Category]_Error.md` (e.g., `Binding_API_Error.md`, `UINode_Children_Error.md`)
   - **DUPLICATION PREVENTION**: Always scan existing logs before creating new ones

2. **FILE NAMING CONVENTION**:
   ✅ CORRECT: `Component_Structure_Error.md`, `Event_System_Error.md`
   ❌ WRONG: `MyComponent_Errors.md`, `ProjectName_Issues.md`

3. **TEMPLATE STRUCTURE** (Use this exact format):
   ```markdown
   # Error Log & Best Practices - [Error Category Name]

   ## Horizon Worlds [Technology Area] Best Practices

   ### [Specific Error Type]

   **Common Errors**:
   - List of typical error messages (exact text in backticks)
   - Runtime behavior descriptions
   - Development workflow issues

   **Problem**:
   Brief explanation of why this error occurs and its impact.

   **Common Causes**:

   1. **[Cause Name]**:
   ```typescript
   // ❌ WRONG: [Description of incorrect pattern]
   [bad code example]
````

2.  **[Another Cause]**:

```typescript
// ❌ WRONG: [Description of another incorrect pattern]
[another bad code example]
```

**Solutions**:

### 1. [Solution Name] (Recommended/Ultimate/etc.)

```typescript
// ✅ CORRECT: [Description of correct pattern]
[good code example with detailed comments]
```

### 2. [Alternative Solution Name]

```typescript
// ✅ CORRECT: [Description of alternative approach]
[alternative good code example]
```

**Best Practices**:

1.  **[Practice Category]**:

```typescript
// ✅ [Description of best practice pattern]
[example code]
```

**Testing Checklist**:

- [ ] [Specific validation point]
- [ ] [Another validation point]
- [ ] [etc.]

```

4. **CONTENT REQUIREMENTS**:
- Focus on ERROR TYPES, not specific components
- Provide GENERAL solutions that work across projects
- Include MULTIPLE solution approaches (basic → advanced)
- Add comprehensive BEST PRACTICES section
- Create actionable TESTING CHECKLISTS
- Use consistent emoji conventions (❌ for wrong, ✅ for correct)

5. **CATEGORIES TO COVER**:
- `UINode_Children_Error.md` - UI component structure issues
- `Binding_API_Error.md` - Data binding and state management
- `Event_System_Error.md` - Event handling and communication
- `Component_Structure_Error.md` - Class architecture and lifecycle
- `Network_API_Error.md` - Network communication issues
- `Asset_Loading_Error.md` - Resource and asset management
- `Type_Safety_Error.md` - TypeScript compilation issues

6. **ANALYSIS APPROACH**:
- **SCAN FIRST**: Check existing logs in `.Error_LOG.md/` folder for similar errors
- **IDENTIFY DUPLICATES**: Look for existing solutions before creating new logs
- **UPDATE vs CREATE**: Update existing logs if error is similar, create new if different
- Identify the ROOT CAUSE category of each error
- Group similar errors by underlying API/system involved
- Extract GENERAL PATTERNS that apply beyond the current project
- Focus on TEACHABLE SOLUTIONS that can be reused
- Document WHY certain patterns cause problems
- Provide MULTIPLE DIFFICULTY LEVELS of solutions

7. **DUPLICATION PREVENTION PROCESS**:
- Before creating new error log, scan `.Error_LOG.md/` folder
- Search for keywords related to your error (API names, error messages, concepts)
- If similar error exists: UPDATE the existing log with new patterns/solutions
- If error is unique: CREATE new log following the template
- Cross-reference related errors in the documentation
- Maintain an index/overview of all error categories

7. **QUALITY STANDARDS**:
- Each error log should be FRAMEWORK/PROJECT AGNOSTIC
- Solutions should work for ANY Horizon Worlds project
- Code examples should be COMPLETE and RUNNABLE
- Include ERROR PREVENTION strategies, not just fixes
- Cross-reference related error categories when appropriate
- **CENTRALIZED STORAGE**: All logs stored in Git Repo `.Error_LOG.md/` folder
- **NO DUPLICATES**: Scan existing logs before creating new ones

### MY CURRENT SITUATION:
[Describe your specific errors, code issues, or problems here]

### EXISTING LOG SCAN RESULTS:
**Scanned Location**: Git Repo `.Error_LOG.md/` folder
**Search Keywords**: [List keywords you searched for: API names, error messages, concepts]
**Found Similar Logs**:
- [ ] None found - Create new log
- [ ] Found similar: [Name of existing log] - UPDATE this log
- [ ] Found related: [Names of related logs] - CROSS-REFERENCE these

**Duplicate Check Summary**:
[Briefly describe what existing logs you found and why your error is different or should update existing]

### REQUEST:
Please analyze the issues and create error logs following the above methodology.

**IMPORTANT STEPS**:
1. **SCAN FIRST**: Check the Git Repo's `.Error_LOG.md/` folder for existing error logs that might already cover this issue
2. **DUPLICATE CHECK**: Search existing logs for similar error messages, API calls, or problem patterns
3. **DECISION**:
- If similar error exists: UPDATE the existing log with new patterns/solutions
- If error is unique: CREATE new log following the template
4. **STORAGE**: Store the result in BOTH locations:
- Primary: Git Repo `.Error_LOG.md/` folder
- Secondary: Local project `error_logs/` folder
5. **CROSS-REFERENCE**: Link related error types when appropriate

Focus on creating REUSABLE templates that will help with future projects, not just fixing the immediate problem.
```

---

## 🔧 **USAGE INSTRUCTIONS**

### When to Use This Prompt:

- ✅ Encountering TypeScript compilation errors
- ✅ Runtime errors in Horizon Worlds
- ✅ API usage issues or binding problems
- ✅ Component lifecycle or structure issues
- ✅ UI rendering or layout problems
- ✅ Need to document patterns for team use

### How to Apply:

1. **Copy the prompt above**
2. **Scan existing logs** in Git Repo `.Error_LOG.md/` folder first
3. **Check for duplicates** using keywords from your error
4. **Replace `[MY CURRENT SITUATION]`** with your specific error details
5. **Include relevant code snippets** that are causing issues
6. **Submit to AI assistant** with scan results
7. **Review generated error logs** for completeness
8. **Store in BOTH locations**:
   - Primary: Git Repo `.Error_LOG.md/` folder
   - Secondary: Local `error_logs/` folder

### Maintenance:

- **Scan before creating** - Always check Git Repo `.Error_LOG.md/` folder first
- **Update existing logs** when you discover new patterns for same error type
- **Cross-reference** between related error types
- **Sync locations** - Keep both Git Repo and local copies updated
- **Share with team members** for consistent practices
- **Use as training material** for new developers
- **Regular cleanup** - Remove outdated patterns, consolidate similar errors

---

## 📋 **QUALITY CHECKLIST**

Before finalizing error logs, verify:

- [ ] **SCANNED EXISTING LOGS** in Git Repo `.Error_LOG.md/` folder first
- [ ] **NO DUPLICATES** - Confirmed this error type doesn't already exist
- [ ] File named by error type, not component name
- [ ] **STORED IN BOTH LOCATIONS**: Git Repo primary + local secondary
- [ ] Follows exact template structure
- [ ] Includes multiple solution approaches
- [ ] Provides general patterns, not project-specific fixes
- [ ] Has actionable testing checklist
- [ ] Uses consistent formatting (❌/✅ patterns)
- [ ] Contains complete, runnable code examples
- [ ] Focuses on prevention, not just problem-solving
- [ ] **CROSS-REFERENCED** with related error types

---

## 🎯 **EXPECTED OUTCOMES**

Using this methodology will create:

- **Reusable documentation** for common Horizon Worlds issues
- **Consistent error resolution** patterns across projects
- **Training materials** for team members
- **Preventive guidance** to avoid future issues
- **Time savings** on debugging and problem-solving
- **Knowledge base** that grows with each project

This approach transforms one-time error fixes into permanent knowledge assets for your development workflow.
