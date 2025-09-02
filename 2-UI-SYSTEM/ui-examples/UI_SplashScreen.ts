import {
  UIComponent,
  View,
  Text,
  Image,
  ImageSource,
  AnimatedBinding,
  Animation,
  Binding,
} from "horizon/ui";
import {
  Component,
  PropTypes,
  Player,
  Asset,
  Color,
  TextureAsset,
} from "horizon/core";

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
export class SplashScreen extends UIComponent {
  // Panel dimensions for responsive design
  panelWidth = 1200;
  panelHeight = 800;

  // Props definition - these will appear in the property panel in Horizon Worlds
  static propsDefinition = {
    // Duration in seconds to display the splash screen
    displayDuration: {
      type: PropTypes.Number,
      default: 3.0,
    },

    // Optional background image asset
    backgroundImage: {
      type: PropTypes.Asset,
    },

    // Main title text
    titleText: {
      type: PropTypes.String,
      default: "Welcome to the World!",
    },

    // Subtitle text
    subtitleText: {
      type: PropTypes.String,
      default: "Loading experience...",
    },

    // Title text color
    titleColor: {
      type: PropTypes.Color,
      default: Color.white,
    },

    // Subtitle text color
    subtitleColor: {
      type: PropTypes.Color,
      default: new Color(0.78, 0.78, 0.78),
    },

    // Background overlay color
    backgroundColor: {
      type: PropTypes.Color,
      default: new Color(0, 0, 0),
    },

    // Animation duration for fade in/out (in seconds)
    animationDuration: {
      type: PropTypes.Number,
      default: 0.5,
    },

    // Auto-hide the splash screen after duration
    autoHide: {
      type: PropTypes.Boolean,
      default: true,
    },
  };

  // Animated bindings for smooth transitions
  private opacityBinding: AnimatedBinding = new AnimatedBinding(1); // Start visible
  private scaleBinding: AnimatedBinding = new AnimatedBinding(1); // Start at full scale

  // Text bindings for dynamic updates
  private titleBinding: Binding<string> = new Binding("Welcome");
  private subtitleBinding: Binding<string> = new Binding("Loading...");

  // Component state
  private isVisible: boolean = false;
  private hideTimeout?: number;
  private owner?: Player;
  private serverPlayer?: Player;

  constructor() {
    super();
    console.log("🎬 SplashScreen UI component created");
  }

  preStart() {
    console.log("🎬 SplashScreen preStart");

    // Setup owner tracking following HUD.ts pattern
    this.owner = this.entity.owner.get();
    this.serverPlayer = this.world.getServerPlayer();

    // Exit early if this is the server player (server doesn't need UI)
    if (this.owner === this.serverPlayer) {
      console.log("🚫 SplashScreen: Server player detected, skipping UI setup");
      return;
    }

    // Initialize text bindings with prop values
    this.titleBinding.set(this.props.titleText || "Welcome");
    this.subtitleBinding.set(this.props.subtitleText || "Loading...");
  }

  start() {
    console.log("🎬 SplashScreen start");

    // Only show for local player, not server
    if (this.owner === this.serverPlayer) {
      return;
    }

    console.log("🎬 SplashScreen initialized for local player");

    // Auto-show the splash screen on start if autoHide is enabled
    if (this.props.autoHide) {
      // Small delay to ensure UI is ready
      this.async.setTimeout(() => {
        this.showSplashScreen();
      }, 100);
    }
  }

  /**
   * Initialize the UI structure
   */
  initializeUI() {
    console.log("🎬 SplashScreen initializeUI called");
    console.log("🎬 Props:", {
      titleText: this.props.titleText,
      autoHide: this.props.autoHide,
      displayDuration: this.props.displayDuration,
    });

    return View({
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        opacity: this.opacityBinding,
        transform: [{ scale: this.scaleBinding }],
        zIndex: 1000,
      },
      children: [
        // Background overlay
        View({
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: this.colorToString(this.props.backgroundColor),
          },
        }),

        // Main content container
        View({
          style: {
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
            maxWidth: 600,
            width: "90%",
          },
          children: [
            // Background image (if provided)
            ...(this.props.backgroundImage
              ? [
                  Image({
                    source: ImageSource.fromTextureAsset(
                      this.props.backgroundImage as TextureAsset
                    ),
                    style: {
                      width: 300,
                      height: 200,
                      borderRadius: 15,
                      marginBottom: 30,
                      opacity: 0.9,
                    },
                  }),
                ]
              : []),

            // Title text
            Text({
              text: this.titleBinding,
              style: {
                fontSize: 36,
                fontWeight: "bold",
                color: this.colorToString(this.props.titleColor),
                textAlign: "center",
                marginBottom: 15,
                paddingHorizontal: 20,
              },
            }),

            // Subtitle text
            Text({
              text: this.subtitleBinding,
              style: {
                fontSize: 20,
                color: this.colorToString(this.props.subtitleColor),
                textAlign: "center",
                marginBottom: 30,
                paddingHorizontal: 20,
              },
            }),

            // Simple loading dots
            View({
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
   * Create a simple loading dot
   */
  private createDot() {
    return View({
      style: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: this.colorToString(this.props.titleColor),
        marginHorizontal: 3,
        opacity: 0.7,
      },
    });
  }

  /**
   * Show the splash screen with fade-in animation
   */
  public showSplashScreen() {
    const duration = this.props.displayDuration || 3.0;
    console.log(`🎬 Showing splash screen for ${duration} seconds`);

    this.isVisible = true;

    // Animate fade in and scale up
    const animDuration = (this.props.animationDuration || 0.5) * 1000;
    this.opacityBinding.set(Animation.timing(1, { duration: animDuration }));
    this.scaleBinding.set(Animation.timing(1, { duration: animDuration }));

    // Auto-hide after duration if enabled
    if (this.props.autoHide && duration > 0) {
      this.hideTimeout = this.async.setTimeout(() => {
        this.hideSplashScreen();
      }, duration * 1000);
    }
  }

  /**
   * Hide the splash screen with fade-out animation
   */
  public hideSplashScreen() {
    if (!this.isVisible) return;

    console.log("🎬 Hiding splash screen");

    this.isVisible = false;

    // Clear any pending hide timeout
    if (this.hideTimeout) {
      this.async.clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }

    // Animate fade out and scale down
    const animDuration = (this.props.animationDuration || 0.5) * 1000;
    this.opacityBinding.set(Animation.timing(0, { duration: animDuration }));
    this.scaleBinding.set(Animation.timing(0.9, { duration: animDuration }));
  }

  /**
   * Update the title text dynamically
   */
  public updateTitle(newTitle: string) {
    console.log(`🎬 Title updated to: ${newTitle}`);
    this.titleBinding.set(newTitle);
  }

  /**
   * Update the subtitle text dynamically
   */
  public updateSubtitle(newSubtitle: string) {
    console.log(`🎬 Subtitle updated to: ${newSubtitle}`);
    this.subtitleBinding.set(newSubtitle);
  }

  /**
   * Manually trigger showing the splash screen
   */
  public show() {
    this.showSplashScreen();
  }

  /**
   * Manually trigger hiding the splash screen
   */
  public hide() {
    this.hideSplashScreen();
  }

  /**
   * Convert Color object to string with optional opacity
   */
  private colorToString(color: Color, opacity: number = 1.0): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    if (opacity < 1) {
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
}

// Register the component with Horizon Worlds
UIComponent.register(SplashScreen);
