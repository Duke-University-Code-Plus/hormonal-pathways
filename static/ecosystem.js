//animals
var predator;
var malebird;
var femalebird; 
var babybirds;
var babybird; 
var prey;
var preys;


//animation
var peck; 
var sing; 

//scavenge 
var searchDirection; 
var preyLocation;
var numPrey = 5;
var caughtPrey;
var removedPrey;
var preySide; 
var rightPreys; 
var leftPreys
var peckColliderY = 0; 

//mating
var babybirdCount = 0; 
var loveCondition = false; 
var femalebirdX; 
var femalebirdY;
var babybirdX;
var notes_flipped; 
var notes; 
var music; 
var babybirdDirection;
var reproduce; 

//player location
var groundHeight;
var nestVicinity;
var effcientScavenge = true; 
var atNest;
var matesVicinity; 

//environment
var nest; 
var trunk; 
var dirt; 
var love; 

//spritesheets
var malebird_fly_spritesheet;
var malebird_sing_spritesheet; 
var femalebird_fly_spritesheet;
var babybird_fly_spritesheet;
var notes_spritesheet;
var notes_flipped_spritesheet; 
var malebird_fly;
var malebird_sing;
var femalebird_fly;
var babybird_fly;
var notes_play;
var notes_flipped_play;


//frames
var time = 0; 
var scavengeFrameCount = 0; 
var peckFrameCycle; 
var singFrameCycle; 
var singFrameCount = 0; 
var fadeEffect = 0; 
var fadeEffectCondition = true; 
var fadeEffectComplete = false; 

//inputs
var foodCheckbox; 
var foodCondition = false; 
var scavengeChange = false; 
var mortalityCheckbox; 
var mortalityCondition = false; 
var imagePath = '/sprites_haruta/';
var shortageSlider; 
var shortageSliderCurrent
var shortageSliderSet;
var shortageSliderChange = false;
var matingCheckbox; 
var matingCondition = false; 
var matingChange = false; 


//load JSON files and Spritesheets 
function preload() {
  // Load the json for the tiles sprite sheet
  loadJSON(imagePath + 'malebird_fly.json', function(malebird_fly_frames) {
    // Load tiles sprite sheet from frames array once frames array is ready
    malebird_fly_spritesheet = loadSpriteSheet(imagePath + 'malebird_fly_spritesheet.png', malebird_fly_frames);
  });

  loadJSON(imagePath + 'femalebird_fly.json', function(femalebird_fly_frames) {
    femalebird_fly_spritesheet = loadSpriteSheet(imagePath + 'femalebird_fly_spritesheet.png', femalebird_fly_frames);
  });

  loadJSON(imagePath + 'babybird_fly.json', function(babybird_fly_frames) {
    babybird_fly_spritesheet = loadSpriteSheet(imagePath + 'babybird_fly_spritesheet.png', babybird_fly_frames);
  });

  loadJSON(imagePath + 'notes.json', function(notes_frames) {
    notes_spritesheet = loadSpriteSheet(imagePath + 'notes_spritesheet.png', notes_frames);
  });

  loadJSON(imagePath + 'notes_flipped.json', function(notes_flipped_frames) {
    notes_flipped_spritesheet = loadSpriteSheet(imagePath + 'notes_flipped_spritesheet.png', notes_flipped_frames);
  });
}

//load sprites 
function setup() {
  createCanvas(800, 400);
  createInputs();
  createEnvironment()
  createAnimals();
}

