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
        fetchData();

        //send proportion data to iframe
        iframe = document.querySelector("#iframeID"); //caching dom element called iframe

        const proportiondata = [0.3, 0.5, 0.9];
        iframe.contentWindow.postMessage(JSON.stringify(proportiondata), "*"); // pushes message to the

        //listen for iframe
        window.onmessage = function (e) {
            window.message = JSON.parse(e.data);

            window.message1 = window.message[0];
            window.message2 = window.message[1];

            const element = document.getElementById(
                window.message1 + "Offspring",
            );
            element.innerHTML = "Offspring Count: " + window.message2;
        };
    });

    async function fetchData() {
        try {
            gamma = [$gamma1, $gamma2, $gamma3];
            z = [$z1, $z2, $z3];
            const params = {
                gamma: gamma.join(","), // Convert array to comma-separated string
                G: $G,
                Xmin: $Xmin,
                delSmax: $delSmax,
                delCmax: $delCmax,
                tau: $tau,
                K: $K,
                alpha: $alpha,
                beta: $beta,
                mu: $mu,
                z: z.join(","), // Convert array to comma-separated string
                N: $N,
                foodShort: $foodShort,
                foodShortbegin: $foodShortbegin,
                foodShortend: $foodShortend,
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryString}`,
            );
            const data = response.data;

            // Data from API
            Xhist = data.Xhist;
            Shist = data.Shist;
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;
            Vhist = data.Vhist;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
</script>

<NavBar />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
    Ecosystem Simulation
</h1>

<!-- Instructions -->
<div class="flex max-w-[1200px] flex-col gap-4 p-5 m-auto">
    <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-bold mb-2">Simulation Steps</h2>
        <ul class="list-disc list-inside">
            <li class="mb-2">
                <strong>Step 1:</strong> Observe the behaviors expressed by the male bird. The birds optimize their chances of reproductive success
                by choosing whether to invest on mating effort or parental effort. 
            <li class="mb-2">
                <strong>Step 2:</strong> Use the slider to change the food availability of the simulation. The change in the external environement
                causes the birds to reconsider their trait expression. 
            </li>
            <li class="mb-2">
                <strong>Step 3:</strong> Reference the Offspring Count to compare which bird is experiencing the most reproductive success. 
            </li>
        </ul>
    </div>
    <p class="text-xl font-semibold mt-4">
        Each bird exhibits a unique level of receptor sensitivity, which
        determines their flexiblilty in adapting to external changes. This adaptive capability 
        directly reflects how successful a bird is in producing an offspring.
    </p>
</div>

<div class="flex flex-col justify-center items-center">

</div>


<!-- Run Simulation Button-->
<div class="text-center my-4">
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
        on:click={fetchData}>Run</button
    >
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

    <div>
        <div id="bird1Offspring">Offspring Count: 1</div>

        <div id="bird2Offspring">Offspring Count: 1</div>

        <div id="bird3Offspring">Offspring Count: 1</div>
    </div>
</div>
