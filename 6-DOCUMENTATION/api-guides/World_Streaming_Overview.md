# World Streaming Overview
World streaming is a Meta Horizon Worlds feature that provides an efficient approach to building and running large worlds. It lets you divide a large world (a parent world) into a set of smaller worlds (sublevels). At runtime, you don’t have to load the world all at once. Instead, you can stream each subworld into the parent world programmatically.

This approach provides tooling that lets you preview sublevels and configure them correctly within a parent world. It allows a team of world creators to work independently, where each developer works on a different sublevel. Sublevels are integrated into the parent world as they’re completed.

From a runtime perspective, this approach gives better load times than streaming in parts of the world using asset spawning. Sublevels can load two to three times faster due to leveraging cached global illumination (GI) information, and removing the cost of dynamically computing lighting during load.

This document details the procedure for dividing large Meta Horizon Worlds into multiple sub-levels.
