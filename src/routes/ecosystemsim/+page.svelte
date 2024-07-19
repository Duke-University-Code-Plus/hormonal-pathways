<script>
    let iframe;

    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import NavBar from "../Nested/navigation.svelte";
    import {
        gamma1,
        gamma2,
        gamma3,
        G,
        Xmin,
        delSmax,
        delCmax,
        tau,
        K,
        alpha,
        beta,
        mu,
        z1,
        z2,
        z3,
        N,
        foodShort,
        foodShortbegin,
        foodShortend,
    } from "../data_store.js";
    import { apiEndpoint } from "../state_store.js";

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];
    let Vhist = [];

    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3];

    onMount(() => {

        //send proportion data to iframe
        iframe = document.querySelector("#iframeID"); //caching dom element called iframe
        const proportiondata = ["proportion", 0.3, 0.5, 0.9];
        iframe.contentWindow.postMessage(JSON.stringify(proportiondata), "*"); // pushes message to the

        //listen for iframe
        window.onmessage = function (e) {
            window.message = JSON.parse(e.data);
            window.message1 = window.message[0]; //name of bird
            window.message2 = window.message[1]; //num of offspring

            const element = document.getElementById(
                window.message1 + "Offspring",
            );
            element.innerHTML = "Offspring Count: " + window.message2;
        };
    });

    async function fetchData() {
        try {

            const runStart = "run"
            iframe.contentWindow.postMessage(JSON.stringify(runStart), "*");
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
</script>

<NavBar />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Ecosystem Simulation
</h1>

<!-- Run Simulation Button-->
<div class="text-center my-4">
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
        on:click={fetchData}>Run</button
    >
</div>

<div class="flex flex-row flex-wrap gap-6 items-center justify-center mb-8">
    <div id="bird1Offspring">Offspring Count: 1</div>

    <div id="bird2Offspring">Offspring Count: 1</div>

    <div id="bird3Offspring">Offspring Count: 1</div>
</div>

<!-- Animation stuff-->
<div class="flex flex-row flex-wrap gap-6 items-center justify-center mb-8">
    <div>
        <iframe
            width="800"
            height="590"
            src="http://localhost:5173/ecosystem-sketch"
            id="iframeID"
            title="YouTube video player"
            frameborder="0"
        ></iframe>
    </div>
</div>
