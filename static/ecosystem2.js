// assets file path
var imagePath = '/sprites_haruta/';

let maleBirdsArray = []
let femaleBirdsArray = []
let babyBirdsArray = []
let wormsArray = []


//Array of locations for nests
//Nests numbered as 1-3 from left to right
let nest1_locations = [[125, 272], [290, 320]];
let nest2_locations = [[330, 410], [440, 376]]
let nest3_locations = [[680, 360], [525, 315]];

//Arrays of positions for male perch spots
let male1_perch_locations = [[300, 310], [215, 265]];
let male2_perch_locations = [[470, 365], [390, 380]];
let male3_perch_locations = [[618, 310], [700, 352]];

//index for determining nest and perch positions
var index1;
var index2;
var index3;

//location of each nest 
var nest1_xy
var nest2_xy
var nest3_xy

// environment sprites
var ground;
var tree1;
var tree2;
var tree3;

//bird sprites
var bird1;
var bird2;
var bird3;
var femalebird;

//inputs
var scavengeCheckbox;
var foodCondition //used in if statement to determine if scavenge behavior should be exhibited
var foodChange //keeps track of whether bird is in process of carrying 
var matingCheckBox;
var matingCondition
var matingChange

//spritesheets
var malebird_fly_spritesheet;
var malebird_sing_spritesheet;
var femalebird_fly_spritesheet;
var babybird_fly_spritesheet;
var notes_spritesheet;
var notes_flipped_spritesheet;

//animation names
var malebird_fly;
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