function draw() {
  clear();
  background(135, 206, 250);

  time = millis(); 
  
  //inputs
  updateText();
  updateInputs();

  //bird trait 
  if (malebird.velocity.x > 0) 
    malebird.mirrorX(-1);
  if (malebird.velocity.x < 0) 
    malebird.mirrorX(1);

  //prey trait
  preyMovement(); 
  updatenumPrey();
  trackcatchablePrey();

  //baby bird trait
  if (babybirds != null)
    babybirdMovement();

  //female bird trait 
if (femalebird != null)
  femalebirdMovement();

  //bird animation to scavenge
  if (foodCondition) { 
    if (!scavengeChange) { 
      searchDirection = random(["left", "right"]);    
      scavengeChange = true; 
    }
    birdScavenge(); 
  }
  else if (matingCondition) { 
    if (!matingChange) {
      createFemalebird();
      reproductiveSuccess();
      matingChange = true;
    }
    birdMate();
  }
  //bird animation in death
  else if (mortalityCondition) { 
    if (predator == null)
      createPredator();
    predatorMovement();
    malebirdDeath(); 
  }
  else { 
    malebirdOnBranch()
  }
  //draw the sprite
  drawSprites();

  //objects

  if (loveCondition) { 
    if (love == null) {
      midpointX = abs(femalebird.position.x - malebird.position.x) / 2; 
      midpointY = abs(femalebird.position.y - malebird.position.y) / 2;
      if (femalebird.position.x <= malebird.position.x)
        love = new Heart(femalebird.position.x + midpointX, femalebird.position.y + midpointY); 
      if (femalebird.position.x > malebird.position.x)
        love = new Heart(malebird.position.x + midpointX, femalebird.position.y + midpointY);
    }
    love.fade();
    love.show();
    if (love.getLoveCondition() == false) { 
      loveCondition = false; 
    }
  }
}

//create inputs
function createInputs() {
  foodCheckbox = createCheckbox("Scavenge Food", false); 
  foodCheckbox.position(0, 0); 
  foodCheckbox.changed(() => {
    foodCondition = true; 
  });

  mortalityCheckbox = createCheckbox("End Simulation", false); 
  mortalityCheckbox.position(0, 30); 
  mortalityCheckbox.changed(() => {
    mortalityCondition = true; 
  });

  matingCheckbox = createCheckbox("Mating Behavior", false); 
  matingCheckbox.position(0, 60); 
  matingCheckbox.changed(() => {
    matingCondition = true; 
  });
  
  shortageSlider = createSlider(0, 10, 5, 0);
  shortageSlider.position(10, 90);
  shortageSlider.size(80);
}

// create environment  
function createEnvironment() { 
  //create ground
  for (var x = 35; x < 840; x += 70) {
    dirt = createSprite(x, 400);
    dirt.addAnimation('normal', imagePath + 'ground.png');
  }

  //create tree
  tree = createSprite(width / 2, 190);
  tree.addAnimation('normal', imagePath + 'tree1.png');
  tree.scale = 0.6;

  //create nest 
  nest = createSprite(width / 2 + 90, 190);
  nest.addAnimation('normal', imagePath + 'nest.png');
  nest.scale = 0.4;
  nest.depth = 20;
}

//create malebird
function createAnimals() {
  malebird_fly = loadAnimation(malebird_fly_spritesheet);
  femalebird_fly = loadAnimation(femalebird_fly_spritesheet);
  babybird_fly = loadAnimation(babybird_fly_spritesheet);
  notes_play = loadAnimation(notes_spritesheet);
  notes_flipped_play = loadAnimation(notes_flipped_spritesheet);

  //create player sprite and add animations
  malebird = createSprite(nest.position.x, nest.position.y - 20);
  malebird.addAnimation('walk', malebird_fly);
  malebird.addAnimation('stand', imagePath + 'malebird_stand.png');
  sing = malebird.addAnimation('sing', imagePath + 'malebird_sing0001.png', imagePath + 'malebird_sing0002.png');
  peck = malebird.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');
  malebird.addAnimation('transformed', imagePath + 'malebird_death.png');

  peckFrameCycle = 20; 
  singFrameCycle = 60; 
  peck.frameDelay = peckFrameCycle / 2;
  sing.frameDelay = singFrameCycle / 4; 
  // create collider for player 
  malebird.setCollider('circle', 0, 0, 200);
  malebird.debug = false;
  malebird.depth = 20;
  malebird.friction = 0.05;
  malebird.scale = 0.1; 

  //create and add animation for a group of prey 
  preys = new Group();
  numPrey = 5;
  // Create the prey sprite and add it's animations
  for (var i = 0; i < numPrey; i++) { 
    createPrey();
  }
}

function updateText() {
  text(floor(shortageSlider.value()), 100, 100);
  text("Reproductive Success: " + babybirdCount, 0, 120);
  //slider for food
}

