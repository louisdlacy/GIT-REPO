import * as hz from 'horizon/core';

export const enum LogLevel {
    Info,
    Warn,
    Error
}

/**
 * Abstract class BaseLogger that provides logging functionality.
 *
 * @template T - The type parameter for the component.
 */
export abstract class BaseLogger<T> extends hz.Component<typeof BaseLogger & T> {
    /**
     * Start method that does nothing by default.
     */
    start(): void { /* Do nothing */ }

    protected enableLogging: boolean = true;

    /**
     * Logs a message with a specified log level.
     *
     * @param msg - The message to log.
     * @param canLog - A boolean indicating if logging is enabled.
     * @param logLevel - The level of the log (Info, Warn, Error).
     */
    log(msg: string, canLog: boolean = this.enableLogging, logLevel: LogLevel = LogLevel.Info) {
        if (!canLog) {
            return;
        }
        let log = `[${Object.getPrototypeOf(this).constructor.name}] ${msg}`;
        switch (logLevel) {
            case LogLevel.Error:
                console.error(log);
                if (this.entity.owner.get() == this.world.getServerPlayer()) {
                }
                break;
            case LogLevel.Warn:
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
    static log(msg: string, logLevel: LogLevel = LogLevel.Info) {
        let log = `[${Object.getPrototypeOf(this).constructor.name}] ${msg}`;
        switch (logLevel) {
            case LogLevel.Error:
                console.error(log);
                break;
            case LogLevel.Warn:
                console.warn(log);
                break;
            default:
                console.log(log);
                break;
        }
    }
}
