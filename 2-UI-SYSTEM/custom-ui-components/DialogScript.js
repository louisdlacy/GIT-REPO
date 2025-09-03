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
exports.DialogScript = void 0;
const hz = __importStar(require("horizon/core"));
const MAX_TREE_LENGTH = 16; // For conversations that can loop back on themselves, terminate after this many steps so the tree doesn't infinitely grow
class DialogScript extends hz.Component {
    constructor() {
        super(...arguments);
        this.branchingDialogs = [];
    }
    start() {
        let branch = this.props.nextDialog1?.getComponents()[0];
        if (branch) {
            this.branchingDialogs.push(branch);
            branch = this.props.nextDialog2?.getComponents()[0];
            if (branch) {
                this.branchingDialogs.push(branch);
                branch = this.props.nextDialog3?.getComponents()[0];
                if (branch) {
                    this.branchingDialogs.push(branch);
                }
            }
        }
    }
    /**
     * Retrieves a dialog from the dialog tree based on the provided key sequence.
     *
     * @param key - An array of numbers representing the path in the dialog tree.
     * @returns A DialogContainer object with the dialog response and options, or undefined if the path is empty and the conversation has ended.
     */
    getDialogFromTree(key) {
        if (key.length === 0) {
            return {
                response: this.props.response,
                option1Text: this.props.option1 || 'Okay', // default to "Okay" if option1 is undefined
                option2Text: this.props.option2 || undefined,
                option3Text: this.props.option3 || undefined
            };
        }
        else if (key.length >= MAX_TREE_LENGTH) {
            return {
                response: "You talk too much!",
                option1Text: "Okay, sorry",
            };
        }
        let index = key[0];
        if (this.branchingDialogs[index] === undefined) {
            return undefined;
        }
        // traverse the tree until there are no more options
        key.shift();
        let result = this.branchingDialogs[index].getDialogFromTree(key);
        return result;
    }
}
exports.DialogScript = DialogScript;
DialogScript.propsDefinition = {
    response: { type: hz.PropTypes.String },
    option1: { type: hz.PropTypes.String },
    nextDialog1: { type: hz.PropTypes.Entity },
    option2: { type: hz.PropTypes.String },
    nextDialog2: { type: hz.PropTypes.Entity },
    option3: { type: hz.PropTypes.String },
    nextDialog3: { type: hz.PropTypes.Entity },
};
hz.Component.register(DialogScript);
