var bird;
var branch;
var speed = 4;
let branchAnimation;
var sun;
var mating = false;
var matinghist = false;

var preys
var prey
var preyNum;
var caughtPrey;

function preload() {

  groundSprite = createSprite(600, 900, 1200, 600);
  //change the color of the placeholder
  groundSprite.shapeColor = color(182, 159, 102);

  // Tree
  branch = createSprite(350, 550, 50, 100);
  branchAnimation = branch.addAnimation('tree', 'assets/tree.png');

  // Water
  water = createSprite(750, 500, 50, 100);
  waterAnimation = water.addAnimation('water', 'assets/water1.png');
  water.debug = true;

  // Sun
  sun = createSprite(1050, 150);
  sun.addAnimation('normal', 'assets/sun1.png', 'assets/sun3.png');

  // Bird
  bird = createSprite(400, 400, 50, 100);
  bird.addAnimation('flapping', 'assets/flap0001.png', 'assets/flap0005.png');
  bird.addAnimation('singing', 'assets/sing1.png', 'assets/sing2.png');
  bird.addAnimation('love', 'assets/heart1.png', 'assets/heart2.png', 'assets/heart3.png');

  bird2 = createSprite(-100, -100, 50, 100);
  bird2.addAnimation('flapping', 'assets/flap0001.png', 'assets/flap0005.png');
  bird2.addAnimation('singing', 'assets/sing0001.png', 'assets/sing0002.png');
  bird2.addAnimation('love', 'assets/heart1.png', 'assets/heart2.png', 'assets/heart3.png');

  preys = new Group();
  preyNum = 5;
  // Create the prey sprite and add it's animations
  for (var i = 0; i < preyNum; i++) {
    prey = createSprite(random(800, 1200), random(800, 1200));
    prey.addAnimation('normal', 'assets/asterisk_explode0009.png');
    prey.addAnimation('dead', 'assets/ghost_standing0003.png');
    prey.setSpeed(1, random(0, 360));
    prey.setCollider('circle', 0, 0, 30);
    prey.debug = true;
    prey.depth = 5;
    prey.scale = 0.5;
    preys.add(prey);
  }
}

function setup() {
  createCanvas(1200, 1200);
  bird.setSpeed(speed, 0);
  bird.scale = 1.5;
  bird2.scale = 1.5
  branch.scale = 3.6;
  sun.scale = 1.5;
  water.scale = 2.5

  var matingCheckbox = document.getElementById('mating');
  matingCheckbox.addEventListener('change', function () {
    mating = this.checked;
    console.log('Mating status:', mating);
  });

  var foragingCheckbox = document.getElementById('foraging');
  foragingCheckbox.addEventListener('change', function () {
    foraging = this.checked;
    console.log('Food status:', foraging);
  });

}

function draw() {
  preyMovement();
  background(134, 210, 235);

  //Turn around at edges of canvas
  birdTurnAround();

  birdMoveToTree();

  birdMoveBackToSky();
  drawSprites();
}

//initialize prey movement
function preyMovement() {
  preys.bounce(preys);

  for (var i = 0; i < preys.length; i++) {
    var prey_organism = preys[i];
    if (prey_organism.getAnimationLabel() != 'dead') {
      if (prey_organism.position.x <= 700 || prey_organism.position.x >= 1200) {
        prey_organism.velocity.x *= -1; // Reverse horizontal velocity
      }

      // Bounce off top and bottom edges
      if (prey_organism.position.y <= 800 || prey_organism.position.y >= 1200) {
        prey_organism.velocity.y *= -1; // Reverse vertical velocity
      }
    }
  }
}

//Turn around at edges of canvas
function birdTurnAround() {
  if (bird.position.x > width) {
    bird.mirrorX(-1);
    bird.setSpeed(speed, 180);
  }
  if (bird.position.x < 0) {
    bird.mirrorX(1);
    bird.setSpeed(speed, 0);
  }
}

//Move to tree and sing when mating is checked
function birdMoveToTree() {
  if (mating) {
    matinghist = true;

    if (bird.position.x > 400) {
      bird.mirrorX(-1);
    } else {
      bird.mirrorX(1);
    }
    bird.attractionPoint(0.8, width/2, height/2)
    bird.limitSpeed(5);
    bird2.limitSpeed(2);

    if (bird.overlap(branch) ) {
      bird.changeAnimation('singing');
      bird2.mirrorX(1);
      bird2.attractionPoint(0.8, width/2 - 200, height/2)
    }

    if(bird2.overlap(branch)) {
      bird.changeAnimation('love');
      bird.scale = 0.75;
      //bird2.changeAnimation('love');
      //bird2.scale = 0.75;
    }
  }
}

//Bird move back to sky after mating is unchecked
function birdMoveBackToSky() {
  if (!mating && matinghist) {
    bird.changeAnimation('flapping');
    bird.scale = 1;
    bird.attractionPoint(1, 400, 400)
    bird.limitSpeed(2);

    bird2.changeAnimation('flapping');
    bird2.scale = 1;
    bird2.mirrorX(-1);
    bird2.attractionPoint(1, -100, -100) 
    bird2.limitSpeed(2);

    if (bird.position.y < 450) {
      bird.mirrorX(1);
      bird.setSpeed(speed, 0);
      matinghist = false;
    }
  }
}


function birdScavenge() {
  //leave nest
  if (player_sprite.position.x <= 245 && player_sprite.position.y >= 90 && caughtPrey == null) {
    player_sprite.changeAnimation('stand');
    player_sprite.velocity.x = 1;
    player_sprite.velocity.y = -1;
  }

  //horizontal travel to water
  if (bird.position.x <= 300 && player_sprite.position.y <= 50) {
    player_sprite.changeAnimation('walk');
    player_sprite.mirrorX(1);
    player_sprite.velocity.x = 1;
    player_sprite.velocity.y = 2;
  }

  //scavenge
  if (player_sprite.position.x >= 400 && player_sprite.position.y >= 350) {
    player_sprite.changeAnimation('stand');
    player_sprite.velocity.y = 0;
    player_sprite.velocity.x = 0;
    catchPrey();
  }

  if (caughtPrey) {
    caughtPrey.attractionPoint(2, player_sprite.position.x, player_sprite.position.y + 15);
    caughtPrey.friction = 0.1;
    caughtPrey.scale = 0.2;
  }

  //vertical travel to nest
  if (player_sprite.position.x >= 400 && player_sprite.position.y >= 350 && caughtPrey) {
    player_sprite.changeAnimation('walk');
    player_sprite.mirrorX(-1);
    player_sprite.velocity.x = -1;
    player_sprite.velocity.y = -2;
  }

  //enter nest
  if (player_sprite.position.x <= 300 && player_sprite.position.y <= 50 && caughtPrey) {
    player_sprite.velocity.y = 1;
    player_sprite.velocity.x = -1;
  }

  //feed
  if (player_sprite.position.x <= 245 && player_sprite.position.y >= 90 && caughtPrey) {
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
  while (counter > 0 && deadPrey == false) {
    if (preys[counter].overlap(player_sprite)) {
      preys[counter].changeAnimation('dead');
      caughtPrey = preys[counter];
      preys.remove(caughtPrey);
      deadPrey = true;
    }
    counter--;
  }
}