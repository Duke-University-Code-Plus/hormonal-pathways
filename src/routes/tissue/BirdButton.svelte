<script>
import { onMount } from "svelte";
import { selectedBird } from "../tissue_store";

export let BirdColor;
export let BirdID;
let sketchcontainer;

onMount(() => {
    createSketch();
});

const createSketch = () => {
        new p5((p) => {
            let malebird;
            let malebird_fly_spritesheet;
            let malebird_fly;


            let peck;


            p.preload = () => {p.loadJSON(`sprites_haruta/${BirdColor}/malebird_fly.json`, function(malebird_fly_frames) {
                    malebird_fly_spritesheet = p.loadSpriteSheet(`sprites_haruta/${BirdColor}/malebird_fly_spritesheet.png`, malebird_fly_frames);
                });
            }

            p.setup = () => {
                let canvas = p.createCanvas(200, 100).parent(sketchcontainer);
                malebird = p.createSprite(100,50);

                malebird_fly = p.loadAnimation(malebird_fly_spritesheet);
                
                malebird.addAnimation('stand', `sprites_haruta/${BirdColor}/malebird_stand.png`);

                // peck = malebird.addAnimation('peck', `sprites_haruta/${BirdColor}/malebird_peck0001.png', 'sprites_haruta/${BirdColor}/malebird_peck0002.png`);

                // peck.frameDelay = 10

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
                // canvas.mouseOver(pecking);
                // canvas.mouseOut(standing);
                //canvas.mousePressed(flying);
                //canvas.mouseReleased(flying);
            };
            p.draw = () => {
                p.background(255);
                //p.scale(0.5);


                updateAnimation()
                
                p.drawSprites();


                
            }

            function updateAnimation(){
                if ($selectedBird == BirdID) flying()
                if ($selectedBird != BirdID) standing()
            }

            function flying() {
                if (malebird.flying) return;
                malebird.changeAnimation('fly');
                malebird.flying = true
                malebird.standing = false
                malebird.pecking = false
            }

            function standing() {
                if (malebird.standing) return;
                malebird.changeAnimation('stand');
                malebird.standing = true
                malebird.flying = false
                malebird.pecking = false
            }

            function pecking(){
                //if ($selectedBird == parseInt(Birdiff)) return
                malebird.changeAnimation('peck');
                malebird.pecking = true
                malebird.standing = false
                malebird.flying = false
            }
            
}, sketchcontainer);
    };


</script>

<div bind:this={sketchcontainer} class="inline-block"></div>