function updateInputs() {
  shortageSliderCurrent = shortageSlider.value();
  if (shortageSliderCurrent != shortageSliderSet) { 
    shortageSliderSet = shortageSliderCurrent; 
    shortageSliderChange = true; 
  }
  else { 
    shortageSliderChange = false; 
  }
}

function createFemalebird() { 
  //create predator sprite and add animation
  var femalebirdLocation = random(["left", "right"]); 

  if (femalebirdLocation == "left") { 
    femalebirdX = 0 - malebird.originalWidth; 
    femalebirdY = random(0, height / 4);
  }
  else if (femalebirdLocation == "right") { 
    femalebirdX = width + malebird.originalWidth; 
    femalebirdY = random(0, height / 4);
  }
  femalebird = createSprite(femalebirdX, femalebirdY);
  femalebird.addAnimation('normal', femalebird_fly);
  femalebird.addAnimation('stand', imagePath + 'femalebird_stand.png');
  femalebird.debug = false;
  femalebird.friction = 0.1;
  femalebird.depth = 20;
  femalebird.scale = 0.1; 
}

  function femalebirdMovement() { 
  if (femalebird.velocity.x > 0) 
    femalebird.mirrorX(-1);
  if (femalebird.velocity.x < 0) 
    femalebird.mirrorX(1);
  if (matingCondition)
    femalebird.attractionPoint (0.2, malebird.position.x,  malebird.position.y + malebird.originalHeight / 2);
  if (!matingCondition) {
    femalebird.changeAnimation('normal'); 
    femalebird.attractionPoint (0.2, femalebirdX,  femalebirdY);
    if (femalebird.position.x <=  0 - malebird.originalWidth || femalebird.position.x >=  width + malebird.originalWidth) {
      femalebird.remove();
      femalebird = null;
    }
  }
}
 
// function perch() {
//   var perchX = tree.position.x - tree.originalWidth / 2; 
//   var perchY = tree.position.y + tree.originalWidth; 
//   if (femalebird.velocity.x > 0) 
//     femalebird.mirrorX(-1);
//   if (femalebird.velocity.x < 0) 
//     femalebird.mirrorX(1);
//   malebird.attractionPoint(0.1, perchX,  perchY);
//   femalebird.attractionPoint (0.1, perchX,  perchY);
// }

function reproductiveSuccess() {
  reproduce = true; 
}

function createBabybird() { 
  babybirdX = nest.position.x - nest.originalWidth / 4 + ((malebird.originalWidth / 4) * babybirdCount);
  if (babybirdX <= nest.position.x + nest.originalWidth / 2) { 
    babybirds = new Group();
    babybird = createSprite(babybirdX, nest.position.y - nest.originalWidth / 8);
    babybird.addAnimation('normal', imagePath + 'babybird0001.png', imagePath + 'babybird0002.png');
    babybird.addAnimation('grown', imagePath + 'babybird_grown0001.png', imagePath + 'babybird_grown0002.png');
    babybird.addAnimation('fly', babybird_fly);
    babybird.debug = false;
    babybird.depth = 50;
    babybird.scale = 0.05; 
    babybirds.add(babybird);
  }
}

function babybirdMovement() {
  if (babybirdDirection == null)
    babybirdDirection = []; 

  for(var i = 0; i < babybirds.length; i++) {
    var babybird_organism = babybirds[i];

    if (babybirdDirection[i] == null)
      babybirdDirection[i] = random(["left", "right"]); 

    if (malebird.position.x > babybird_organism.position.x && babybird_organism.getAnimationLabel() == 'normal')
      babybird_organism.mirrorX(-1);
    else 
      babybird_organism.mirrorX(1);

    if (babybird_organism.scale <= 0.075) {
      babybird_organism.scale += 0.00001; 
    }
    else if (babybird_organism.scale <= 0.07) {
      babybird_organism.changeAnimation('grown');
      babybird_organism.scale += 0.00001; 
    }
    else {
      babybird_organism.changeAnimation('fly');
      console.log(babybirdDirection[i]);
      if (babybirdDirection[i] == "left") {
        babybird_organism.mirrorX(1);
        babybird_organism.velocity.x = -2;
      }
      if (babybirdDirection[i] == "right") {
        babybird_organism.velocity.x = 2;
        babybird_organism.mirrorX(-1);
      }
      babybird_organism.velocity.y = -1;
    }

    if (babybird_organism.position.x >= width || babybird_organism.position.x <= 0) {
      babybirdDirection[i] = null;
      babybird_organism.remove();
    }
  }
}

