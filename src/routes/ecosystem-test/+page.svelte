<script>

    import { onMount } from "svelte";

    let iframe; 

    onMount(() => {

        iframe = document.querySelector("#iframeID") //caching dom element called iframe
        const proportiondata = [0.3, 0.5, 0.7]
        iframe.contentWindow.postMessage( JSON.stringify(proportiondata) , '*'); // pushes message to the 

    });
</script>


<iframe width="800" height="590" src="http://localhost:5173/ecosystem-sketch" id="iframeID" title="YouTube video player" frameborder="0" ></iframe>
