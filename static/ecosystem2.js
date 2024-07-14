// assets file path
var imagePath = '/sprites_haruta/';
 
let birds = [];
 
//Array of locations for nests
//Nests numbered as 1-3 from left to right
let nest1_locations = [[125, 272], [290, 320]];
let nest2_locations = [[330, 410], [440, 376]]
let nest3_locations = [[680, 360], [525, 315]];
 
//Arrays of positions for male perch spots
let male1_perch_locations = [[300, 310], [215, 265]];
let male2_perch_locations = [[470, 365], [390, 380]];
let male3_perch_locations = [[618, 310], [700, 352]];
 
// environment sprites
var ground;
var tree1;
var tree2;
var tree3;
 
var bird1;
var bird2;
var bird3;
 
//inputs
var scavengeCheckbox;
var matingCheckBox;
 
//spritesheets
var malebird_fly_spritesheet;
var malebird_food_fly_spritesheet;
var femalebird_fly_spritesheet;
 
//bird animations
var malebird_fly
var malebird_food_fly
var femalebird_fly
var peck;
var food_peck;
 
function preload() {
    loadJSON(imagePath + 'malebird_fly.json', function (malebird_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        malebird_fly_spritesheet = loadSpriteSheet(imagePath + 'malebird_fly_spritesheet.png', malebird_fly_frames);
    });
 
    loadJSON(imagePath + 'malebird_food_fly.json', function (malebird_food_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        malebird_food_fly_spritesheet = loadSpriteSheet(imagePath + 'malebird_food_fly_spritesheet.png', malebird_food_fly_frames);
    });
 
    loadJSON(imagePath + 'femalebird_fly.json', function (femalebird_fly_frames) {
        // Load tiles sprite sheet from frames array once frames array is ready
        femalebird_fly_spritesheet = loadSpriteSheet(imagePath + 'femalebird_fly_spritesheet.png', femalebird_fly_frames);
    });
}
 
function setup() {
    createCanvas(800, 590);
    createEnvironment();
    createInputs();
    loadAnimations();
}
 
function draw() {
    background(135, 206, 250);
    bird1 = new maleBird(100,100,1);
    bird1.createMaleBird();
 
    drawSprites();
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
}
 
function createInputs() {
    scavengeCheckbox = createCheckbox(" Scavenge Food", false);
    scavengeCheckbox.position(10, 0);
 
    matingCheckbox = createCheckbox(" Mating Behavior", false);
    matingCheckbox.position(10, 20);
}
 
function loadAnimations() {
    malebird_fly = loadAnimation(malebird_fly_spritesheet);
    malebird_food_fly = loadAnimation(malebird_food_fly_spritesheet); //flying with worm
    femalebird_fly = loadAnimation(femalebird_fly_spritesheet);
}
 
class maleBird {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
 
    createMaleBird() {
        var male_sprite = createSprite(this.x, this.y)
        male_sprite.addAnimation('fly', malebird_fly);
        male_sprite.addAnimation('perch', imagePath + 'malebird_stand.png');
        male_sprite.addAnimation('food fly', malebird_food_fly); //finding food
        //sing = player_sprite.addAnimation('sing', malebird_sing);
        peck = male_sprite.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');
        male_sprite.addAnimation('death', imagePath + 'malebird_death.png');
        food_peck = male_sprite.addAnimation('peck_food', imagePath + 'malebird_food_peck0001.png', imagePath + 'malebird_food_peck0002.png');
    }
 
}