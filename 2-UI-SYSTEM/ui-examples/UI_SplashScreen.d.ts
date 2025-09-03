import { UIComponent } from "horizon/ui";
import { Color } from "horizon/core";
/**
 * SplashScreen - A configurable splash screen UI component for Horizon Worlds
 *
 * This component displays a splash screen with customizable content and duration.
 * Configure the properties in the property panel to customize the appearance and behavior.
 *
 * Property Panel Settings:
 * - Display Duration: How long to show the splash screen (seconds)
 * - Title Text: Main heading text
 * - Subtitle Text: Secondary text below the title
 * - Auto Hide: Whether to automatically hide after the duration
 * - Animation Duration: Speed of fade in/out animations
 * - Title Color, Subtitle Color, Background Color: Color customization
 * - Background Image: Optional image asset to display
 *
 * Usage:
 * 1. Copy this file to your Horizon Worlds scripts folder
 * 2. Attach the SplashScreen component to a UI Panel entity
 * 3. Configure the properties in the property panel
 * 4. The splash screen will auto-show on start if autoHide is enabled
 * 5. Call show() or hide() methods programmatically if needed
 *
 * Example API Usage:
 * ```typescript
 * // Get reference to the component
 * const splashScreen = this.entity.getComponent(SplashScreen);
 *
 * // Show manually
 * splashScreen.show();
 *
 * // Update content dynamically
 * splashScreen.updateTitle("New Title");
 * splashScreen.updateSubtitle("New loading message...");
 *
 * // Hide manually
 * splashScreen.hide();
 * ```
 */
export declare class SplashScreen extends UIComponent {
    panelWidth: number;
    panelHeight: number;
    static propsDefinition: {
        displayDuration: {
            type: "number";
            default: number;
        };
        backgroundImage: {
            type: "Asset";
        };
        titleText: {
            type: "string";
            default: string;
        };
        subtitleText: {
            type: "string";
            default: string;
        };
        titleColor: {
            type: "Color";
            default: Color;
        };
        subtitleColor: {
            type: "Color";
            default: Color;
        };
        backgroundColor: {
            type: "Color";
            default: Color;
        };
        animationDuration: {
            type: "number";
            default: number;
        };
        autoHide: {
            type: "boolean";
            default: boolean;
        };
    };
    private opacityBinding;
    private scaleBinding;
    private titleBinding;
    private subtitleBinding;
    private isVisible;
    private hideTimeout?;
    private owner?;
    private serverPlayer?;
    constructor();
    preStart(): void;
    start(): void;
    /**
     * Initialize the UI structure
     */
    initializeUI(): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
    /**
     * Create a simple loading dot
     */
    private createDot;
    /**
     * Show the splash screen with fade-in animation
     */
    showSplashScreen(): void;
    /**
     * Hide the splash screen with fade-out animation
     */
    hideSplashScreen(): void;
    /**
     * Update the title text dynamically
     */
    updateTitle(newTitle: string): void;
    /**
     * Update the subtitle text dynamically
     */
    updateSubtitle(newSubtitle: string): void;
    /**
     * Manually trigger showing the splash screen
     */
    show(): void;
    /**
     * Manually trigger hiding the splash screen
     */
    hide(): void;
    /**
     * Convert Color object to string with optional opacity
     */
    private colorToString;
}
