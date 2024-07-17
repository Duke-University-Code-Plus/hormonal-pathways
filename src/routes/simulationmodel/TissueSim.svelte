<script>
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import {
        gamma1_tissue,
        gamma2_tissue,
        gamma3_tissue,
        hormoneCount,
        currRate1,
        currRate2,
        currRate3,
        receptorsBound1,
        receptorsBound2,
        receptorsBound3,
        labelToggle,
    } from "../tissue_store.js";
    export let canvas;

    // function updateCurrRate(value) {
    //     currRate.set(value);
    // }

    let sketchContainer;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * -8;
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

        show(p) {
            p.noStroke();
            if (canvas == "gamma1_tissue") {
                p.fill(355, 100, 0, this.alpha);
            }
            if (canvas == "gamma2_tissue") {
                p.fill(23, 181, 2, this.alpha);
            }

            if (canvas == "gamma3_tissue") {
                p.fill(10, 24, 209, this.alpha);
            }
            p.ellipse(this.x, this.y, 16);
        }
    }

    onMount(() => {
        createSketch();
    });

    const createSketch = () => {
        new p5((p) => {
            var circles,
                absorbed,
                boxes,
                proteins,
                outer,
                nuc,
                nucleus,
                cell,
                inv1,
                inv2,
                dna_strand;
            let hormoneSlider,
                receptorSlider,
                bg,
                outer_mem,
                nuc_mem,
                receptor,
                hormone,
                dna,
                cellbg,
                nucbg;
            const particles = [];

            let setwidth = 960;
            let setheight = 672;

            // Hormone and receptor count
            let g = 0; // hormone
            let h = 0; // receptor

            let scaleFactor = 1 / 2.5;

            let frameCounter = 0;
            let receptorBoundCounter = 0;

            p.setup = () => {
                p.createCanvas(setwidth * scaleFactor, setheight * scaleFactor);

                //Initialize images
                bg = p.loadImage("cell-images/tissue-sim-background.png");
                outer_mem = p.loadImage("cell-images/outermembrane.png");
                nuc_mem = p.loadImage("cell-images/nuclearmembrane.png");
                receptor = p.loadImage("cell-images/receptor.png");
                hormone = p.loadImage("cell-images/hormone.png");
                dna = p.loadImage("cell-images/dna.png");
                cellbg = p.loadImage("cell-images/cell-bg.png");
                nucbg = p.loadImage("cell-images/nucleus-bg.png");

                // Initialize sliders
                // hormoneSlider = p.createSlider(0, 20, 0, 1);
                // hormoneSlider.position(10, 10);
                // hormoneSlider.size(80);
                // hormoneSlider.input(hormoneSliderchange);

                // receptorSlider = p.createSlider(0, 10, 0, 1);
                // receptorSlider.position(10, 30);
                // receptorSlider.size(80);
                // receptorSlider.input(receptorSliderchange);

                // Initialize groups
                circles = new p.Group();
                boxes = new p.Group();
                proteins = new p.Group();
                absorbed = new p.Group();

                function hormoneSliderchange() {
                    console.log(hormoneSlider.value());
                }

                function receptorSliderchange() {
                    console.log(receptorSlider.value());
                }

                // Initialize sprites
                p.setBG();
                p.setMembranes();
                p.setDNA();
                p.invisibleSprites();
            };

            p.draw = () => {
                // console.log(p.frameCount);
                if ($labelToggle) {
                    console.log("show labels");
                }

                if (canvas == "gamma1_tissue") {
                    p.background(247, 211, 208);
                }
                if (canvas == "gamma2_tissue") {
                    p.background(188, 245, 188);
                }

                if (canvas == "gamma3_tissue") {
                    p.background(210, 210, 248);
                }
                p.scale(scaleFactor);

                // for (var i = 0; i < p.allSprites.length; i++) {
                //     p.allSprites[i].debug = true;
                // }

                g = $hormoneCount;

                if (canvas == "gamma1_tissue") {
                    h = $gamma1_tissue;
                }

                if (canvas == "gamma2_tissue") {
                    h = $gamma2_tissue;
                }

                if (canvas == "gamma3_tissue") {
                    h = $gamma3_tissue;
                }

                if (g > circles.length + absorbed.length) {
                    p.createCircle();
                }

                if (g < circles.length + absorbed.length) {
                    if (circles.length != 0) {
                        p.removeCircle();
                    } else {
                        p.removeAbsorbed();
                    }
                }

                if (h > boxes.length) {
                    p.createBoxes();
                }

                if (h < boxes.length) {
                    p.removeBox();
                }

                p.updateCircles();

                // Circles bounce against each other
                circles.bounce(circles);

                // Circles p.absorb boxes
                circles.overlap(boxes, p.absorb);

                absorbed.overlap(boxes, p.absorb);

                p.updateAbsorbed();

                p.moveBackBoxes();

                frameCounter += 1;
                let framesMax = 300;
                if (frameCounter == framesMax) {
                    if (canvas == "gamma1_tissue") {
                        $currRate1 = p.bindRate(framesMax);
                    }

                    if (canvas == "gamma2_tissue") {
                        $currRate2 = p.bindRate(framesMax);
                    }

                    if (canvas == "gamma3_tissue") {
                        $currRate3 = p.bindRate(framesMax);
                    }
                    frameCounter = 0;
                    receptorBoundCounter = 0;
                }

                // Handle edges
                for (var i = 0; i < p.allSprites.length; i++) {
                    var s = p.allSprites[i];
                    if (s.position.x < 0) {
                        s.position.x = 1;
                        s.velocity.x = p.abs(s.velocity.x);
                    }
                    if (s.position.x > p.width / scaleFactor) {
                        s.position.x = p.width / scaleFactor - 1;
                        s.velocity.x = -p.abs(s.velocity.x);
                    }
                    if (s.position.y < 0) {
                        s.position.y = 1;
                        s.velocity.y = p.abs(s.velocity.y);
                    }
                    if (s.position.y > p.height / scaleFactor) {
                        s.position.y = p.height / scaleFactor - 1;
                        s.velocity.y = -p.abs(s.velocity.y);
                    }
                }
                

                p.drawSprites();

                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    particles[i].show(p);
                    if (particles[i].finished()) {
                        particles.splice(i, 1);
                    }
                }

                if ($labelToggle) {
                    p.showLabels();
                }

                
            };

            p.showLabels = () => {
                p.textFont("Arial");

                // Define a helper function to draw labels with background
                const drawLabel = (
                    text,
                    x,
                    y,
                    lineXStart = null,
                    lineYStart = null,
                    lineXEnd = null,
                    lineYEnd = null,
                    textSize = 30,
                    bgColor = "white",
                    textColor = "black",
                ) => {
                    p.textSize(textSize);
                    p.fill(bgColor);
                    p.noStroke();
                    let textWidth = p.textWidth(text);
                    let textHeight = textSize * 1.2;
                    p.rect(x - 5, y - textSize, textWidth + 10, textHeight, 5); // Background with padding and rounded corners

                    p.fill(textColor);
                    p.text(text, x, y);

                    if (lineXStart !== null && lineYStart !== null) {
                        p.stroke(textColor);
                        p.strokeWeight(3);
                        p.line(
                            lineXStart,
                            lineYStart,
                            lineXEnd,
                            lineYEnd,
                        );
                    }
                };

                // Labels and optional lines
                drawLabel("cell", 200, 125);
                // p.line(218, 65, 295, 175); // Adjust coordinates as needed

                drawLabel("nucleus", 120, 400);
                // p.line(123, 436, 100, 500); // Adjust coordinates as needed

                drawLabel("DNA", 220, 640);
                // p.line(245, 586, 245, 623); // Adjust coordinates as needed

                drawLabel("nuclear membrane", 365, 260, 420, 453, 500, 270);

                drawLabel("outer membrane", 685, 60, 750, 70, 700, 250);

                drawLabel("extracellular fluid", 785, 360, null, null, null, null, 23);
            };

            p.updateAbsorbed = () => {
                for (var i = 0; i < absorbed.length; i++) {
                    const a = absorbed[i];
                    a.attractionPoint(
                        5,
                        a.box.position.x,
                        a.box.position.y - 20,
                    );
                    a.maxSpeed = 7;
                }
            };

            p.absorb = (circle, box) => {
                if (!box.circle && !circle.absorbed && !box.movingBack) {
                    box.circle = circle;
                    circle.absorbed = true;
                    circle.box = box;
                    circles.remove(circle);
                    absorbed.add(circle);
                    if (canvas == "gamma1_tissue") {
                        $receptorsBound1 += 1;
                    }

                    if (canvas == "gamma2_tissue") {
                        $receptorsBound2 += 1;
                    }

                    if (canvas == "gamma3_tissue") {
                        $receptorsBound3 += 1;
                    }
                    receptorBoundCounter += 1;
                }

                if (circle != box.circle) {
                    return;
                }

                if (box != circle.box) {
                    return;
                }
                p.toDNA(circle, box);
            };

            p.toDNA = (circle, box) => {
                if (!dna_strand) {
                    console.error("DNA strand is not defined");
                    return;
                }

                if (box.framesAtDNA == null) {
                    box.framesAtDNA = 0;
                }

                if (box.framesAtDNA < 20) {
                    if (box.dnaPos == null) {
                        let coors = p.findDNACoors();
                        if (coors != null) {
                            box.dnaPos = coors;
                            box.attractionPoint(15, coors[0], coors[1]);
                            box.maxSpeed = 3;
                        } else {
                            console.log("no coordinates found");
                            return;
                        }
                    } else {
                        let coors = box.dnaPos;
                        box.attractionPoint(15, coors[0], coors[1]);
                    }

                    let xDiff = p.abs(box.position.x - box.dnaPos[0]);
                    let yDiff = p.abs(box.position.y - box.dnaPos[1]);
                    if (xDiff <= 3 && yDiff <= 3) {
                        box.framesAtDNA++;
                    }
                } else {
                    box.movingBack = true;
                    box.circle = null;
                    box.dnaPos = null;
                    circle.remove();
                    //p.createCircle();
                    p.createParticles(box.position.x, box.position.y);
                }
            };

            p.bindRate = (frames) => {
                // let receptorCounter = 0;
                // if (canvas == "gamma1_tissue") {
                //     receptorCounter = $receptorsBound1;
                // }

                // if (canvas == "gamma2_tissue") {
                //     receptorCounter = $receptorsBound2;
                // }

                // if (canvas == "gamma3_tissue") {
                //     receptorCounter = $receptorsBound3;
                // }
                let ratePerSec =
                    (receptorBoundCounter / frames) * p.frameRate();
                let ratePerMin = ratePerSec * 60;
                //return parseFloat(ratePerMin.toFixed(2));
                return Math.round(ratePerMin);
            };

            p.createParticles = async (x, y) => {
                for (let i = 0; i < 50; i++) {
                    let particle = new Particle(x, y);
                    particles.push(particle);
                    await p.sleep(50);
                }
            };

            p.sleep = (millisecondsDuration) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, millisecondsDuration);
                });
            };

            p.findDNACoors = () => {
                let midX = dna_strand.position.x;
                let midY = dna_strand.position.y;
                let w = 150;

                let x = midX + p.random(-1 * w, w);
                let y = midY;

                return [x, y];
            };

            p.moveBackBoxes = () => {
                boxes.forEach((box) => {
                    if (box.movingBack) {
                        box.attractionPoint(15, box.initPos.x, box.initPos.y);
                        box.maxSpeed = 3;
                        if (p.isAtInitialPosition(box)) {
                            p.resetBox(box);
                        }
                    }
                });
            };

            p.isAtInitialPosition = (box) => {
                return (
                    p.abs(box.position.x - box.initPos.x) <= 3 &&
                    p.abs(box.position.y - box.initPos.y) <= 3
                );
            };

            p.resetBox = (box) => {
                box.position.x = box.initPos.x;
                box.position.y = box.initPos.y;
                box.velocity.x = 0;
                box.velocity.y = 0;
                box.movingBack = false;
                box.framesAtDNA = null;
            };

            p.createCircle = () => {
                var circle = p.createSprite(
                    p.width / scaleFactor,
                    p.random(0, p.height / scaleFactor),
                );
                circle.addImage(hormone);
                circle.setCollider("circle", 0, 0, 25);
                circle.setSpeed(p.random(2, 3), 180);
                circle.enteredCell = false;
                circle.scale = 0.6;
                circle.mass = 6;
                circle.depth = 5;
                circle.absorbed = false;
                circle.leaving = false;
                circles.add(circle);
            };

            p.removeCircle = () => {
                const index = circles.length - 1;
                circles[index].remove();
            };

            p.removeAbsorbed = () => {
                const index = absorbed.length - 1;
                for (let i = 0; i < boxes.length; i++) {
                    if (boxes[i].circle == absorbed[index]) {
                        boxes[i].circle = null;
                        boxes[i].movingBack = true;
                        boxes[i].dnaPos = null;
                    }
                }
                absorbed[index].remove();
            };

            p.updateCircles = () => {
                for (let i = 0; i < circles.length; i++) {
                    let circle = circles[i];
                    if (!circle.enteredCell && circle.overlap(inv2)) {
                        circle.enteredCell = true;
                    }
                    if (circle.enteredCell && !circle.absorbed) {
                        p.keepWithinCell(circle);
                    }
                }
            };

            p.keepWithinCell = (circle) => {
                // if (circle.absorbed == true) {
                //     return;
                // }
                if (
                    nucleus.overlapPixel(circle.position.x, circle.position.y)
                ) {
                    // Reverse the velocity
                    circle.velocity.y = -circle.velocity.y;
                    circle.velocity.x = -circle.velocity.x;

                    circle.attractionPoint(
                        10,
                        circle.position.x + 1,
                        circle.position.y - 1,
                    );
                    circle.maxSpeed = 3;
                }

                if (outer.overlapPixel(circle.position.x, circle.position.y)) {
                    // Reverse the velocity
                    circle.velocity.y = -circle.velocity.y;
                    circle.velocity.x = -circle.velocity.x;

                    circle.attractionPoint(
                        10,
                        circle.position.x - 1,
                        circle.position.y,
                    );
                    circle.maxSpeed = 3;
                }
            };

            p.circleLeaveScreen = (circle) => {
                circle.remove();
                // circle.velocity.y += 0.02;

                // if (circle.position.x < 0 || circle.position.y < 0 || circle.position.y > p.height) {
                //     circle.remove();
                // }
            };

            p.createBoxes = () => {
                var box;

                // Select random coordinates
                var bx = p.random(0, p.width / scaleFactor);
                var by = p.random(20, p.height / scaleFactor - 20);

                // Check if coordinates overlap with another box
                for (var k = 0; k < boxes.length; k++) {
                    var otherBox = boxes[k];
                    if (
                        p.dist(
                            bx,
                            by,
                            otherBox.position.x,
                            otherBox.position.y,
                        ) < 100
                    )
                        return;
                }
                //console.log("Passed first test: No overlap with other boxes");

                // Check if coordinates overlap with background sprites
                // Create temporary box for location checking
                box = p.createSprite(bx, by);
                box.setCollider("rectangle");
                if (!p.isCorrectReceptorLocation(box)) return box.remove();
                box.remove();
                // console.log(
                //     "Passed second test: No overlap with background sprites",
                // );

                // Create box
                box = p.createSprite(bx, by);
                box.addImage(receptor);
                box.setCollider("rectangle");
                box.immovable = true;
                box.depth = 4;
                boxes.add(box);
                box.dnaPos = null;
                box.initPos = {
                    x: bx,
                    y: by,
                };
                box.movingBack = false;
            };

            p.removeBox = () => {
                const index = boxes.length - 1;
                for (let i = 0; i < absorbed.length; i++) {
                    if (absorbed[i].box == boxes[index]) {
                        absorbed[i].remove();
                    }
                }
                boxes[index].remove();
            };

            p.setMembranes = () => {
                outer = p.createSprite(480, 335, 30, 30);
                outer.addImage(outer_mem);
                outer.immovable = true;
                outer.depth = 3;

                nuc = p.createSprite(480, 340, 30, 30);
                nuc.addImage(nuc_mem);
                nuc.immovable = true;
                nuc.depth = 3;
            };

            p.setDNA = () => {
                dna_strand = p.createSprite(
                    200,
                    p.height / (scaleFactor * (10 / 9)),
                    30,
                    30,
                );
                dna_strand.addImage(dna);
                dna_strand.immovable = true;
                dna_strand.depth = 3;
            };

            p.setBG = () => {
                nucleus = p.createSprite(480, 335, 960, 672);
                nucleus.addImage(nucbg);
                nucleus.immovable = true;
                nucleus.depth = 1;

                cell = p.createSprite(480, 335, 960, 672);
                cell.addImage(cellbg);
                cell.immovable = true;
                cell.depth = 0;
            };

            p.invisibleSprites = () => {
                // inv1 = p.createSprite();
                // inv1.draw = function () {
                //     p.ellipse(p.width * 0.01, p.height, 30, 30);
                // };
                // inv1.setCollider("circle", p.width * 0.01, p.height, 500);
                // //inv1.visible = false;

                inv2 = p.createSprite();
                inv2.draw = function () {
                    p.ellipse(210, 435, 30, 30);
                };
                inv2.depth = 1;
                inv2.setCollider("circle", 210, 435, 463);
                inv2.visible = false;
            };

            p.isCorrectReceptorLocation = (box) => {
                var withinCell = cell.overlapPixel(
                    box.position.x,
                    box.position.y,
                );
                var inNucleus = nucleus.overlapPixel(
                    box.position.x,
                    box.position.y,
                );
                var onOuter = outer.overlapPixel(
                    box.position.x,
                    box.position.y,
                );
                var onNuc = nuc.overlapPixel(box.position.x, box.position.y);

                return withinCell && !inNucleus && !onOuter && !onNuc;
            };
        }, sketchContainer);
    };
</script>

<svelte:head>
    <!-- link p5.js and its addons like p5.dom.js or p5.sound.js -->
    <script src="/p5.js" type="text/javascript"></script>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.4/addons/p5.dom.min.js"
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
    ></script>
    <!-- link p5.play.js -->
    <script src="/p5.play.js" type="text/javascript"></script>
</svelte:head>

<div bind:this={sketchContainer}></div>
