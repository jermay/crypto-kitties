import { interfaces } from "mocha";

var defaultDNA = {
    "bodyColor": 10,
    "accentColor": 13,
    "eyeColor": 91,
    "earColor": 42,
    //Cattributes
    "eyeShape": 7,
    "decorationPattern": 1,
    "decorationMidcolor": 13,
    "decorationSidescolor": 13,
    "animation": 1,
    "lastNum": 1
}

export class KittyDNA {

    _str = '';

    attributes = {
        // colors
        'bodyColor': { indexStart: 0, indexEnd: 2 },
        'accentColor': { indexStart: 2, indexEnd: 3 },
        'eyeColor': { indexStart: 4, indexEnd: 5 },
        'earColor': { indexStart: 6, indexEnd: 7 },

        // Cattributes
        'eyeShape': { indexStart: 8, indexEnd: 8 },
        'decorationPattern': { indexStart: 9, indexEnd: 9 },
        'decorationMidcolor': { indexStart: 10, indexEnd: 11 },
        'decorationSidescolor': { indexStart: 12, indexEnd: 13 },
        'animation': { indexStart: 14, indexEnd: 14 },
        'lastNum': { indexStart: 15, indexEnd: 15 },
    };

    constructor(str) {
        _str = str;
    }

    getAttributeValue(attr) {
        return +this._str.substring(attr.indexStart, attr.indexEnd);
    }

    setDnaStringAttribute(attr, value) {
        for (let i = attr.indexStart, j=0; i <= attr.indexEnd; i++, j++) {
            this._str[i] = value[j];
        }
    }

    // parse the DNA str

    // getters
    get bodyColor() {
        return this.getAttributeValue(this.attributes.bodyColor);
    }
    set bodyColor(val) {
        this.setDnaStringAttribute(this.attributes.bodyColor, val);
    }

    // setters that update the DNA str
}

export class DnaAttribute {
    id;
    name;
    indexStart;
    indexEnd;
}
