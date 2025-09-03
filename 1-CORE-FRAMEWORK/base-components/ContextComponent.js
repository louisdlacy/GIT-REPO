"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextComponent = void 0;
const BaseComponent_1 = require("BaseComponent");
const hz = __importStar(require("horizon/core"));
const BaseLogger_1 = require("BaseLogger");
/**
 * ContextComponent is an abstract base class for components that manage contextual information for NPCs.
 *
 * This class provides a foundation for components that need to store and manage
 * key-value pairs of contextual information. Each context item has a key and a description.
 * The class handles initialization, validation, and fallback logic for these properties.
 *
 * @template T - The type parameter that extends the component's properties
 * @extends BaseComponent<typeof ContextComponent & T>
 */
class ContextComponent extends BaseComponent_1.BaseComponent {
    constructor() {
        super(...arguments);
        this.key = '';
        this.description = '';
    }
    start() {
        //ensure we've got something for key and value
        this.key = this.props.itemKey;
        this.description = this.props.itemDescription;
        if (this.description == this.key && this.key == null) {
            this.log(`${this.entity.name} is missing parameters`, true, BaseLogger_1.LogLevel.Warn);
            return;
        }
        if (!this.description) {
            this.description = this.key;
        }
        if (!this.key) {
            this.key = this.description;
        }
    }
}
exports.ContextComponent = ContextComponent;
ContextComponent.propsDefinition = {
    ...BaseComponent_1.BaseComponent.propsDefinition,
    itemKey: { type: hz.PropTypes.String },
    itemDescription: { type: hz.PropTypes.String }
};
