/*
To do: 
- worm animation 
- reconsider mu behavior 
- simulate by passing in trait ad fitness values 
- apply food shortage 
- rename variables 
- remove left and right worm 

*/ 
//spritesheets
var malebird_fly_spritesheet;
var malebird_sing_spritesheet; 
var femalebird_fly_spritesheet;
var babybird_fly_spritesheet;
var notes_spritesheet;
var notes_flipped_spritesheet; 

//loaded animations
var malebird_fly;
var malebird_sing;
var femalebird_fly;
var babybird_fly;
var notes_play;
var notes_flipped_play;

//animals
var malebird;
var femalebird; 
var predator;
var babybird; 
var prey;

//environment
var nest; 
var trunk; 
var dirt; 

//effects
var notes;
var notes_flipped; 
var love; 
var perchLocationLeft;
var perchLocationRight;

//groups 
var babybirds;
var preys;

//delayed animations
var peck; 
var sing; 
var music; 

// behaviors 
var matingTrait; 
var parentalTrait; 

//mating
//mating conditions
var matingCondition = false; 
var matingChange = false; 
var perched = false;
var loveCondition = false; 

//mating instances
var babybirdDirections;
var femalebirdLocation;

//mating variables 
var babybirdCount = 0;  
var singFrameCount = 0; 
var peckFrameCycle = 20; 
var singFrameCycle = 60; 
var reproduce;  

//mating coordinates 
var femalebirdX; 
var femalebirdY;
var perchLeftX;
var perchLeftY;
var perchRightX;
var perchRightY;
var babybirdX;

//mating love animation 
var fadeEffect = 0; 
var fadeEffectCondition = true; 
var fadeEffectComplete = false; 

//scavenge 
//conditions 
var foodCondition = false; 

//worm
var numPrey = 5;
var caughtPrey;
var removedPrey;
var peckColliderY = 0; 
var randomPrey = -1; 

//malebird location conditions
var birdPosition; 
var groundHeight;
var nestVicinity;
var atNest;
var underNest; 
var effcientScavenge = true; 

//frames
var scavengeFrameCount = 0; 

//inputs
var time = 0; 
var timeStepCycle = 25; 
var timeStep = 0; 
var behavior; 
var mu = 10; 
var shortageSlider; 
var foodCondition = false; 
var mortalityCondition = false; 
var imagePath = '/sprites_haruta/';

