var circles;
var boxes;
var proteins;
let hormoneSlider;
let receptorSlider;
var outer;
var nuc;
var nucleus;
var cell;
var inv1;
var inv2;
<<<<<<< HEAD
var dna_strand, midDNA, leftDNA, rightDNA;
=======
var dna_strand;
>>>>>>> 23-tissue-simulation
const particles = [];

function setup() {
    createCanvas(960, 672);

    // Initialize images
    bg = loadImage('cell-images/tissue-sim-background.png');
    outer_mem = loadImage('cell-images/outermembrane.png');
    nuc_mem = loadImage('cell-images/nuclearmembrane.png');
    receptor = loadImage('cell-images/receptor.png');
    hormone = loadImage('cell-images/hormone.png');
    dna = loadImage('cell-images/dna.png');
    cellbg = loadImage('cell-images/cell-bg.png');
    nucbg = loadImage('cell-images/nucleus-bg.png');

    // Initialize sliders
    hormoneSlider = createSlider(0, 20, 0, 1);
    hormoneSlider.position(10, 10);
    hormoneSlider.size(80);
    hormoneSlider.input(hormoneSliderchange);

    receptorSlider = createSlider(0, 10, 0, 1);
    receptorSlider.position(10, 30);
    receptorSlider.size(80);
    receptorSlider.input(receptorSliderchange);

    // Initialize groups
    circles = new Group();
    boxes = new Group();
    proteins = new Group();
    particle = new Group();

    function hormoneSliderchange() {
        console.log(hormoneSlider.value());
    }

    function receptorSliderchange() {
        console.log(receptorSlider.value());
    }

    // Initialize sprites
    setBG();
    setMembranes();
    setDNA();
    invisibleSprites();

    // Create circles and boxes
    for (let i = 0; i < hormoneSlider.value(); i++) {
        createCircle();
    }

    for (let j = 0; j < receptorSlider.value(); j++) {
        createBoxes();
    }

    
}

function draw() {
    background(247, 211, 208);

    for (var i = 0; i < boxes.length; i++) {
        boxes[i].debug = true;
    }

    // Handle sliders
    let g = hormoneSlider.value();
    let h = receptorSlider.value();

    while (g > circles.length) {
        createCircle();
    }

    while (g < circles.length) {
        removeCircle();
    }

    while (h > boxes.length) {
        createBoxes();
    }

    while (h < boxes.length) {
        removeBox();
    }

    updateCircles();

    // Circles bounce against each other
    circles.bounce(circles, circleBounce);



    //circles.bounce(inv1);

    // Circles absorb boxes
    circles.overlap(boxes, absorb);

    moveBackBoxes();

    // Handle edges
    for (var i = 0; i < allSprites.length; i++) {
        var s = allSprites[i];
        if (s.position.x < 0) {
            s.position.x = 1;
            s.velocity.x = abs(s.velocity.x);
        }
        if (s.position.x > width) {
            s.position.x = width - 1;
            s.velocity.x = -abs(s.velocity.x);
        }
        if (s.position.y < 0) {
            s.position.y = 1;
            s.velocity.y = abs(s.velocity.y);
        }
        if (s.position.y > height) {
            s.position.y = height - 1;
            s.velocity.y = -abs(s.velocity.y);
        }
    }

    drawSprites();

<<<<<<< HEAD

     // Draw and update particles
=======
>>>>>>> 23-tissue-simulation
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].finished()) {
            particles.splice(i, 1);
        }
    }
<<<<<<< HEAD


   
=======
>>>>>>> 23-tissue-simulation
}

function absorb(circle, box) {
    if (!box.circle && !circle.absorbed && !box.movingBack) {
        box.circle = circle;
    }

    if (circle != box.circle) {
        return;
    }
<<<<<<< HEAD
    
    circle.attractionPoint(15, box.position.x, box.position.y - 20);
    circle.maxSpeed = 5;
    
    circle.absorbed = true;
    box.absorbed = true;


    toDNA(box,circle)
=======

    circle.attractionPoint(20, box.position.x, box.position.y - 20);
    circle.maxSpeed = 7;
    circle.absorbed = true;
>>>>>>> 23-tissue-simulation

    toDNA(circle, box);
}

