import * as hz from 'horizon/core';
import * as ui from 'horizon/ui';
import { scoreUpdateEvent, upgradePurchaseEvent, type Upgrade } from './CapybaraClickerGame';

/**
 * Capybara Clicker UI Component
 *
 * Displays the game UI including:
 * - Current score with formatting
 * - Click value indicator
 * - Auto-click rate
 * - Upgrade shop with purchase buttons
 * - Click animations
 */

class CapybaraClickerUI extends ui.UIComponent<typeof CapybaraClickerUI> {
  static propsDefinition = {
    // Visual settings
    displaySize: { type: hz.PropTypes.Number, default: 60 },
    primaryColor: { type: hz.PropTypes.String, default: "#FFB84D" }, // Capybara orange
    secondaryColor: { type: hz.PropTypes.String, default: "#8B4513" }, // Brown
    accentColor: { type: hz.PropTypes.String, default: "#4CAF50" }, // Green for positive
    // Shop settings
    showShop: { type: hz.PropTypes.Boolean, default: true },
  };

  // Bindings for reactive UI
  private score = new ui.Binding<string>("0");
  private clickValue = new ui.Binding<number>(1);
  private autoClickRate = new ui.Binding<number>(0);
  private showClickAnimation = new ui.Binding<boolean>(false);
  private clickAnimationValue = new ui.Binding<string>("+1");

  // Shop bindings
  private shopVisible = new ui.Binding<boolean>(false);

  // Upgrade bindings
  private upgrades = new ui.Binding<UpgradeUIData[]>([
    {
      id: 'clickPower',
      name: 'Better Clicks',
      description: '+1 point per click',
      cost: '10',
      level: 0,
      canAfford: false,
    },
    {
      id: 'autoClicker',
      name: 'Auto Clicker',
      description: '+1 click per second',
      cost: '50',
      level: 0,
      canAfford: false,
    },
    {
      id: 'clickMultiplier',
      name: 'Click Multiplier',
      description: '+50% to all clicks',
      cost: '100',
      level: 0,
      canAfford: false,
    },
  ]);

  private currentScore = 0;

