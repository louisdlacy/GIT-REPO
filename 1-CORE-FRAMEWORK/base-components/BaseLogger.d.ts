import * as hz from 'horizon/core';
export declare const enum LogLevel {
    Info = 0,
    Warn = 1,
    Error = 2
}
/**
 * Abstract class BaseLogger that provides logging functionality.
 *
 * @template T - The type parameter for the component.
 */
export declare abstract class BaseLogger<T> extends hz.Component<typeof BaseLogger & T> {
    /**
     * Start method that does nothing by default.
     */
    start(): void;
    protected enableLogging: boolean;
    /**
     * Logs a message with a specified log level.
     *
     * @param msg - The message to log.
     * @param canLog - A boolean indicating if logging is enabled.
     * @param logLevel - The level of the log (Info, Warn, Error).
     */
    log(msg: string, canLog?: boolean, logLevel?: LogLevel): void;
    /**
     * Static method to log a message with a specified log level.
     *
     * @param msg - The message to log.
     * @param logLevel - The level of the log (Info, Warn, Error).
     */
    static log(msg: string, logLevel?: LogLevel): void;
}
