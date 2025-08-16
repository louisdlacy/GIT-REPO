/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════╗
 * ║                                  DISCLAIMER                                          ║
 * ║                                 May 28, 2025                                         ║
 * ║                                                                                      ║
 * ║      ██╗██╗   ██╗███╗   ██╗██╗   ██╗██╗   ██╗██╗  ██╗██╗   ██╗██████╗              ║
 * ║      ██║██║   ██║████╗  ██║╚██╗ ██╔╝██║   ██║██║  ██║██║   ██║██╔══██╗             ║
 * ║      ██║██║   ██║██╔██╗ ██║ ╚████╔╝ ██║   ██║███████║██║   ██║██████╔╝             ║
 * ║ ██   ██║██║   ██║██║╚██╗██║  ╚██╔╝  ██║   ██║██╔══██║╚██╗ ██╔╝██╔══██╗             ║
 * ║ ╚█████╔╝╚██████╔╝██║ ╚████║   ██║   ╚██████╔╝██║  ██║ ╚████╔╝ ██║  ██║             ║
 * ║  ╚════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝             ║
 * ║                                                                                      ║
 * ║  📢 PUBLIC ASSET NOTICE:                                                            ║
 * ║      This asset is freely available for MHCP (Meta Horizon Creator Program)      ║
 * ║      members to use and modify for their own projects                               ║
 * ║                                                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════╝
 */

import { Component } from 'horizon/core';
import * as hz from 'horizon/core';
import { UIComponent, View, Text, Pressable, Binding, AnimatedBinding, Easing, Animation, Image, ImageSource } from 'horizon/ui';

namespace game {
    // Asset IDs for game textures and sounds
    export const ASSET_IDS = {
        HEART_TEXTURE: '683581487797261', // Replace with actual heart texture
    } as const;

    // Mode enum for the different compatibility types
    export enum LoveMeterMode {
        Love = 'love',
        Friendship = 'friendship',
        DrinkingPartner = 'drinking'
    }

    interface LoveMeterState {
        started: boolean;
        calculating: boolean;
        percentage: number;
        player1Name: string;
        player2Name: string;
        player1Joined: boolean;
        player2Joined: boolean;
        player1Id: string;
        player2Id: string;
        message: string;
        mode: LoveMeterMode; // Current mode of the love meter 
    }

    export interface LoveMeterProps {
        heartTexture: hz.TextureAsset;
        startSound: hz.Entity | null;
        resultSound: hz.Entity | null;
    }

    export class LoveMeterUI extends UIComponent<LoveMeterProps> {
        private readonly stateBinding: Binding<LoveMeterState>;
        private readonly timerBinding: AnimatedBinding;
        protected panelWidth: number = 1080;
        protected panelHeight: number = 1080;

        static propsDefinition = {
            heartTexture: { type: hz.PropTypes.Asset },
            startSound: { type: hz.PropTypes.Entity, nullable: true },
            resultSound: { type: hz.PropTypes.Entity, nullable: true }
        };

        constructor() {
            super();
            this.stateBinding = new Binding<LoveMeterState>({
                started: false,
                calculating: false,
                percentage: 0,
                player1Name: 'Player 1',
                player2Name: 'Player 2',
                player1Joined: false,
                player2Joined: false,
                player1Id: '',
                player2Id: '',
                message: '',
                mode: LoveMeterMode.Love // Default to Love mode
            });
            this.timerBinding = new AnimatedBinding(0);
        }
        
        // Mode selection handlers
        private onSelectLoveMode = () => {
            this.stateBinding.set(state => ({
                ...state,
                mode: LoveMeterMode.Love
            }));
        };
        
        private onSelectFriendshipMode = () => {
            this.stateBinding.set(state => ({
                ...state,
                mode: LoveMeterMode.Friendship
            }));
        };
        
        private onSelectDrinkingPartnerMode = () => {
            this.stateBinding.set(state => ({
                ...state,
                mode: LoveMeterMode.DrinkingPartner
            }));
        }

        private onJoinPlayer1 = (player: hz.Player) => {
            if (!player) return;
            
            this.stateBinding.set(state => {
                // If we had results shown, reset everything except the new player
                if (state.started) {
                    return {
                        started: false,
                        calculating: false,
                        percentage: 0,
                        message: '',
                        player1Joined: true,
                        player2Joined: false,
                        player1Id: player.index.get().toString(),
                        player2Id: '',
                        player1Name: player.name.get(),
                        player2Name: 'Player 2',
                        mode: state.mode // Preserve the current mode
                    };
                }
                
                // Otherwise just update player 1's info
                return {
                    ...state,
                    player1Joined: true,
                    player1Id: player.index.get().toString(),
                    player1Name: player.name.get()
                };
            });
            this.timerBinding.set(0);
        };

