"use strict";
//
// Digital Clock Script 
// Author: Craigusprime
// always stop the world or turn world sim off before making changes in the properties panel or the old time will hang!!!
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalClock = void 0;
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
function pad(num) {
    return num < 10 ? `0${num}` : `${num}`;
}
class DigitalClock extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.timeBinding = new ui_1.Binding("00:00:00");
        this.colorBinding = new ui_1.Binding("#00FF00");
        this.lastKnownColor = "";
        this.lastKnownHourOffset = 0;
        this.lastKnownMinuteOffset = 0;
    }
    initializeUI() {
        const containerStyle = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        };
        const textStyle = {
            fontSize: 60,
            fontWeight: "bold",
            color: this.colorBinding,
        };
        return (0, ui_1.View)({
            style: containerStyle,
            children: [
                (0, ui_1.Text)({
                    text: this.timeBinding,
                    style: textStyle
                })
            ]
        });
    }
    start() {
        const initialColorHex = this.props.clockColor.toHex();
        const initialHourOffset = this.props.hourOffset;
        const initialMinuteOffset = this.props.minuteOffset;
        this.lastKnownColor = initialColorHex;
        this.lastKnownHourOffset = initialHourOffset;
        this.lastKnownMinuteOffset = initialMinuteOffset;
        this.colorBinding.set(initialColorHex);
        this.async.setInterval(() => this.updateTime(), 1000);
    }
    updateTime() {
        const currentColorHex = this.props.clockColor.toHex();
        if (currentColorHex !== this.lastKnownColor) {
            this.colorBinding.set(currentColorHex);
            this.lastKnownColor = currentColorHex;
        }
        if (this.props.hourOffset !== this.lastKnownHourOffset) {
            this.lastKnownHourOffset = this.props.hourOffset;
        }
        if (this.props.minuteOffset !== this.lastKnownMinuteOffset) {
            this.lastKnownMinuteOffset = this.props.minuteOffset;
        }
        const now = new Date();
        now.setHours(now.getHours() + this.lastKnownHourOffset);
        now.setMinutes(now.getMinutes() + this.lastKnownMinuteOffset);
        const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        this.timeBinding.set(timeStr);
    }
}
exports.DigitalClock = DigitalClock;
DigitalClock.propsDefinition = {
    clockColor: {
        type: core_1.PropTypes.Color,
        default: new core_1.Color(0, 1, 0),
    },
    hourOffset: {
        type: core_1.PropTypes.Number,
        default: 0,
    },
    minuteOffset: {
        type: core_1.PropTypes.Number,
        default: 0,
    },
};
core_1.Component.register(DigitalClock);
