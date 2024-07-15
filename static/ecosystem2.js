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
let male1_perch_locations = [[300, 320], [205, 275]];
let male2_perch_locations = [[470, 375], [390, 385]];
let male3_perch_locations = [[618, 310], [700, 352]];

let female1_perch_locations = [[220, 320], [155, 275]];
let female2_perch_locations = [[425, 375], [355, 385]];
let female3_perch_locations = [[585, 315], [655, 365]];

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

//inputs
var scavengeCheckbox;
var foodCondition //used in if statement to determine if scavenge behavior should be exhibited
var foodChange //keeps track of whether bird is in process of carrying 

var matingCheckBox;
var matingCondition
var mateCreated

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

//music notes
var music;
var music_flipped

var peckFrameCycle = 20;
var singFrameCycle = 60;

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
        if (bird.matingCondition) { //if should be mating
            if (!bird.mateCreated) { //and not in the process of mating
                bird.mate = createFemaleBird(bird); //create a female bird
                bird.mateCreated = true //set variable to indicate in process of mating
            }
            bird.mateBehavior();
        }
    }
}

function createFemaleBird(bird) {
    var femalebirdLocation = random(["left", "right"]);

    if (femalebirdLocation == "left") {
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
        if (bird.sprite.velocity.x > 0) {
            bird.sprite.mirrorX(-1);
        } else if (bird.sprite.velocity.x < 0) {
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
    dirt = createSprite(width / 2, 560);
    dirt.addAnimation('normal', imagePath + 'ground.png');
    dirt.scale = 1;
    dirt.depth = 3;

    //left most tree
    tree1 = createSprite(width / 4, 320);
    tree1.addAnimation('normal', imagePath + 'tree2.png');
    tree1.scale = 0.7;
    tree1.depth = 4;

    //middle tree
    tree2 = createSprite(width / 2, 410);
    tree2.addAnimation('normal', imagePath + 'tree1.png');
    tree2.scale = 0.5;
    tree2.depth = 2;

    //right most tree
    tree3 = createSprite(3 * width / 4, 360);
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
    nest1 = new Nest(nest1_xy[0], nest1_xy[1], 0.3)
    nest2 = new Nest(nest2_xy[0], nest2_xy[1], 0.25)
    nest3 = new Nest(nest3_xy[0], nest3_xy[1], 0.3)

}

function createInputs() {
    scavengeCheckbox = createButton(" Scavenge Food");
    scavengeCheckbox.position(10, 10);
    scavengeCheckbox.mousePressed(() => {
        bird1.foodCondition = true
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
        bird1.matingCondition = true
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

    let perch1 = male1_perch_locations[index1]
    let perch2 = male2_perch_locations[index2]
    let perch3 = male3_perch_locations[index3]

    let femaleperch1 = female1_perch_locations[index1]
    let femaleperch2 = female2_perch_locations[index2]
    let femaleperch3 = female3_perch_locations[index3]

    bird1 = new maleBird(nest1.sprite.position.x, nest1.sprite.position.y - 20, 0.1, nest1, perch1, femaleperch1)
    //bird2 = new maleBird(nest2.sprite.position.x, nest2.sprite.position.y - 20, 0.1, nest2, perch2, femaleperch2)
    //bird3 = new maleBird(nest3.sprite.position.x, nest3.sprite.position.y - 20, 0.1, nest3, perch3, femaleperch3)

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
    constructor(x, y, scale, nest, perch, femaleperch) {
        this.sprite = createSprite(x, y);
        this.sprite.scale = scale
        this.nest = nest;
        this.perchX = perch[0]
        this.perchY = perch[1]

        this.femaleperchX = femaleperch[0]
        this.femaleperchY = femaleperch[1]

        console.log('male perch x', this.perchX)
        console.log('male perch y', this.perchY)

        console.log('female perch x', this.femaleperchX)
        console.log('female perch y', this.femaleperchY)

        this.scavengeCondition = false
        this.scavengeChange = false; //keeps track of whether bird is in the process of scavenging

        this.matingCondition = false
        this.mateCreated = false

        this.matingStage = 0 //keeps track of mating stage 
        // if = 1, bird is singing and female bird is flying to it
        //if = 2, female bird is at its perch spot
        //if = 3, heart is created

        //animations
        this.sprite.addAnimation('fly', malebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'malebird_stand.png'); sing = this.sprite.addAnimation('sing', imagePath + 'malebird_sing0001.png', imagePath + 'malebird_sing0002.png');
        peck = this.sprite.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');
        this.sprite.addAnimation('transformed', imagePath + 'malebird_death.png');

        this.sprite.changeAnimation('stand');

        peck.frameDelay = peckFrameCycle / 2;
        sing.frameDelay = singFrameCycle / 4;

        this.notes;
        this.notes_flipped

        this.love;

        // create collider for player 
        this.sprite.setCollider('circle', 0, 0, 200);
        this.sprite.depth = 20;
        this.sprite.friction = 0.05;

        this.mate = null;

        maleBirdsArray.push(this)
    }

    mateBehavior() {

        // if = 1, bird is singing and female bird is flying to it
        //if = 2, heart shows 
        //if = 3, heart disappeared and femae bird flies out of frame

        this.mate.mateBehavior();

        if (this.matingStage == 0) {
        if ((abs(this.sprite.position.y - this.perchY) < 1) && (abs(this.sprite.position.x - this.perchX) < 1)) { //if close to perch stop
            this.sprite.velocity.x = 0; //stop moving
            this.sprite.velocity.y = 0;
            this.sprite.changeAnimation('stand')

            //facing mate
            if (this.mate.sprite.perchX < this.sprite.perchX) {
                this.sprite.mirrorX(-1);
            } else {
                this.sprite.mirrorX(1);
            }

            this.matingStage = 1
            this.mate.matingStage = 1

        } else {
            this.sprite.changeAnimation('fly')
            this.sprite.attractionPoint(0.1, this.perchX, this.perchY)
        }
    }


        if (this.matingStage == 1) { //start to sing 
            this.sprite.changeAnimation('sing')
            if (this.notes == null && this.notes_flipped == null) {
                this.createNotes();
            }
        }

        if (this.matingStage == 3) { //heart will appear 
            if (this.notes != null) {
                this.notes.remove();
            }
            if (this.notes_flipped != null) {
                this.notes_flipped.remove()
            }
            this.sprite.changeAnimation('stand')
            this.createLove();
            if(!this.love.loveCondition) {
                this.matingStage = 4
                this.mate.matingStage = 4
            }
        }

        if (this.matingStage ==4) {
            console.log('matingStage', this.matingStage)
            //create baby bird 
            //baby bird count increase 
            //female bird flies away 
            //mating change = false 
            //mating condition = false 

            //need a create baby Bird functin
            //need baby bird movement function

        }
    }

    createNotes() {

        if (this.notes != null) this.notes.remove();
        if (this.notes_flipped != null) this.notes_flipped.remove()

        if (this.mate.sprite.perchX < this.sprite.perchX) {
            this.notes = createSprite(this.sprite.position.x + 0.3 * this.sprite.originalWidth, this.sprite.position.y - 0.3 * this.sprite.originalHeight);
            music = this.notes.addAnimation('normal', notes_play);
            this.notes.scale = 0.1;
            music.frameDelay = singFrameCycle / 4;
        }
        else {
            this.notes_flipped = createSprite(this.sprite.position.x - 0.3 * this.sprite.originalWidth, this.sprite.position.y - 0.3 * this.sprite.originalHeight);
            music_flipped = this.notes_flipped.addAnimation('normal', notes_flipped_play);
            this.notes_flipped.scale = 0.1;
            music_flipped.frameDelay = singFrameCycle / 4;
        }
    }

    createLove() {
        if (this.love == null) {
            var midpointX = abs(this.mate.sprite.position.x - this.sprite.position.x) / 2;
            if (this.mate.sprite.position.x <= this.sprite.position.x)
                this.love = new Heart(this.mate.sprite.position.x + midpointX, this.mate.sprite.position.y - 20);
            if (this.mate.sprite.position.x > this.sprite.position.x)
                this.love = new Heart(this.sprite.position.x + midpointX, this.mate.sprite.position.y - 20);
        }
        this.love.fade();
        this.love.show();
    }
}
class femaleBird {
    constructor(x, y, scale, mate, perch) {
        this.initialX = x
        this.initialY = y

        this.sprite = createSprite(x, y);
        this.sprite.scale = scale;

        this.perchX = perch[0]
        this.perchY = perch[1]

        this.matingStage = 0;

        // Animations
        this.sprite.addAnimation('fly', femalebird_fly);
        this.sprite.addAnimation('stand', imagePath + 'femalebird_stand.png');

        this.sprite.friction = 0.1;
        this.sprite.depth = 20;

        this.mate = mate; // Assign the sprite of the maleBird

        femaleBirdsArray.push(this);

        this.singFrameCount = 0;
    }

    mateBehavior() {

        // if = 1, bird is singing and female bird is flying to it
        //if = 2, male bird sings for 5 more cycles
        //if = 3, heart shows 
        //if = 4, heart disappeared and femae bird flies out of frame

        if (this.matingStage == 1) { //female bird flying to male bid
            console.log('matingStage', this.matingStage)
            if ((abs(this.sprite.position.y - this.perchY) < 1) && (abs(this.sprite.position.x - this.perchX) < 1)) { //if close to perch stop
                this.sprite.velocity.x = 0; //stop moving
                this.sprite.velocity.y = 0
                this.sprite.changeAnimation('stand')

                if (this.mate.sprite.position.x < this.sprite.position.x) {
                    this.sprite.mirrorX(1);
                } else {
                    this.sprite.mirrorX(-1);
                }

                this.matingStage = 2;
                this.mate.matingStage = 2;
            } else {
                this.sprite.changeAnimation('fly')
                this.sprite.attractionPoint(0.2, this.perchX, this.perchY)
            }
        }

        if (this.matingStage == 2) { //bird sings for 1 more frame cycles
            console.log('matingStage', this.matingStage)
            this.sprite.changeAnimation('stand')
            console.log('sing frame count', this.singFrameCount)
            this.singFrameCount++
            if (this.singFrameCount > singFrameCycle) {
                this.matingStage = 3;
                this.mate.matingStage = 3;
            }
        }

        if (this.matingStage == 3) {
            console.log('matingStage', this.matingStage)
        }


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


class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.loveX = 100;
        this.loveY = 3 * (cos(100) + sin(100 / 2)) + 110;
        this.fadeEffect = 1;
        this.fadeEffectCondition = true;
        this.loveCondition = true;
    }



    fade() {
        if (!this.loveCondition) return
        if (this.fadeEffectCondition) {
            this.fadeEffect += 2;
            if (this.fadeEffect >= 255) {
                this.fadeEffect = 255;
                this.fadeEffectCondition = false;
            }
        } else {
            this.fadeEffect -= 2;
            if (this.fadeEffect <= 0) {
                this.fadeEffect = 0;
                this.fadeEffectCondition = true;
                this.loveCondition = false;
            }
        }
    }

    show() {
        push();
        fill(250, 0, 0, this.fadeEffect);
        noStroke();
        this.loveX += 54;
        this.loveY = 3 * (cos(this.loveX) + sin(this.loveX / 2)) + 110;

        translate(this.x, this.y);
        rotate(45);
        // Calculate sizes based on loveY
        let sizeRect = this.loveY / 6;
        let sizeEllipse = this.loveY / 6;

        // Draw the rectangle
        rectMode(CENTER);
        rect(0, 0, sizeRect, sizeRect);

        // Draw the semi-circles
        arc(0, -sizeRect / 2, sizeEllipse, sizeEllipse, 180, 0, CHORD); // Right semi-circle
        arc(-sizeRect / 2, 0, sizeEllipse, sizeEllipse, 90, -90, CHORD); // Top semi-circle
        pop();

    }
}