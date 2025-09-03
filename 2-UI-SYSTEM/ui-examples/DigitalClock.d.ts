import { Color } from "horizon/core";
import { UINode, UIComponent } from "horizon/ui";
export declare class DigitalClock extends UIComponent<typeof DigitalClock> {
    static propsDefinition: {
        clockColor: {
            type: "Color";
            default: Color;
        };
        hourOffset: {
            type: "number";
            default: number;
        };
        minuteOffset: {
            type: "number";
            default: number;
        };
    };
    private readonly timeBinding;
    private readonly colorBinding;
    private lastKnownColor;
    private lastKnownHourOffset;
    private lastKnownMinuteOffset;
    initializeUI(): UINode;
    start(): void;
    private updateTime;
}
