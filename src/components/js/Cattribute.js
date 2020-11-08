
export default class Cattribute {
  static NAMES = {
    eyeShape: 'eyeShape',
    decorationPattern: 'decorationPattern',
    decorationSidescolor: 'decorationSidescolor',
    animation: 'animation',
    lastNum: 'lastNum',
  };

  static TYPES = {
    basic: 'basic',
    cattribute: 'cattribute',
  };

  constructor(props) {
    this.name = props.name;
    this.valueNames = props.valueNames || {};
    this.displayName = props.displayName;
    this.minValue = props.minValue;
    this.maxValue = props.maxValue;
    this.digits = props.digits;
    this.defaultValue = props.defaultValue;
    this.value = props.value || props.defaultValue;
    this.type = props.type || 'cattribute';
  }

  get strValue() {
    return String(this.value).padStart(this.digits, '0');
  }

  get valueName() {
    const val = this.strValue;
    return this.valueNames[val] || val;
  }
}
