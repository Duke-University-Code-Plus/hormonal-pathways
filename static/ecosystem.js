//animals
var predator;
var player_sprite;
var femalebird; 
var babybirds;
var babybird; 
var prey;
var preys;


//animation
var peck; 
var food_peck;
var sing; 

//scavenge 
var searchDirection; 
var preyLocation;
var numPrey = 5;
var caughtPrey;
var removedPrey;
var preySide; 

//mating
var babybirdCount = 0; 
var loveCondition = false; 
var femalebirdX; 
var femalebirdY;
var babybirdX;
var notes_flipped; 
var notes; 
var music; 

//player location
var groundHeight;
var nestVicinity;
var effcientScavenge; 
var atNest;
var matesVicinity; 

//environment
var nest; 
var trunk; 
var dirt; 
var love; 

//spritesheets
var tile_sprite_sheet;
var malebird_fly_spritesheet;
var malebird_food_fly_spritesheet;
var malebird_sing_spritesheet; 
var femalebird_fly_spritesheet;
var notes_spritesheet;
var notes_flipped_spritesheet; 
var malebird_fly;
var malebird_food_fly;
var malebird_sing;
var femalebird_fly;
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
var caughtPrey = false; 
var mortalityCheckbox; 
var mortalityCondition = false; 
var imagePath = '/sprites_haruta/';
var shortageSlider; 
var shortageSliderCurrent
var shortageSliderSet;
var shortageSliderChange = false;
var matingCheckbox; 
var matingCondition = false; 