function createNotes() {
  if (femalebird.position.x < malebird.position.x) {
    notes = createSprite(malebird.position.x - 0.3 * malebird.originalWidth, malebird.position.y - 0.3 * malebird.originalHeight); 
    music = notes.addAnimation('normal', notes_play);
    notes.scale = 0.1; 
    music.frameDelay = singFrameCycle / 4;   
  }
  else { 
    notes_flipped = createSprite(malebird.position.x + 0.3 * malebird.originalWidth, malebird.position.y - 0.3 * malebird.originalHeight); 
    music_flipped = notes_flipped.addAnimation('normal', notes_flipped_play);
    notes_flipped.scale = 0.1; 
    music_flipped.frameDelay = singFrameCycle / 4;   
  }
}

function birdMate(){  
  if (1.5 * nest.originalWidth > abs(femalebird.position.x - malebird.position.x)
  && abs(femalebird.position.y - malebird.position.y) < malebird.originalHeight / 4) 
    matesVicinity = true; 
  else 
    matesVicinity = false; 

  if (femalebird.position.x < malebird.position.x) 
    malebird.mirrorX(1); 
  else
    malebird.mirrorX(-1); 
  
  if (matesVicinity) { 
    malebird.changeAnimation('sing');
    singFrameCount++;  
    if (notes == null && notes_flipped == null)
      createNotes();
    femalebird.changeAnimation('stand'); 
    femalebird.velocity.x = 0;
    femalebird.velocity.y = 0;
    if (singFrameCount >= singFrameCycle * 1) {
      malebird.changeAnimation('stand'); 
      if (notes != null) { 
        notes.remove();
        notes = null; 
      }
      else {
        notes_flipped.remove();
        notes_flipped = null; 
      }
      if (love == null)
        loveCondition = true; 
      if (reproduce && !loveCondition) {
        createBabybird(); 
        babybirdCount++;
        reproduce = false; 
      }
      if (!reproduce && !loveCondition) {
        matingCondition = false; 
        matingChange = false;
        love = null; 
      }
    }
  }
}

//initialize prey movement
function preyMovement() { 
  for(var i = 0; i < preys.length; i++) {
    var prey_organism = preys[i];
    if (prey_organism.getAnimationLabel() != 'dead') { 
      if ((prey_organism.position.x <= dirt.originalWidth && prey_organism.position.x < width / 2)
        || (prey_organism.position.x >= nest.position.x - nest.originalWidth && prey_organism.position.x < width / 2)
        || (prey_organism.position.x <= nest.position.x + nest.originalWidth && prey_organism.position.x > width / 2)
        || (prey_organism.position.x >= width - dirt.originalWidth && prey_organism.position.x > width / 2)) 
        prey_organism.velocity.x *= -1; // Reverse horizontal velocity
    }
    if (prey_organism.velocity.x >= 0) 
      prey_organism.mirrorX(-1);
    if (prey_organism.velocity.x < 0) 
      prey_organism.mirrorX(1);
  }
}

function catchPrey() {
  var counter = preys.length - 1;
  var deadPrey = false; 
  while (counter >= 0 && deadPrey == false) { 
    if (preys[counter].overlap(malebird)) { 
      preys[counter].changeAnimation('dead');
      caughtPrey = preys[counter]; 
      preys.remove(caughtPrey);
      rightPreys.remove(caughtPrey);
      leftPreys.remove(caughtPrey);
      deadPrey = true; 
    }
    counter--; 
  }
  if (deadPrey == true)
    createPrey();
}

