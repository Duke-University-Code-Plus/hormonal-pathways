


<script> 
import { onMount } from "svelte";

let sketchcontainer;

 class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() *2 - 1;
            this.vy = Math.random() - 2.5;
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
            p.fill(128, 128, 128, this.alpha);
            p.ellipse(this.x, this.y, 16);
        }
    }

onMount(() => {
        createSketch();
    });

const createSketch = () => {
        new p5((p) => {
            var dna_strand,
                circle,
                protein,
                box,
                inv1;
            
            let dna,
                receptor,
                hormone;

            const particles = [];
            p.setup = () => {
                p.createCanvas(960/2, 75/2);
                receptor = p.loadImage("cell-images/receptor.png");
                hormone = p.loadImage("cell-images/hormone.png");
                dna = p.loadImage("cell-images/dna.png");


                p.setDNA();
                p.setReceptor();
                p.setHormone();
                p.invisibleSprite();

            };
                
            p.draw = () => {
                p.background(255);
                p.scale(0.5)
                
              
                p.textSize(40);
                p.fill('black');
                p.text('dna', 70, 65);

                p.text('receptor', 345, 60);
                p.text('hormone', 565, 60);
                p.text('mRNA', 800, 60);

                p.shake(circle,inv1);
             

                p.drawSprites();
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    particles[i].show(p);
                    if (particles[i].finished()) {
                        particles.splice(i, 1);
                    }

                
                };
                p.createParticles(770,60);
            }


            p.shake = (circle,inv1) => {
                circle.attractionPoint(50, inv1.position.x, inv1.position.y);
                circle.maxSpeed = 1;
                console.log(`${inv1}`);
            };

            p.setDNA = () => {
                dna_strand = p.createSprite(50, 30, 1, 1);
                dna_strand.addImage(dna);
                dna_strand.immovable = true;
                //dna_strand.depth = 3;
            };
            p.setReceptor = () => {
                box = p.createSprite(300, 45, 1, 1);
                box.addImage(receptor);
                box.immovable = true;
                //box.depth = 3;
            };
            p.setHormone = () => {
                circle = p.createSprite(535, 47, 1, 1);
                circle.addImage(hormone);
                circle.immovable = true;
                circle.depth = 2;
            };
            

            p.createParticles = async (x, y) => {
                for (let i = 0; i < 2; i++) {
                    let particle = new Particle(x,y);
                    particles.push(particle);
                    await p.sleep(10000);
                }
            };


            p.invisibleSprite = () => {
                inv1 = p.createSprite(535,47, 20,20);
                //inv1.draw = function () {
                //    p.ellipse(535, 47, 20, 20);
                //};
                inv1.depth = 3
                //inv1.setCollider("circle", 535, 47);
                inv1.visible = false;
            }


            p.sleep = (millisecondsDuration) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, millisecondsDuration);
                });
            };

            


            
}, sketchcontainer);
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