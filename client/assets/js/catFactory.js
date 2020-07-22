
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