function trackcatchablePrey() { 
  rightPreys = new Group();
  leftPreys = new Group();
  for (var i = 0; i < preys.length; i++) { 
    //
    if (preys[i].position.x < nest.position.x) { 
      leftPreys.add(preys[i]); 
    }
    else {
      rightPreys.add(preys[i]); 
    }
  }
}

function updatenumPrey() {
  if (shortageSliderChange == true) { 
    while (preys.length < shortageSlider.value()) {
      createPrey(); 
    }
    while (preys.length > shortageSlider.value()) { 
      removePrey();
    }
  }
}

function createPrey() { 
  preySide = random(["left", "right"]);
  if (preySide == "left") 
    prey = createSprite(random(dirt.originalWidth, nest.position.x - nest.originalWidth), random(dirt.position.y - dirt.originalHeight / 4, dirt.position.y - 5));
  else
    prey = createSprite(random(nest.position.x + nest.originalWidth, width - dirt.originalWidth), random(dirt.position.y - dirt.originalHeight / 4, dirt.position.y - 5));
  prey.addAnimation('normal', imagePath + 'worm.png');
  prey.addAnimation('dead', imagePath + 'worm.png');
  
  prey.setSpeed(random(0.1 ,0.25));
  prey.velocity.y = 0; 
  prey.setCollider('circle', 0, 0, 150);
  prey.scale = 0.1; 
  prey.debug = false;
  prey.depth = 25;
  preys.add(prey);
}

function removePrey() { 
  removedPrey = preys[preys.length - 1]; 
  preys.remove(removedPrey); 
  removedPrey.remove(); 
}

function birdScavenge() { 
  if (malebird.position.x < nest.position.x)
    var birdPosition = "left";
  else 
    var birdPosition = "right";

  if (malebird.position.y >= dirt.position.y - 0.6 * dirt.originalHeight) 
    groundHeight = true;
  else
    groundHeight = false; 

  if (malebird.position.x <= nest.position.x + nest.originalWidth / 3 
    && malebird.position.x >= nest.position.x - nest.originalWidth / 3) 
    nestVicinity = true;
  else
    nestVicinity = false; 

  if (malebird.position.x <= nest.position.x + nest.originalWidth / 4 
    && malebird.position.x >= nest.position.x - nest.originalWidth / 4) 
    atNest = true;
  else
    atNest = false; 

//bird facing prey       

  //leave nest 
  if (nestVicinity && !caughtPrey) { 
    if (searchDirection == "left" && leftPreys.length != 0) 
      malebird.velocity.x = -1; 
    else 
      malebird.velocity.x = 1;

    malebird.velocity.y = -1; 
    malebird.changeAnimation('walk');
  }

  //horizontal travel to ground
  if ((!nestVicinity && !caughtPrey)) { 
    if (birdPosition == "left") {
      malebird.attractionPoint(0.2, leftPreys[leftPreys.length - 1].position.x, dirt.position.y - dirt.originalHeight / 2);
      leftPreys[leftPreys.length - 1].setSpeed(0.05); 
      if (2 * nest.originalWidth < abs(nest.position.x - leftPreys[leftPreys.length - 1].position.x)) 
        effcientScavenge = false; 
    }
    else {
      malebird.attractionPoint(0.2, rightPreys[rightPreys.length - 1].position.x, dirt.position.y - dirt.originalHeight / 2);
      rightPreys[rightPreys.length - 1].setSpeed(0.05); 
      if (2 * nest.originalWidth < abs(nest.position.x - rightPreys[rightPreys.length - 1].position.x)) 
        effcientScavenge = false; 
    }
    malebird.velocity.y = 3; 
  }


  //scavenge
  if (groundHeight && !caughtPrey) { 
    if (scavengeFrameCount <= peckFrameCycle + peckFrameCycle / 2) { 
      malebird.changeAnimation('peck');
    }
    else { 
      catchPrey();
    }     
    if (scavengeFrameCount - (int(scavengeFrameCount / peckFrameCycle) * peckFrameCycle) == peckFrameCycle / 2) {
      peckColliderY += 40; 
      malebird.setCollider('circle', 0, peckColliderY, 200);
    }
    if (peckColliderY >= 300) {
      peckColliderY = 0; 
      malebird.setCollider('circle', 0, 0, 200);
    }
    scavengeFrameCount++; 
    malebird.velocity.x = 0; 
    malebird.velocity.y = 0; 
  }


  if (caughtPrey) { 
    if (malebird.getAnimationLabel() == 'walk') {
      if (birdPosition == "left")
        caughtPrey.attractionPoint(3, malebird.position.x + 20,  malebird.position.y);
      else
        caughtPrey.attractionPoint(3, malebird.position.x - 20,  malebird.position.y);
    }
    else {
      if (birdPosition == "left")
        caughtPrey.attractionPoint(3, malebird.position.x + 20,  malebird.position.y + 15);
      else
        caughtPrey.attractionPoint(3, malebird.position.x - 20,  malebird.position.y + 15);
    }

    caughtPrey.friction = 0.2; 
  }

  //vertical travel to nest
  if (!nestVicinity && caughtPrey)  { 
    scavengeFrameCount = 0; 
    malebird.changeAnimation('walk');
    if (birdPosition == "left" && effcientScavenge) 
      malebird.velocity.x = 1; 
    else if (birdPosition == "left"  && !effcientScavenge)
      malebird.velocity.x = 1.5; 
    else if (birdPosition == "right"  && effcientScavenge) 
      malebird.velocity.x = -1; 
    else 
      malebird.velocity.x = -1.5; 
    malebird.velocity.y = -2; 
    malebird.attractionPoint(0.2, nest.position.x, nest.position.y - nest.originalHeight / 2);
  }

  //enter nest
  if (nestVicinity && caughtPrey) {
    if (malebird.velocity.x < 0)
      malebird.velocity.x = -0.4;
    else 
      malebird.velocity.x = 0.4;
    malebird.velocity.y = 1; 
    malebird.attractionPoint(0.1, nest.position.x, nest.position.y);
    }

  //feed
  if (atNest && malebird.position.y >= nest.position.y - 30
    && caughtPrey) {

    scavengeFrameCount++; 
    malebird.velocity.x = 0; 
    malebird.velocity.y = 0; 
    if (scavengeFrameCount <= peckFrameCycle / 2) { 
      malebird.changeAnimation('peck');
      caughtPrey.remove();
    }
    else { 
      scavengeFrameCount = 0; 
      peckColliderY = 0; 
      malebird.setCollider('circle', 0, 0, 200);
      caughtPrey = null;
      scavengeChange = false; 
      foodCondition = false; 
    }
  }
}

