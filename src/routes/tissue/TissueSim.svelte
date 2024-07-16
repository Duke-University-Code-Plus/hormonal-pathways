<script>
    import { onMount } from "svelte";

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
            p.fill(355, 100, 0, this.alpha);
            p.ellipse(this.x, this.y, 16);
        }
    }

    onMount(() => {
        createSketch();
    });

    const createSketch = () => {
        new p5((p) => {
            var circles,
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

            p.setup = () => {
                p.createCanvas(960, 672);

                // Initialize images
                bg = p.loadImage("cell-images/tissue-sim-background.png");
                outer_mem = p.loadImage("cell-images/outermembrane.png");
                nuc_mem = p.loadImage("cell-images/nuclearmembrane.png");
                receptor = p.loadImage("cell-images/receptor.png");
                hormone = p.loadImage("cell-images/hormone.png");
                dna = p.loadImage("cell-images/dna.png");
                cellbg = p.loadImage("cell-images/cell-bg.png");
                nucbg = p.loadImage("cell-images/nucleus-bg.png");

                // Initialize sliders
                hormoneSlider = p.createSlider(0, 20, 0, 1);
                hormoneSlider.position(10, 10);
                hormoneSlider.size(80);
                hormoneSlider.input(hormoneSliderchange);

                receptorSlider = p.createSlider(0, 10, 0, 1);
                receptorSlider.position(10, 30);
                receptorSlider.size(80);
                receptorSlider.input(receptorSliderchange);

                // Initialize groups
                circles = new p.Group();
                boxes = new p.Group();
                proteins = new p.Group();

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

                // Create circles and boxes
                for (let i = 0; i < hormoneSlider.value(); i++) {
                    p.createCircle();
                }

                for (let j = 0; j < receptorSlider.value(); j++) {
                    p.createBoxes();
                }
            };

            p.draw = () => {
                p.background(247, 211, 208);
                p.scale(1);

                // for (var i = 0; i < boxes.length; i++) {
                //     boxes[i].debug = true;
                // }

                // Handle sliders
                let g = hormoneSlider.value();
                let h = receptorSlider.value();

                while (g > circles.length) {
                    p.createCircle();
                }

                while (g < circles.length) {
                    p.removeCircle();
                }

                while (h > boxes.length) {
                    p.createBoxes();
                }

                while (h < boxes.length) {
                    p.removeBox();
                }

                p.updateCircles();

                // Circles bounce against each other
                circles.bounce(circles, p.circleBounce);

                // Circles p.absorb boxes
                circles.overlap(boxes, p.absorb);

                p.moveBackBoxes();

                // Handle edges
                for (var i = 0; i < p.allSprites.length; i++) {
                    var s = p.allSprites[i];
                    if (s.position.x < 0) {
                        s.position.x = 1;
                        s.velocity.x = p.abs(s.velocity.x);
                    }
                    if (s.position.x > p.width) {
                        s.position.x = p.width - 1;
                        s.velocity.x = -p.abs(s.velocity.x);
                    }
                    if (s.position.y < 0) {
                        s.position.y = 1;
                        s.velocity.y = p.abs(s.velocity.y);
                    }
                    if (s.position.y > p.height) {
                        s.position.y = p.height - 1;
                        s.velocity.y = -p.abs(s.velocity.y);
                    }
                }
                
                p.drawSprites();


                 //text inputs  
                 p.textSize(30);
                 p.fill('black');

                 //line and text for cell
                 p.text('cell', 200, 125);
                 //p.line(218, 65, 295, 175);

                 //line and text for nucleus
                 p.text('nucleus', 120, 400);
                 //p.line(123, 436, 100, 500);

                 //line and text for dna
                 p.text('DNA', 220, 640);
                 //p.line(245, 586, 245, 623);

                 //line and text for nuclear membrane
                 p.text('nuclear membrane', 365, 260);
                 p.line(420, 453, 500, 260);

                 //line and text for outer membrane
                 p.textSize(25);
                 p.text('outer membrane', 685, 60);
                 p.line(750, 60, 700, 250);
                
                 //line and text for extracellular fluid
                 p.textSize(23);
                 p.text('extracellular fluid', 785, 360);


                //initialize particles 
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    particles[i].show(p);
                    if (particles[i].finished()) {
                        particles.splice(i, 1);
                    }
                }
            };

            p.absorb = (circle, box) => {
                if (!box.circle && !circle.absorbed && !box.movingBack) {
                    box.circle = circle;
                }

                if (circle != box.circle) {
                    return;
                }

                circle.attractionPoint(20, box.position.x, box.position.y - 20);
                circle.maxSpeed = 7;
                circle.absorbed = true;

                p.toDNA(circle, box);
            };

            p.circleBounce = (circle1, circle2) => {
                if (circle1.absorbed || circle2.absorbed) {
                    return;
                }
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
                    circle.velocity.x = -2;
                    circle.velocity.y = -5;
                    circle.absorbed = false;
                    circle.leaving = true;
                    box.dnaPos = null;
                    circle.remove();
                    p.createCircle();
                    p.createParticles(box.position.x, box.position.y);
                }
            };

            p.createParticles = async (x, y) => {
                for (let i = 0; i < 200; i++) {
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
                var circle = p.createSprite(p.width + 50, p.random(0, p.height));
                circle.addImage(hormone);
                circle.setCollider("circle", 0, 0, 25);
                circle.setSpeed(p.random(2, 3), 180);
                circle.enteredCell = false;
                circle.scale = 0.5;
                circle.mass = 5;
                circle.depth = 5;
                circle.absorbed = false;
                circle.leaving = false;
                circles.add(circle);
            };

            p.removeCircle = () => {
                const index = circles.length - 1;
                for (let i = 0; i < boxes.length; i++) {
                    if (boxes[i].circle == circles[index]) {
                        boxes[i].circle = null;
                    }
                }
                circles[index].remove();
            };

            p.updateCircles = () => {
                for (let i = 0; i < circles.length; i++) {
                    let circle = circles[i];
                    if (!circle.enteredCell && circle.overlap(inv2)) {
                        circle.enteredCell = true;
                        //circle.setSpeed(random(2, 3), random(0, 360)); // Change to random movement
                    }
                    if (circle.enteredCell && !circle.absorbed) {
                        p.keepWithinCell(circle);
                    }
                    // if (circle.leaving) {
                    //     circleLeaveScreen(circle);
                    //     if (!circle.replaced) {
                    //         p.createCircle();
                    //         circle.replaced = true;
                    //     }
                    // }
                }
            };

            p.keepWithinCell = (circle) => {
                if (circle.absorbed == true) {
                    return;
                }
                if (
                    nucleus.overlapPixel(circle.position.x, circle.position.y) ||
                    outer.overlapPixel(circle.position.x, circle.position.y)
                ) {
                    // Reverse the velocity
                    circle.velocity.y = -circle.velocity.y;
                    circle.velocity.x = -circle.velocity.x;
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
                var overlapping;
                var correctLoc;

                do {
                    overlapping = false;
                    correctLoc = false;
                    var bx = p.random(0, p.width);
                    var by = p.random(20, p.height - 20);

                    for (var k = 0; k < boxes.length; k++) {
                        var otherBox = boxes[k];
                        if (
                            p.dist(
                                bx,
                                by,
                                otherBox.position.x,
                                otherBox.position.y
                            ) < 100
                        ) {
                            overlapping = true;
                            break;
                        }
                    }

                    // Create temporary box for location checking
                    if (!overlapping) {
                        box = p.createSprite(bx, by);
                        box.setCollider("rectangle");
                        correctLoc = p.checkReceptorLocation(box);
                        box.remove(); // Remove temporary box
                    }

                    if (!overlapping && correctLoc) {
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
                    }
                } while (overlapping || !correctLoc);
            };

            p.removeBox = () => {
                const index = boxes.length - 1;
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
                dna_strand = p.createSprite(200, 600, 30, 30);
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
                inv1 = p.createSprite();
                inv1.draw = function () {
                    p.ellipse(10, 672, 30, 30);
                };
                inv1.setCollider("circle", 10, 672, 500);
                inv1.visible = false;

                inv2 = p.createSprite();
                inv2.draw = function () {
                    p.ellipse(210, 435, 30, 30);
                };
                inv2.depth = 1;
                inv2.setCollider("circle", 210, 435, 400);
                inv2.visible = false;
            };

            p.checkReceptorLocation = (box) => {
                var withinCell = cell.overlapPixel(
                    box.position.x,
                    box.position.y
                );
                var inNucleus = nucleus.overlapPixel(
                    box.position.x,
                    box.position.y
                );
                var onOuter = outer.overlapPixel(box.position.x, box.position.y);
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
