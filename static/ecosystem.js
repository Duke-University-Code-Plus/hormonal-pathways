//animals
var predator;
var prey;
var preys;
var numPrey = 5;
var caughtPrey;
var removedPrey;
var player_sprite;
var player_sprite_sheet;
var player_walk;

//environment
var nest; 
var trunk; 
var dirt; 
var tile_sprite_sheet;

//settings
var time = 0; 
let foodSlider; 
var foodSliderCurrent; 
var foodSliderSet = 5; 
var foodSliderChange = false; 


//load JSON files and Spritesheets 
function preload() {
  loadJSON('assets/player_frames.json', function(player_frames) {
    player_sprite_sheet = loadSpriteSheet('assets/player_spritesheet.png', player_frames);
  });
  // Load the json for the tiles sprite sheet
  loadJSON('assets/tiles.json', function(tile_frames) {
    // Load tiles sprite sheet from frames array once frames array is ready
    tile_sprite_sheet = loadSpriteSheet('assets/tiles_spritesheet.png', tile_frames);
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

  displayInputs();
  updateInputs();
  //prey animation in habitat
  preyMovement();
  updatePreyDirection(); 
  //prey availability 
  updatenumPrey(); 
  trackcatchablePrey();
  
  //bird animation to scavenge
  birdScavenge(); 

  //bird animation in death
  birdDeath(); 

  //accounts for predator 
  // if (player_sprite.getAnimationLabel() == 'walk') { 
  //   predator.attractionPoint (0.1, player_sprite.position.x,  player_sprite.position.y);
  // }
  //draw the sprite
  drawSprites();
}

//create inputs
function createInputs() { 
  //slider for food
  foodSlider = createSlider(0, 15, 5, 0);
  foodSlider.position(10, 10);
  foodSlider.size(80);
}

function updateInputs() { 
  //slider for food
  foodSliderCurrent = foodSlider.value();
  if (foodSliderCurrent != foodSliderSet) { 
    foodSliderSet = foodSliderCurrent; 
    foodSliderChange = true; 
  }
  else { 
    foodSliderChange = false; 
  }
}

// create environment  
function createEnvironment() { 
  //initialize spritesheets
  dirt_sheet = loadAnimation(new SpriteSheet('assets/tiles_spritesheet.png', [{'name':"dirt.png", 'frame':{'x':792, 'y': 0, 'width': 70, 'height': 70}}]));
  trunk_sheet = loadAnimation(new SpriteSheet('assets/tiles_spritesheet.png', [{'name':"grassCenter.png", 'frame':{'x':576, 'y': 864, 'width': 70, 'height': 70}}]));
  nest_sheet = loadAnimation(new SpriteSheet('assets/tiles_spritesheet.png', [{'name':"dirtCenterrounded.png", 'frame':{'x':720, 'y': 792, 'width': 70, 'height': 70}}]));
  
  //create ground
  for (var x = 35; x < 840; x += 70) {
    if (x <= 280 || x >= 560) { 
      dirt = createSprite(x, 365);
      dirt.addAnimation('normal', dirt_sheet);
    }
  }

  //create tree
  tree = createSprite(175, 190);
  tree.addAnimation('normal', 'assets/tree0001.png');
  tree.scale = 0.65;

  //create nest 
  nest = createSprite(245, 155);
  nest.addAnimation('normal', 'assets/nest.png');
  nest.depth = 20;
}

//create animals
function createAnimals() { 
  //load player animation 
  player_walk = loadAnimation(player_sprite_sheet);
  player_stand = loadAnimation(new SpriteSheet('assets/player_spritesheet.png', [{'name':'player_stand', 'frame':{'x':284, 'y': 95, 'width': 70, 'height': 94}}]));

  //create player sprite and add animations
  player_sprite = createSprite(245, 110, 70, 94);
  player_sprite.addAnimation('walk', 'assets/bird0001.png', 'assets/bird0004.png');
  player_sprite.addAnimation('stand', 'assets/bird0006.png');
  player_sprite.addAnimation('transformed', 'assets/bird0005.png');
  // create collider for player 
  player_sprite.setCollider('circle', 0, 0, 150);
  player_sprite.debug = false;
  player_sprite.depth = 20;
  player_sprite.scale = 0.15; 

  //create and add animation for a group of prey 
  preys = new Group();
  numPrey = 5;
  // Create the prey sprite and add it's animations
  for (var i = 0; i < numPrey; i++) { 
    createPrey();
  }

  //create predator sprite and add animation
  predator = createSprite(700, 300, 64, 64);
  predator.addAnimation('normal', 'assets/cloud_breathing0001.png', 'assets/cloud_breathing0009.png');
  predator.attractionPoint (0.1, player_sprite.position.x,  player_sprite.position.y);
  predator.debug = false;
  predator.friction = 0.1;
  predator.depth = 10;
  predator.scale = 0.5; 
}

//display inputs
function displayInputs() { 
  //slider for food
  text(floor(foodSlider.value()), 100, 15);
}

//initialize prey movement
function preyMovement() { 
  //preys will bounce against eachother 
  preys.bounce(preys);

  for(var i = 0; i < preys.length; i++) {
    var prey_organism = preys[i];
    if (prey_organism.getAnimationLabel() != 'dead') { 
      if (prey_organism.position.x <= 300 || prey_organism.position.x >= 540) 
        prey_organism.velocity.x *= -1; // Reverse horizontal velocity
  
      // Bounce off top and bottom edges
      if (prey_organism.position.y <= 340 || prey_organism.position.y >= 450) 
        prey_organism.velocity.y *= -1; // Reverse vertical velocity
    }
  }
}

function birdScavenge() { 
  //leave nest 
  if (player_sprite.position.x <= nest.position.x + nest.originalWidth / 2 
    && player_sprite.position.y >= nest.position.y - nest.originalHeight / 2 && caughtPrey == null) { 
    player_sprite.changeAnimation('walk');
    player_sprite.mirrorX(-1);
    player_sprite.velocity.x = 1; 
    player_sprite.velocity.y = -1; 
    player_sprite.attractionPoint(0.1, nest.position.x + nest.originalWidth, nest.position.y - 1.5 * nest.originalHeight);
    player_sprite.friction = 0.01;
  }

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

  //vertical travel to nest
  if (player_sprite.position.y >= dirt.position.y - dirt.originalHeight / 2 && caughtPrey) { 
    player_sprite.changeAnimation('walk');
    player_sprite.mirrorX(1);
    player_sprite.velocity.x = -0.5; 
    player_sprite.velocity.y = -2;
    player_sprite.attractionPoint(1.5, nest.position.x + nest.originalWidth, dirt.position.y - 2 * dirt.originalHeight);
    player_sprite.friction = 0.01;
  }

  //enter nest
  if (player_sprite.position.y <= nest.position.y - nest.originalHeight && caughtPrey) {
    player_sprite.velocity.x = -1; 
    if (player_sprite.position.x >= nest.position.x + nest.originalWidth) 
      player_sprite.velocity.x = -2; 
    player_sprite.velocity.y = 1; 
    player_sprite.attractionPoint(0.1, nest.position.x, nest.position.y);
    player_sprite.friction = 0.01;
  }

  //feed
  if (player_sprite.position.x < nest.position.x + nest.originalWidth / 2 
    && player_sprite.position.y >= nest.position.y - nest.originalHeight / 2  && caughtPrey) { 
    player_sprite.changeAnimation('stand');
    player_sprite.velocity.y = 0;
    player_sprite.velocity.x = 0;
    caughtPrey.remove();
    caughtPrey = null;
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

function birdDeath() { 
    // if bird collides with predator 
    if (player_sprite.overlapPoint(predator.position.x, predator.position.y)) { 
      player_sprite.changeAnimation('transformed');
      player_sprite.velocity.x = 0;
      player_sprite.velocity.y = 2;
      if (caughtPrey) 
        caughtPrey.remove();      
    }
  
    if (player_sprite.position.y >= 310 && player_sprite.getAnimationLabel() == 'transformed') 
      player_sprite.remove();
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

function updatePreyDirection() { 
  for (var i = 0; i < preys.length; i++) {
    if (preys[i].velocity.x > 0) { 
      preys[i].mirrorX(-1);
    }
    else if (preys[i].velocity.x < 0) { 
      preys[i].mirrorX(1);
    }
  }
}
function updatenumPrey() {
  if (foodSliderChange == true) { 
    while (preys.length < foodSlider.value()) {
      createPrey(); 
    }
    while (preys.length > foodSlider.value()) { 
      removePrey();
    }
  }
}

function createPrey() { 
  prey = createSprite(random(300, 540), random(400, 440));
  prey.addAnimation('normal', 'assets/fish0001.png', 'assets/fish0004.png');
  prey.addAnimation('dead', 'assets/fish0005.png');
  prey.setSpeed(1, random(0, 360));
  prey.setCollider('circle', 0, 0, 150);
  prey.scale = 0.08; 
  prey.debug = false;
  prey.depth = 25;
  preys.add(prey);
}

function removePrey() { 
  removedPrey = preys[preys.length - 1]; 
  preys.remove(removedPrey); 
  removedPrey.remove(); 
}

