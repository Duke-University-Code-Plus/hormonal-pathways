<script>
import { onMount } from "svelte";
export let Birdiff;
let sketchcontainer;    
onMount(() => {
        createSketch();
    });
const createSketch = () => {
        new p5((p) => {
            let malebird;
            let malebird_fly_spritesheet;
            let malebird_fly;
            if (Birdiff == "1") {
                p.preload = () => {p.loadJSON('bird-images/malebird_fly.json', function(malebird_fly_frames) {
                        malebird_fly_spritesheet = p.loadSpriteSheet('bird-images/malebird_fly_spritesheet.png', malebird_fly_frames);
                    });
                }
            }
            if (Birdiff == "2") {
                p.preload = () => {p.loadJSON('bird-images/malebird2_fly.json', function(malebird_fly_frames) {
                        malebird_fly_spritesheet = p.loadSpriteSheet('bird-images/malebird2_fly_spritesheet.png', malebird_fly_frames);
                    });
                }
            }

            if (Birdiff == "3") {
                p.preload = () => {p.loadJSON('bird-images/malebird1_fly.json', function(malebird_fly_frames) {
                        malebird_fly_spritesheet = p.loadSpriteSheet('bird-images/malebird1_fly_spritesheet.png', malebird_fly_frames);
                    });
                }
            }

            p.setup = () => {
                let canvas = p.createCanvas(200, 100).parent(sketchcontainer);
                malebird = p.createSprite(100,50);
                console.log(Birdiff);

                if(Birdiff == "1") {
                malebird_fly = p.loadAnimation(malebird_fly_spritesheet);
                malebird.addAnimation('stand', 'bird-images/malebird_stand.png');
                }
                if(Birdiff == "2") {
                malebird_fly = p.loadAnimation(malebird_fly_spritesheet);
                malebird.addAnimation('stand', 'bird-images/malebird2_stand.png');
                }
                if(Birdiff == "3") {
                malebird_fly = p.loadAnimation(malebird_fly_spritesheet);
                malebird.addAnimation('stand', 'bird-images/malebird1_stand.png');
                }




                malebird.addAnimation('fly', malebird_fly);
                malebird.setCollider('circle', 0, 0, 250);
                //malebird.debug = true;
                malebird.scale = 0.2
                // canvas.onMouseOver = function() {
                //     malebird.changeAnimation('fly');
                //     };
                
                // canvas.onMouseOut = function() {
                //     malebird.changeAnimation('stand');
                // };
                canvas.mouseOver(flying);
                canvas.mouseOut(standing);
                //canvas.mousePressed(flying);
                //canvas.mouseReleased(flying);
            };
            p.draw = () => {
                p.background(255);
                //p.scale(0.5);
                
                p.drawSprites();
                
            }

            function flying() {
                malebird.changeAnimation('fly');
                }
            function standing() {
                malebird.changeAnimation('stand');
            }
            
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


<div bind:this={sketchcontainer} class="inline-block"></div>


