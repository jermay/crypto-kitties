import { ColorCattribute, Cattribute, KittyDNA } from "./dna";

export class CatPart {

    constructor(props) {
        this.name = props.name || 'catPart';
        this.childParts = props.childParts || [];
        this.dna = props.dna;
        this.colorCattributeName = props.colorCattributeName;

        // css properties
        this.display = props.display;
        this.height = props.height;
        this.width = props.width;
        this.position = props.position || 'relative';
        this.top = props.top;
        this.left = props.left;
        this.zIndex = props.zIndex;

        this.margin = props.margin;
        this.padding = props.padding;

        this.border = props.border;
        this.borderTop = props.borderTop;
        this.borderRight = props.borderRight;
        this.borderBottom = props.borderBottom;
        this.borderLeft = props.borderLeft;
        this.borderRadius = props.borderRadius;

        this.transform = props.transform;
    }

    get color() {
        if (this.colorCattributeName) {
            let cattribute = this.dna.getCattribute(this.colorCattributeName);
            return cattribute.getCssColor();
        }
        return null;
    }
    set color(num) {
        if (this.colorCattributeName) {
            let cattribute = this.dna.getCattribute(this.colorCattributeName);
            cattribute.value = num;
            return;
        }
        console.error(`CatPart ${this.name} does not have a colorCattributeName!`);
    }
}

export class CatHeadContainer extends CatPart {
    constructor(props) {
        super({
            dna: props.dna,
            name: 'headContainer',
            position: 'relative',
            zIndex: 2,
            childParts: [
                new CatEars({ dna: props.dna }),
                new CatHeadPart({ dna: props.dna }),
            ]
        });
    }
}

export class CatHeadPart extends CatPart {
    constructor(props) {
        super({
            dna: props.dna,
            name: 'head',
            position: 'relative',
            width: '190px',
            height: '190px',
            left: '40px',
            borderRadius: '45%',
            borderBottom: '2px solid lightgray',
            zIndex: 'auto',
            childParts: [
                new CatEyes({ dna: props.dna }),
                new CatMuzzlePart({ dna: props.dna }),
            ]
        });

        this.colorCattributeName = ColorCattribute.NAMES.bodyColor;
    }
}

export class CatEars extends CatPart {
    constructor(props) {
        super({
            dna: props.dna,
            name: 'ears',
            childParts: [
                new CatEarPart({ type: 'left', dna: props.dna }),
                new CatEarPart({ type: 'right', dna: props.dna }),
            ]
        });
    }
}

export class CatEarPart extends CatPart {
    constructor(props) {
        super({
            dna: props.dna,
            name: 'earRight',
            borderRadius: '90% 0 90% 0',
            height: '100px',
            width: '100px',
            position: 'absolute',
            left: '140px',
            childParts: [
                new CatInnerEarPart({ type: props.type, dna: props.dna }),
            ]
        });
        this.type = props.type;

        if (props.type === 'left') {
            this.name = 'earLeft';
            this.left = '25px';
            this.transform = 'scale(1, -1)';
        }

        this.colorCattributeName = ColorCattribute.NAMES.bodyColor;
    }
}

export class CatInnerEarPart extends CatPart {
    constructor(props) {
        super({
            dna: props.dna,
            name: 'innerEarLeft',
            borderRadius: '90% 0 90% 0',
            height: '100px',
            width: '100px',
            position: 'relative',
            top: "-10px",
            left: '10px',
        });

        this.type = props.type;
        if (props.type === 'right') {
            this.name = 'innerEarRight';
            this.top = '10px';
            this.left = '-10px';
        }

        this.colorCattributeName = ColorCattribute.NAMES.earColor;
    }
}

export class CatEyes extends CatPart {
    constructor(props) {
        super({
            name: 'catEyes',
            dna: props.dna,
            position: 'relative',
            top: '39px',
            left: '20px',
            display: "flex",
            childParts: [
                new CatEyePart({ dna: props.dna, type: 'left' }),
                new CatEyePart({ dna: props.dna, type: 'right' }),
                new CatEyeLidPart({ dna: props.dna, type: 'left' }),
                new CatEyeLidPart({ dna: props.dna, type: 'right' }),
            ]
        });
    }
}

