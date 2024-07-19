<script>
    import { json } from "@sveltejs/kit";
    import { parse } from "svelte/compiler";
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
    <!-- link your javascript sketch -->
    <script src="heart.js" type="text/javascript"></script>
    <script src="malebird.js" type="text/javascript"></script>
    <script src="femalebird.js" type="text/javascript"></script>
    <script src="nest.js" type="text/javascript"></script>
    <script src="ecosystem2.js" type="text/javascript"></script>

    <script>
        window.onmessage = function (e) {
            // inside the iframe
            window.message = JSON.parse(e.data); //either proportion or start button

            if (window.message[0] == "proportion") {
                window.proportion1 = Number(window.message[1]);
                window.proportion2 = Number(window.message[2]);
                window.proportion3 = Number(window.message[3]);
            } else { //if message is to run
                window.birdNeutralState = false; //then birds shouldnt be in neutral state
            }

        };
    </script>
</svelte:head>
