# Programmatically Spawn and Despawn Sublevels

## API Functions
- `activate()`: Make sublevel visible + run scripts.
- `hide()`: Return active sublevel to loaded state.
- `load()`: Load sublevel into memory (not active).
- `pause()`: Pause load process. Resume with `load()`.
- `unload()`: Remove sublevel from memory.

These are available in the `SublevelEntity` class API (world_streaming package v2.0.0).  
Not supported in v1.0.0.
