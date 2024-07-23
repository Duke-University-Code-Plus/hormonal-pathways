// assets file paths
var imagePath = '/sprites_haruta/';
var bluePath = 'blue/';
var purplePath = 'purple/';
var redPath = 'red/';

let maleBirdsArray = []
let femaleBirdsArray = []
let babyBirdsArray = []
let wormsArray = []
let nestArray = []
var numPrey = 10;

//Array of locations for nests
//Nests numbered as 1-3 from left to right
let nest1_locations = [[125, 202], [290, 250]];
let male1_perch_locations = [[300, 250], [205, 205]];
let female1_perch_locations = [[250, 342], [155, 205]];

let nest2_locations = [[330, 340], [440, 306]];
let male2_perch_locations = [[470, 302], [390, 335]];
let female2_perch_locations = [[420, 305], [340, 335]];

let nest3_locations = [[680, 290], [525, 255]];
let male3_perch_locations = [[618, 280], [700, 287]];
let female3_perch_locations = [[568, 280], [655, 287]];

//index for determining nest and perch positions
var index1;
var index2;
var index3;

//location of each nest 
var nest1_xy;
var nest2_xy;
var nest3_xy;

// environment sprites
var ground;
var tree1;
var tree2;
var tree3;

//bird sprites
var bird1;
var bird2;
var bird3;

//inputs
var scavengeButton1;
var scavengeButton2
var scavengeButton3

var matingButton1;
var matingButton2;
var matingButton3;

var foodSlider


//spritesheets
var malebird1_fly_spritesheet;
var malebird2_fly_spritesheet;
var malebird3_fly_spritesheet;
var malebird_sing_spritesheet;
var femalebird_fly_spritesheet;
var babybird_fly_spritesheet;
var notes_spritesheet;
var notes_flipped_spritesheet;

//animation names
var malebird1_fly;
var malebird2_fly;
var malebird3_fly;
var malebird_sing;
var femalebird_fly;
var babybird_fly;
var notes_play;
var notes_flipped_play;

//bird animations
var malebird_fly
var malebird_food_fly
var femalebird_fly
var peck;
var food_peck;
var sing;

//music notes
var music;
var music_flipped

var peckFrameCycle = 20;
var singFrameCycle = 60;

var wormBorder = 100


//preload all json files and sprite sheets 
function preload() {
    // Load the json for the tiles sprite sheet
    loadJSON(imagePath + bluePath + 'malebird_fly.json', function (malebird1_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        malebird1_fly_spritesheet = loadSpriteSheet(imagePath + bluePath + 'malebird_fly_spritesheet.png', malebird1_fly_frames);
    });
    loadJSON(imagePath + purplePath + 'malebird_fly.json', function (malebird2_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        malebird2_fly_spritesheet = loadSpriteSheet(imagePath + purplePath + 'malebird_fly_spritesheet.png', malebird2_fly_frames);
    });
    loadJSON(imagePath + redPath + 'malebird_fly.json', function (malebird3_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        malebird3_fly_spritesheet = loadSpriteSheet(imagePath + redPath + 'malebird_fly_spritesheet.png', malebird3_fly_frames);
    });

    loadJSON(imagePath + 'femalebird_fly.json', function (femalebird_fly_frames) {
        femalebird_fly_spritesheet = loadSpriteSheet(imagePath + 'femalebird_fly_spritesheet.png', femalebird_fly_frames);
    });

    loadJSON(imagePath + 'babybird_fly.json', function (babybird_fly_frames) {
        babybird_fly_spritesheet = loadSpriteSheet(imagePath + 'babybird_fly_spritesheet.png', babybird_fly_frames);
    });

    loadJSON(imagePath + 'notes.json', function (notes_frames) {
        notes_spritesheet = loadSpriteSheet(imagePath + 'notes_spritesheet.png', notes_frames);
    });

    loadJSON(imagePath + 'notes_flipped.json', function (notes_flipped_frames) {
        notes_flipped_spritesheet = loadSpriteSheet(imagePath + 'notes_flipped_spritesheet.png', notes_flipped_frames);
    });
}

function setup() {
    createCanvas(800, 520);
    createEnvironment();
    //createInputs();
    createAnimals()
    updateNumPrey()
}

function updateProportion() {
    bird1.proportion = window.proportion1
    bird2.proportion = window.proportion2
    bird3.proportion = window.proportion3
}