export class CatEyePart extends CatPart {
    constructor(props) {
        super({
            name: `catEye${props.type}`,
            dna: props.dna,
            borderRadius: '50%',
            width: '50px',
            height: '42px',
            margin: '16px',
            position: 'relative',
            border: '2px solid #4e4d4d',
            childParts: [
                new CatPupilPart({ dna: props.dna, type: props.type })
            ]
        });
        this.type = props.type;
        this.colorCattributeName = ColorCattribute.NAMES.eyeColor;
        this.setEyeShape();
    }

    setEyeShape() {
        let eyeShapeNum = this.dna.getCattribute(Cattribute.NAMES.eyeShape).value;
        switch (eyeShapeNum) {
            // Look Down
            case 2:
                this.borderTop = '7px solid';
                break;

            // Look Right
            case 3:
                this.borderLeft = `6px solid #4e4d4d`;
                break;
            
            // Look Left
            case 4:
                this.borderRight = `6px solid #4e4d4d`;
                break;
        
            default:
                break;
        }
    }
}

export class CatPupilPart extends CatPart {
    constructor(props) {
        super({
            name: `pupil${props.type}`,
            dna: props.dna,
            width: '24px',
            height: '27px',
            borderRadius: '30% 60% 30% 60%',
            transform: 'rotate(32deg)',
            position: 'absolute',
            top: '6px',
            left: '11px',
        });
        this.type = props.type;
        this.setPupilPosition();
    }

    get color() {
        return '#4e4d4d'; // black
    }

    setPupilPosition() {
        const eyeShape = this.dna
            .getCattribute(Cattribute.NAMES.eyeShape)
            .value;
        switch (eyeShape) {
            case 4:
                this.left = '7px';
                break;
        
            default:
                break;
        }
    }
}

export class CatEyeLidPart extends CatPart {
    constructor(props) {
        super({
            name: `catEyeLids${props.type}`,
            dna: props.dna,
            borderRadius: '50%',
            width: '50px',
            height: '42px',
            margin: '16px',
            position: 'absolute',
            zIndex: 2,
            childParts: []
        });
        this.type = props.type;

        if (props.type === 'right') {
            this.left = '82px';
        }

        let bodyCattribute = this.dna.getCattribute(ColorCattribute.NAMES.bodyColor);
        this.EyeLidColor = bodyCattribute.getCssColor();

        this.setLidPosition();
    }

    get color() {
        return 'transparent';
    }

    setLidPosition() {
        let shapeCattribute = this.dna.getCattribute(Cattribute.NAMES.eyeShape);
        let pos = {};
        switch (shapeCattribute.value) {
            // Down
            case 2:
                pos.top = 12;
                pos.bottom = 4;
                break;

            // Angry
            case 5:
                pos.top = 21;
                pos.bottom = 4;
                break;

            // Suprised
            case 6:
                pos.top = 0;
                pos.bottom = 0;
                break;

            // Sleepy
            case 7:
                pos.top = 28;
                pos.bottom = 7;
                break;

            default:
                pos.top = 4;
                pos.bottom = 4;
                break;
        }
        this.borderTop = `${pos.top}px solid ${this.EyeLidColor}`;
        this.borderBottom = `${pos.bottom}px solid ${this.EyeLidColor}`;
    }
}

export class CatMuzzlePart extends CatPart {
    constructor(props) {
        super({
            name: 'catMuzzle',
            dna: props.dna,
            position: 'relative',
            top: '19px',
            left: '50px',
            width: '100px',
            height: '50px',
            borderRadius: '40%',
            childParts: [
                new CatNosePart({ dna: props.dna }),
                new CatMouthPart({ dna: props.dna, type: 'left' }),
                new CatMouthPart({ dna: props.dna, type: 'right' }),
                new CatMouthPart({ dna: props.dna, type: 'bottom' }),
            ]
        });
        this.colorCattributeName = ColorCattribute.NAMES.accentColor;
    }
}

export class CatNosePart extends CatPart {
    constructor(props) {
        super({
            name: 'catNose',
            dna: props.dna,
            position: 'absolute',
            width: '25px',
            height: '25px',
            borderRadius: '40% 0 90% 0',
            transform: 'rotate(-136deg)',
            left: '39px',
            top: '-12px',
            childParts: []
        });
    }

