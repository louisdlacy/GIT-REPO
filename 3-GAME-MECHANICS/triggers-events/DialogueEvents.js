"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkEvent = exports.UpdatePromptVisibilityEvent = exports.RemovePromptEvent = exports.AddPromptEvent = void 0;
const core_1 = require("horizon/core");
exports.AddPromptEvent = new core_1.NetworkEvent("AddPromptEvent");
exports.RemovePromptEvent = new core_1.NetworkEvent("RemovePromptEvent");
exports.UpdatePromptVisibilityEvent = new core_1.LocalEvent("UpdatePromptVisibility");
exports.TalkEvent = new core_1.LocalEvent("TalkEvent");
