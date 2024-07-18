<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import FormInput from "../Nested/FormInput.svelte";
    import NavBar from "../Nested/navigation.svelte";
    import SliderInput from "../Nested/SliderInput.svelte";
    import TissueSim from "./TissueSim.svelte";
    import { writable } from "svelte/store";
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
    import {
        gamma1_tissue,
        gamma2_tissue,
        gamma3_tissue,
        hormoneCount,
        currRate1,
        currRate2,
        currRate3,
        receptorsBound1,
        receptorsBound2,
        receptorsBound3
    } from "../tissue_store";

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];
    let Vhist = [];

    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3];

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;
    let traitChartInstance = null;

    let canvas1 = "gamma1_tissue";
    let canvas2 = "gamma2_tissue";
    let canvas3 = "gamma3_tissue";

    onMount(() => {
        fetchData();
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
            console.log(Shist);
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;
            Vhist = data.Vhist;

            //createCharts();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // function makeChart(canvas, title, y, color, maxValue) {
    //     // <block:data:3>
    //     let chartData = {};
    //     const is2dArray = (array) => array.every((item) => Array.isArray(item));
    //     if (is2dArray(y)) {
    //         let chartDatasets = [];
    //         for (let i = 0; i < y.length; i++) {
    //             let data = {
    //                 label: title + " " + i,
    //                 data: y[i],
    //                 borderColor: color,
    //                 radius: 0,
    //                 borderWidth: 1,
    //                 fill: false,
    //                 lineTension: 0.5,
    //             };
    //             chartDatasets.push(data);
    //         }
    //         chartData = {
    //             labels: Array.from({ length: y[0].length }, (_, i) => i),
    //             datasets: chartDatasets,
    //         };
    //     } else {
    //         let data = {
    //             label: title,
    //             data: y,
    //             borderColor: color,
    //             radius: 0,
    //             borderWidth: 1,
    //             fill: false,
    //             lineTension: 0.5,
    //         };
    //         chartData = {
    //             labels: Array.from({ length: y.length }, (_, i) => i),
    //             datasets: [data],
    //         };
    //     }

    //     let ctx = document.getElementById(canvas); //.getContext("2d");
    //     if (!ctx) {
    //         console.error(`Canvas element with ID ${canvas} not found`);
    //     }
    //     // </block:data>

    //     // <block:animation:2>
    //     const render = [];

    //     for (let i = 0; i < y.length; i++) {
    //         render.push({ x: i, y: y[i] });
    //     }
    //     //ratio for sensitvity graphs is ? 1 : 32.78
    //     //const totalDuration = 2800;
    //     const totalDuration =
    //         canvas == "sensitivityChart" || canvas == "traitChart" ? 122 : 4000;
    //     const delayBetweenPoints = totalDuration / render.length;

    //     const previousY = (ctx) =>
    //         ctx.index === 0
    //             ? ctx.chart.scales.y.getPixelForValue(100)
    //             : ctx.chart
    //                   .getDatasetMeta(ctx.datasetIndex)
    //                   .data[ctx.index - 1].getProps(["y"], true).y;

    //     const animation = {
    //         x: {
    //             type: "number",
    //             easing: "linear",
    //             duration: delayBetweenPoints,
    //             from: NaN, // the point is initially skipped
    //             delay(ctx) {
    //                 if (ctx.type !== "data" || ctx.xStarted) {
    //                     return 0;
    //                 }
    //                 ctx.xStarted = true;
    //                 return ctx.index * delayBetweenPoints;
    //             },
    //         },
    //         y: {
    //             type: "number",
    //             easing: "linear",
    //             duration: delayBetweenPoints,
    //             from: previousY,
    //             delay(ctx) {
    //                 if (ctx.type !== "data" || ctx.yStarted) {
    //                     return 0;
    //                 }
    //                 ctx.yStarted = true;
    //                 return ctx.index * delayBetweenPoints;
    //             },
    //         },
    //     };
    //     // </block:animation>

    //     // <block:chartOptions:1>
    //     const chartOptions = {
    //         animation,
    //         interaction: {
    //             intersect: false,
    //         },
    //         plugins: {
    //             display: {
    //                 legend: true,
    //             },
    //         },
    //         scales: {
    //             x: {
    //                 type: "linear",
    //                 beginAtZero: true,
    //                 title: { display: true, text: "Reproductive Cycle" },
    //                 max: $N,
    //             },
    //             y: {
    //                 beginAtZero: true,
    //                 title: { display: true, text: "y label" },
    //                 max: maxValue,
    //             },
    //         },
    //     };
    //     // </block:chartOptions>

    //     // <block:config:0>
    //     const config = {
    //         type: "line",
    //         data: chartData,
    //         options: chartOptions,
    //     };
    //     // </block:config>

    //     return new Chart(ctx, config);
    // }

    // function createCharts() {
    //     // Destroy existing charts if they exist
    //     if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
    //     if (sensitivityChartInstance) sensitivityChartInstance.destroy();
    //     if (productionChartInstance) sensitivityChartInstance.destroy();
    //     if (fitnessChartInstance) sensitivityChartInstance.destroy();
    //     if (cumulativeFitnessChartInstance)
    //         cumulativeFitnessChartInstance.destroy();
    //     if (traitChartInstance) traitChartInstance.destroy();

    //     // Create Sensitivity Chart
    //     sensitivityChartInstance = makeChart(
    //         "sensitivityChart",
    //         "Sensitivity",
    //         Shist,
    //         "rgba(255, 99, 132, 1)",
    //         20,
    //     );

    //     // Create Production Chart
    //     productionChartInstance = makeChart(
    //         "productionChart",
    //         "Production",
    //         Chist,
    //         "rgba(153, 102, 255, 1)",
    //         20,
    //     );

    //     traitChartInstance = makeChart(
    //         "traitChart",
    //         "Trait Value",
    //         Vhist,
    //         "rgba(210, 155, 90, 1)",
    //         20,
    //     );
    // }

    function fakeReturnData() {
        console.log("Button clicked");
        $gamma1_tissue = 5;
        $gamma2_tissue = 3;
        $gamma3_tissue = 9;
        $hormoneCount = 20;
    }

    function returnData() {
        //will call billys function here which updates tissue-stores based on delSmax and gamma vals?
        $gamma1_tissue = 5;
        $gamma2_tissue = 3;
        $gamma3_tissue = 9;
        $hormoneCount = 20;
    }

    function reset() {
        //tissueSimKey += 1;
        $gamma1_tissue = 0;
        $gamma2_tissue = 0;
        $gamma3_tissue = 0;
        $hormoneCount = 0;
    }

    let selectedBird = null;

    function updateSmax(bird) {
        console.log("bird button clicked", bird);
        //reset();
        selectedBird = bird;
        // if (bird == 1) {
        //     $delSmax = 10;
        // } else if (bird == 2) {
        //     $delSmax = 20;
        // } else if (bird == 3) {
        //     $delSmax = 30;
        // }
    }
</script>

<NavBar multiPage="Single" />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Simulations
</h1>

<!--Input Parameters -->
<!-- <div class="flex flex-wrap justify-center flex-row">
    <div
        class="flex flex-wrap justify-center grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1"
    >
        <div class="flex flex-wrap justify-center w-full flex-col">
            <SliderInput
                id="Selection against effort in trait i (γᵢ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma1}
                modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            />

            <SliderInput
                id="Selection against effort in trait j (γⱼ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma2}
                modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the second trait."
            />

            <SliderInput
                id="Selection against effort in trait k (γₖ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma3}
            />
        </div>
    </div>
    <div class="flex flex-wrap justify-center items-center">
        <FormInput
            id="Max change of sensitivity to hormone (|ΔSᵢ, ₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues. The organism maximizes its lifetime success by finding the optimal level of the |ΔSᵢ, ₘₐₓ| at a given target."
            bind:inputVar={$delSmax}
        />
    </div>
</div> -->

<!-- Creating Charts-->
<!-- <div class="flex flex-row flex-wrap gap-6 items-center justify-center">
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Sensitivity to Hormone
        </h2>
        <canvas id="sensitivityChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Circulating Level Of Hormone
        </h2>
        <canvas id="productionChart"></canvas>
    </div>

    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Trait Values</h2>
        <canvas id="traitChart"></canvas>
    </div>
</div> -->

<!-- <button on:click={fakeReturnData}>Fake Data Update</button> -->

<div class="flex flex-row, flex-wrap justify-center">
    <SliderInput
        id="hormoneCount"
        min="0"
        max="30"
        step="1"
        bind:inputVar={$hormoneCount}
        modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
    />
</div>

<!-- Bird buttons -->
<div class=" flex space-x-2 justify-center">
    <button
        class="px-4 py-2 border rounded transition-colors duration-200"
        class:bg-gray-400={selectedBird === 1}
        class:text-white={selectedBird === 1}
        class:bg-white={selectedBird !== 1}
        class:text-black={selectedBird !== 1}
        on:click={() => updateSmax(1)}
    >
        Bird 1
    </button>
    <button
        class="px-4 py-2 border rounded transition-colors duration-200"
        class:bg-gray-400={selectedBird === 2}
        class:text-white={selectedBird === 2}
        class:bg-white={selectedBird !== 2}
        class:text-black={selectedBird !== 2}
        on:click={() => updateSmax(2)}
    >
        Bird 2
    </button>
    <button
        class="px-4 py-2 border rounded transition-colors duration-200"
        class:bg-gray-400={selectedBird === 3}
        class:text-white={selectedBird === 3}
        class:bg-white={selectedBird !== 3}
        class:text-black={selectedBird !== 3}
        on:click={() => updateSmax(3)}
    >
        Bird 3
    </button>
</div>

<!-- Run Simulation Button-->
<div class="text-center my-4">
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
        on:click={returnData}>Run</button
    >
</div>

<!-- Simulations -->
<div class="flex flex-row flex-wrap items-center justify-center p-5 space-x-10">
    <div class="flex flex-col justify-center">
        <h2 class="text-center text-xl font-semibold">
            Gamete Maturation <em>(V<sub>g</sub> ,<sub>t</sub>)</em>
        </h2>
        <div class="rounded-lg overflow-hidden shadow-md my-5">
            <TissueSim canvas={canvas1}/>
            <p>Current Rate: {$currRate1} receptors bound/min</p>
            <p>Total Number of Receptors Bound: {$receptorsBound1}</p>
        </div>
        <SliderInput
            id="gamma1_tissue"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma1_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
        />
    </div>

    <div class="flex flex-col">
        <h2 class="text-center text-xl font-semibold">
            Parental Effort <em>(V<sub>m</sub> ,<sub>t</sub>)</em>
        </h2>
        <div class="rounded-lg overflow-hidden shadow-md my-5">
            <TissueSim canvas={canvas2}/>
            <p>Current Rate: {$currRate2} receptors bound/min</p>
            <p>Total Number of Receptors Bound: {$receptorsBound2}</p>
        </div>
        <SliderInput
            id="gamma2_tissue"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma2_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
        />
    </div>

    <div class="flex flex-col">
        <h2 class="text-center text-xl font-semibold">
            Mating Effort <em>(V<sub>p</sub> ,<sub>t</sub>)</em>
        </h2>
        <div class="rounded-lg overflow-hidden shadow-md my-5">
            <TissueSim canvas={canvas3}/>
            <p>Current Rate: {$currRate3} receptors bound/min</p>
            <p>Total Number of Receptors Bound: {$receptorsBound3}</p>
        </div>
        <SliderInput
            id="gamma3_tissue"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma3_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
        />
    </div>
</div>