function draw() {

    if (bird1.proportion == null) {
        updateProportion();
    }

    background(135, 206, 250);
    drawSprites();
    maleBirdMovement()
    preyMovement();
    femaleBirdMovement();
    updateNumPrey()

    for (let bird of maleBirdsArray) { //go through male birds
        if (window.birdNeutralState == false) { //if birds shouldnt be in neutrak state in set constructor value to false
            bird.neutralState = false;
            bird.sprite.friction = 0.1
        }

        if (bird.neutralState) {
            bird.neutralStateBehavior();
        }

        if (!bird.neutralState) { //if bird isnt in neutral state 
            if (bird.proportion != undefined) {
                if (bird.matingCondition != true && bird.scavengeCondition != true) {
                    bird.determineBehavior()
                }

                if (bird.matingCondition) { //if should be mating
                    if (!bird.mateCreated) { //and not in the process of mating
                        bird.mate = createFemaleBird(bird); //create a female bird
                        bird.mateCreated = true //set variable to indicate in process of mating
                    }
                    bird.mateBehavior();
                }
                if (bird.scavengeCondition) { //if should be scavenging
                    bird.scavengeBehavior();
                }
            }
        }
    }
}

function updateNumPrey() {
    //numPrey = foodSlider.value()

    if (wormsArray.length < numPrey) {
        createPrey();
    }
    if (wormsArray.length > numPrey) {
        removePrey()
    }
}

function removePrey() {
    const index = wormsArray.length - 1
    let worm = wormsArray[index]
    wormsArray.splice(index, 1) //splice is to remove at certain index, pop removes the last one
    worm.sprite.remove()
}


function createFemaleBird(bird) {
    var femalebirdLocation = random(["left", "right"]);

    if (femalebirdLocation == "left") {
        //why 25? 
        var femalebirdX = -25;
        var femalebirdY = random(0, height / 4);
    } else if (femalebirdLocation == "right") {
        var femalebirdX = width + 25
        var femalebirdY = random(0, height / 4);
    }

    var perch = [bird.femaleperchX, bird.femaleperchY]

    var femalebird = new femaleBird(femalebirdX, femalebirdY, 0.1, bird, perch);

    return femalebird;
}


function maleBirdMovement() {
    for (let bird of maleBirdsArray) {
        if (bird.sprite.velocity.x > 0 ) {
            if (bird.sprite.position.x > width) {
                bird.sprite.velocity.x *= -1
            }
            bird.sprite.mirrorX(-1);
        } else if (bird.sprite.velocity.x < 0) {
            if (bird.sprite.position.x < 0) {
                bird.sprite.velocity.x *= -1
            }
            bird.sprite.mirrorX(1);
        }

    }
}

function femaleBirdMovement() {
    for (let bird of femaleBirdsArray) {
        if (bird.sprite.velocity.x > 0) {
            bird.sprite.mirrorX(-1);
        } else if (bird.sprite.velocity.x < 0) {
            bird.sprite.mirrorX(1);
        }
    }
}

function createEnvironment() {
    ground = createSprite(width / 2,485);
    ground.addAnimation('normal', imagePath + 'ground.png');
    ground.scale = 1;
    ground.depth = 3;

    //left most tree
    tree1 = createSprite(width / 4, 250);
    tree1.addAnimation('normal', imagePath + 'tree2.png');
    tree1.scale = 0.7;
    tree1.depth = 4;

    //middle tree
    tree2 = createSprite(width / 2, 340);
    tree2.addAnimation('normal', imagePath + 'tree1.png');
    tree2.scale = 0.5;
    tree2.depth = 2;

    //right most tree
    tree3 = createSprite(3 * width / 4, 290);
    tree3.addAnimation('normal', imagePath + 'tree2.png');
    tree3.scale = 0.65;
    tree3.depth = 1;

    index1 = Math.floor(Math.random() * nest1_locations.length);
    let nest1_xy = nest1_locations[index1];

    index2 = Math.floor(Math.random() * nest2_locations.length);
    let nest2_xy = nest2_locations[index2];

    index3 = Math.floor(Math.random() * nest3_locations.length);
    let nest3_xy = nest3_locations[index3];

    //creating nest sprites using index
    nest1 = new Nest(nest1_xy[0], nest1_xy[1], 0.3, bird1)
    nest2 = new Nest(nest2_xy[0], nest2_xy[1], 0.3, bird2)
    nest3 = new Nest(nest3_xy[0], nest3_xy[1], 0.3, bird3)

}

