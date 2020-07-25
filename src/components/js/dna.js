import { colors } from './colors';

export class Cattribute {
    constructor(props) {
        this.name = props.name;
        this.displayName = props.displayName;
        this.minValue = props.minValue;
        this.maxValue = props.maxValue;
        this.digits = props.digits;
        this.defaultValue = props.defaultValue;
        this.value = props.value || props.defaultValue;
    }
}

export class ColorCattribute extends Cattribute {
    constructor(props) {
        super({
            defaultValue: 10,
            minValue: 10,
            maxValue: 98,
            digits: 2,
            ...props
        });
    }

    // returns the hex color value
    getCssColor() {
        return colors[this.getCattributeValue(this.name)];
    }

}

export class KittyDNA {

    // old DNA structure
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
        new ColorCattribute({ name: 'bodyColor', displayName: 'Body Color', defaultValue: 10 }),
        new ColorCattribute({ name: 'accentColor', displayName: 'Accent Color', defaultValue: 13 }),
        new ColorCattribute({ name: 'eyeColor', displayName: 'Eye Color', defaultValue: 91 }),
        new ColorCattribute({ name: 'earColor', displayName: 'Ear Color',  defaultValue: 42 }),

        new Cattribute({ name: 'eyeShape', displayName: 'Eye Shape', minValue: 0, maxValue: 7, digits: 1, defaultValue: 7 }),
        new Cattribute({ name: 'decorationPattern', displayName: 'Decoration Pattern', minValue: 0, maxValue: 7, digits: 1, defaultValue: 1 }),
        new ColorCattribute({ name: 'decorationMidcolor', displayName: 'Decoration Mid Color', defaultValue: 13 }),
        new ColorCattribute({ name: 'decorationSidescolor', displayName: 'Decoration Side Color', defaultValue: 13 }),
        new Cattribute({ name: 'animation', displayName: 'Animation', minValue: 0, maxValue: 7, digits: 1, defaultValue: 1 }),
        new Cattribute({ name: 'lastNum', displayName: '??', minValue: 0, maxValue: 7, digits: 1, defaultValue: 1 }),
    ];

    constructor(dna) {
        this.dna = dna;
    }

    get dna() {
        return this.cattributes
            .map(c => String(c.value).padStart(c.digits, '0'))
            .join('');
    }
    set dna(_dna) {
        if (!_dna) {
            return;
        }

        // slice off each cattribute from the DNA
        let i = 0;
        this.cattributes.forEach(cattribute => {
            const value = _dna.substr(i, cattribute.digits);
            cattribute.value = value;
            i += cattribute.digits;
        });
    }

    getCattribute(name) {
        return this.cattributes.find(c => c.name === name);
    }

    getCattributeValue(name) {
        let cattribute = this.getCattribute(name);
        if (cattribute) {
            return cattribute.value;
        }
        console.error(`Unkown cattribute "${name}"`);
        return undefined;
    }

    setCattributeValue(name, value) {
        let cattribute = this.getCattribute(name);
        if (cattribute) {
            cattribute.value = value;
            return;
        }

        console.error(`Unkown cattribute "${name}"`);
    }

    clone() {
        const dna = this.dna;
        console.log('cloning DNA: ', dna)
        return new KittyDNA(dna);
    }

}