        private onJoinPlayer2 = (player: hz.Player) => {
            if (!player) return;
            
            this.stateBinding.set(state => {
                // If we had results shown, reset everything except the new player
                if (state.started) {
                    return {
                        started: false,
                        calculating: false,
                        percentage: 0,
                        message: '',
                        player1Joined: false,
                        player2Joined: true,
                        player1Id: '',
                        player2Id: player.index.get().toString(),
                        player1Name: 'Player 1',
                        player2Name: player.name.get(),
                        mode: state.mode // Preserve the current mode
                    };
                }
                
                // Otherwise just update player 2's info
                return {
                    ...state,
                    player2Joined: true,
                    player2Id: player.index.get().toString(),
                    player2Name: player.name.get()
                };
            });
            this.timerBinding.set(0);
        };

        private onStart = () => {
            this.stateBinding.set(state => {
                if (state.player1Joined && state.player2Joined && !state.calculating) {
                    if (this.props.startSound) {
                        const startGizmo = (this.props.startSound as hz.Entity).as(hz.AudioGizmo);
                        if (startGizmo) {
                            startGizmo.play();
                        }
                    }

                    // Generate result
                    const percentage = Math.floor(Math.random() * 101);
                    const message = this.getMessage(percentage, state.mode);

                    return {
                        ...state,
                        started: true,
                        calculating: true,
                        percentage: 0,
                        message: ''
                    };
                }
                return state;
            });

            this.timerBinding.set(Animation.timing(1, {
                duration: 2500,
                easing: Easing.linear
            }), () => {
                this.stateBinding.set(s => {
                    const percentage = Math.floor(Math.random() * 101);
                    return {
                        ...s,
                        calculating: false,
                        percentage: percentage,
                        message: this.getMessage(percentage, s.mode)
                    };
                });

                if (this.props.resultSound) {
                    const resultGizmo = (this.props.resultSound as hz.Entity).as(hz.AudioGizmo);
                    if (resultGizmo) {
                        resultGizmo.play();
                    }
                }
            });
        };

        private getMessage(percentage: number, mode: LoveMeterMode): string {
            switch (mode) {
                case LoveMeterMode.Love:
                    return this.getLoveMessage(percentage);
                case LoveMeterMode.Friendship:
                    return this.getFriendshipMessage(percentage);
                case LoveMeterMode.DrinkingPartner:
                    return this.getDrinkingPartnerMessage(percentage);
                default:
                    return this.getLoveMessage(percentage);
            }
        }

        private getLoveMessage(percentage: number): string {
            if (percentage <= 5) {
                return "New Oculus, Who Dis?\nIce cold...\nTime to swipe left! ❄️";
            } else if (percentage <= 10) {
                return "Barely a flicker...\nLike a match in a monsoon.\nBetter luck next time! 🔥";
            } else if (percentage <= 15) {
                return "A slow burn...\nThere's potential, but it's a long game.\nPatience is a virtue! ⏳";
            } else if (percentage <= 20) {
                return "Warming up...\nLike a cozy blanket on a chilly night.\nCould be something more! 🌙";
            } else if (percentage <= 25) {
                return "A gentle simmer...\nThe pot's on the stove, but not quite boiling.\nKeep stirring! 🍲";
            } else if (percentage <= 30) {
                return "Getting steamy...\nLike a sauna session.\nBring a towel! 🧖‍♂️";
            } else if (percentage <= 35) {
                return "Sparks are flying...\nBut is it love or static?\nOnly time will tell! ⚡";
            } else if (percentage <= 40) {
                return "Heating up...\nThere's a definite chemistry here.\nExperiment further! 🧪";
            } else if (percentage <= 45) {
                return "A slow roast...\nThe flavor's developing nicely.\nSavor the moment! ☕";
            } else if (percentage <= 50) {
                return "Halfway hot...\nLike a medium salsa.\nAdd some spice! 🌶️";
            } else if (percentage <= 55) {
                return "Getting spicy...\nThe heat is on.\nCan you handle it? 🌡️";
            } else if (percentage <= 60) {
                return "Turning up the heat...\nThings are getting interesting.\nKeep it sizzling! 🔥";
            } else if (percentage <= 65) {
                return "Sizzling connection...\nLike bacon in the pan.\nHear that sizzle! 🥓";
            } else if (percentage <= 70) {
                return "Red hot...\nYou're cooking with gas now!\nKeep the fire burning! 🔥";
            } else if (percentage <= 75) {
                return "Scorching chemistry...\nLike a summer heatwave.\nStay hydrated! ☀️";
            } else if (percentage <= 80) {
                return "Blazing romance...\nThe flames are high.\nDon't get burned! 🔥";
            } else if (percentage <= 85) {
                return "Inferno alert...\nThis is a five-alarm fire!\nCall the fire department! 🚒";
            } else if (percentage <= 90) {
                return "Volcanic passion...\nLava's got nothing on you two.\nEruption imminent! 🌋";
            } else if (percentage <= 95) {
                return "Nuclear fusion...\nThe energy is off the charts.\nHandle with care! ☢️";
            } else if (percentage <= 99) {
                return "Cosmic connection...\nWritten in the stars.\nDestiny awaits! ✨";
            } else {
                return "Perfect match...\nA love for the ages.\nEternal flame! ❤️";
            }
        }

