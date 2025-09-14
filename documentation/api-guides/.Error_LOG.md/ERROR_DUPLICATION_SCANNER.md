# Error Log Duplication Scanner

## Quick Scan Commands

### PowerShell Commands for Duplicate Detection

```powershell
# Navigate to Git Repo Error Logs folder
cd "c:\Users\louis\AppData\LocalLow\Meta\Horizon Worlds\766342209379743\scripts\Git Repo\.Error_LOG.md"

# List all existing error logs
Get-ChildItem -Name "*.md"

# Search for specific error keywords in all logs
Select-String -Path "*.md" -Pattern "YourKeywordHere" -CaseSensitive:$false

# Search for API-related errors
Select-String -Path "*.md" -Pattern "Binding|Event|Component|UINode" -CaseSensitive:$false

# Search for specific error messages
Select-String -Path "*.md" -Pattern "Property.*does not exist|Argument of type.*not assignable" -CaseSensitive:$false

# Get content summary of all logs
Get-ChildItem "*.md" | ForEach-Object { Write-Host "`n=== $($_.Name) ==="; Get-Content $_.FullName | Select-Object -First 10 }
```

### Search Checklist

Before creating new error log, search existing logs for:

#### **1. Error Message Keywords**
- [ ] Exact error text (e.g., "Property 'value' does not exist")
- [ ] API names (e.g., "Binding", "LocalEvent", "UIComponent")
- [ ] Error types (e.g., "TypeError", "CompileError", "RuntimeError")

#### **2. Technology Keywords**
- [ ] "Binding" - for data binding issues
- [ ] "Event" - for event system issues  
- [ ] "Component" - for component structure issues
- [ ] "UINode" - for UI rendering issues
- [ ] "Network" - for networking issues
- [ ] "Asset" - for asset loading issues

#### **3. Concept Keywords**
- [ ] "Memory leak" - for disposal/cleanup issues
- [ ] "Type safety" - for TypeScript issues
- [ ] "Lifecycle" - for component lifecycle issues
- [ ] "Validation" - for data validation issues

### Search Commands by Error Type

```powershell
# For Binding-related errors
Select-String -Path "*.md" -Pattern "Binding|\.set\(|\.value|\.get\(" -CaseSensitive:$false

# For Event-related errors  
Select-String -Path "*.md" -Pattern "Event|connectLocalEvent|LocalEvent" -CaseSensitive:$false

# For Component structure errors
Select-String -Path "*.md" -Pattern "propsDefinition|UIComponent|Component.*extends" -CaseSensitive:$false

# For UI rendering errors
Select-String -Path "*.md" -Pattern "UINode|children.*must be|View.*component" -CaseSensitive:$false

# For TypeScript errors
Select-String -Path "*.md" -Pattern "not assignable|does not exist|implicitly.*any" -CaseSensitive:$false
```

### Decision Matrix

| Found Similar Error | Action | Reason |
|---------------------|---------|---------|
| Exact same error message | **UPDATE** existing log | Add new solution patterns |
| Same API, different symptom | **UPDATE** existing log | Expand the causes section |
| Related API, different error | **CROSS-REFERENCE** | Link to related log |
| Different API/system | **CREATE NEW** | Unique error category |
| Similar concept, different tech | **CREATE NEW** | Different root cause |

### Quick Reference: Existing Log Categories

Based on current error logs in the system:

1. **`UINode_Children_Error.md`** - UI component children arrays, derive patterns
2. **`Binding_API_Error.md`** - Data binding `.set()/.value` issues, disposal
3. **`Event_System_Error.md`** - LocalEvent vs strings, CodeBlockEvents
4. **`Component_Structure_Error.md`** - propsDefinition, lifecycle, entity ownership

### Example Search Workflow

```powershell
# 1. List existing logs
Get-ChildItem -Name "*.md"

# 2. Search for your specific error keywords
Select-String -Path "*.md" -Pattern "your error message here" -CaseSensitive:$false

# 3. If found, examine the specific log
Get-Content "Binding_API_Error.md" | Select-Object -First 50

# 4. Decide: UPDATE existing or CREATE new
```

This systematic approach ensures no duplicate error logs and builds a comprehensive knowledge base efficiently.