/*
loads spritesheets and its json files 
*/
function preload() {
  loadJSON(imagePath + 'malebird_fly.json', function(malebird_fly_frames) {
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

/*
creates the canvas and initializes all of the inputs and objects in the simulation
*/
function setup() {
  createCanvas(800, 400);
  createInputs();
  createEnvironment()
  createAnimals();
}

/*
draws animations for the objects created in setup()
*/
function draw() {
  //clears the entire canvas blank(resets the frame)
  clear();
  //creates background color (skyblue)
  background(135, 206, 250);

  //keeps track of time (in seconds)
  time = int(millis() / 1000); 

  //inputs
  updateText();

  //decide behavior 
  if ((time % timeStepCycle == 0 || time == 0)
    && (foodCondition == false && matingCondition == false && mortalityCondition == false)) {
    malebirdBehavior();
  }

  //constant traits for malebird
  //the malebird faces the direction that it's moving towards
  if (malebird.velocity.x > 0) {
    malebird.mirrorX(-1);
  } 
  if (malebird.velocity.x < 0) {
    malebird.mirrorX(1);
  }

  //constant traits for worm
  preyMovement(); 
  updatenumPrey();

  //constant traits for babybird
  if (babybirds != null) {
    babybirdMovement();
  }

  //constant traits for femalebird
  if (femalebird != null) {
    femalebirdMovement();
  }
  //bird's parental behavior
  if (foodCondition) { 
    birdScavenge(); 
  }

//bird's mating behavior
  else if (matingCondition) { 
    //creates and initializes objects for the mating behavior 
    if (!matingChange) {
      createFemalebird();
      createCollisionBoxes();
      reproductiveSuccess();
      matingChange = true;
    }
    if (!perched) {
      perch();
    }
    birdMate();
  }

  //bird's death behavior
  else if (mortalityCondition) { 
    //creates and initializes objects for the death behavior 
    if (predator == null)
      createPredator();
    predatorMovement();
    malebirdDeath(); 
  }
  //bird's default behavior
  else { 
    malebirdMovement();
  }
  //draw the sprite
  drawSprites();

  /*
  love animation that appears in the mating behavior 
  */
  if (loveCondition) { 
    //creates and initiaizes the heart for the animation 
    if (love == null) {
      midpointX = abs(femalebird.position.x - malebird.position.x) / 2; 
      midpointY = abs(femalebird.position.y - malebird.position.y) / 2 - malebird.originalHeight / 2;
      //the heart is created at the midpoint of the male and female birds 
      if (femalebird.position.x <= malebird.position.x) {
        love = new Heart(femalebird.position.x + midpointX, femalebird.position.y + midpointY); 
      }      
      else {
        love = new Heart(malebird.position.x + midpointX, femalebird.position.y + midpointY);
      }
    }
    love.fade();
    love.show();
    if (love.getLoveCondition() == false) { 
      loveCondition = false; 
    }
  }
}

/*
creates a slider for the food shortage
*/
function createInputs() {
  var foodCheckbox = createCheckbox("Scavenge Food", false); 
  foodCheckbox.position(0, 0); 
  foodCheckbox.changed(() => {
    foodCondition = true; 
  });

  var mortalityCheckbox = createCheckbox("End Simulation", false); 
  mortalityCheckbox.position(0, 30); 
  mortalityCheckbox.changed(() => {
    mortalityCondition = true; 
  });

  var matingCheckbox = createCheckbox("Mating Behavior", false); 
  matingCheckbox.position(0, 60); 
  matingCheckbox.changed(() => {
    matingCondition = true; 
  });
  
  //creates the slider for food shortage
  shortageSlider = createSlider(2, 10, 5, 0);
  shortageSlider.position(10, 90);
  shortageSlider.size(80);
}

/*
loads in frames and initializes objects that represent the external environment 
*/
function createEnvironment() { 
  //creates ground 
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
  //place nest above the tree but below the birds 
  nest.depth = 20;
}

/*
loads in frames and initializes objects that represent animals
*/
function createAnimals() {
  //loads in the broken down spritesheets in preload()
  malebird_fly = loadAnimation(malebird_fly_spritesheet);
  femalebird_fly = loadAnimation(femalebird_fly_spritesheet);
  babybird_fly = loadAnimation(babybird_fly_spritesheet);
  notes_play = loadAnimation(notes_spritesheet);
  notes_flipped_play = loadAnimation(notes_flipped_spritesheet);

  //creates malebird and add animations 
  malebird = createSprite(0, dirt.originalHeight);
  malebird.addAnimation('walk', malebird_fly);
  malebird.addAnimation('stand', imagePath + 'malebird_stand.png');
  malebird.addAnimation('transformed', imagePath + 'malebird_death.png');
  sing = malebird.addAnimation('sing', imagePath + 'malebird_sing0001.png', imagePath + 'malebird_sing0002.png');
  peck = malebird.addAnimation('peck', imagePath + 'malebird_peck0001.png', imagePath + 'malebird_peck0002.png');

  //delays frames for the pecking and singing animation for the malebird 
  peck.frameDelay = peckFrameCycle / 2;
  sing.frameDelay = singFrameCycle / 4; 

  // creates a collider for the malebird 
  malebird.setCollider('circle', 0, 0, 200);
  malebird.debug = false;
  malebird.depth = 20;
  // sets a friction for the movement of the malebird 
  malebird.friction = 0.05;
  malebird.scale = 0.1; 

  //creates and adds animations for a group of worms 
  preys = new Group();
  // Create the prey sprite and add it's animations
  for (var i = 0; i < numPrey; i++) { 
    createPrey();
  }

  babybirds = new Group();
}

function updateText() {
  text(floor(shortageSlider.value()), 100, 100);
  text("Reproductive Success: " + babybirdCount, 0, 120);
}

/*
takes in the trait values from the simulation and determines what behavior is expressed by the malebird
*/
function malebirdBehavior() {    
  timeStep++; 
  matingTrait = random(0,100);
  parentalTrait = random(0, 100); 
  deathProbability = random(0, 100); 
  if (mu > deathProbability) {
    mortalityCondition = true; 
  }
  else if (parentalTrait / matingTrait > 1 && babybirdCount > 0) {
    foodCondition = true; 
  }
  else {
    matingCondition = true; 
  }
}

/*
creates and initializes femalebird 
*/
function createFemalebird() { 
  //create female bird in random location outside of canvas 
  femalebirdLocation = random(["left", "right"]); 
  if (femalebirdLocation == "left") { 
    femalebirdX = 0 - malebird.originalWidth; 
    femalebirdY = random(0, height / 4);
  }
  else { 
    femalebirdX = width + malebird.originalWidth; 
    femalebirdY = random(0, height / 4);
  }
  femalebird = createSprite(femalebirdX, femalebirdY);
  femalebird.addAnimation('normal', femalebird_fly);
  femalebird.addAnimation('stand', imagePath + 'femalebird_stand.png');
  femalebird.setCollider('circle', 0, 0, 200);
  femalebird.debug = false;
  femalebird.friction = 0.1;
  femalebird.depth = 20;
  femalebird.scale = 0.1; 
}

/*
initializes the constant traits of the femalebird 
*/
function femalebirdMovement() { 
  //the femalebird faces the direction that it's moving towards
  if (femalebird.velocity.x > 0) {
    femalebird.mirrorX(-1);
  }
  if (femalebird.velocity.x < 0) {
    femalebird.mirrorX(1);
  }
  //if mating behavior is complete, let femalebird fly back outside of canvas to be removed
  if (!matingCondition) {
    femalebird.changeAnimation('normal'); 
    femalebird.attractionPoint (0.2, femalebirdX,  femalebirdY);
    if (femalebird.position.x <=  0 - malebird.originalWidth || femalebird.position.x >=  width + malebird.originalWidth) {
      femalebird.remove();
      femalebird = null;
    }
  }
}

/*
creates collision boxes for specified coordinates
*/
function createCollisionBoxes(){
  //specified coordinates to perch
  perchLeftX = tree.position.x - 0.75 * tree.originalWidth; 
  perchLeftY = tree.position.y; 
  perchRightX = tree.position.x - tree.originalWidth / 4; 
  perchRightY = tree.position.y + tree.originalHeight / 8; 

  perchLocationLeft = createBox(perchLeftX, perchLeftY);
  perchLocationRight = createBox(perchRightX, perchRightY);
}

/*
creates a collision box for the perch function 
Parameters: 
- x: the x coordinate of the box
- y: the y coordinate of the box

Returns: 
- collision box
*/
function createBox(x, y) {
  var collisionBox = createSprite(x, y, 5, 5);
  collisionBox.setCollider('rectangle', 0, 0, 5, 5);
  collisionBox.debug = true;
  //make the collider invisible 
  //collisionBox.visible = false;
  return collisionBox
}

/*
tracks whether the birds collide with the collision box
Parameters: 
- bird: malebird or femalebird 
- x: the x coordinate of the box
- y: the y coordinate of the box
- box: collision box 
*/
function trackPerch(bird, box) {
  if (box.overlapPoint(bird.position.x, bird.position.y + bird.originalHeight / 8)) {
    //if a bird collides with a collision box, make the bird stop 
    bird.changeAnimation('stand');
    bird.velocity.x = 0;
    bird.velocity.y = 0;
    // remove the box after collision
    box.remove();
  }
}

/*
draws the male and female birds to perch at the perching location 
*/
function perch() {
  malebird.changeAnimation('walk');
  //draws the male and female birds to a specific perching location, depending on where the female bird spawns
  if (femalebirdLocation == "left") {
    femalebird.attractionPoint (0.2, perchLeftX,  perchLeftY - femalebird.originalHeight / 8);
    malebird.attractionPoint (0.2, perchRightX,  perchRightY - malebird.originalHeight / 8);
    trackPerch(femalebird, perchLocationLeft);
    trackPerch(malebird, perchLocationRight);
  }
  if (femalebirdLocation == "right")  {
    femalebird.attractionPoint (0.2, perchRightX, perchRightY - femalebird.originalHeight / 8);
    malebird.attractionPoint (0.1, perchLeftX,  perchLeftY - malebird.originalHeight / 8);
    trackPerch(malebird, perchLocationLeft);
    trackPerch(femalebird, perchLocationRight);
  } 

  if (malebird.getAnimationLabel() == 'stand' && femalebird.getAnimationLabel() == 'stand'){
    perched = true;
  }
}

/*
expresses the malebird's courtship
*/
function courtship() {
  //allows the malebird to face the femalebird once perched
  if (femalebird.position.x < malebird.position.x) {
    malebird.mirrorX(1); 
  }
  if (femalebird.position.x > malebird.position.x) {
    malebird.mirrorX(-1); 
  }
  malebird.changeAnimation('sing');
  //keeps track of the number of frames after the birds have perched 
  singFrameCount++;  
  if (notes == null && notes_flipped == null) {
    createNotes();
  }
}

/*
determines whether the mating resulted in reproductive success 
*/ 
function reproductiveSuccess() {
  reproduce = true; 
}

/*
creates and initializes babybird
*/
function createBabybird() { 
  //the x coordinate of babybird, initalized so the birds do not overlap 
  babybirdX = nest.position.x - nest.originalWidth / 4 + ((malebird.originalWidth / 8) * babybirdCount);
  if (babybirdX <= nest.position.x + nest.originalWidth / 2) { 
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

/*
enlarges the scale of the babybird overtime 
Parameter: 
- babybird_organism: a babybird
- babybirdDirection: direction the specific babybird flies to
*/
function babybirdGrowth(babybird_organism, babybirdDirection) {
  //increases the scale of babybird
  if (babybird_organism.scale <= 0.075) {
    babybird_organism.scale += 0.00001; 
  }
  //changes the appearance of baby bird after certain scale 
  else if (babybird_organism.scale <= 0.07) {
    babybird_organism.changeAnimation('grown');
    babybird_organism.scale += 0.00001; 
  }
  //babybird flies away after it reaches a certain scale 
  else {
    babybird_organism.changeAnimation('fly');
    if (babybirdDirection == "left") {
      babybird_organism.mirrorX(1);
      babybird_organism.velocity.x = -2;
    }
    if (babybirdDirection == "right") {
      babybird_organism.velocity.x = 2;
      babybird_organism.mirrorX(-1);
    }
    babybird_organism.velocity.y = -1;
  }
}

/*
initializes the constant traits of babybird 
*/
function babybirdMovement() {
  //array with the direction that the babybird flies to 
  if (babybirdDirections == null) {
    babybirdDirections = []; 
  }

  for(var i = 0; i < babybirds.length; i++) {
    var babybird_organism = babybirds[i];

    //sets the direction that the babybird flies to 
    if (babybirdDirections[i] == null) {
      babybirdDirections[i] = random(["left", "right"]); 
    }

    //flips the babybird to face the location of malebird
    if (malebird.position.x > babybird_organism.position.x && babybird_organism.getAnimationLabel() == 'normal') {
      babybird_organism.mirrorX(-1);
    }
    else {
      babybird_organism.mirrorX(1);
    }

    babybirdGrowth(babybird_organism, babybirdDirections[i]); 

    //babybird is removed after its outside canvas  
    if (babybird_organism.position.x >= width || babybird_organism.position.x <= 0) {
      babybirdDirections[i] = null;
      babybird_organism.remove();
    }
  }
}

/*
loads animation for the music notes in the malebird's singing
*/
function createNotes() {
  //flips notes depending on the spawn location of femalebird 
  if (femalebird.position.x < malebird.position.x) {
    notes = createSprite(malebird.position.x - 0.4 * malebird.originalWidth, malebird.position.y - 0.3 * malebird.originalHeight); 
    music = notes.addAnimation('normal', notes_play);
    notes.scale = 0.1; 
    music.frameDelay = singFrameCycle / 4;   
  }
  else { 
    notes_flipped = createSprite(malebird.position.x + 0.4 * malebird.originalWidth, malebird.position.y - 0.3 * malebird.originalHeight); 
    music_flipped = notes_flipped.addAnimation('normal', notes_flipped_play);
    notes_flipped.scale = 0.1; 
    music_flipped.frameDelay = singFrameCycle / 4;   
  }
}

/*
animates the malebird's mating behavior 
*/
function birdMate(){ 
  if (malebird.getAnimationLabel() != 'walk') {
    courtship();
  }

  if (perched) {
    //stop the display of courtshup if the malebird's singing completed a full cycle after the birds have both perched
    if (singFrameCount % singFrameCycle == 0) {
      singFrameCount--;
      malebird.changeAnimation('stand'); 
      if (notes != null) { 
        notes.remove();
        notes = null; 
      }
      else {
        notes_flipped.remove();
        notes_flipped = null; 
      }
      //if the fitness value has been incremented, trigger the mating
      if (reproduce) {
        if (love == null)
          loveCondition = true; 
        if (!loveCondition) {
          createBabybird(); 
          babybirdCount++;
          reproduce = false; 
        }
      }
      //reset the mating variables
      if (!reproduce) {
        singFrameCount = 0; 
        matingCondition = false; 
        matingChange = false;
        love = null; 
        perched = false;
      }
    }
  }
}

/*
initializes the constant traits of the worms
*/
function preyMovement() {
  for(var i = 0; i < preys.length; i++) {
    var prey_organism = preys[i];
    if (prey_organism.getAnimationLabel() != 'dead') { 
      // reverse a worm's horizontal velocity if it goes outside boundaries
      if (prey_organism.position.x <= dirt.originalWidth 
        || prey_organism.position.x >= width - dirt.originalWidth) 
        prey_organism.velocity.x *= -1; 
    }
    //allows a worm to face the direction it is moving towards
    if (prey_organism.velocity.x >= 0) 
      prey_organism.mirrorX(-1);
    if (prey_organism.velocity.x < 0) 
      prey_organism.mirrorX(1);
  }
}

/*
determines the worm that was caught by malebird
*/ 
function catchPrey() {
  var counter = preys.length - 1;
  var deadPrey = false; 
  //iterates through every worm and removes the worm that overlapped with the malebird from all groups 
  while (counter >= 0 && deadPrey == false) { 
    if (preys[counter].overlap(malebird)) { 
      preys[counter].changeAnimation('dead');
      caughtPrey = preys[counter]; 
      preys.remove(caughtPrey);
      deadPrey = true; 
    }
    counter--; 
  }

}

/*
updates the number of worms to equal the slider value 
*/
function updatenumPrey() {
  //create a new worm if the slider value is larger than the current number of worms 
  //remove if less
  while (preys.length < shortageSlider.value()) {
    createPrey(); 
  }
  while (preys.length > shortageSlider.value()) { 
    removePrey();
  }
}

/*
creates the worm 
*/
function createPrey() { 
  prey = createSprite(random(dirt.originalWidth, width - dirt.originalWidth), random(dirt.position.y - dirt.originalHeight / 4, dirt.position.y - 5));
  prey.addAnimation('normal', imagePath + 'worm.png');
  prey.addAnimation('dead', imagePath + 'worm.png');
  //sets the worm to have a random speed 
  prey.setSpeed(random(0.1 ,0.25));
  prey.velocity.y = 0; 
  prey.setCollider('circle', 0, 0, 150);
  prey.scale = 0.1; 
  prey.debug = false;
  prey.depth = 25;
  preys.add(prey);
}

/*
removes random worm from all groups 
*/
function removePrey() { 
  preys[preys.length - 1].remove(); 
}

/*
tracks the location of the bird
*/
function birdLocation() {
  //checks which side of the nest the bird is at 
  if (malebird.position.x <= nest.position.x - 0.6 * nest.originalWidth) {
    birdPosition = "left";
  }
  if (malebird.position.x >= nest.position.x + 0.6 * nest.originalWidth) {
    birdPosition = "right";
  }

  //checks if the bird is at ground height
  if (malebird.position.y >= dirt.position.y - 0.6 * dirt.originalHeight) {
    groundHeight = true;
  }
  else {
    groundHeight = false; 
  }

  //checks if the bird is in the vicinity of the nest
  if (malebird.position.x <= nest.position.x + nest.originalWidth / 3 
    && malebird.position.x >= nest.position.x - nest.originalWidth / 3
    && malebird.position.y <= nest.position.y) {
    nestVicinity = true;
  }
  else {
    nestVicinity = false; 
  }

  //checks if the bird is in the range of the nest
  if (malebird.position.x <= nest.position.x + nest.originalWidth / 4 
    && malebird.position.x >= nest.position.x - nest.originalWidth / 4
    && malebird.position.y <= nest.position.y) {
    atNest = true;
  }
  else {
    atNest = false; 
  }

  //checks if the bird is scavenging under the nest
  if (malebird.position.x <= nest.position.x - nest.originalWidth / 2 
    && malebird.position.x >= nest.position.x + nest.originalWidth / 2
    && malebird.position.y > nest.position.y + nest.originalHeight / 2) {
    underNest = true;
  }
  else {
    underNest = false; 
  }

}

/*
animates the malebird's scavenging behavior 
*/
function birdScavenge() { 
  birdLocation(); 
  malebird.changeAnimation('walk');
  //chooses a random worm
  if (randomPrey == -1) {
    randomPrey = int(random(1, preys.length)); 
  }

  //the vertical travel to ground
  if (!groundHeight && !caughtPrey) { 
    //attracts the malebird to the specified worm
    malebird.attractionPoint(0.4, preys[preys.length - randomPrey].position.x, dirt.position.y - dirt.originalHeight / 2);
    //slows down the specified worm
    preys[preys.length - randomPrey].setSpeed(0.05); 
    //determines if retrieving the specified worm is an efficient scavenge in terms of distance
    if (2 * nest.originalWidth < abs(nest.position.x - preys[preys.length - randomPrey].position.x)) {
      effcientScavenge = false; 
    }
    malebird.velocity.y = 2; 
  }

  //the scavenge of the worm
  if (groundHeight && !caughtPrey) { 
    //makes the bird peck once
    if (scavengeFrameCount <= peckFrameCycle + peckFrameCycle / 2) { 
      malebird.changeAnimation('peck');
    }
    else { 
      catchPrey();
    }     
    //drops the malebird's collider for each peck 
    if (scavengeFrameCount - (int(scavengeFrameCount / peckFrameCycle) * peckFrameCycle) == peckFrameCycle / 2) {
      peckColliderY += 40; 
      malebird.setCollider('circle', 0, peckColliderY, 200);
    }
    //resets malebird's collider after not retrieving the worm for a specified amount of pecks
    if (peckColliderY >= 300) {
      peckColliderY = 0; 
      malebird.setCollider('circle', 0, 0, 200);
    }
    scavengeFrameCount++; 
    malebird.velocity.x = 0; 
    malebird.velocity.y = 0; 
    birdPosition = "";
  }

  if (caughtPrey) { 
    //attracts the caught worm to the bird's beak
    //accounts for the position of the bird's beak when flying and pecking 
    if (malebird.getAnimationLabel() == 'walk') {
      if (malebird.mirrorX() == -1)
        caughtPrey.attractionPoint(3, malebird.position.x + 20,  malebird.position.y);
      else
        caughtPrey.attractionPoint(3, malebird.position.x - 20,  malebird.position.y);
    }
    else {
      if (malebird.mirrorX() == 1)
        caughtPrey.attractionPoint(3, malebird.position.x + 20,  malebird.position.y + 15);
      else
        caughtPrey.attractionPoint(3, malebird.position.x - 20,  malebird.position.y + 15);
    }
    caughtPrey.friction = 0.2; 
  }

  //vertical travel to nest
  if (!nestVicinity && caughtPrey)  { 
    //determines the velocity and attraction of the bird depending on the location and distance of the bird from the nest 
    scavengeFrameCount = 0; 
    malebird.changeAnimation('walk');
    if (birdPosition == "left") {
      if (effcientScavenge)
        malebird.velocity.x = 0.5; 
      else 
        malebird.velocity.x = 2; 
      malebird.attractionPoint(0.4, nest.position.x - nest.originalWidth / 3, nest.position.y - nest.originalHeight / 2);
    }
    else if (birdPosition == "right") {
      if (effcientScavenge)
        malebird.velocity.x = -0.5; 
      else 
        malebird.velocity.x = -2; 
      malebird.attractionPoint(0.4, nest.position.x + nest.originalWidth / 3, nest.position.y - nest.originalHeight / 2);
    }
    else {
      if (malebird.position.x >= nest.position.x) {
        malebird.velocity.x = 1; 
      }
      else {
        malebird.velocity.x = -1; 
      }
    }
    malebird.velocity.y = -2; 
  }

  //entering the nest
  if (nestVicinity && caughtPrey) {
    //slows down the bird
    if (malebird.velocity.x < 0)
      malebird.velocity.x = -0.3;
    else 
      malebird.velocity.x = 0.3;
    malebird.velocity.y = 1; 
    malebird.attractionPoint(0.2, nest.position.x, nest.position.y);
    }

  //feeding the babybirds
  if (atNest && malebird.position.y >= nest.position.y - 30
    && caughtPrey) {
    scavengeFrameCount++; 
    malebird.velocity.x = 0; 
    malebird.velocity.y = 0; 
    //pecks the nest once to feed the babybirds
    if (scavengeFrameCount <= peckFrameCycle / 2) { 
      malebird.changeAnimation('peck');
      caughtPrey.remove();
    }
    //resets the scavenge variables 
    else { 
      scavengeFrameCount = 0; 
      peckColliderY = 0; 
      randomPrey = -1; 
      malebird.setCollider('circle', 0, 0, 200);
      caughtPrey = null;
      effcientScavenge = true;
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
  predator.attractionPoint (0.4, malebird.position.x,  malebird.position.y);
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

/*
animates default behavior of the malebird 
*/
function malebirdMovement() {
  //the bird horizontally travels at a high height
  malebird.changeAnimation('walk');
  if (malebird.position.y > dirt.originalHeight) { 
    malebird.attractionPoint(0.2, width / 2, dirt.originalHeight);
  }
  else {
    //the bird flips its direction once reaching a side of the canvas
    if (malebird.velocity.x > 0)
      malebird.velocity.x = 2; 
    else 
      malebird.velocity.x = -2; 
  }
  if (malebird.position.x <= 0 || malebird.position.x >= width)
    malebird.velocity.x *= -1; 
}

/*
a heart for the love animation 
Parameters: 
- x: the x coordinate of the heart 
- y: the y coordinate of the heart 
*/
class Heart { 
  constructor(x, y) {
    this.x = x;
    this.y = y; 
    //the width of the heart
    this.loveX = 100;
    //the height of the heart
    this.loveY = 3 * (cos(100) + sin(100 / 2)) + 110;
    //the alpha of the heart
    this.fadeEffect = 1;
    this.fadeEffectCondition = true;
    this.loveCondition = true; 
  }


  /*
  fades the heart in and out of the canvas 
  */
  fade() {
    //fades the heart in until the alpha reaches 255
    if (this.fadeEffectCondition) {
      this.fadeEffect += 5;
      if (this.fadeEffect >= 255) {
        this.fadeEffect = 255;
        this.fadeEffectCondition = false;
      }
    //fades the heart out until the alpha reaches 0, then exits the function
    } else {
      this.fadeEffect -= 5;
      if (this.fadeEffect <= 0) {
        this.fadeEffect = 0;
        this.fadeEffectCondition = true;
        this.loveCondition = false; 
      }
    }
  }

  /*
  displays the heart
  */
  show() {
    push();
    //colors the heart, red
    fill(250, 0, 0, this.fadeEffect);
    noStroke();
    //creates the thumping animation of the heart 
    this.loveX += 54;
    this.loveY = 3 * (cos(this.loveX) + sin(this.loveX / 2)) + 110;

    //translates and rotates the heart to accomodate its raw image
    translate(this.x, this.y);
    rotate(45);

    //the sizes for the components of the heart
    let sizeRect = this.loveY / 6;
    let sizeEllipse = this.loveY / 6;

    //the rectangle component
    rectMode(CENTER);
    rect(0, 0, sizeRect, sizeRect);

    //the circular component
    arc(0, -sizeRect / 2, sizeEllipse, sizeEllipse, 180, 0, CHORD); 
    arc(-sizeRect / 2, 0, sizeEllipse, sizeEllipse, 90, -90, CHORD); 
    //resets the translation and rotation of the canvas
    pop();
  }

  /*
  retrieves the boolean, loveCondition
  */
  getLoveCondition() { 
    return this.loveCondition;
  }
}