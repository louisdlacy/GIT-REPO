"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HealthData_1 = require("HealthData");
const ui_1 = require("horizon/ui");
class HealthBar extends ui_1.UIComponent {
    initializeUI() {
        return ui_1.UINode.if(HealthData_1.healthData.isVisible, (0, ui_1.View)({
            children: [
                // Progress bar container
                (0, ui_1.View)({
                    style: {
                        width: '100%',
                        height: 30,
                        backgroundColor: 'white',
                        borderColor: 'black',
                        borderWidth: 4,
                        borderRadius: 10,
                        overflow: 'hidden'
                    },
                    children: [
                        // Progress bar fill
                        (0, ui_1.View)({
                            style: {
                                height: '100%',
                                backgroundColor: 'lightgreen',
                                width: HealthData_1.healthData.animationValueBinding.interpolate([0, 1], ['0%', '100%']),
                                borderRadius: 5
                            }
                        })
                    ]
                }),
                // Health text
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Text)({
                            style: {
                                marginTop: 10,
                                fontSize: 40,
                                color: 'black',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            },
                            text: HealthData_1.healthData.healthValueBinding.derive(v => `${Math.round(v * HealthData_1.healthData.maxHealth)}/${HealthData_1.healthData.maxHealth}`),
                        })
                    ],
                    style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                })
            ],
            style: {
                backgroundColor: 'white',
                borderWidth: 4,
                borderRadius: 50,
                padding: 20,
            },
        }), (0, ui_1.View)({}));
    }
}
ui_1.UIComponent.register(HealthBar);