        private getFriendshipMessage(percentage: number): string {
            if (percentage <= 5) {
                return "Awkward acquaintances...\nLike oil and water.\nMaybe just wave from across the room! 👋";
            } else if (percentage <= 10) {
                return "Casual contacts...\nYou might share an elevator ride.\nSmall talk only! 🛗";
            } else if (percentage <= 15) {
                return "Friendly neighbors...\nYou'll borrow sugar occasionally.\nKeep the fence tall! 🏡";
            } else if (percentage <= 20) {
                return "Occasional hangouts...\nGroup settings preferred.\nSafety in numbers! 👥";
            } else if (percentage <= 25) {
                return "Coffee buddies...\nGood for a quick chat.\nKeep it caffeinated! ☕";
            } else if (percentage <= 30) {
                return "Lunch companions...\nYou can share a meal.\nSplit the check! 🍽️";
            } else if (percentage <= 35) {
                return "Movie pals...\nYou agree on most genres.\nPass the popcorn! 🍿";
            } else if (percentage <= 40) {
                return "Gaming partners...\nCompetitive but friendly.\nGood sportsmanship! 🎮";
            } else if (percentage <= 45) {
                return "Workout buddies...\nYou push each other.\nOne more rep! 💪";
            } else if (percentage <= 50) {
                return "Weekend friends...\nReliable for fun plans.\nSaturday adventures! 🗓️";
            } else if (percentage <= 55) {
                return "Trusted confidants...\nYou share some secrets.\nJudgment-free zone! 🤐";
            } else if (percentage <= 60) {
                return "Reliable allies...\nYou've got each other's backs.\nThrough thick and thin! 🛡️";
            } else if (percentage <= 65) {
                return "Genuine companions...\nYou enjoy the silence together.\nNo need for words! 😌";
            } else if (percentage <= 70) {
                return "Adventure partners...\nYou bring out each other's courage.\nTake the leap! 🧗‍♂️";
            } else if (percentage <= 75) {
                return "Loyal supporters...\nFirst call in a crisis.\nMidnight rescues! 🚨";
            } else if (percentage <= 80) {
                return "Childhood-level friends...\nBuilding forts and sharing snacks.\nYoung at heart! 🏰";
            } else if (percentage <= 85) {
                return "Kindred spirits...\nYou finish each other's sentences.\nMind meld activated! 🧠";
            } else if (percentage <= 90) {
                return "Soul siblings...\nConnected beyond explanation.\nFamily by choice! 👫";
            } else if (percentage <= 95) {
                return "Lifelong companions...\nDecades of memories ahead.\nGray hair together! 👵👴";
            } else if (percentage <= 99) {
                return "Legendary friendship...\nThe stuff of stories.\nFuture generations will hear about you! 📚";
            } else {
                return "Friendship soulmates...\nOnce in a lifetime bond.\nBest friends forever! 🤝";
            }
        }

