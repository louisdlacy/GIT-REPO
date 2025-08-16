import { healthData } from "HealthData";
import { UIComponent, View, Text, UINode } from "horizon/ui";

class HealthBar extends UIComponent<typeof HealthBar> {
  initializeUI() {
    return UINode.if(
      healthData.isVisible,
      View({
        children: [
          // Progress bar container
          View({
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
              View({
                style: {
                  height: '100%',
                  backgroundColor: 'lightgreen',
                  width: healthData.animationValueBinding.interpolate([0, 1], ['0%', '100%']),
                  borderRadius: 5
                }
              })
            ]
          }),
          // Health text
          View({
            children: [
              Text({
                style: {
                  marginTop: 10,
                  fontSize: 40,
                  color: 'black',
                  fontWeight: 'bold',
                  textAlign: 'center'
                },
                text: healthData.healthValueBinding.derive(v => `${Math.round(v * healthData.maxHealth)}/${healthData.maxHealth}`),
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
      }),
      View({})
    );
  }
}
UIComponent.register(HealthBar);