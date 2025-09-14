/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/**
  This script defines the custom UI, which is the Trading Store in the world. 

  This custom UI:
  - allows trading of green gems for gold coins
  - allows trading of gold coins for a red gem
  - maintains counts of the players green gems, coins, and red gems

  Custom UI also sends the events to complete quests, which are:
  - trade 5 green gems for 1 coin
  - trade 1 coin for 1 red gem

  These events are handled in the Quest Manager.
 */


import * as hz from 'horizon/core'
import * as hzui from 'horizon/ui'

import * as NPCManager from 'NPCManager'
import * as DataStore from 'DataStore'
import { QuestNames, questComplete } from 'QuestManager'

// $$$ SPO Added.
import { merchantTakesGem } from 'GameManager';
import { isNPC } from 'Utils';


const GreentoCoin_GREEN = 5
const GreentoCoin_COIN = 1

const CoinToRed_COIN = 1
const CoinToRed_RED = 1

export class EconomyUI extends hzui.UIComponent<typeof EconomyUI> {
  static propsDefinition = {}

  protected panelHeight: number = 1080
  protected panelWidth: number = 1920

  COIN_COUNT = new hzui.Binding<number>(0)
  GEM_COUNT = new hzui.Binding<number>(0)
  RED_GEM_COUNT = new hzui.Binding<number>(0)

  TRADE_BUTTON_HOVER = new hzui.Binding<Boolean>(false)
  TRADE2_BUTTON_HOVER = new hzui.Binding<Boolean>(false)
  CONFIRMATION_POPUP = new hzui.Binding<Boolean>(false)
  CONFIRMATION2_POPUP = new hzui.Binding<Boolean>(false)

  CANCEL_BUTTON_HOVER = new hzui.Binding<Boolean>(false)
  CONFIRM_BUTTON_HOVER = new hzui.Binding<Boolean>(false)

  CANCEL2_BUTTON_HOVER = new hzui.Binding<Boolean>(false)
  CONFIRM2_BUTTON_HOVER = new hzui.Binding<Boolean>(false)

  public refresh(player: hz.Player) {
    // console.log("[EconomyUI] running refresh for " + player.name.get())
    this.COIN_COUNT.set(this.GetCoins(player), [player])
    this.GEM_COUNT.set(this.GetGems(player), [player])
    // console.log("[EconomyUI] RetVal of getGems for " + player.name.get() + ": " + this.GetGems(player).toString())
    this.RED_GEM_COUNT.set(this.GetRedGems(player), [player])
  }