        private getDrinkingPartnerMessage(percentage: number): string {
            if (percentage <= 5) {
                return "Designated drivers...\nOne sips, one sits.\nSafety first! 🚗";
            } else if (percentage <= 10) {
                return "Water cooler companions...\nStick to hydration.\nMaybe add a lemon slice! 🍋";
            } else if (percentage <= 15) {
                return "Coffee shop acquaintances...\nCaffeine over alcohol.\nEspresso meetings! ☕";
            } else if (percentage <= 20) {
                return "One drink wonders...\nQuick toast and goodbye.\nKeep it brief! 🥂";
            } else if (percentage <= 25) {
                return "Happy hour colleagues...\nStrictly 5-6pm on Fridays.\nBack to business Monday! 💼";
            } else if (percentage <= 30) {
                return "Occasional bar mates...\nA round or two, max.\nHome by 10! 🕙";
            } else if (percentage <= 35) {
                return "Beer buddies...\nCasual pints and sports talk.\nKeep it light! 🍺";
            } else if (percentage <= 40) {
                return "Wine tasters...\nDiscussing notes and vintages.\nSophisticated sips! 🍷";
            } else if (percentage <= 45) {
                return "Cocktail companions...\nExploring mixology together.\nShaken, not stirred! 🍸";
            } else if (percentage <= 50) {
                return "Pub quiz partners...\nDrinks and trivia.\nBrain power! 🧩";
            } else if (percentage <= 55) {
                return "Weekend warriors...\nFriday night regulars.\nSaturday recovery! 🛌";
            } else if (percentage <= 60) {
                return "Karaoke comrades...\nLiquid courage for the mic.\nHit those high notes! 🎤";
            } else if (percentage <= 65) {
                return "Dancing duo...\nShots and shuffles.\nOwn that dance floor! 💃";
            } else if (percentage <= 70) {
                return "Party partners...\nEntrance to exit together.\nNo one left behind! 🎉";
            } else if (percentage <= 75) {
                return "Festival friends...\nAll weekend, all in.\nHydrate between rounds! 🎪";
            } else if (percentage <= 80) {
                return "Bar-hopping besties...\nTour the town together.\nStamp that passport! 🗺️";
            } else if (percentage <= 85) {
                return "Celebration specialists...\nToasting life's victories.\nClink those glasses! 🥃";
            } else if (percentage <= 90) {
                return "Spirits soulmates...\nSame taste in drinks.\nMind-reading orders! 🍹";
            } else if (percentage <= 95) {
                return "Legendary night-outers...\nThe stuff of stories.\nWhat happens in VR stays in VR! 🤫";
            } else if (percentage <= 99) {
                return "Epic drinking legends...\nNames known across servers.\nVirtual world famous! 🌐";
            } else {
                return "Perfect drinking partners...\nA match made in happy hour heaven.\nCheers to that! 🍻";
            }
        }

        initializeUI() {
            return this.render();
        }

