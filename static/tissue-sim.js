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
var dna_strand;

function setup() {
    createCanvas(960, 672);

    //intialize images
    bg = loadImage('cell-images/tissue-sim-background.png');
    outer_mem = loadImage('cell-images/outermembrane.png');
    nuc_mem = loadImage('cell-images/nuclearmembrane.png');
    receptor = loadImage('cell-images/receptor.png');
    hormone = loadImage('cell-images/hormone.png');
    dna = loadImage('cell-images/dna.png');
    cellbg = loadImage('cell-images/cell-bg.png');
    nucbg = loadImage('cell-images/nucleus-bg.png');


    //initalize sliders
    hormoneSlider = createSlider(0, 20, 0, 1);
    hormoneSlider.position(10, 10);
    hormoneSlider.size(80);
    hormoneSlider.input(hormoneSliderchange);

    receptorSlider = createSlider(0, 6, 0, 1);
    receptorSlider.position(10, 30);
    receptorSlider.size(80);
    receptorSlider.input(receptorSliderchange);

    //intialize groups
    circles = new Group();
    boxes = new Group();
    proteins = new Group();

    function hormoneSliderchange() {
        console.log(hormoneSlider.value())
    }

    function receptorSliderchange() {
        console.log(receptorSlider.value())
    }

    //initialize sprites
    setBG()
    setMembranes();
    setDNA();
    invisibleSprites();

    // Create circles and boxes
    for (let i = 0; i < hormoneSlider.value(); i++) {
        createCircle()
    }

    for (let j = 0; j < receptorSlider.value(); j++) {
        createBoxes()
    }

    // for (var i = 0; i < allSprites.length; i++) {
    //     allSprites[i].debug = true;
    // }
}

function draw() {
    background(247, 211, 208);

    //handle sliders
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

    // Circles bounce against each other
    circles.bounce(circles);

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
}

function absorb(circle, box) {
    if (!box.circle && !circle.absorbed && !box.movingBack) {
        box.circle = circle;
    }

    if (circle != box.circle) {
        return
    }

    circle.attractionPoint(15, box.position.x, box.position.y - 20);
    circle.maxSpeed = 5;
    circle.absorbed = true;
    box.absorbed = true;

    toDNA(circle, box)

}

function toDNA(circle, box) {
    if (!dna_strand) {
        console.error('DNA strand is not defined');
        return;
    }

    if (box.framesAtDNA == null) {
        box.framesAtDNA = 0;
    }

    if (box.framesAtDNA < 20) {
        if (box.dnaPos == null) {
            let coors = findDNACoors();
            if (coors != null) {
                box.dnaPos = coors;
                box.attractionPoint(15, coors[0], coors[1]);
                box.maxSpeed = 3;
            }
            else {
                console.log('no coordinates found')
                return;
            }
        } else {
            let coors = box.dnaPos;
            box.attractionPoint(15, coors[0], coors[1]);
        }
        //check if DNA at its position
        let xDiff = abs(box.position.x - box.dnaPos[0]);
        let yDiff = abs(box.position.y - box.dnaPos[1]);
        if (xDiff <= 3 && yDiff <= 3) {
            box.framesAtDNA++;
        }
    } else {
        box.movingBack = true;
        box.circle = null
        circle.velocity.y = -5; // Move the receptor up
        circle.velocity.x = 0;
        circle.absorbed = false;
        box.dnaPos = null

    }
}

function findDNACoors() {
    let midX = dna_strand.position.x;
    let midY = dna_strand.position.y;
    let w = 150

    let x = midX + random(-1*w, w);
    let y = midY;

    return [x,y];
}

function moveBackBoxes(){
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
    box.absorbed = false;
    box.movingBack = false;
    box.framesAtDNA = null;
}


function createCircle() {
    var circle = createSprite(random(800, width), random(0, height));
    circle.addImage(hormone)
    circle.setCollider('circle', 0, 0, 25);
    circle.setSpeed(random(2, 3), random(0, 360));
    circle.scale = 0.5;
    circle.mass = 1;
    circle.depth = 5;
    circle.absorbed = false; 
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

function createBoxes() {
    var box;
    var overlapping;
    var correctLoc;

    do {
        overlapping = false;
        correctLoc = false;
        var bx = random(200, 760);
        var by = random(200, 480);

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
            box.absorbed = false;
            boxes.add(box);
            box.dnaPos = null;
            box.initPos = {
                x: bx,
                y: by
            },
            box.movingBack = false
        }
    } while (overlapping || !correctLoc);
}

function removeBox() {
    const index = boxes.length - 1
    boxes[index].remove()
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
    inv2 = createSprite();
    inv2.draw = function () { ellipse(210, 435, 30, 30) }
    inv2.depth = 1
    inv2.setCollider('circle', 210, 435, 400);
    inv2.visible = false;

    inv1 = createSprite();
    inv1.draw = function () { ellipse(10, 672, 30, 30) }
    inv1.setCollider('circle', 10, 672, 500);
    inv1.visible = false;


}

function checkReceptorLocation(box) {
    var withinCell = box.overlap(inv2);
    var inNucleus = box.overlap(inv1);

    return withinCell && !inNucleus;
}