function createPredator() { 
  //create predator sprite and add animation
  var predatorLocation = random(["left", "top", "right"]); 
  var predatorX; 
  var predatorY;
  if (predatorLocation == "left") { 
    predatorX = 0 - 64; 
    predatorY = random(0, height / 4);
  }
  else if (predatorLocation == "right") { 
    predatorX = width + 64; 
    predatorY = random(0, height / 4);
  }
  else {
    predatorX = random(0, width); 
    predatorY = 0 - 64;
  }
  predator = createSprite(predatorX, predatorY);
  predator.addAnimation('normal', imagePath + 'cloud_breathing0001.png', imagePath + 'cloud_breathing0002.png');
  predator.attractionPoint (0.1, malebird.position.x,  malebird.position.y);
  predator.debug = false;
  predator.friction = 0.1;
  predator.depth = 25;
  predator.scale = 0.5; 
}

function predatorMovement() { 
  //accounts for predator 
  predator.attractionPoint (0.1, malebird.position.x,  malebird.position.y);
}

function malebirdDeath() { 
  // if bird collides with predator 
  if (predator.overlapPoint(malebird.position.x, malebird.position.y)) { 
    malebird.changeAnimation('transformed');
    malebird.velocity.x = 0;
    malebird.velocity.y = 2;
    predator.velocity.x = 0;
    predator.velocity.y = 0;
  }
  if (malebird.position.y >= height - dirt.originalHeight / 2 && malebird.getAnimationLabel() == 'transformed') 
    malebird.remove();
}

function malebirdOnBranch() {
  malebird.changeAnimation('stand');
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

  getLoveCondition() { 
    return this.loveCondition;
  }
}