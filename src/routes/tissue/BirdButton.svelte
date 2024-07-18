


<script> 
import { onMount } from "svelte";

let sketchcontainer;


const fetchData = () => {
    console.log("Fetch data triggered");
    // Add your fetch logic here
  };
 
onMount(() => {
        createSketch();
    });

const createSketch = () => {
        new p5((p) => {
            let malebird;
            let malebird_fly_spritesheet;
            let malebird_fly;
            //var hover = false;
            //var offset = 400;
            //var size = offset;
            //var imagePath;

            //let mb;
            p.preload = () => {p.loadJSON('Bird/malebird_fly.json', function(malebird_fly_frames) {
                    malebird_fly_spritesheet = p.loadSpriteSheet('Bird/malebird_fly_spritesheet.png', malebird_fly_frames);
                });
             }

            
            p.setup = () => {
                p.createCanvas(200, 100).parent(sketchcontainer);
                malebird = p.createSprite(100,50);
                malebird_fly = p.loadAnimation(malebird_fly_spritesheet);
                malebird.addAnimation('stand', 'Bird/malebird_stand.png');
                malebird.addAnimation('walk', malebird_fly);
                

                malebird.setCollider('circle', 0, 0, 250);
                //malebird.debug = true;
                malebird.scale = 0.2
                //mb = p.loadImage()
                //malebird = p.createSprite(400,200);
                //malebird.addAnimation('stand','static/Bird/malebird_stand.png');

                malebird.onMouseOver = function() {
                    this.changeAnimation('walk');
                 };
                
                 malebird.onMouseOut = function() {
                     this.changeAnimation('stand');
                 };

                 malebird.onMousePressed = function() {
                     fetchData();
                 };

                // malebird.onMouseReleased = function() {
                //     this.changeAnimation('stand');
                // };
            };
                
            p.draw = () => {
                p.background(255);
                //p.scale(0.5);
                
                p.drawSprites();
                
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