        render() {
            return View({
                style: { width: this.panelWidth, height: this.panelHeight },
                children: [
                    // Heart Container
                    View({
                        style: { 
                            width: '80%', 
                            height: '80%',
                            position: 'absolute',
                            left: '10%',
                            top: '10%'
                        },
                        children: [
                            // Heart Image
                            Image({
                                source: ImageSource.fromTextureAsset(this.props.heartTexture),
                                style: { 
                                    width: '100%', 
                                    height: '100%',
                                    position: 'absolute'
                                }
                            }),

                            // Mode Selection Buttons
                            View({
                                style: {
                                    position: 'absolute',
                                    top: '25%',  // Moved down further from 20%
                                    left: '10%',
                                    width: '80%',
                                    height: 50,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                },
                                children: [
                                    // Love Mode Button
                                    Pressable({
                                        onPress: this.onSelectLoveMode,
                                        style: {
                                            padding: 8,
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1,
                                            marginRight: 5,
                                            backgroundColor: this.stateBinding.derive(s => 
                                                s.mode === LoveMeterMode.Love ? '#FF4081' : '#666666'
                                            )
                                        },
                                        children: [
                                            Text({
                                                text: 'LOVE ❤️',
                                                style: {
                                                    fontSize: 24,
                                                    fontFamily: 'Bangers',
                                                    color: '#FFFFFF',
                                                    textAlign: 'center'
                                                }
                                            })
                                        ]
                                    }),
                                    
                                    // Friendship Mode Button
                                    Pressable({
                                        onPress: this.onSelectFriendshipMode,
                                        style: {
                                            padding: 8,
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1,
                                            marginRight: 5,
                                            marginLeft: 5,
                                            backgroundColor: this.stateBinding.derive(s => 
                                                s.mode === LoveMeterMode.Friendship ? '#4CAF50' : '#666666'
                                            )
                                        },
                                        children: [
                                            Text({
                                                text: 'FRIEND 🤝',
                                                style: {
                                                    fontSize: 24,
                                                    fontFamily: 'Bangers',
                                                    color: '#FFFFFF',
                                                    textAlign: 'center'
                                                }
                                            })
                                        ]
                                    }),
                                    
                                    // Drinking Partner Mode Button
                                    Pressable({
                                        onPress: this.onSelectDrinkingPartnerMode,
                                        style: {
                                            padding: 8,
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1,
                                            marginLeft: 5,
                                            backgroundColor: this.stateBinding.derive(s => 
                                                s.mode === LoveMeterMode.DrinkingPartner ? '#2196F3' : '#666666'
                                            )
                                        },
                                        children: [
                                            Text({
                                                text: 'DRINK 🍻',
                                                style: {
                                                    fontSize: 24,
                                                    fontFamily: 'Bangers',
                                                    color: '#FFFFFF',
                                                    textAlign: 'center'
                                                }
                                            })
                                        ]
                                    })
                                ]
                            }),

                            // Player 1 Join Button
                            Pressable({
                                onPress: this.onJoinPlayer1,
                                style: {
                                    position: 'absolute',
                                    left: '20%',
                                    top: '42%',  // Moved down further from 35%
                                    padding: 10
                                },
                                children: [
                                    Text({
                                        text: 'JOIN AS PLAYER 1',
                                        style: {
                                            fontSize: 36,
                                            fontFamily: 'Bangers',
                                            color: '#FFFFFF',
                                            textAlign: 'center'
                                        }
                                    })
                                ]
                            }),

                            // Player 2 Join Button
                            Pressable({
                                onPress: this.onJoinPlayer2,
                                style: {
                                    position: 'absolute',
                                    right: '20%',
                                    top: '42%',  // Moved down further from 35%
                                    padding: 10
                                },
                                children: [
                                    Text({
                                        text: 'JOIN AS PLAYER 2',
                                        style: {
                                            fontSize: 36,
                                            fontFamily: 'Bangers',
                                            color: '#FFFFFF',
                                            textAlign: 'center'
                                        }
                                    })
                                ]
                            }),

                            // Test Compatibility Button
                            Pressable({
                                onPress: this.onStart,
                                style: {
                                    position: 'absolute',
                                    top: '58%',  // Moved down further from 50%
                                    left: '30%',
                                    width: '40%',
                                    height: 60,
                                    backgroundColor: '#666666',
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                },
                                children: [
                                    Text({
                                        text: this.stateBinding.derive(s => {
                                            switch (s.mode) {
                                                case LoveMeterMode.Love:
                                                    return 'TEST LOVE COMPATIBILITY!';
                                                case LoveMeterMode.Friendship:
                                                    return 'TEST FRIENDSHIP MATCH!';
                                                case LoveMeterMode.DrinkingPartner:
                                                    return 'TEST DRINKING BUDDY MATCH!';
                                                default:
                                                    return 'TEST COMPATIBILITY!';
                                            }
                                        }),
                                        style: {
                                            fontSize: 32,
                                            fontFamily: 'Bangers',
                                            color: '#FFFFFF',
                                            textAlign: 'center'
                                        }
                                    })
                                ]
                            }),

                            // Result Text
                            Text({
                                text: this.stateBinding.derive(s => {
                                    // Get the appropriate emoji for the current mode
                                    let modeEmoji = '🤍';
                                    let modeText = 'LOVE';
                                    
                                    switch (s.mode) {
                                        case LoveMeterMode.Love:
                                            modeEmoji = '❤️';
                                            modeText = 'LOVE';
                                            break;
                                        case LoveMeterMode.Friendship:
                                            modeEmoji = '🤝';
                                            modeText = 'FRIENDSHIP';
                                            break;
                                        case LoveMeterMode.DrinkingPartner:
                                            modeEmoji = '🍻';
                                            modeText = 'DRINKING PARTNER';
                                            break;
                                    }
                                    
                                    if (s.calculating) {
                                        return `Calculating ${modeText} Compatibility... `;
                                    }
                                    if (s.started && !s.calculating) {
                                        return `${s.player1Name} ${modeEmoji} ${s.player2Name}\n${s.percentage}% - ${s.message}`;
                                    }
                                    if (!s.player1Joined && !s.player2Joined) {
                                        return `JOIN TO TEST YOUR ${modeText} COMPATIBILITY`;
                                    }
                                    if (s.player1Joined && s.player2Joined) {
                                        return `${s.player1Name} ${modeEmoji} ${s.player2Name}`;
                                    }
                                    if (s.player1Joined) {
                                        return `${s.player1Name} ${modeEmoji}`;
                                    }
                                    return `${modeEmoji} ${s.player2Name}`;
                                }),
                                style: {
                                    fontSize: 32,
                                    fontFamily: 'Bangers',
                                    color: '#FFFFFF',
                                    textAlign: 'center',
                                    position: 'absolute',
                                    width: '60%',
                                    left: '20%',
                                    top: '72%'  // Moved down further from 65%
                                }
                            })
                        ]
                    })
                ]
            });
        }
    }

}

// Register the component outside the namespace
Component.register(game.LoveMeterUI);
