# World Streaming: Benefits and Limitations

## Benefits
- Divide a world into smaller sublevels  
- Sublevels are separate worlds, which can each contain meshes, gizmos, scripts. You can preview and organize sublevels during world creation, and at runtime. You can dynamically stream sublevels in and out.
- Faster load time (two to three times improvement vs asset spawning)
- Cached global illumination precomputes mesh lighting in the cloud.
- Typescript APIs allow sublevels to load/unload based on player actions.
- Improved collaboration: teams can work on different sublevels independently.

## Limitations
- Per-player world streaming is not supported (loads for all players).
- Multiple sublevels loaded simultaneously may hurt performance.
- Automated streaming based on player movement is not supported (must be done via TS APIs).
