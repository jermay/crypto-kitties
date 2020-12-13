import Cattribute from './Cattribute';
import { colorObj } from './colors';


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
      maxValue: 99,
      digits: 2,
      ...props,
    });
  }

  // returns the hex color value
  getCssColor() {
    return colorObj[this.value].color;
  }

  get valueName() {
    return colorObj[this.value].name;
  }
}
