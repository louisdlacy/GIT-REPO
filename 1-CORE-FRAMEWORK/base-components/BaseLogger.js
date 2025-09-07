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
exports.BaseLogger = void 0;
const hz = __importStar(require("horizon/core"));
/**
 * Abstract class BaseLogger that provides logging functionality.
 *
 * @template T - The type parameter for the component.
 */
class BaseLogger extends hz.Component {
    constructor() {
        super(...arguments);
        this.enableLogging = true;
    }
    /**
     * Start method that does nothing by default.
     */
    start() { }
    /**
     * Logs a message with a specified log level.
     *
     * @param msg - The message to log.
     * @param canLog - A boolean indicating if logging is enabled.
     * @param logLevel - The level of the log (Info, Warn, Error).
     */
    log(msg, canLog = this.enableLogging, logLevel = 0 /* LogLevel.Info */) {
        if (!canLog) {
            return;
        }
        let log = `[${Object.getPrototypeOf(this).constructor.name}] ${msg}`;
        switch (logLevel) {
            case 2 /* LogLevel.Error */:
                console.error(log);
                if (this.entity.owner.get() == this.world.getServerPlayer()) {
                }
                break;
            case 1 /* LogLevel.Warn */:
                console.warn(log);
                break;
            default:
                console.log(log);
                break;
        }
    }
    /**
     * Static method to log a message with a specified log level.
     *
     * @param msg - The message to log.
     * @param logLevel - The level of the log (Info, Warn, Error).
     */
    static log(msg, logLevel = 0 /* LogLevel.Info */) {
        let log = `[${Object.getPrototypeOf(this).constructor.name}] ${msg}`;
        switch (logLevel) {
            case 2 /* LogLevel.Error */:
                console.error(log);
                break;
            case 1 /* LogLevel.Warn */:
                console.warn(log);
                break;
            default:
                console.log(log);
                break;
        }
    }
}
exports.BaseLogger = BaseLogger;