//preload all json files and sprite sheets 
function preload() {
    // Load the json for the tiles sprite sheet
    loadJSON(imagePath + 'malebird_fly.json', function (malebird_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        malebird_fly_spritesheet = loadSpriteSheet(imagePath + 'malebird_fly_spritesheet.png', malebird_fly_frames);
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
    createCanvas(800, 590);
    createEnvironment();
    createInputs();
    createAnimals();
}

function draw() {
    background(135, 206, 250);
    drawSprites();
    maleBirdMovement()
    femaleBirdMovement();

    for (let bird of maleBirdsArray) { //go through male birds
        if (foodCondition) { //if they should be scavenging
            if (!bird.scavengeChange) { //and isn't already in the process of scavenging
                birdScavenge(bird); //pass in bird so can access later on
            }
        } else if (matingCondition) { //if should be mating
            if (!bird.matingChange) { //and not in the process of mating
                createFemaleBird(bird); //create a female bird
                bird.matingChange = true //set variable to indicate in process of mating
            }
            birdMate()
        }
    }
}

function createFemaleBird(bird) {
    var femalebirdLocation = random(["left", "right"]); 
    if (femalebirdLocation == "left") { 
        var femalebirdX = 0 - bird.originalWidth; 
        var femalebirdY = random(0, height / 4);
      }
      else if (femalebirdLocation == "right") { 
        var femalebirdX = width + bird.originalWidth; 
        var femalebirdY = random(0, height / 4);
      }

      femalebird = new femaleBird(femalebirdX, femalebirdY, 0.1, bird)
}

function birdMate() {

}

function birdScavenge(bird) {
    //console.log(bird.nest.sprite.position.x)
}

function maleBirdMovement() {
    for (let bird of maleBirdsArray) {
        if (bird.velocity.x > 0) {
            bird.mirrorX(-1);
        } else if (bird.velocity.x < 0) {
            bird.mirrorX(1);
        }
    }
}

function femaleBirdMovement() {
    for (let bird of femaleBirdsArray) {
        if (bird.velocity.x > 0) {
            bird.mirrorX(-1);
        } else if (bird.velocity.x < 0) {
            bird.mirrorX(1);
        }
    }
}

function createEnvironment() {
    dirt = createSprite(width / 2, 560);
    dirt.addAnimation('normal', imagePath + 'ground.png');
    dirt.scale = 1;
    dirt.depth = 3;

    //left most tree
    tree1 = createSprite(width / 4, 320);
    tree1.addAnimation('normal', imagePath + 'tree1.png');
    tree1.scale = 0.7;
    tree1.depth = 4;

    //middle tree
    tree2 = createSprite(width / 2, 410);
    tree2.addAnimation('normal', imagePath + 'tree2.png');
    tree2.scale = 0.5;
    tree2.depth = 2;

    //right most tree
    tree3 = createSprite(3 * width / 4, 360);
    tree3.addAnimation('normal', imagePath + 'tree1.png');
    tree3.scale = 0.65;
    tree3.depth = 1;

    index1 = Math.floor(Math.random() * nest1_locations.length);
    let nest1_xy = nest1_locations[index1];

    index2 = Math.floor(Math.random() * nest2_locations.length);
    let nest2_xy = nest2_locations[index2];

    index3 = Math.floor(Math.random() * nest3_locations.length);
    let nest3_xy = nest3_locations[index3];

    //creating nest sprites using index
    nest1 = new Nest(nest1_xy[0], nest1_xy[1], 0.3)
    nest2 = new Nest(nest2_xy[0], nest2_xy[1], 0.25)
    nest3 = new Nest(nest3_xy[0], nest3_xy[1], 0.3)
}

function createInputs() {
    scavengeCheckbox = createButton(" Scavenge Food");
    scavengeCheckbox.position(10, 10);
    scavengeCheckbox.mousePressed(() => {
        foodCondition = true
    })

    scavengeCheckbox.style('font-size', '14px');
    scavengeCheckbox.style('background-color', 'pink');
    scavengeCheckbox.style('color', 'white');
    scavengeCheckbox.style('padding', '5px 5px');
    scavengeCheckbox.style('border', 'none');
    scavengeCheckbox.style('border-radius', '12px');

    matingCheckbox = createButton(" Mating Behavior");
    matingCheckbox.position(10, 40);
    matingCheckbox.mousePressed(() => {
        matingCondition = true  
    })

    matingCheckbox.style('font-size', '14px');
    matingCheckbox.style('background-color', 'blue');
    matingCheckbox.style('color', 'white');
    matingCheckbox.style('padding', '5px 5px');
    matingCheckbox.style('border', 'none');
    matingCheckbox.style('border-radius', '12px');
}


function createAnimals() {
    loadAnimations();

    bird1 = new maleBird(nest1.sprite.position.x, nest1.sprite.position.y - 20, 0.1, nest1)
    //bird2 = new maleBird(nest2.sprite.position.x, nest2.sprite.position.y - 20, 0.1)
    //bird3 = new maleBird(nest3.sprite.position.x, nest3.sprite.position.y - 20, 0.1)

}

//load the animations into variables
function loadAnimations() {
    malebird_fly = loadAnimation(malebird_fly_spritesheet);
    femalebird_fly = loadAnimation(femalebird_fly_spritesheet);
    babybird_fly = loadAnimation(babybird_fly_spritesheet);
    notes_play = loadAnimation(notes_spritesheet);
    notes_flipped_play = loadAnimation(notes_flipped_spritesheet);
}

class maleBird {
    constructor(x, y, scale, nest, perch) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        maleBirdsArray.push(this.sprite)
        this.sprite.nest = nest;

        this.sprite.scavengeChange = false; //keeps track of whether bird is in the process of scavenging

        //animations
        this.sprite.addAnimation('walk', malebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'malebird_stand.png'); sing = this.sprite.addAnimation('sing', imagePath + 'malebird_sing0001.png', imagePath + 'malebird_sing0002.png');
        peck = this.sprite.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');
        this.sprite.addAnimation('transformed', imagePath + 'malebird_death.png');

        this.sprite.changeAnimation('stand');

        var peckFrameCycle = 20;
        var singFrameCycle = 60;
        peck.frameDelay = peckFrameCycle / 2;
        sing.frameDelay = singFrameCycle / 4;

        // create collider for player 
        this.sprite.setCollider('circle', 0, 0, 200);
        this.sprite.depth = 20;
        this.sprite.friction = 0.05;
    }
}

class femaleBird {
    constructor(x, y, scale, mate) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        femaleBirdsArray.push(this.sprite);
        this.sprite.mate = mate;

        //animations
        this.sprite.addAnimation('normal', femalebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'femalebird_stand.png');

        this.sprite.friction = 0.1;
        this.sprite.depth = 20;
       
    }
}

class Nest {
    constructor(x, y, scale) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        this.sprite.addAnimation('normal', imagePath + 'nest.png');
    }

    addBabyBird() {
        console.log('in add baby bird')
    }

    removeBabyBird() {
        console.log('in remove baby bird')
    }
}
