"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreen = void 0;
const ui_1 = require("horizon/ui");
const core_1 = require("horizon/core");
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
class SplashScreen extends ui_1.UIComponent {
    constructor() {
        super();
        // Panel dimensions for responsive design
        // CUSTOMIZATION: Adjust these values to change the UI panel size
        this.panelWidth = 1200;
        this.panelHeight = 800;
        // Animated bindings for smooth transitions
        // TECHNICAL NOTE: These start at 1 (visible) to avoid initial flash
        this.opacityBinding = new ui_1.AnimatedBinding(1);
        this.scaleBinding = new ui_1.AnimatedBinding(1);
        // Text bindings for dynamic content updates
        // CUSTOMIZATION: Initialize with different default values if needed
        this.titleBinding = new ui_1.Binding("Welcome");
        this.subtitleBinding = new ui_1.Binding("Loading...");
        // Component state management
        this.isVisible = false;
        // Component initialization - no setup needed here
    }
    preStart() {
        // IMPORTANT: UI components should only run on client entities, not server
        // This check ensures the splash screen only appears for actual players
        const localPlayer = this.world.getLocalPlayer();
        const entityOwner = this.entity.owner.get();
        // Exit early if this is not the local player's entity
        if (!localPlayer || localPlayer !== entityOwner) {
            return;
        }
        // Initialize text bindings with values from property panel
        // CUSTOMIZATION: Add initialization for any new bindings here
        this.titleBinding.set(this.props.titleText || "Welcome");
        this.subtitleBinding.set(this.props.subtitleText || "Loading...");
    }
    start() {
        // Double-check client entity validation for safety
        const localPlayer = this.world.getLocalPlayer();
        const entityOwner = this.entity.owner.get();
        if (!localPlayer || localPlayer !== entityOwner) {
            return;
        }
        // Auto-show the splash screen on start if Auto Hide is enabled in property panel
        // CUSTOMIZATION: Change this logic if you want different trigger conditions
        if (this.props.autoHide) {
            // Small delay to ensure UI is fully initialized before showing
            this.async.setTimeout(() => {
                this.showSplashScreen();
            }, 100);
        }
        // If autoHide is false, splash screen can still be shown manually via show() method
    }
    /**
     * Initialize the UI structure
     * CUSTOMIZATION: Modify this method to change the visual layout and styling
     */
    initializeUI() {
        return (0, ui_1.View)({
            style: {
                // Full-screen overlay positioning
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                opacity: this.opacityBinding, // Controlled by animations
                transform: [{ scale: this.scaleBinding }], // Controlled by animations
                zIndex: 1000, // CUSTOMIZATION: Adjust if you need different layering
            },
            children: [
                // Background overlay - provides colored backdrop
                // CUSTOMIZATION: Modify backgroundColor style or remove entirely
                (0, ui_1.View)({
                    style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: this.colorToString(this.props.backgroundColor),
                    },
                }),
                // Main content container - holds all visible elements
                // CUSTOMIZATION: Adjust padding, maxWidth, or layout direction
                (0, ui_1.View)({
                    style: {
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 40,
                        maxWidth: 600, // Responsive width limit
                        width: "90%",
                    },
                    children: [
                        // Background image (optional) - displayed if backgroundImage prop is set
                        // CUSTOMIZATION: Adjust image size, position, or styling
                        ...(this.props.backgroundImage
                            ? [
                                (0, ui_1.Image)({
                                    source: ui_1.ImageSource.fromTextureAsset(this.props.backgroundImage),
                                    style: {
                                        width: 300, // CUSTOMIZATION: Change image dimensions
                                        height: 200,
                                        borderRadius: 15, // CUSTOMIZATION: Adjust corner rounding
                                        marginBottom: 30,
                                        opacity: 0.9, // CUSTOMIZATION: Adjust image transparency
                                    },
                                }),
                            ]
                            : []),
                        // Title text - main heading
                        // CUSTOMIZATION: Modify fontSize, fontWeight, or styling
                        (0, ui_1.Text)({
                            text: this.titleBinding,
                            style: {
                                fontSize: 36, // CUSTOMIZATION: Adjust title size
                                fontWeight: "bold",
                                color: this.colorToString(this.props.titleColor),
                                textAlign: "center",
                                marginBottom: 15,
                                paddingHorizontal: 20,
                            },
                        }),
                        // Subtitle text - secondary information
                        // CUSTOMIZATION: Modify fontSize or styling
                        (0, ui_1.Text)({
                            text: this.subtitleBinding,
                            style: {
                                fontSize: 20, // CUSTOMIZATION: Adjust subtitle size
                                color: this.colorToString(this.props.subtitleColor),
                                textAlign: "center",
                                marginBottom: 30,
                                paddingHorizontal: 20,
                            },
                        }),
                        // Loading indicator - animated dots
                        // CUSTOMIZATION: Replace with different loading animation or remove
                        (0, ui_1.View)({
                            style: {
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                            children: [this.createDot(), this.createDot(), this.createDot()],
                        }),
                    ],
                }),
            ],
        });
    }
    /**
     * Create a simple loading dot indicator
     * CUSTOMIZATION: Modify dot size, color, spacing, or replace with different animation
     */
    createDot() {
        return (0, ui_1.View)({
            style: {
                width: 8, // CUSTOMIZATION: Adjust dot size
                height: 8,
                borderRadius: 4, // Makes it circular (half of width/height)
                backgroundColor: this.colorToString(this.props.titleColor),
                marginHorizontal: 3, // CUSTOMIZATION: Adjust spacing between dots
                opacity: 0.7, // CUSTOMIZATION: Adjust dot transparency
            },
        });
    }
    /**
     * Show the splash screen with fade-in animation
     * CUSTOMIZATION: Modify animation timing or add additional effects
     */
    showSplashScreen() {
        const duration = this.props.displayDuration || 3.0;
        this.isVisible = true;
        // Clear any existing timeout to prevent conflicts
        if (this.hideTimeout) {
            this.async.clearTimeout(this.hideTimeout);
            this.hideTimeout = undefined;
        }
        // Animate fade in and scale up
        // CUSTOMIZATION: Adjust animation duration or add different animation types
        const animDuration = (this.props.animationDuration || 0.5) * 1000;
        this.opacityBinding.set(ui_1.Animation.timing(1, { duration: animDuration }));
        this.scaleBinding.set(ui_1.Animation.timing(1, { duration: animDuration }));
        // Auto-hide after duration if enabled in property panel
        if (this.props.autoHide && duration > 0) {
            this.hideTimeout = this.async.setTimeout(() => {
                this.hideSplashScreen();
            }, duration * 1000);
        }
    }
    /**
     * Hide the splash screen with fade-out animation
     * CUSTOMIZATION: Modify animation timing or final scale value
     */
    hideSplashScreen() {
        if (!this.isVisible)
            return;
        this.isVisible = false;
        // Clear any pending hide timeout
        if (this.hideTimeout) {
            this.async.clearTimeout(this.hideTimeout);
            this.hideTimeout = undefined;
        }
        // Animate fade out and scale down
        // CUSTOMIZATION: Adjust final scale (0.9) for different shrink effect
        const animDuration = (this.props.animationDuration || 0.5) * 1000;
        this.opacityBinding.set(ui_1.Animation.timing(0, { duration: animDuration }));
        this.scaleBinding.set(ui_1.Animation.timing(0.9, { duration: animDuration }));
    }
    /**
     * Update the title text dynamically during runtime
     * USAGE: splashScreen.updateTitle("New Title Text")
     */
    updateTitle(newTitle) {
        this.titleBinding.set(newTitle);
    }
    /**
     * Update the subtitle text dynamically during runtime
     * USAGE: splashScreen.updateSubtitle("New loading message...")
     */
    updateSubtitle(newSubtitle) {
        this.subtitleBinding.set(newSubtitle);
    }
    /**
     * Manually trigger showing the splash screen
     * USAGE: splashScreen.show()
     */
    show() {
        this.showSplashScreen();
    }
    /**
     * Manually trigger hiding the splash screen
     * USAGE: splashScreen.hide()
     */
    hide() {
        this.hideSplashScreen();
    }
    /**
     * Convert Horizon Color object to CSS color string
     * TECHNICAL: Supports both RGB and RGBA formats for web compatibility
     * CUSTOMIZATION: Modify color conversion logic if needed
     */
    colorToString(color, opacity = 1.0) {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        if (opacity < 1) {
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
}
exports.SplashScreen = SplashScreen;
// Props definition - these will appear in the property panel in Horizon Worlds
// CUSTOMIZATION: Add new props here to extend functionality
SplashScreen.propsDefinition = {
    // Duration in seconds to display the splash screen
    displayDuration: {
        type: core_1.PropTypes.Number,
        default: 3.0,
    },
    // Optional background image asset
    backgroundImage: {
        type: core_1.PropTypes.Asset,
    },
    // Main title text
    titleText: {
        type: core_1.PropTypes.String,
        default: "Welcome to the World!",
    },
    // Subtitle text
    subtitleText: {
        type: core_1.PropTypes.String,
        default: "Loading experience...",
    },
    // Title text color
    titleColor: {
        type: core_1.PropTypes.Color,
        default: core_1.Color.white,
    },
    // Subtitle text color
    subtitleColor: {
        type: core_1.PropTypes.Color,
        default: new core_1.Color(0.78, 0.78, 0.78),
    },
    // Background overlay color
    backgroundColor: {
        type: core_1.PropTypes.Color,
        default: new core_1.Color(0, 0, 0),
    },
    // Animation duration for fade in/out (in seconds)
    animationDuration: {
        type: core_1.PropTypes.Number,
        default: 0.5,
    },
    // Auto-hide the splash screen after duration
    autoHide: {
        type: core_1.PropTypes.Boolean,
        default: true,
    },
};
// Register the component with Horizon Worlds
ui_1.UIComponent.register(SplashScreen);
