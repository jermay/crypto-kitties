import Cattribute from './Cattribute';
import { colors } from './colors';


export default class ColorCattribute extends Cattribute {
  static NAMES = {
    bodyColor: 'bodyColor',
    accentColor: 'accentColor',
    eyeColor: 'eyeColor',
    earColor: 'earColor',
    decorationMidcolor: 'decorationMidcolor',
    decorationSidescolor: 'decorationSidescolor',
  };

  constructor(props) {
    super({
      defaultValue: 10,
      minValue: 10,
      maxValue: 98,
      digits: 2,
      ...props,
    });
  }

  // returns the hex color value
  getCssColor() {
    return `#${colors[this.value]}`;
  }
}