    get color() {
        return 'pink';
    }
}

export class CatMouthPart extends CatPart {
    constructor(props) {
        super({
            name: `catMouth${props.type}`,
            dna: props.dna,
            position: 'absolute',
            backgroundColor: 'white',
            width: '50px',
            height: '50px',
            top: '2px',
            left: '2px',
            borderRadius: '50% 60% 50% 50%',
            borderBottom: '5px solid lightgray',
        });
        this.type = props.type;

        if (props.type === 'right') {
            this.borderRadius = '60% 50% 50% 50%';
            this.left = '51px';
        } else if (props.type === 'bottom') {
            this.borderRadius = '40% 0 90% 0';
            this.left = '37px';
            this.top = '37px';
            this.borderLeft = '2px solid lightgray';
            this.borderTop = '2px solid lightgray';
            this.borderBottom = '5px solid lightgray';
            this.borderRight = '5px solid lightgray';
            this.transform = 'rotate(45deg)';
            this.width = '30px';
            this.height = '30px';
        }

        this.colorCattributeName = ColorCattribute.NAMES.accentColor;
    }
}

export class CatBodyContainer extends CatPart {
    constructor(props) {
        super({
            name: 'bodyContainer',
            dna: props.dna,
            position: 'relative',
            zIndex: 1,
            childParts: [
                new CatBodyPart({ dna: props.dna }),
                new CatTailPart({ dna: props.dna }),
            ]
        });
    }
}

export class CatBodyPart extends CatPart {
    constructor(props) {
        super({
            name: 'catBody',
            dna: props.dna,
            position: 'relative',
            top: '-80px',
            left: '10px',
            width: '255px',
            height: '280px',
            zIndex: 1,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            border: '2px solid lightgray',
            borderBottom: '3px solid lightgray',
            childParts: [
                new CatBellyPart({ dna: props.dna }),
                new CatLegPart({ dna: props.dna, type: 'left' }),
                new CatLegPart({ dna: props.dna, type: 'right' }),
            ]
        });
        this.colorCattributeName = ColorCattribute.NAMES.bodyColor;
    }
}

export class CatBellyPart extends CatPart {
    constructor(props) {
        super({
            name: 'catBelly',
            dna: props.dna,
            position: 'relative',
            top: '120px',
            left: '65px',
            width: '130px',
            height: '160px',
            zIndex: 2,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            border: '2px solid lightgray',
            borderBottom: '3px solid lightgray',
        });
        this.colorCattributeName = ColorCattribute.NAMES.accentColor;
    }
}

export class CatLegPart extends CatPart {
    constructor(props) {
        super({
            name: `catLeg${props.type}`,
            dna: props.dna,
            position: 'absolute',
            width: '50px',
            height: '120px',
            left: '41px',
            top: '140px',
            zIndex: 3,
            borderLeft: '2px solid lightgray',
            borderRight: '2px solid lightgray',
            borderBottom: '2px solid lightgray',
            childParts: [
                new CatFootPart({ dna: props.dna, type: props.type }),
            ]
        });
        this.type = props.type;

        if (props.type === 'right') {
            this.left = '167px';
        }

        this.colorCattributeName = ColorCattribute.NAMES.bodyColor;
    }
}

export class CatFootPart extends CatPart {
    constructor(props) {
        super({
            name: 'catFoot',
            dna: props.dna,
            position: 'relative',
            borderBottom: '5px solid lightgray',
            borderTop: '2px solid lightgray',
            width: '75px',
            height: '40px',
            top: '105px',
            left: '-17px',
            borderRadius: '50%',
            childParts: []
        });
        this.type = props.type;
        this.colorCattributeName = ColorCattribute.NAMES.accentColor;
    }
}

export class CatTailPart extends CatPart {
    constructor(props) {
        super({
            name: 'catTail',
            dna: props.dna,
            position: 'absolute',
            width: '35px',
            height: '100px',
            top: '73px',
            left: '250px',
            zIndex: 0,
            transform: 'rotate(72deg)',
            borderRadius: '50%',
            border: '2px solid lightgray',
            childParts: []
        });
        this.colorCattributeName = ColorCattribute.NAMES.bodyColor;
    }
}

export class CatModel {