function createInputs() {
    /*
    //bird 1
    scavengeButton1 = createButton(" Scavenge Food");
    scavengeButton1.position(70, 10);
    scavengeButton1.mousePressed(() => {
        if (bird1.matingCondition != true) bird1.scavengeCondition = true
    })
    scavengeButton1.style('font-size', '14px');
    scavengeButton1.style('background-color', 'pink');
    scavengeButton1.style('color', 'white');
    scavengeButton1.style('padding', '5px 5px');
    scavengeButton1.style('border', 'none');
    scavengeButton1.style('border-radius', '12px');

    matingButton1 = createButton(" Mating Behavior");
    matingButton1.position(70, 40);
    matingButton1.mousePressed(() => {
        if (bird1.scavengeCondition != true) bird1.matingCondition = true
    })
    matingButton1.style('font-size', '14px');
    matingButton1.style('background-color', 'blue');
    matingButton1.style('color', 'white');
    matingButton1.style('padding', '5px 5px');
    matingButton1.style('border', 'none');
    matingButton1.style('border-radius', '12px');

    //bird 2
    scavengeButton2 = createButton(" Scavenge Food");
    scavengeButton2.position(330, 10);
    scavengeButton2.mousePressed(() => {
        if (bird2.matingCondition != true) bird2.scavengeCondition = true
    })
    scavengeButton2.style('font-size', '14px');
    scavengeButton2.style('background-color', 'pink');
    scavengeButton2.style('color', 'white');
    scavengeButton2.style('padding', '5px 5px');
    scavengeButton2.style('border', 'none');
    scavengeButton2.style('border-radius', '12px');

    matingButton2 = createButton(" Mating Behavior");
    matingButton2.position(330, 40);
    matingButton2.mousePressed(() => {
        if (bird2.scavengeCondition != true) bird2.matingCondition = true
    })
    matingButton2.style('font-size', '14px');
    matingButton2.style('background-color', 'blue');
    matingButton2.style('color', 'white');
    matingButton2.style('padding', '5px 5px');
    matingButton2.style('border', 'none');
    matingButton2.style('border-radius', '12px');

    //bird 3

    scavengeButton3 = createButton(" Scavenge Food");
    scavengeButton3.position(600, 10);
    scavengeButton3.mousePressed(() => {
        if (bird3.matingCondition != true) bird3.scavengeCondition = true
    })

    scavengeButton3.style('font-size', '14px');
    scavengeButton3.style('background-color', 'pink');
    scavengeButton3.style('color', 'white');
    scavengeButton3.style('padding', '5px 5px');
    scavengeButton3.style('border', 'none');
    scavengeButton3.style('border-radius', '12px');

    matingButton3 = createButton(" Mating Behavior");
    matingButton3.position(600, 40);
    matingButton3.mousePressed(() => {
        if (bird3.scavengeCondition != true) bird3.matingCondition = true
    })

    matingButton3.style('font-size', '14px');
    matingButton3.style('background-color', 'blue');
    matingButton3.style('color', 'white');
    matingButton3.style('padding', '5px 5px');
    matingButton3.style('border', 'none');
    matingButton3.style('border-radius', '12px');
    

    
    foodSlider = createSlider(3, 10, 3, 1);
    foodSlider.position(10, 10);
    foodSlider.size(80);
    */
}

