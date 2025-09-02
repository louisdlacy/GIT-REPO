### Copilot Rule: Console.log Cleanup

When cleaning code:

- Remove all temporary `console.log` statements used only for debugging.
- Keep only meaningful logs that describe important runtime events.
- Use proper log levels **with priority markers**:

  - 🔴 `console.error()` → Critical failure (must investigate immediately).
  - 🟠 `console.warn()` → Important warning (non-breaking but attention needed).
  - 🔵 `console.info()` → General system info (startup, shutdown, requests).
  - 🟢 `console.debug()` → Development-only details (remove in production).

- No duplicate logs.
- Before production, all non-essential logs must be removed or wrapped in an environment check:
  ```ts
  if (process.env.NODE_ENV === "development") {
    console.debug("🟢 Debug:", someVar);
  }
  ```
