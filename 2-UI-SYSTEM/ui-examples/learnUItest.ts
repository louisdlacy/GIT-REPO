import * as hz from "horizon/core";

import {} from "horizon/core";
import { UIComponent, View, Text } from "horizon/ui";

class learnUItest extends UIComponent {
  panelHeight = 1000;
  panelWidth = 800;
  panelBackgroundColor = "#f0f0f0";

  initializeUI() {
    return View({
      children: Text({
        text: "WanesWorld",
        style: {
          fontSize: 28,
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        },
      }),
      style: {
        backgroundColor: "#333",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
      },
    });
  }
}

hz.Component.register(learnUItest);
