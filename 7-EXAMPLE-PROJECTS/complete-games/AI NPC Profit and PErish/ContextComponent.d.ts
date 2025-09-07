import { BaseComponent } from 'BaseComponent';
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
export declare abstract class ContextComponent<T> extends BaseComponent<typeof ContextComponent & T> {
    static propsDefinition: any;
    key: string;
    description: string;
    start(): void;
}
