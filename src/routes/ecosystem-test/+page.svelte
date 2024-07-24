<script>

    import { onMount } from "svelte";
    import { rootURL } from "../state_store.js";

    let iframe; 

    onMount(() => {

        iframe = document.querySelector("#iframeID") //caching dom element called iframe
        const proportiondata = [0.3, 0.5, 0.7]
        iframe.contentWindow.postMessage( JSON.stringify(proportiondata) , '*'); // pushes message to the 

    });
</script>


<iframe width="800" height="590" src= "{$rootURL}/ecosystem-sketch" id="iframeID" title="YouTube video player" frameborder="0" ></iframe>
