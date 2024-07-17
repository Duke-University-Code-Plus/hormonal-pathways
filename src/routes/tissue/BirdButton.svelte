


<script> 
import { onMount } from "svelte";

let sketchcontainer;

 
onMount(() => {
        createSketch();
    });

const createSketch = () => {
        new p5((p) => {
            var bird1;

            
            p.setup = () => {
                p.createCanvas(960, 750);
                bird1 = createSprite(400,200);
                bird1.addAnimation('normal', )
               


                

            };
                
            p.draw = () => {
                p.background(255);
               
                
              
               

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