  initializeUI() {

    return hzui.View({
      style: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: hz.Color.black,
        borderColor: hz.Color.fromHex('#E6901C'),
        borderWidth: 4
      },
      children: [
        // Coins
        hzui.Text({
          style: {
            fontFamily: 'Kallisto',
            fontSize: 96,
          color: hz.Color.fromHex('#E6901C'),
            textAlign: 'center'
          },
          text: hzui.Binding.derive([this.COIN_COUNT], (cointCount: number) => {
            return `COINS: ${cointCount}`
          })
        }),
        // Gems
        hzui.Text({
          style: {
            fontFamily: 'Kallisto',
            fontSize: 96,
            color: hz.Color.fromHex('#E6901C'),
            textAlign: 'center'
          },
          text: hzui.Binding.derive([this.GEM_COUNT], (gemCount: number) => {
            return `GREEN GEMS: ${gemCount}`
          })
        }),
        // Red Gems
        hzui.Text({
          style: {
            fontFamily: 'Kallisto',
            fontSize: 96,
            color: hz.Color.fromHex('#E6901C'),
            textAlign: 'center'
          },
          text: hzui.Binding.derive([this.RED_GEM_COUNT], (gemCount: number) => {
            return `RED GEMS: ${gemCount}`
          })
        }),
        // Trade Button
        hzui.Pressable({
          style: {
            height: '25%',
            width: '75%',
            backgroundColor: hzui.Binding.derive([this.TRADE_BUTTON_HOVER], (hovered: Boolean) => {
              if (hovered)
              return hz.Color.fromHex('#E6901C')
              else
                return hz.Color.black
            }),
            borderColor: hzui.Binding.derive([this.TRADE_BUTTON_HOVER], (hovered: Boolean) => {
              if (hovered)
                return hz.Color.black
              else
                return hz.Color.fromHex('#E6901C')
            }),
            borderWidth: 4
          },
          children: [
            hzui.Text({
              style: {
                fontFamily: 'Kallisto',
                fontSize: 96,
                color: hzui.Binding.derive([this.TRADE_BUTTON_HOVER], (hovered: Boolean) => {
                  if (hovered)
                    return hz.Color.black
                  else
                  return hz.Color.fromHex('#E6901C')
                }),
                textAlign: 'center',
                textAlignVertical: 'center',
              },
              text: `TRADE\n${GreentoCoin_GREEN} GREEN GEM -> ${GreentoCoin_COIN} COIN`
            })
          ],
          onEnter: (player: hz.Player) => {
            this.TRADE_BUTTON_HOVER.set(true, [player])
          },
          onExit: (player: hz.Player) => {
            this.TRADE_BUTTON_HOVER.set(false, [player])
          },
          onRelease: (player: hz.Player) => {
            this.CONFIRMATION_POPUP.set(true, [player])
          }
        }),
        // Trade 2
        hzui.Pressable({
          style: {
            height: '25%',
            width: '75%',
            backgroundColor: hzui.Binding.derive([this.TRADE2_BUTTON_HOVER], (hovered: Boolean) => {
              if (hovered)
                return hz.Color.fromHex('#E6901C')
              else
                return hz.Color.black
            }),
            borderColor: hzui.Binding.derive([this.TRADE2_BUTTON_HOVER], (hovered: Boolean) => {
              if (hovered)
                return hz.Color.black
              else
                return hz.Color.fromHex('#E6901C')
            }),
            borderWidth: 4
          },
          children: [
            hzui.Text({
              style: {
                fontFamily: 'Kallisto',
                fontSize: 96,
                color: hzui.Binding.derive([this.TRADE2_BUTTON_HOVER], (hovered: Boolean) => {
                  if (hovered)
                    return hz.Color.black
                  else
                    return hz.Color.fromHex('#E6901C')
                }),
                textAlign: 'center',
                textAlignVertical: 'center',
              },
              text: `TRADE\n${CoinToRed_COIN} COIN -> ${CoinToRed_RED} RED GEM`
            })
          ],
          onEnter: (player: hz.Player) => {
            this.TRADE2_BUTTON_HOVER.set(true, [player])
          },
          onExit: (player: hz.Player) => {
            this.TRADE2_BUTTON_HOVER.set(false, [player])
          },
          onRelease: (player: hz.Player) => {
            this.CONFIRMATION2_POPUP.set(true, [player])
          }
        }),
        // Confirm Dialogue
        hzui.View({
          style: {
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '50%',
            width: '50%',
            position: 'absolute',
            backgroundColor: hz.Color.black,
            borderColor: hz.Color.fromHex('#E6901C'),
            borderWidth: 4,
            display: hzui.Binding.derive([this.CONFIRMATION_POPUP], (active: Boolean) => {
              if (active)
                return 'flex'
              else
                return 'none'
            })
          },
          children: [
            hzui.Text({
              style: {
                fontFamily: 'Kallisto',
                fontSize: 96,
                color: hz.Color.fromHex('#E6901C'),
                textAlign: 'center'
              },
              text: 'CONFIRM:'
            }),
            hzui.Text({
              style: {
                fontFamily: 'Kallisto',
                fontSize: 72,
                color: hz.Color.fromHex('#E6901C'),
                textAlign: 'center'
              },
              text: `${GreentoCoin_GREEN} GREEN GEM -> ${GreentoCoin_COIN} COIN`
            }),
            hzui.View({
              style: {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                height: '20%',
                width: '100%',
              },
              children: [
                // Cancel
                hzui.Pressable({
                  style: {
                    height: '100%',
                    width: '40%',
                    backgroundColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.fromHex('#E6901C')
                      else
                        return hz.Color.black
                    }),
                    borderColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.black
                      else
                        return hz.Color.fromHex('#E6901C')
                    }),
                    borderWidth: 4
                  },
                  children: [
                    hzui.Text({
                      style: {
                        fontFamily: 'Kallisto',
                        fontSize: 72,
                        color: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered: Boolean) => {
                          if (hovered)
                            return hz.Color.black
                          else
                            return hz.Color.fromHex('#E6901C')
                        }),
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      },
                      text: "CANCEL"
                    })
                  ],
                  onEnter: (player: hz.Player) => {
                    this.CANCEL_BUTTON_HOVER.set(true, [player])
                  },
                  onExit: (player: hz.Player) => {
                    this.CANCEL_BUTTON_HOVER.set(false, [player])
                  },
                  onRelease: (player: hz.Player) => {
                    this.CONFIRMATION_POPUP.set(false, [player])
                  }
                }),
                // Accept
                hzui.Pressable({
                  style: {
                    height: '100%',
                    width: '40%',
                    backgroundColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.fromHex('#E6901C')
                      else
                        return hz.Color.black
                    }),
                    borderColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.black
                      else
                        return hz.Color.fromHex('#E6901C')
                    }),
                    borderWidth: 4,
                    display: hzui.Binding.derive([this.GEM_COUNT], (count: number) => {
                      if (count >= GreentoCoin_GREEN) {
                        return 'flex'
                      }
                      else {
                        return 'none'
                      }
                    })
                  },
                  children: [
                    hzui.Text({
                      style: {
                        fontFamily: 'Kallisto',
                        fontSize: 72,
                        color: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered: Boolean) => {
                          if (hovered)
                            return hz.Color.black
                          else
                            return hz.Color.fromHex('#E6901C')
                        }),
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      },
                      text: "CONFIRM"
                    })
                  ],
                  onEnter: (player: hz.Player) => {
                    this.CONFIRM_BUTTON_HOVER.set(true, [player])
                  },
                  onExit: (player: hz.Player) => {
                    this.CONFIRM_BUTTON_HOVER.set(false, [player])
                  },
                  onRelease: (player: hz.Player) => {
                    // $$$ SPO Added isNPC()
                    if (!isNPC(player)) {
                      const GemCount = this.GetGems(player)
                      if (GemCount >= GreentoCoin_GREEN) {
                        this.CONFIRMATION_POPUP.set(false, [player])
                        this.HandleGreenGemToCoinTransaction(player,GreentoCoin_GREEN, GreentoCoin_COIN)
                      }
                    }
                  }
                }),
              ]
            })
          ]
        }),
        // Confirm 2 Dialogue
        hzui.View({
          style: {
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '50%',
            width: '50%',
            position: 'absolute',
            backgroundColor: hz.Color.black,
            borderColor: hz.Color.fromHex('#E6901C'),
            borderWidth: 4,
            display: hzui.Binding.derive([this.CONFIRMATION2_POPUP], (active: Boolean) => {
              if (active)
                return 'flex'
              else
                return 'none'
            })
          },
          children: [
            hzui.Text({
              style: {
                fontFamily: 'Kallisto',
                fontSize: 96,
                color: hz.Color.fromHex('#E6901C'),
                textAlign: 'center'
              },
              text: 'CONFIRM:'
            }),
            hzui.Text({
              style: {
                fontFamily: 'Kallisto',
                fontSize: 72,
                color: hz.Color.fromHex('#E6901C'),
                textAlign: 'center'
              },
              text: `${CoinToRed_COIN} COIN -> ${CoinToRed_RED} RED GEM`
            }),
            hzui.View({
              style: {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                height: '20%',
                width: '100%',
              },
              children: [
                // Cancel
                hzui.Pressable({
                  style: {
                    height: '100%',
                    width: '40%',
                    backgroundColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.fromHex('#E6901C')
                      else
                        return hz.Color.black
                    }),
                    borderColor: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.black
                      else
                        return hz.Color.fromHex('#E6901C')
                    }),
                    borderWidth: 4
                  },
                  children: [
                    hzui.Text({
                      style: {
                        fontFamily: 'Kallisto',
                        fontSize: 72,
                        color: hzui.Binding.derive([this.CANCEL_BUTTON_HOVER], (hovered: Boolean) => {
                          if (hovered)
                            return hz.Color.black
                          else
                            return hz.Color.fromHex('#E6901C')
                        }),
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      },
                      text: "CANCEL"
                    })
                  ],
                  onEnter: (player: hz.Player) => {
                    this.CANCEL_BUTTON_HOVER.set(true, [player])
                  },
                  onExit: (player: hz.Player) => {
                    this.CANCEL_BUTTON_HOVER.set(false, [player])
                  },
                  onRelease: (player: hz.Player) => {
                    this.CONFIRMATION2_POPUP.set(false, [player])
                  }
                }),
                // Accept
                hzui.Pressable({
                  style: {
                    height: '100%',
                    width: '40%',
                    backgroundColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.fromHex('#E6901C')
                      else
                        return hz.Color.black
                    }),
                    borderColor: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered: Boolean) => {
                      if (hovered)
                        return hz.Color.black
                      else
                        return hz.Color.fromHex('#E6901C')
                    }),
                    borderWidth: 4,
                    display: hzui.Binding.derive([this.COIN_COUNT], (count: number) => {
                      if (count >= CoinToRed_COIN) {
                        return 'flex'
                      }
                      else {
                        return 'none'
                      }
                    })
                  },
                  children: [
                    hzui.Text({
                      style: {
                        fontFamily: 'Kallisto',
                        fontSize: 72,
                        color: hzui.Binding.derive([this.CONFIRM_BUTTON_HOVER], (hovered: Boolean) => {
                          if (hovered)
                            return hz.Color.black
                          else
                            return hz.Color.fromHex('#E6901C')
                        }),
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      },
                      text: "CONFIRM"
                    })
                  ],
                  onEnter: (player: hz.Player) => {
                    this.CONFIRM_BUTTON_HOVER.set(true, [player])
                  },
                  onExit: (player: hz.Player) => {
                    this.CONFIRM_BUTTON_HOVER.set(false, [player])
                  },
                  onRelease: (player: hz.Player) => {
                    const CoinCount = this.GetCoins(player)
                    if (CoinCount >= CoinToRed_COIN) {
                      this.CONFIRMATION2_POPUP.set(false, [player])
                      this.HandleCoinToRedGemTransaction(player, CoinToRed_COIN, CoinToRed_RED)
                    }
                  }
                }),
              ]
            })
          ]
        })
      ]
    })
  }

  // when the Green Gem -> 1 Coin transaction is confirmed, this function handles it.
  HandleGreenGemToCoinTransaction(player: hz.Player, GemDelta: number, CoinDelta: number) {
    const manager = DataStore.dataStore.getData('NPCManager') as (NPCManager.NPCManager)
    const playerState = manager.playerMap.get(player.id)
    if (playerState != undefined) {
      console.warn("HandleGreenGemToCoinTransaction");
      playerState.gemsCollected -= GemDelta
      playerState.coins += CoinDelta
      if (player.hasCompletedAchievement('QuestCollect1Coin') == false) { // send event to resolve QuestCollect1Coin quest
        this.sendLocalBroadcastEvent( questComplete, {player: player, questName: QuestNames.QuestCollect1Coin } );
      } 
      manager.onTransactionDone(playerState, GemDelta, CoinDelta);
    }
    this.refresh(player)
  }

  // when the 1 Coin -> 1 Red Gem transaction is confirmed, this function handles it.
  HandleCoinToRedGemTransaction(player: hz.Player, CoinDelta: number, GemDelta: number) {
    const manager = DataStore.dataStore.getData('NPCManager') as (NPCManager.NPCManager)
    const playerState = manager.playerMap.get(player.id)
    if (playerState != undefined) {
      playerState.coins -= CoinDelta
      playerState.redGems += GemDelta
      if (player.hasCompletedAchievement('Collect1RedGem') == false) { // send event to resolve QuestCollect1RedGem quest
        this.sendLocalBroadcastEvent( questComplete, {player: player, questName: QuestNames.Collect1RedGem } );
      } 
      manager.onTransactionDone(playerState, GemDelta, CoinDelta);

    }
    this.refresh(player)
  }

  // retrieves count of player green gems
  GetGems(player: hz.Player): number {
    let retVal = 0
    const manager = DataStore.dataStore.getData('NPCManager') as (NPCManager.NPCManager)
    if (manager != undefined) {
      const playerState = manager.playerMap.get(player.id)
      if (playerState != undefined) {
        retVal = playerState.gemsCollected
      } 
    }
    return retVal
  }

  // retrieves count of player red gems
  GetRedGems(player: hz.Player): number {
    let retVal = 0
    const manager = DataStore.dataStore.getData('NPCManager') as (NPCManager.NPCManager)
    if (manager != undefined) {
      const playerState = manager.playerMap.get(player.id)
      if (playerState != undefined) {
        retVal = playerState.redGems
      }
    }
    return retVal
  }

  // retrieves count of player gold coins
  GetCoins(player: hz.Player): number {
    let retVal = 0
    const manager = DataStore.dataStore.getData('NPCManager') as (NPCManager.NPCManager)
    if (manager != undefined) {
      const playerState = manager.playerMap.get(player.id)
      if (playerState != undefined) {
        retVal = playerState.coins
      }
    }
    return retVal
  }

  start() {
    let UIs: Array<EconomyUI> = DataStore.dataStore.getData('EconomyUIs') as (Array<EconomyUI>)
    if (UIs == undefined) {
      UIs = []
    }
    UIs.push(this)
    DataStore.dataStore.setData('EconomyUIs', UIs)
  }
}
hzui.UIComponent.register(EconomyUI)