  start() {
    // Listen for score updates
    this.connectNetworkBroadcastEvent(scoreUpdateEvent, (data) => {
      this.updateUI(data);
    });

    // Initialize on player join
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => {
        // Initial UI state will be set by scoreUpdateEvent
      }
    );
  }

  private updateUI(data: {
    oldValue: number;
    newValue: number;
    player: hz.Player;
    clickValue: number;
    autoClickRate: number;
  }) {
    // Update score display
    this.score.set(this.formatNumber(data.newValue), [data.player]);
    this.currentScore = data.newValue;

    // Update click and auto-click values
    this.clickValue.set(data.clickValue, [data.player]);
    this.autoClickRate.set(data.autoClickRate, [data.player]);

    // Show click animation if score increased from a click (not auto-click)
    if (data.newValue > data.oldValue && data.newValue - data.oldValue === data.clickValue) {
      this.showClickFeedback(data.clickValue, data.player);
    }

    // Update upgrade affordability
    this.updateUpgradeAffordability(data.newValue, [data.player]);
  }

  private showClickFeedback(value: number, player: hz.Player) {
    this.clickAnimationValue.set(`+${value}`, [player]);
    this.showClickAnimation.set(true, [player]);

    this.async.setTimeout(() => {
      this.showClickAnimation.set(false, [player]);
    }, 500);
  }

  private updateUpgradeAffordability(currentScore: number, players: hz.Player[]) {
    const upgradesData = this.upgrades.get();
    const updated = upgradesData.map(upgrade => ({
      ...upgrade,
      canAfford: currentScore >= parseInt(upgrade.cost),
    }));
    this.upgrades.set(updated, players);
  }

  private handleUpgradePurchase(upgradeId: string, player: hz.Player) {
    const upgradesData = this.upgrades.get();
    const upgrade = upgradesData.find(u => u.id === upgradeId);

    if (!upgrade) return;

    const cost = parseInt(upgrade.cost);

    // Send purchase event to game component
    this.sendNetworkBroadcastEvent(upgradePurchaseEvent, {
      player,
      upgradeType: upgradeId,
      cost,
    });

    // Update UI optimistically
    upgrade.level++;
    const newCost = this.calculateUpgradeCost(upgradeId, upgrade.level);
    upgrade.cost = newCost.toString();
    this.upgrades.set([...upgradesData], [player]);
  }

  private calculateUpgradeCost(upgradeId: string, level: number): number {
    const baseCosts: { [key: string]: number } = {
      clickPower: 10,
      autoClicker: 50,
      clickMultiplier: 100,
    };

    const multipliers: { [key: string]: number } = {
      clickPower: 1.5,
      autoClicker: 2,
      clickMultiplier: 3,
    };

    const baseCost = baseCosts[upgradeId] || 10;
    const multiplier = multipliers[upgradeId] || 1.5;

    return Math.floor(baseCost * Math.pow(multiplier, level));
  }

  initializeUI(): ui.UINode {
    return ui.View({
      children: [
        // Main score display
        this.createScoreDisplay(),

        // Click animation
        this.createClickAnimation(),

        // Stats panel
        this.createStatsPanel(),

        // Shop button
        this.createShopButton(),

        // Shop panel (conditional)
        ui.UINode.if(this.shopVisible, this.createShopPanel()),
      ],
      style: {
        width: '100%',
        height: '100%',
      },
    });
  }

  private createScoreDisplay(): ui.UINode {
    return ui.View({
      children: [
        ui.Text({
          text: "Capybara Points",
          style: {
            fontSize: this.props.displaySize * 0.4,
            color: this.props.secondaryColor,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
        ui.Text({
          text: this.score,
          style: {
            fontSize: this.props.displaySize,
            color: this.props.primaryColor,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 5,
          },
        }),
      ],
      style: {
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: [{ translateX: -200 }],
        width: 400,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
      },
    });
  }

  private createClickAnimation(): ui.UINode {
    return ui.View({
      children: ui.UINode.if(
        this.showClickAnimation,
        ui.Text({
          text: this.clickAnimationValue,
          style: {
            fontSize: this.props.displaySize * 0.8,
            color: this.props.accentColor,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        })
      ),
      style: {
        position: 'absolute',
        top: 150,
        left: '50%',
        transform: [{ translateX: -50 }],
        width: 100,
      },
    });
  }

  private createStatsPanel(): ui.UINode {
    return ui.View({
      children: [
        ui.Text({
          text: "Stats",
          style: {
            fontSize: this.props.displaySize * 0.5,
            color: this.props.primaryColor,
            fontWeight: 'bold',
            marginBottom: 10,
          },
        }),
        ui.Text({
          text: this.clickValue.derive(val => `Click Power: ${val}`),
          style: {
            fontSize: this.props.displaySize * 0.35,
            color: '#FFFFFF',
            marginBottom: 5,
          },
        }),
        ui.Text({
          text: this.autoClickRate.derive(val => `Auto-Click: ${val}/sec`),
          style: {
            fontSize: this.props.displaySize * 0.35,
            color: '#FFFFFF',
          },
        }),
      ],
      style: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        padding: 12,
        minWidth: 200,
      },
    });
  }

  private createShopButton(): ui.UINode {
    return ui.View({
      children: [
        ui.Pressable({
          onPress: (player) => {
            const current = this.shopVisible.get([player])[0];
            this.shopVisible.set(!current, [player]);
          },
          style: {
            backgroundColor: this.props.primaryColor,
            borderRadius: 10,
            padding: 15,
            width: '100%',
            alignItems: 'center',
          },
        }),
        ui.Text({
          text: this.shopVisible.derive(visible => visible ? "Close Shop" : "Open Shop"),
          style: {
            fontSize: this.props.displaySize * 0.5,
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
            position: 'absolute',
            width: '100%',
            top: 15,
          },
        }),
      ],
      style: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -100 }],
        width: 200,
      },
    });
  }

  private createShopPanel(): ui.UINode {
    return ui.View({
      children: [
        ui.Text({
          text: "Upgrade Shop",
          style: {
            fontSize: this.props.displaySize * 0.6,
            color: this.props.primaryColor,
            fontWeight: 'bold',
            marginBottom: 15,
            textAlign: 'center',
          },
        }),
        ui.ScrollView({
          children: this.upgrades.derive(upgrades =>
            upgrades.map(upgrade => this.createUpgradeItem(upgrade))
          ),
          style: {
            maxHeight: 400,
          },
        }),
      ],
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -250 }, { translateY: -250 }],
        width: 500,
        maxHeight: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        borderWidth: 3,
        borderColor: this.props.primaryColor,
      },
    });
  }

  private createUpgradeItem(upgrade: UpgradeUIData): ui.UINode {
    return ui.View({
      children: [
        ui.View({
          children: [
            ui.Text({
              text: `${upgrade.name} (Lvl ${upgrade.level})`,
              style: {
                fontSize: this.props.displaySize * 0.4,
                color: '#FFFFFF',
                fontWeight: 'bold',
              },
            }),
            ui.Text({
              text: upgrade.description,
              style: {
                fontSize: this.props.displaySize * 0.3,
                color: '#CCCCCC',
                marginTop: 5,
              },
            }),
          ],
          style: {
            flex: 1,
          },
        }),
        ui.View({
          children: [
            ui.Pressable({
              onPress: (player) => {
                if (upgrade.canAfford) {
                  this.handleUpgradePurchase(upgrade.id, player);
                }
              },
              style: {
                backgroundColor: upgrade.canAfford ? this.props.accentColor : '#666666',
                borderRadius: 8,
                padding: 12,
                minWidth: 100,
                alignItems: 'center',
              },
            }),
            ui.Text({
              text: `${this.formatNumber(parseInt(upgrade.cost))} pts`,
              style: {
                fontSize: this.props.displaySize * 0.35,
                color: '#FFFFFF',
                fontWeight: 'bold',
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
                top: 12,
              },
            }),
          ],
        }),
      ],
      style: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
      },
    });
  }

  private formatNumber(num: number): string {
    if (num < 1000) {
      return Math.floor(num).toString();
    } else if (num < 1000000) {
      return (Math.floor(num / 100) / 10) + "K";
    } else if (num < 1000000000) {
      return (Math.floor(num / 100000) / 10) + "M";
    } else if (num < 1000000000000) {
      return (Math.floor(num / 100000000) / 10) + "B";
    } else {
      return (Math.floor(num / 100000000000) / 10) + "T";
    }
  }
}

interface UpgradeUIData {
  id: string;
  name: string;
  description: string;
  cost: string;
  level: number;
  canAfford: boolean;
}

ui.UIComponent.register(CapybaraClickerUI);
