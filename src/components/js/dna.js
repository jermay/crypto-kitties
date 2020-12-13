import Cattribute from './Cattribute';
import ColorCattribute from './ColorCattribute';

export default class KittyDNA {
  // academy template project DNA structure
  // var defaultDNA = {
  //     "bodyColor": 10,
  //     "accentColor": 13,
  //     "eyeColor": 91,
  //     "earColor": 42,
  //     //Cattributes
  //     "eyeShape": 7,
  //     "decorationPattern": 1,
  //     "decorationMidcolor": 13,
  //     "decorationSidescolor": 13,
  //     "animation": 1,
  //     "lastNum": 1
  // }

  cattributes = [
    new ColorCattribute({
      name: ColorCattribute.NAMES.bodyColor, displayName: 'Body Color', type: Cattribute.TYPES.basic, defaultValue: 10,
    }),
    new ColorCattribute({
      name: ColorCattribute.NAMES.accentColor, displayName: 'Accent Color', type: Cattribute.TYPES.basic, defaultValue: 13,
    }),
    new ColorCattribute({
      name: ColorCattribute.NAMES.eyeColor, displayName: 'Eye Color', type: Cattribute.TYPES.basic, defaultValue: 93,
    }),
    new ColorCattribute({
      name: ColorCattribute.NAMES.earColor, displayName: 'Ear Color', type: Cattribute.TYPES.basic, defaultValue: 42,
    }),

    new Cattribute({
      name: Cattribute.NAMES.eyeShape,
      displayName: 'Eye Shape',
      minValue: 1,
      maxValue: 7,
      digits: 1,
      defaultValue: 2,
      valueNames: {
        1: 'Basic', 2: 'Down', 3: 'Right', 4: 'Left', 5: 'Angry', 6: 'Suprised', 7: 'Sleepy',
      },
    }),
    new Cattribute({
      name: Cattribute.NAMES.decorationPattern,
      displayName: 'Pattern',
      minValue: 0,
      maxValue: 3,
      digits: 1,
      defaultValue: 2,
      valueNames: {
        0: 'None', 1: 'Pin Stripes', 2: 'Triangle Stripes', 3: 'Spots',
      },
    }),
    new ColorCattribute({ name: ColorCattribute.NAMES.decorationMidcolor, displayName: 'Pattern Color', defaultValue: 42, }),
    new ColorCattribute({ name: ColorCattribute.NAMES.decorationSidescolor, displayName: 'Pattern Accent Color', defaultValue: 13, }),
    new Cattribute({
      name: Cattribute.NAMES.animation,
      displayName: 'Animation',
      minValue: 0,
      maxValue: 4,
      digits: 1,
      defaultValue: 4,
      valueNames: {
        0: 'None', 1: 'Head Back-And-Forth', 2: 'Tail Back-And-Forth', 3: 'Head Bob', 4: 'Rockin Out',
      },
    }),
    new Cattribute({
      name: Cattribute.NAMES.lastNum, displayName: 'Mysterious', minValue: 0, maxValue: 7, digits: 1, defaultValue: 1,
    }),
  ];

  constructor(dna) {
    this.dna = dna;
  }

  get dna() {
    return this.cattributes
      .map((cattribute) => cattribute.strValue)
      .join('');
  }

  set dna(_dna) {
    if (!_dna) {
      return;
    }

    // slice off each cattribute from the DNA
    let i = 0;
    this.cattributes.forEach((cattribute) => {
      const value = _dna.substr(i, cattribute.digits);
      // eslint-disable-next-line no-param-reassign
      cattribute.value = +value;
      i += cattribute.digits;
    });
  }

  getCattribute(name) {
    return this.cattributes.find((c) => c.name === name);
  }

  getCattributeValue(name) {
    const cattribute = this.getCattribute(name);
    if (cattribute) {
      return cattribute.value;
    }
    console.error(`Unkown cattribute "${name}"`);
    return undefined;
  }

  setCattributeValue(name, value) {
    const cattribute = this.getCattribute(name);
    if (cattribute) {
      cattribute.value = value;
      return;
    }

    console.error(`Unkown cattribute "${name}"`);
  }

  clone() {
    const { dna, } = this;
    return new KittyDNA(dna);
  }
}
