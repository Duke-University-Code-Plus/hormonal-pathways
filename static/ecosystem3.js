var bird;
var branch;
var speed = 4;
let branchAnimation;
var sun;
var mating = false;
var matinghist = false;

var branch2
var branch3
let branch2Animation;
let branch3Animation;

var bird1_matingx = 200
var bird1_matingy = 200

var bird2_matingx = 600
var bird2_matingy = 500

var bird3_matingx = 300
var bird3_matingy= 800;

var gamma_slider;

function preload() {

  // Tree
  branch = createSprite(300, 700, 50, 100);
  branchAnimation = branch.addAnimation('tree', 'eco-pics/branch0001.png');

  branch2 = createSprite(250, 200, 50, 100);
  branch2Animation = branch2.addAnimation('tree', 'eco-pics/branch0002.png');

  branch3 = createSprite(750, 600, 50, 100);
  branch3Animation = branch3.addAnimation('tree', 'eco-pics/branch0002.png');

  // Bird
  bird = createSprite(400, 390, 50, 100);
  bird.addAnimation('flapping', 'eco-pics/flap0001.png', 'eco-pics/flap0005.png');
  bird.addAnimation('singing', 'eco-pics/sing1.png', 'eco-pics/sing2.png');
  bird.addAnimation('love', 'eco-pics/heart1.png', 'eco-pics/heart2.png', 'eco-pics/heart3.png');


  bird2 = createSprite(700, 600, 50, 100);
  bird2.addAnimation('flapping', 'eco-pics/flap0001.png', 'eco-pics/flap0005.png');
  bird2.addAnimation('singing', 'eco-pics/sing0001.png', 'eco-pics/sing0002.png');
  bird2.addAnimation('love', 'eco-pics/heart1.png', 'eco-pics/heart2.png', 'eco-pics/heart3.png');

  bird3 = createSprite(200, 800, 50, 100);
  bird3.addAnimation('flapping', 'eco-pics/flap0001.png', 'eco-pics/flap0005.png');
  bird3.addAnimation('singing', 'eco-pics/sing0001.png', 'eco-pics/sing0002.png');
  bird3.addAnimation('love', 'eco-pics/heart1.png', 'eco-pics/heart2.png', 'eco-pics/heart3.png');

}

function setup() {
  // Create the slider 
  gamma_slider = createSlider(0, 1, 0.1, 0.1); 
      
  // Set the position of slider on the canvas 
  gamma_slider.position(850, 20); 

  createCanvas(1000, 1000);
  bird.setSpeed(speed, 0);
  bird2.setSpeed(speed, 0);
  bird3.setSpeed(speed, 0);

  bird.scale = 1;
  bird2.scale = 1
  branch.scale = 1.5;
  branch2.scale = 1.5
  branch3.scale = 1.5

  branch3.mirrorX(-1)
  branch3.mirrorY(-1)

  /*
  var matingCheckbox = document.getElementById('mating');
  matingCheckbox.addEventListener('change', function () {
    mating = this.checked;
    console.log('Mating status:', mating);
  });
  */

}

function draw() {
  background(134, 210, 235);

  //Turn around at edges of canvas
  birdTurnAround();

  birdMoveToTree();

  birdMoveBackToSky();
  drawSprites();
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

  if (bird2.position.x > width) {
    bird2.mirrorX(-1);
    bird2.setSpeed(speed, 180);
  }
  if (bird2.position.x < 0) {
    bird2.mirrorX(1);
    bird2.setSpeed(speed, 0);
  }

  if (bird3.position.x > width) {
    bird3.mirrorX(-1);
    bird3.setSpeed(speed, 180);
  }
  if (bird3.position.x < 0) {
    bird3.mirrorX(1);
    bird3.setSpeed(speed, 0);
  }



}

//Move to tree and sing when mating is checked
function birdMoveToTree() {
  if (mating) {
    matinghist = true;

    if (bird.position.x > bird1_matingx) {
      bird.mirrorX(-1);
    } else {
      bird.mirrorX(1);
    }
    if (bird2.position.x > bird2_matingx) {
      bird2.mirrorX(-1);
    } else {
      bird2.mirrorX(1);
    }


    if (bird3.position.x > bird3_matingx) {
      bird3.mirrorX(-1);
    } else {
      bird3.mirrorX(1);
    }
    bird.attractionPoint(0.8, bird1_matingx, bird1_matingy)
    bird.limitSpeed(5);

    bird2.attractionPoint(0.8, bird2_matingx, bird2_matingy)
    bird2.limitSpeed(2);

    bird3.attractionPoint(0.8, bird3_matingx, bird3_matingy)
    bird3.limitSpeed(2);


    if (bird.overlap(branch) ) {
      bird.changeAnimation('singing');
      bird2.mirrorX(1);
      bird2.attractionPoint(0.8, width/2 - 200, height/2)
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