    constructor(dna) {
        this.dna = dna || new KittyDNA();
        this.parts = [];
        console.log('CatModel::ctor: dna: ', this.dna.dna);
        this.buildCat();
    }

    buildCat() {
        this.parts = [
            new CatHeadContainer({ dna: this.dna }),
            new CatBodyContainer({ dna: this.dna }),
        ];
    }

    clone() {
        console.log('clone > eyeShape: ', this.dna.getCattribute('eyeShape').valueName);
        return new CatModel(this.dna.clone());
    }

    mewtate(cattributeName, value) {
        const newDna = this.dna.clone();
        newDna.setCattributeValue(cattributeName, value);
        return new CatModel(newDna);
    }
}

export class CatFactory {

}

/*
//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors() {
    var colors = []
    for (var i = 10; i < 99; i++) {
        var color = getColor()
        colors[i] = color
    }
    return colors
}


//This function code needs to modified so that it works with Your cat code.
function bodyColor(color, code) {
    $('.cat-color-body').css('background', '#' + color);  //This changes the color of the cat
    $('#headcode').html('code: ' + code); //This updates text of the badge next to the slider
    $('#dnabody').html(code); //This updates the body color part of the DNA that is displayed below the cat
}

function accentColor(color, code) {
    $('.cat-color-accent').css('background', '#' + color);
    $('#accentcode').html('code: ' + code);
    $('#dnaaccent').html(code);
}

function eyeColor(color, code) {
    $('.cat-color-eyes').css('background', '#' + color);
    $('#eyecode').html('code: ' + code);
    $('#dnaeye').html(code);
}

function earColor(color, code) {
    $('.cat-color-ears').css('background', '#' + color);
    $('#earcode').html('code: ' + code);
    $('#earaccent').html(code);
}


//###################################################
//Functions below will be used later on in the project
//###################################################
function eyeVariation(num) {

    $('#dnashape').html(num) // set DNA code
    normalEyes(); // reset eye style

    let name = 'Unknown';
    switch (num) {
        case 1:
            name = 'Basic'; // set the badge label
            break;

        case 2:
            name = 'Chill';
            eyesType1(); // render
            break;

        case 3:
            name = 'Right';
            eyesType2();
            break;

        case 4:
            name = 'Left';
            eyesType3();
            break;

        case 5:
            name = 'Angry';
            eyesType4();
            break;

        case 6:
            name = 'Sad';
            eyesType5();
            break;

        case 7:
            name = 'Sleepy';
            eyesType6();
            break;

        default:
            console.log('Invalid eye shape: ', num);
            break;
    }

    $('#eyeName').html(name);
}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#decorationName').html('Basic')
            normaldecoration()
            break
    }
}

async function normalEyes() {
    $('.cat-temp').remove();
    $('.cat-eye').find('.cat-pupils')
        .css('left', '11px');
    $('.cat-eyes').find('.cat-eye')
        .css('border', '1px solid #4e4d4d');
}

async function eyesType1() {
    $('.cat-eyes').find('.cat-eye')
        .css('border-top', '7px solid #4e4d4d')
        .css('border-bottom', '7px solid #4e4d4d');
}

async function eyesType2() {
    $('.cat-eyes').find('.cat-eye')
        .css('border-left', '7px solid #4e4d4d');
}

async function eyesType3() {
    $('.cat-eyes').find('.cat-eye')
        .css('border-right', '7px solid #4e4d4d');
    $('.cat-eye').find('.cat-pupils')
        .css('left', '6px');
}

async function eyesType4() {
    let angryEyes = $('<div class="cat-eyes-angry cat-color cat-temp"></div>')
        .css('background-color', '#' + colors[defaultDNA.bodyColor]);
    $('.cat').append(angryEyes);
}

async function eyesType5() {
    let angryEyes = $('<div class="cat-eyes-sad cat-color cat-temp"></div>')
        .css('background-color', '#' + colors[defaultDNA.bodyColor]);
    $('.cat').append(angryEyes);
}

async function eyesType6() {
    let angryEyes = $('<div class="cat-eyes-sleepy cat-color cat-temp"></div>')
        .css('background-color', '#' + colors[defaultDNA.bodyColor]);
    $('.cat').append(angryEyes);
}

async function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}
*/