var circles;
var boxes;
var proteins;
let slider;
var outer;
var nuc;
var nucleus;
var cell;
var inv1;
var inv2;
var dna_strand, midDNA, leftDNA, rightDNA;
const particles = [];

function setup() {
    createCanvas(960, 672);
    bg = loadImage('cell-images/tissue-sim-background.png');
    outer_mem = loadImage('cell-images/outermembrane.png');
    nuc_mem = loadImage('cell-images/nuclearmembrane.png');
    receptor = loadImage('cell-images/receptor.png');
    hormone = loadImage('cell-images/hormone.png');
    dna = loadImage('cell-images/dna.png');
    cellbg = loadImage('cell-images/cell-bg.png');
    nucbg = loadImage('cell-images/nucleus-bg.png');

    slider = createSlider(0, 20, 0, 1);
    slider.position(10, 10);
    slider.size(80);
    slider.input(sliderchange);

    slider2 = createSlider(0, 6, 0, 1);
    slider2.position(10, 30);
    slider2.size(80);
    slider2.input(slider2change);

    // Create groups
    circles = new Group();
    boxes = new Group();
    proteins = new Group();
    particle = new Group();

    function sliderchange() {
        console.log(slider.value())
    }

    function slider2change() {
        console.log(slider2.value())
    }

    setBG()
    setMembranes();
    setDNA();
    invisibleSprites();

    // Create circles and boxes
    for (let i = 0; i < slider.value(); i++) {
        createCircle()
    }

    for (let j = 0; j < 3; j++) {
        createBoxes()
    }

    // for (var i = 0; i < allSprites.length; i++) {
    //     allSprites[i].debug = true;
    // }
}

function draw() {
    background(247, 211, 208);

    let g = slider.value();
    let h = slider2.value();

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

    // Circles bounce against each other
    circles.bounce(circles);


    //circles.bounce(inv1);

    // Circles absorb boxes
    circles.overlap(boxes, absorb);


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


     // Draw and update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].finished()) {
            particles.splice(i, 1);
        }
    }


   
}

function absorb(circle, box) {
    if (!box.circle && !circle.absorbed) {
        box.circle = circle;
    }

    if (circle != box.circle) {
        return
    }
    
    circle.attractionPoint(15, box.position.x, box.position.y - 20);
    circle.maxSpeed = 5;
    
    circle.absorbed = true;
    box.absorbed = true;


    toDNA(box,circle)

}

function toDNA(box,circle) {
    if (!dna_strand) {
        console.error('DNA strand is not defined');
        return;
    }

    if (box.framesAtDNA == null) {
        box.framesAtDNA = 0;
    }

    if (box.framesAtDNA < 30) {
        if (box.dnaPos == null) {
            let coors = findDNACoors();
            if (coors != null) {
                box.dnaPos = coors;
                box.attractionPoint(15, coors[0], coors[1]);
                box.maxSpeed = 3;
            }
            else {
                console.log('no coordinates found')
            }
        } else {
            let coors = box.dnaPos;
            box.attractionPoint(15, coors[0], coors[1]);
        }
        //console.log('compare ' + box.position, box.dnaPos);
        let xDiff = abs(box.position.x - box.dnaPos[0]);
        let yDiff = abs(box.position.y - box.dnaPos[1]);
        if (xDiff <= 3 && yDiff <= 3) {
            box.framesAtDNA++;
        }
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




function findDNACoors() {
    // console.log('midDNA:', midDNA);
    // console.log('leftDNA:', leftDNA);
    // console.log('rightDNA:', rightDNA);

    let midFull = midDNA.full;
    let leftFull = leftDNA.full;
    let rightFull = rightDNA.full;

    if (!midFull) {
        midDNA.full = true;
        return [midDNA.pos.x, midDNA.pos.y];
    } else if (!leftFull) {
        leftDNA.full = true;
        return [leftDNA.pos.x, leftDNA.pos.y];
    } else if (!rightFull) {
        rightDNA.full = true;
        return [rightDNA.pos.x, rightDNA.pos.y];
    }

    return null;
}

function createCircle() {
    var circle = createSprite(random(800, width), random(0, height));
    //circle.addAnimation('normal', 'assets/asterisk_circle0006.png', 'assets/asterisk_circle0008.png');
    circle.addImage(hormone)
    //circle.setCollider('circle', -2, 2, 55);
    circle.setCollider('circle', 0, 0, 25);
    circle.setSpeed(random(2, 3), random(0, 360));
    circle.scale = 0.5;
    circle.mass = 1;
    circle.depth = 5;
    circle.absorbed = false; // Track if the circle has absorbed a box
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

function removeBox() {
    const index = boxes.length - 1
    boxes[index].remove()
}

function createBoxes() {
    var box;
    var overlapping;
    var correctLoc;

    do {
        overlapping = false;
        correctLoc = false;
        var bx = random(200, 760);
        var by = random(200, 480);

        // Check for overlap with existing boxes
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
        //console.log(correctLoc)

        // Make the box
        if (!overlapping && correctLoc) {
            box = createSprite(bx, by);
            box.addImage(receptor);
            box.setCollider('rectangle');
            box.immovable = true;
            box.depth = 4;
            box.absorbed = false;
            boxes.add(box);
            box.dnaPos = null;
        }
    } while (overlapping || !correctLoc);
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

    let midX = dna_strand.position.x;
    let midY = dna_strand.position.y;
    let w = 100

    midDNA = {
        pos: {
            x: midX,
            y: midY,
        },
        full: false
    };
    leftDNA = {
        pos: {
            x: midX - w,
            y: midY
        }
        ,
        full: false
    };
    rightDNA = {
        pos: {
            x: midX + w,
            y: midY
        }
        ,
        full: false
    };
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
    inv2 = createSprite();
    inv2.draw = function () { ellipse(210, 435, 30, 30) }
    inv2.depth = 1
    inv2.setCollider('circle', 210, 435, 400);
    inv2.visible = false;

    inv1 = createSprite();
    inv1.draw = function () { ellipse(10, 672, 30, 30) }
    inv1.setCollider('circle', 10, 672, 500);
    inv1.visible = false;
    inv1.immovable = true; 


}

function checkReceptorLocation(box) {
    var withinCell = box.overlap(inv2);
    var inNucleus = box.overlap(inv1);
    // console.log('withinCell ' + withinCell)
    // console.log('inNucleus ' + inNucleus)


    return withinCell && !inNucleus;
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