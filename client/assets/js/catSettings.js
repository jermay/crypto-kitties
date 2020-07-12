
var colors = Object.values(allColors())

var defaultDNA = {
    "bodyColor" : 10,
    "accentColor" : 13,
    "eyeColor" : 91,
    "earColor" : 42,
    //Cattributes
    "eyesShape" : 1,
    "decorationPattern" : 1,
    "decorationMidcolor" : 13,
    "decorationSidescolor" : 13,
    "animation" :  1,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  $('#dnabody').html(defaultDNA.bodyColor);
  $('#dnaaccent').html(defaultDNA.accentColor);
  $('#dnaeyes').html(defaultDNA.eyeColor);
  $('#dnaears').html(defaultDNA.earColor);
    
//   $('#dnashape').html(defaultDNA.eyesShape)
//   $('#dnadecoration').html(defaultDNA.decorationPattern)
//   $('#dnadecorationMid').html(defaultDNA.decorationMidcolor)
//   $('#dnadecorationSides').html(defaultDNA.decorationSidescolor)
//   $('#dnaanimation').html(defaultDNA.animation)
//   $('#dnaspecial').html(defaultDNA.lastNum)

  renderCat(defaultDNA)
});

function getDna(){
    var dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnaaccent').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaears').html()
    dna += $('#dnashape').html()
    dna += $('#dnadecoration').html()
    dna += $('#dnadecorationMid').html()
    dna += $('#dnadecorationSides').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    return parseInt(dna)
}

function renderCat(dna){
    bodyColor(colors[dna.bodyColor],dna.bodyColor);
    $('#bodyColor').val(dna.bodyColor); // input selector

    accentColor(colors[dna.accentColor],dna.accentColor);
    $('#accentColor').val(dna.accentColor);

    eyeColor(colors[dna.eyeColor],dna.eyeColor);
    $('#eyeColor').val(dna.eyeColor);

    earColor(colors[dna.earColor],dna.earColor);
    $('#earColor').val(dna.earColor);
}

// Changing cat colors
$('#bodyColor').change(()=>{
    var colorVal = $('#bodyColor').val();
    bodyColor(colors[colorVal],colorVal);
});

$('#accentColor').change(()=>{
  var colorVal = $('#accentColor').val();
  accentColor(colors[colorVal],colorVal);
});

$('#eyeColor').change(()=>{
  var colorVal = $('#eyeColor').val();
  eyeColor(colors[colorVal],colorVal);
});

$('#earColor').change(()=>{
  var colorVal = $('#earColor').val();
  earColor(colors[colorVal],colorVal);
});