//load JSON files and Spritesheets 
function preload() {
  // Load the json for the tiles sprite sheet
  loadJSON(imagePath + 'malebird_fly.json', function(malebird_fly_frames) {
    // Load tiles sprite sheet from frames array once frames array is ready
    malebird_fly_spritesheet = loadSpriteSheet(imagePath + 'malebird_fly_spritesheet.png', malebird_fly_frames);
  });

  loadJSON(imagePath + 'malebird_food_fly.json', function(malebird_food_fly_frames) {
    malebird_food_fly_spritesheet = loadSpriteSheet(imagePath + 'malebird_food_fly_spritesheet.png', malebird_food_fly_frames);
  });

  loadJSON(imagePath + 'femalebird_fly.json', function(femalebird_fly_frames) {
    femalebird_fly_spritesheet = loadSpriteSheet(imagePath + 'femalebird_fly_spritesheet.png', femalebird_fly_frames);
  });

  loadJSON(imagePath + 'notes.json', function(notes_frames) {
    notes_spritesheet = loadSpriteSheet(imagePath + 'notes_spritesheet.png', notes_frames);
  });

  loadJSON(imagePath + 'notes_flipped.json', function(notes_flipped_frames) {
    notes_flipped_spritesheet = loadSpriteSheet(imagePath + 'notes_flipped_spritesheet.png', notes_flipped_frames);
  });

  loadJSON(imagePath + 'tiles.json', function(tile_frames) {
    tile_sprite_sheet = loadSpriteSheet(imagePath + 'tiles_spritesheet.png', tile_frames);
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
  if (player_sprite.velocity.x > 0) 
    player_sprite.mirrorX(-1);
  if (player_sprite.velocity.x < 0) 
    player_sprite.mirrorX(1);

  //prey trait
  preyMovement(); 
  updatenumPrey();

  //bird animation to scavenge
  if (foodCondition) { 
    if (!scavengeChange) { 
      searchDirection = random(["left", "right"]);
      if (searchDirection == "left")
        preyLocation = random(1.5 * dirt.originalWidth, nest.position.x - nest.originalWidth);
      else
        preyLocation = random(nest.position.x + nest.originalWidth, width - 1.5 * dirt.originalWidth);    
      scavengeChange = true; 
    }
    birdScavenge(); 
  }
  else if (matingCondition) { 
    if (femalebird == null)
      createFemalebird();
    femalebirdMovement()
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
      midpointX = abs(femalebird.position.x - player_sprite.position.x) / 2; 
      midpointY = abs(femalebird.position.y - player_sprite.position.y) / 2;
      if (femalebird.position.x <= player_sprite.position.x)
        love = new Heart(femalebird.position.x + midpointX, femalebird.position.y + midpointY); 
      if (femalebird.position.x > player_sprite.position.x)
        love = new Heart(player_sprite.position.x + midpointX, femalebird.position.y + midpointY);
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
  //initialize spritesheets
  dirt_sheet = loadAnimation(new SpriteSheet(imagePath + 'tiles_spritesheet.png', [{'name':"dirt.png", 'frame':{'x':792, 'y': 0, 'width': 70, 'height': 70}}]));
  
  //create ground
  for (var x = 35; x < 840; x += 70) {
    dirt = createSprite(x, 400);
    dirt.addAnimation('normal', dirt_sheet);
  }

  //create tree
  tree = createSprite(width / 2, 190);
  tree.addAnimation('normal', imagePath + 'tree0001.png');
  tree.scale = 0.8;

  //create nest 
  nest = createSprite(width / 2 + 90, 190);
  nest.addAnimation('normal', imagePath + 'nest.png');
  nest.depth = 20;
}

//create malebird
function createAnimals() {
  malebird_fly = loadAnimation(malebird_fly_spritesheet);
  malebird_food_fly = loadAnimation(malebird_food_fly_spritesheet);
  femalebird_fly = loadAnimation(femalebird_fly_spritesheet);
  notes_play = loadAnimation(notes_spritesheet);
  notes_flipped_play = loadAnimation(notes_flipped_spritesheet);

  //create player sprite and add animations
  player_sprite = createSprite(nest.position.x, nest.position.y - 20);
  player_sprite.addAnimation('walk', malebird_fly);
  player_sprite.addAnimation('stand', imagePath + 'malebird_stand.png');
  player_sprite.addAnimation('food_walk', malebird_food_fly);
  sing = player_sprite.addAnimation('sing', imagePath + 'malebird_sing0001.png', imagePath + 'malebird_sing0002.png');
  peck = player_sprite.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');
  player_sprite.addAnimation('transformed', imagePath + 'malebird_death.png');
  food_peck = player_sprite.addAnimation('peck_food', imagePath + 'malebird_food_peck0001.png', imagePath + 'malebird_food_peck0002.png');

  peckFrameCycle = 20; 
  singFrameCycle = 60; 
  peck.frameDelay = peckFrameCycle / 2;
  food_peck.frameDelay = peckFrameCycle / 2; 
  sing.frameDelay = singFrameCycle / 4; 
  // create collider for player 
  player_sprite.setCollider('circle', 0, 0, 150);
  player_sprite.debug = true;
  player_sprite.depth = 20;

  player_sprite.scale = 0.1; 

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
    femalebirdX = 0 - player_sprite.originalWidth; 
    femalebirdY = random(0, height / 4);
  }
  else if (femalebirdLocation == "right") { 
    femalebirdX = width + player_sprite.originalWidth; 
    femalebirdY = random(0, height / 4);
  }
  femalebird = createSprite(femalebirdX, femalebirdY);
  femalebird.addAnimation('normal', femalebird_fly);
  femalebird.addAnimation('stand', imagePath + 'femalebird_stand.png');
  femalebird.debug = true;
  femalebird.friction = 0.1;
  femalebird.depth = 20;
  femalebird.scale = 0.1; 
}

function femalebirdMovement() { 
  if (femalebird.velocity.x > 0) 
    femalebird.mirrorX(-1);
  if (femalebird.velocity.x < 0) 
    femalebird.mirrorX(1);
  femalebird.attractionPoint (0.2, player_sprite.position.x,  player_sprite.position.y + player_sprite.originalHeight / 2);
}

// function perch() {
//   var perchX = tree.position.x - tree.originalWidth / 2; 
//   var perchY = tree.position.y + tree.originalWidth; 
//   if (femalebird.velocity.x > 0) 
//     femalebird.mirrorX(-1);
//   if (femalebird.velocity.x < 0) 
//     femalebird.mirrorX(1);
//   player_sprite.attractionPoint(0.1, perchX,  perchY);
//   femalebird.attractionPoint (0.1, perchX,  perchY);
// }

function createBabybird() { 
  babybirdX = nest.position.x - nest.originalWidth / 4 + ((player_sprite.originalWidth / 2) * babybirdCount);
  if (babybirdX <= nest.position.x + nest.originalWidth / 2) { 
    babybirds = new Group();
    babybird = createSprite(babybirdX, nest.position.y - nest.originalWidth / 8);
    babybird.addAnimation('normal', imagePath + 'babybird0001.png', imagePath + 'babybird0002.png');
    babybird.debug = true;
    babybird.depth = 50;
    babybird.scale = 0.05; 
    babybirds.add(babybird);
  }
}

function createNotes() {
  if (femalebird.position.x < player_sprite.position.x) {
    notes = createSprite(player_sprite.position.x - 0.3 * player_sprite.originalWidth, player_sprite.position.y - 0.3 * player_sprite.originalHeight); 
    music = notes.addAnimation('normal', notes_play);
    notes.scale = 0.1; 
    music.frameDelay = singFrameCycle / 4;   
  }
  else { 
    notes_flipped = createSprite(player_sprite.position.x + 0.3 * player_sprite.originalWidth, player_sprite.position.y - 0.3 * player_sprite.originalHeight); 
    music_flipped = notes_flipped.addAnimation('normal', notes_flipped_play);
    notes_flipped.scale = 0.1; 
    music_flipped.frameDelay = singFrameCycle / 4;   
  }
}

function birdMate(){  
  if (1.5 * nest.originalWidth > abs(femalebird.position.x - player_sprite.position.x)
  && abs(femalebird.position.y - player_sprite.position.y) < player_sprite.originalHeight / 4) 
    matesVicinity = true; 
  else 
    matesVicinity = false; 

  if (femalebird.position.x < player_sprite.position.x) 
    player_sprite.mirrorX(1); 
  else
    player_sprite.mirrorX(-1); 
  
  if (matesVicinity) { 
    player_sprite.changeAnimation('sing');
    singFrameCount++;  
    if (notes == null && notes_flipped == null)
      createNotes();
    femalebird.changeAnimation('stand'); 
    femalebird.velocity.x = 0;
    femalebird.velocity.y = 0;
  }

  if (singFrameCount >= singFrameCycle * 1) {
    player_sprite.changeAnimation('stand'); 
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
    if (babybird == null && !loveCondition) {
      createBabybird(); 
      babybirdCount++;
    }
    if (babybird != null) {
      matingCondition = false; 
      love = null; 
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
    prey_organism.setSpeed(random(0,0.1));
  }
}

function catchPrey() {
  var counter = preys.length - 1;
  var deadPrey = false; 
  while (counter >= 0 && deadPrey == false) { 
    if (preys[counter].overlap(player_sprite)) { 
      preys[counter].changeAnimation('dead');
      caughtPrey = preys[counter]; 
      preys.remove(caughtPrey);
      deadPrey = true; 
    }
    counter--; 
  }
}

function trackcatchablePrey() { 
  catchablePreys = new Group();
  for (var i = 0; i < preys.length; i++) { 
    //
    if (preys[i].position.y < 380) { 
      catchablePreys.add(preys[i]); 
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
  
  prey.setSpeed(random(0,0.1));
  prey.velocity.y = 0; 
  prey.setCollider('circle', 0, 0, 150);
  prey.scale = 0.08; 
  prey.debug = true;
  prey.depth = 25;
  preys.add(prey);
}

function removePrey() { 
  removedPrey = preys[preys.length - 1]; 
  preys.remove(removedPrey); 
  removedPrey.remove(); 
}

function birdScavenge() { 
  if (player_sprite.position.y >= dirt.position.y - 0.6 * dirt.originalHeight) 
    groundHeight = true;
  else
    groundHeight = false; 

  if (player_sprite.position.x <= nest.position.x + nest.originalWidth / 3 
    && player_sprite.position.x >= nest.position.x - nest.originalWidth / 3) 
    nestVicinity = true;
  else
    nestVicinity = false; 

  if (1.5 * nest.originalWidth < abs(nest.position.x - preyLocation)) 
    effcientScavenge = false; 
  else 
    effcientScavenge = true; 

  if (player_sprite.position.x <= nest.position.x + nest.originalWidth / 4 
    && player_sprite.position.x >= nest.position.x - nest.originalWidth / 4) 
    atNest = true;
  else
    atNest = false; 

  //leave nest 
  if (nestVicinity && !caughtPrey) { 
    if (searchDirection == "left") 
      player_sprite.velocity.x = -1; 
    if (searchDirection == "right") 
      player_sprite.velocity.x = 1; 
    player_sprite.velocity.y = -1; 
    player_sprite.changeAnimation('walk');
    player_sprite.friction = 0.01;
  }
  //horizontal travel to ground
  if (!nestVicinity
    && player_sprite.position.y <= nest.position.y - nest.originalHeight / 2
    && !caughtPrey) { 
    player_sprite.velocity.y = 3; 
    player_sprite.attractionPoint(0.2, preyLocation, dirt.position.y);
    player_sprite.friction = 0.01;
  }

  //scavenge
  if (groundHeight && !caughtPrey) { 
    if (scavengeFrameCount <= peckFrameCycle + peckFrameCycle / 2) { 
      player_sprite.changeAnimation('peck');
    }
    else if (scavengeFrameCount <= peckFrameCycle + 1.5 * peckFrameCycle ) { 
      player_sprite.changeAnimation('peck_food');
    }
    else { 
      caughtPrey = true; 
    }     
    scavengeFrameCount++; 
    player_sprite.velocity.x = 0; 
    player_sprite.velocity.y = 0; 
  }

  /*

  //horizontal travel to water
  if (player_sprite.position.x <= nest.position.x + nest.originalWidth 
    && player_sprite.position.y <= nest.position.y - nest.originalHeight) { 
    player_sprite.changeAnimation('walk');
    player_sprite.velocity.y = 2; 
    player_sprite.attractionPoint(1.5, width / 2, dirt.position.y);
    player_sprite.friction = 0.01;
  }

    //scavenge
  if (player_sprite.position.y >= dirt.position.y - dirt.originalHeight / 2) { 
    player_sprite.changeAnimation('stand');
    player_sprite.velocity.y = 0.5;
    if (catchablePreys.length != 0) { 
      player_sprite.attractionPoint(0.5, catchablePreys[catchablePreys.length - 1].position.x, catchablePreys[catchablePreys.length - 1].position.y);
      if (player_sprite.velocity.x > 0)
        player_sprite.mirrorX(-1);
      if (player_sprite.velocity.x < 0)
        player_sprite.mirrorX(1);
    }
    else { 
      player_sprite.changeAnimation('walk');
      player_sprite.velocity.x = 0; 
      player_sprite.velocity.y = 0;
    }
    catchPrey();
  }

  if (caughtPrey) { 
    caughtPrey.attractionPoint(2, player_sprite.position.x,  player_sprite.position.y + 15);
    caughtPrey.friction = 0.1; 
    caughtPrey.scale = 0.08; 
  }

  */
  //vertical travel to nest
  if (!nestVicinity && caughtPrey)  { 
    scavengeFrameCount = 0; 
    player_sprite.changeAnimation('food_walk');
    if (searchDirection == "left" && effcientScavenge) 
      player_sprite.velocity.x = 1; 
    else if (searchDirection == "left" && !effcientScavenge)
      player_sprite.velocity.x = 1.5; 
    else if (searchDirection == "right" && effcientScavenge) 
      player_sprite.velocity.x = -1; 
    else 
      player_sprite.velocity.x = -1.5; 
    player_sprite.velocity.y = -3; 
    player_sprite.attractionPoint(0.2, nest.position.x, nest.position.y - nest.originalHeight / 3);
  }

  //enter nest
  if (nestVicinity && caughtPrey) {
    if (searchDirection == "left") 
      player_sprite.velocity.x = 0.5; 
    if (searchDirection == "right") 
      player_sprite.velocity.x = -0.5; 
    player_sprite.velocity.y = 1; 
    player_sprite.attractionPoint(0.1, nest.position.x, nest.position.y);
    }

  //feed
  if (atNest && player_sprite.position.y >= nest.position.y - 30
    && caughtPrey) {

    scavengeFrameCount++; 
    player_sprite.velocity.x = 0; 
    player_sprite.velocity.y = 0; 
    if (scavengeFrameCount <= peckFrameCycle / 2) { 
      player_sprite.changeAnimation('peck_food');
    }
    else if (scavengeFrameCount <= peckFrameCycle) { 
      player_sprite.changeAnimation('peck');
    }
    else { 
      scavengeFrameCount = 0; 
      // caughtPrey.remove();
      // caughtPrey = null;
      caughtPrey = false; 
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
  predator.attractionPoint (0.1, player_sprite.position.x,  player_sprite.position.y);
  predator.debug = true;
  predator.friction = 0.1;
  predator.depth = 25;
  predator.scale = 0.5; 
}

function predatorMovement() { 
  //accounts for predator 
  predator.attractionPoint (0.1, player_sprite.position.x,  player_sprite.position.y);
}

function malebirdDeath() { 
  // if bird collides with predator 
  if (predator.overlapPoint(player_sprite.position.x, player_sprite.position.y)) { 
    player_sprite.changeAnimation('transformed');
    player_sprite.velocity.x = 0;
    player_sprite.velocity.y = 2;
    predator.velocity.x = 0;
    predator.velocity.y = 0;
  }
  if (player_sprite.position.y >= height - dirt.originalHeight / 2 && player_sprite.getAnimationLabel() == 'transformed') 
    player_sprite.remove();
}

function malebirdOnBranch() {
  player_sprite.changeAnimation('stand');
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