<<<<<<< HEAD
function toDNA(box,circle) {
=======
function circleBounce(circle1, circle2){
    if(circle1.absorbed || circle2.absorbed){
        return;
    }
}

function toDNA(circle, box) {
>>>>>>> 23-tissue-simulation
    if (!dna_strand) {
        console.error('DNA strand is not defined');
        return;
    }

    if (box.framesAtDNA == null) {
        box.framesAtDNA = 0;
    }

<<<<<<< HEAD
    if (box.framesAtDNA < 30) {
=======
    if (box.framesAtDNA < 20) {
>>>>>>> 23-tissue-simulation
        if (box.dnaPos == null) {
            let coors = findDNACoors();
            if (coors != null) {
                box.dnaPos = coors;
                box.attractionPoint(15, coors[0], coors[1]);
                box.maxSpeed = 3;
            } else {
                console.log('no coordinates found');
                return;
            }
        } else {
            let coors = box.dnaPos;
            box.attractionPoint(15, coors[0], coors[1]);
        }

        let xDiff = abs(box.position.x - box.dnaPos[0]);
        let yDiff = abs(box.position.y - box.dnaPos[1]);
        if (xDiff <= 3 && yDiff <= 3) {
            box.framesAtDNA++;
        }
<<<<<<< HEAD
     } else {
        
    //     createrna(box.position.x, box.position.y);
    box.velocity.y = -12; // Move the receptor up
    box.velocity.x = 0;

    // Generate particles
    for (let i = 0; i < 100; i++) {
        let p = new Particle(box.position.x, box.position.y);
        particles.push(p);
    }

    // Reset DNA coordinates
  
    resetDNACoors(box.dnaPos);
 
    box.remove();

    circle.remove();
    

    console.log("Particles created at:", box.position.x, box.position.y); // Debug log
    console.log("Number of particles:", particles.length); 


     }
    //      if (circle.overlap(inv2)) {
    //          circle.velocity(0,0);


    //      };
    


    // function createrna() {
    //         var circle = createSprite(box.position.x,box.position.y);
    //         circle.addImage(hormone);
    //         circle.setSpeed(5, 270);
            
    //     }

}


function resetDNACoors(coors) {
   if(coors[0] == midDNA.pos.x && coors[1] == midDNA.pos.y){
        midDNA.full = false;
    } else if(coors[0] == leftDNA.pos.x && coors[1] == leftDNA.pos.y){
        leftDNA.full = false;
     } else if(coors[0] == rightDNA.pos.x && coors[1] == rightDNA.pos.y){
        rightDNA.full = false;
    }
}



=======
    } 
    else {
        box.movingBack = true;
        box.circle = null;
        circle.velocity.x = -2;
        circle.velocity.y = -5;
        circle.absorbed = false;
        circle.leaving = true;
        box.dnaPos = null;
        circle.remove();
        createCircle();
        createParticles(box.position.x, box.position.y);
    }
}

async function createParticles(x, y){
    for (let i = 0; i < 200; i++) {
        let p = new Particle(x, y);
        particles.push(p);
        await sleep(50)
    }
}

function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}
>>>>>>> 23-tissue-simulation

function findDNACoors() {
    let midX = dna_strand.position.x;
    let midY = dna_strand.position.y;
    let w = 150;

    let x = midX + random(-1 * w, w);
    let y = midY;

    return [x, y];
}

function moveBackBoxes() {
    boxes.forEach(box => {
        if (box.movingBack) {
            box.attractionPoint(15, box.initPos.x, box.initPos.y);
            box.maxSpeed = 3;
            if (isAtInitialPosition(box)) {
                resetBox(box);
            }
        }
    });
}

function isAtInitialPosition(box) {
    return abs(box.position.x - box.initPos.x) <= 3 && abs(box.position.y - box.initPos.y) <= 3;
}

function resetBox(box) {
    box.position.x = box.initPos.x;
    box.position.y = box.initPos.y;
    box.velocity.x = 0;
    box.velocity.y = 0;
    box.movingBack = false;
    box.framesAtDNA = null;
}

function createCircle() {
    var circle = createSprite(width + 50, random(0, height));
    circle.addImage(hormone);
    circle.setCollider('circle', 0, 0, 25);
    circle.setSpeed(random(2, 3), 180);
    circle.enteredCell = false;
    circle.scale = 0.5;
    circle.mass = 5;
    circle.depth = 5;
    circle.absorbed = false;
    circle.leaving = false;
    circles.add(circle);
}

function removeCircle() {
    const index = circles.length - 1
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].circle == circles[index]) {
            boxes[i].circle = null;
        }
    }
    circles[index].remove();
}

