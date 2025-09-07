import { UIComponent } from "horizon/ui";
import { Color } from "horizon/core";
/**
 * SplashScreen - A configurable splash screen UI component for Horizon Worlds
 *
 * This component displays a splash screen with customizable content and duration.
 * Configure the properties in the property panel to customize the appearance and behavior.
 *
 * PROPERTY PANEL SETTINGS:
 * ========================
 * - Display Duration: How long to show the splash screen (seconds)
 * - Title Text: Main heading text displayed prominently
 * - Subtitle Text: Secondary text below the title (e.g., "Loading...")
 * - Auto Hide: Whether to automatically hide after the duration expires
 * - Animation Duration: Speed of fade in/out animations (seconds)
 * - Title Color: Color of the main title text
 * - Subtitle Color: Color of the subtitle text
 * - Background Color: Color of the full-screen overlay background
 * - Background Image: Optional image asset from Asset Library
 *
 * USAGE:
 * ======
 * 1. Copy this file to your Horizon Worlds scripts folder
 * 2. Attach the SplashScreen component to a UI Panel entity
 * 3. Configure the properties in the property panel
 * 4. The splash screen will auto-show on start if autoHide is enabled
 * 5. Call show() or hide() methods programmatically if needed
 *
 * CUSTOMIZATION:
 * ==============
 * - Modify panelWidth/panelHeight for different screen sizes
 * - Adjust font sizes in the Text components (fontSize property)
 * - Change layout by modifying the View components and their styles
 * - Add more props to propsDefinition for additional customization
 * - Modify createDot() method to change loading indicator appearance
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
    constructor();
    preStart(): void;
    start(): void;
    /**
     * Initialize the UI structure
     * CUSTOMIZATION: Modify this method to change the visual layout and styling
     */
    initializeUI(): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
    /**
     * Create a simple loading dot indicator
     * CUSTOMIZATION: Modify dot size, color, spacing, or replace with different animation
     */
    private createDot;
    /**
     * Show the splash screen with fade-in animation
     * CUSTOMIZATION: Modify animation timing or add additional effects
     */
    showSplashScreen(): void;
    /**
     * Hide the splash screen with fade-out animation
     * CUSTOMIZATION: Modify animation timing or final scale value
     */
    hideSplashScreen(): void;
    /**
     * Update the title text dynamically during runtime
     * USAGE: splashScreen.updateTitle("New Title Text")
     */
    updateTitle(newTitle: string): void;
    /**
     * Update the subtitle text dynamically during runtime
     * USAGE: splashScreen.updateSubtitle("New loading message...")
     */
    updateSubtitle(newSubtitle: string): void;
    /**
     * Manually trigger showing the splash screen
     * USAGE: splashScreen.show()
     */
    show(): void;
    /**
     * Manually trigger hiding the splash screen
     * USAGE: splashScreen.hide()
     */
    hide(): void;
    /**
     * Convert Horizon Color object to CSS color string
     * TECHNICAL: Supports both RGB and RGBA formats for web compatibility
     * CUSTOMIZATION: Modify color conversion logic if needed
     */
    private colorToString;
}