function createAnimals() {
    loadAnimations();

    let perch1 = male1_perch_locations[index1]
    let perch2 = male2_perch_locations[index2]
    let perch3 = male3_perch_locations[index3]

    let femaleperch1 = female1_perch_locations[index1]
    let femaleperch2 = female2_perch_locations[index2]
    let femaleperch3 = female3_perch_locations[index3]

    let bird1_InitialX = random(0, width)
    let bird1_InitialY = random(20, height / 2)

    let bird2_InitialX = random(0, width)
    let bird2_InitialY = random(20, height / 2)

    let bird3_InitialX = random(0, width)
    let bird3_InitialY = random(20, height / 2)

    bird1 = new maleBird('bird1', bird1_InitialX, bird1_InitialY, 0.1, nest1, perch1, femaleperch1, "red/", random([random(1.25,2), random(-1.25,-2)]))
    bird2 = new maleBird('bird2', bird2_InitialX, bird2_InitialY, 0.1, nest2, perch2, femaleperch2, "purple/", random([random(1.25,2), random(-1.25,-2)]))
    bird3 = new maleBird('bird3', bird3_InitialX, bird3_InitialY, 0.1, nest3, perch3, femaleperch3, "blue/", random([random(1.25,2), random(-1.25,-2)]))

    nest1.bird = bird1;
    nest2.bird = bird2;
    nest3.bird = bird3

    for (let nest of nestArray) {
        var babyBirdX = nest.sprite.position.x - nest.sprite.originalWidth / 8 + ((nest.sprite.originalWidth / 3) * nest.babyBirdsInNest.length)
        nest.babyBirdCount++;
        new babyBird(babyBirdX, nest.sprite.position.y - nest.sprite.originalWidth / 8, 0.05, nest);
    }
}

function createPrey() {
    var wormX = random(wormBorder, width - wormBorder)
    var wormY = random(ground.position.y - 20, ground.position.y)
    new Worm(wormX, wormY, 0.1)
}

function preyMovement() {
    for (let worm of wormsArray) {
        if (worm.sprite.position.x <= wormBorder || worm.sprite.position.x >= width - wormBorder) {
            worm.sprite.velocity.x *= -1
        }
    }
}

//load the animations into variables
function loadAnimations() {
    malebird1_fly = loadAnimation(malebird1_fly_spritesheet);
    malebird2_fly = loadAnimation(malebird2_fly_spritesheet);
    malebird3_fly = loadAnimation(malebird3_fly_spritesheet);
    femalebird_fly = loadAnimation(femalebird_fly_spritesheet);
    babybird_fly = loadAnimation(babybird_fly_spritesheet);
    notes_play = loadAnimation(notes_spritesheet);
    notes_flipped_play = loadAnimation(notes_flipped_spritesheet);
}

class Worm {
    constructor(x, y, scale) {
        this.sprite = createSprite(x, y)
        this.sprite.scale = scale;
        this.sprite.depth = 25;
        this.sprite.debug = false

        this.sprite.addAnimation('normal', imagePath + 'worm.png');
        this.sprite.addAnimation('dead', imagePath + 'worm.png');

        this.sprite.setSpeed(random(random(-0.3, -0.2), random(0.2, 0.3)));
        this.sprite.velocity.y = 0;

        this.sprite.setCollider('circle', 0, 0, 150)

        wormsArray.push(this)
    }
}
class babyBird {
    constructor(x, y, scale, nest) {
        this.sprite = createSprite(x, y)
        this.initialX = x
        this.sprite.scale = scale
        this.nest = nest
        this.removeX = random([-10, width + 10]) //where bird should fly to
        this.removeY = random(0, height / 5)
        this.sprite.mirrorX(random([1, -1]))

        this.sprite.addAnimation('normal', imagePath + 'babybird0001.png', imagePath + 'babybird0002.png');
        this.sprite.addAnimation('grown', imagePath + 'babybird_grown0001.png', imagePath + 'babybird_grown0002.png');
        this.sprite.addAnimation('fly', babybird_fly);

        this.sprite.depth = 15;
        babyBirdsArray.push(this); //keeps track of all baby birds

        // Check if babyBirdsInNest is an array
        if (Array.isArray(this.nest.babyBirdsInNest)) {
            this.nest.babyBirdsInNest.push(this);
        } else {
            console.error('babyBirdsInNest is not an array:', this.nest.babyBirdsInNest);
        }

    }

    leaveNest() {
        if (this.sprite.velocity.x > 0) {
            this.sprite.mirrorX(-1);
        } else if (this.sprite.velocity.x < 0) {
            this.sprite.mirrorX(1);
        }

        this.sprite.changeAnimation('fly');  //baby bird fly to remove location
        this.sprite.friction = 0.1
        this.sprite.attractionPoint(0.2, this.removeX, this.removeY)

        if ((abs(this.sprite.position.y - this.removeY) < 1) && (abs(this.sprite.position.x - this.removeX) < 1)) { //if baby bird at remove location
            this.sprite.velocity.x = 0;
            this.sprite.velocity.y = 0;
            this.nest.bird.babyBirdFlying = false;
            this.sprite.remove();
        }
    }
}