function updateCircles() {
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        if (!circle.enteredCell && circle.overlap(inv2)) {
            circle.enteredCell = true;
            //circle.setSpeed(random(2, 3), random(0, 360)); // Change to random movement
        }
        if (circle.enteredCell && !circle.absorbed) {
            keepWithinCell(circle);
        }
        // if (circle.leaving) {
        //     circleLeaveScreen(circle);
        //     if (!circle.replaced) {
        //         createCircle();
        //         circle.replaced = true;
        //     }
        // }
    }
}

function keepWithinCell(circle) {
    if(circle.absorbed == true){
        return;
    }
    if (nucleus.overlapPixel(circle.position.x, circle.position.y) || outer.overlapPixel(circle.position.x, circle.position.y)) {
        // Reverse the velocity
        circle.velocity.y = -circle.velocity.y
        circle.velocity.x = -circle.velocity.x
    }

}

function circleLeaveScreen(circle) {
    circle.remove();
    // circle.velocity.y += 0.02;

    // if (circle.position.x < 0 || circle.position.y < 0 || circle.position.y > height) {
    //     circle.remove();
    // }

}

function createBoxes() {
    var box;
    var overlapping;
    var correctLoc;

    do {
        overlapping = false;
        correctLoc = false;
        var bx = random(0, width);
        var by = random(20, height - 20);

        for (var k = 0; k < boxes.length; k++) {
            var otherBox = boxes[k];
            if (dist(bx, by, otherBox.position.x, otherBox.position.y) < 100) {
                overlapping = true;
                break;
            }
        }

        // Create temporary box for location checking
        if (!overlapping) {
            box = createSprite(bx, by);
            box.setCollider('rectangle');
            correctLoc = checkReceptorLocation(box);
            box.remove(); // Remove temporary box
        }

        if (!overlapping && correctLoc) {
            box = createSprite(bx, by);
            box.addImage(receptor);
            box.setCollider('rectangle');
            box.immovable = true;
            box.depth = 4;
            boxes.add(box);
            box.dnaPos = null;
            box.initPos = {
                x: bx,
                y: by
            };
            box.movingBack = false;
        }
    } while (overlapping || !correctLoc);
}

function removeBox() {
    const index = boxes.length - 1;
    boxes[index].remove();
}

function setMembranes() {
    outer = createSprite(480, 335, 30, 30);
    outer.addImage(outer_mem);
    outer.immovable = true;
    outer.depth = 3;

    nuc = createSprite(480, 340, 30, 30);
    nuc.addImage(nuc_mem);
    nuc.immovable = true;
    nuc.depth = 3;
}

function setDNA() {
    dna_strand = createSprite(200, 600, 30, 30);
    dna_strand.addImage(dna);
    dna_strand.immovable = true;
    dna_strand.depth = 3;
}

function setBG() {
    nucleus = createSprite(480, 335, 960, 672);
    nucleus.addImage(nucbg);
    nucleus.immovable = true;
    nucleus.depth = 1;

    cell = createSprite(480, 335, 960, 672);
    cell.addImage(cellbg);
    cell.immovable = true;
    cell.depth = 0;
}

function invisibleSprites() {
    inv1 = createSprite();
    inv1.draw = function () {
        ellipse(10, 672, 30, 30);
    };
    inv1.setCollider('circle', 10, 672, 500);
    inv1.visible = false;
    inv1.immovable = true; 

    inv2 = createSprite();
    inv2.draw = function () {
        ellipse(210, 435, 30, 30);
    };
    inv2.depth = 1;
    inv2.setCollider('circle', 210, 435, 400);
    inv2.visible = false;
}

function checkReceptorLocation(box) {
    var withinCell = cell.overlapPixel(box.position.x, box.position.y);
    var inNucleus = nucleus.overlapPixel(box.position.x, box.position.y);
    var onOuter = outer.overlapPixel(box.position.x, box.position.y);
    var onNuc = nuc.overlapPixel(box.position.x, box.position.y);

    return withinCell && !inNucleus && !onOuter && !onNuc;
}

class Particle {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-8, 0);
        this.alpha = 255;
    }

    finished() {
        return this.alpha < 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 3;
    }

    show() {
        noStroke();
        fill(355, 100, 0, this.alpha);
        ellipse(this.x, this.y, 16);
    }

}


class Particle {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1);
        this.vy = random(-8, 0);
        this.alpha = 255;
    }

    finished() {
        return this.alpha < 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 3;
    }

    show() {
        noStroke();
        fill(355, 100, 0 ,this.alpha);
        ellipse(this.x, this.y, 16);
    }

}