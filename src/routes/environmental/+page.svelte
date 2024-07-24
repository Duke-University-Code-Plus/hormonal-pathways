<script>
    let showFitnessCharts = false;
    let showFoodScarcitySlider = false;
    let modelRan = false;

    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import SliderInput from "../Nested/SliderInput.svelte";
    import {
        gamma1,
        gamma2,
        gamma3,
        G,
        Xmin,
        delSmax1,
        delSmax2,
        delSmax3,
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
    } from "../data5_store.js";
    import { apiEndpoint, rootURL } from "../state_store.js";

    let iframe;

    let VhistBlue = [];
    let VhistRed = [];
    let VhistPurple = [];
    let WhistBlue = [];
    let WhistRed = [];
    let WhistPurple = [];

    let VhistBlueRatio = [];
    let VhistRedRatio = [];
    let VhistPurpleRatio = [];

    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3];

    let traitBirdOneChartInstance = null;
    let traitBirdTwoChartInstance = null;
    let traitBirdThreeChartInstance = null;
    let fitnessBirdOneChartInstance = null;
    let fitnessBirdTwoChartInstance = null;
    let fitnessBirdThreeChartInstance = null;

    onMount(() => {
        //listen for iframe
        window.onmessage = function (e) {
            window.message = JSON.parse(e.data);
            window.message1 = window.message[0]; //name of bird
            window.message2 = window.message[1]; //num of offspring
            window.message3 = window.message[2]; //cumulative mating effort
            window.message4 = window.message[3]; //cumulative parental effort
            window.message5 = window.message[4]; //ratio of mating effort
            window.message6 = window.message[5]; //ratio of parental effort
            window.message7 = window.message[6]; //reproductive cycle

            const element1 = document.getElementById(
                window.message1 + "Offspring",
            );
            const element2 = document.getElementById(
                window.message1 + "Mating",
            );
            const element3 = document.getElementById(
                window.message1 + "Parental",
            );
            const element4 = document.getElementById(
                window.message1 + "Ratio",
            );
            const element5 = document.getElementById(
                "reproductiveCycle",
            );
            element1.innerHTML = window.message2;
            //element2.innerHTML = window.message3;
            //element3.innerHTML = window.message4;
            element4.innerHTML = window.message5 + " : " + window.message6;
            element5.innerHTML = "Reproductive Cycle: " + window.message7;
        };
    });



    async function fetchData() {
        try {
            modelRan = true;

            gamma = [$gamma1, $gamma2, $gamma3];
            z = [$z1, $z2, $z3];
            var params = {
                gamma: gamma.join(","), // Convert array to comma-separated string
                G: $G,
                Xmin: $Xmin,
                delSmax: $delSmax3,
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

            // Making 3 Requests to the server in one Fetch

            // Blue Bird
            // Setting gamma a z values to create more weight for parental effort
            params["gamma"] = [$gamma1, $gamma2, $gamma3].join(",");
            params["z"] = [$z1, $z2, $z3].join(",");
            params["delSmax"] = $delSmax3;

            const queryStringBlue = new URLSearchParams(params).toString();
            const responseBlue = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryStringBlue}`,
            );
            const dataBlue = responseBlue.data;

            // Red Bird

            // Setting gamma a z values to create more weight for mating effort
            // params['gamma'] = [$gamma1, $gamma3, $gamma2].join(",");
            // params['z'] = [$z1, $z3, $z2].join(",");
            params["delSmax"] = $delSmax1;

            const queryStringRed = new URLSearchParams(params).toString();
            const responseRed = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryStringRed}`,
            );
            const dataRed = responseRed.data;

            // Purple Bird

            // Setting gamma a z values to put equal weight on each trait
            // params['gamma'] = [$gamma1, $gamma1, $gamma1].join(",");
            // params['z'] = [$z1, $z1, $z1].join(",");
            params["delSmax"] = $delSmax2;

            const queryStringPurple = new URLSearchParams(params).toString();
            const responsePurple = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryStringPurple}`,
            );
            const dataPurple = responsePurple.data;

            // Making the bird data
            VhistBlue = dataBlue.Vhist;
            VhistRed = dataRed.Vhist;
            VhistPurple = dataPurple.Vhist;
            WhistBlue = dataBlue.Whist;
            WhistRed = dataRed.Whist;
            WhistPurple = dataPurple.Whist;

            // Making the Bird Ratios
            for (let i = 0; i < VhistBlue[0].length; i++) {
                VhistRedRatio.push(
                    VhistRed[1][i] / (VhistRed[1][i] + VhistRed[2][i]),
                );
                VhistPurpleRatio.push(
                    VhistPurple[1][i] / (VhistPurple[1][i] + VhistPurple[2][i]),
                );
                VhistBlueRatio.push(
                    VhistBlue[1][i] / (VhistBlue[1][i] + VhistBlue[2][i]),
                );
            }

            createCharts();

            iframe = document.querySelector("#iframeID"); //caching dom element called iframe
            const proportiondata = [
                "proportion",
                VhistRedRatio,
                VhistPurpleRatio,
                VhistBlueRatio,
            ];
            iframe.contentWindow.postMessage(
                JSON.stringify(proportiondata),
                "*",
            ); // pushes message to the

            modelRan = true;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function makeChart(canvas, title, y, legendTitles, color, maxValue, ylabel) {
        // <block:data:3>
        let color_pool = [
            [216, 27, 96],
            [9, 224, 188],
            [124, 181, 24],
        ];
        let chartData = {};
        const is2dArray = (array) => array.every((item) => Array.isArray(item));
        if (is2dArray(y)) {
            let chartDatasets = [];
            //start at 1 to exclude gamete maturation data from graphs
            //order of data is gamete maturation, parental effort, an dmating effort
            for (let i = 1; i < y.length; i++) {
                color = color_pool[i];
                let r = color[0];
                let g = color[1];
                let b = color[2];
                let data = {
                    label: legendTitles[i],
                    data: y[i],
                    borderColor: "rgba(" + r + ", " + g + ", " + b + ", 1)",
                    radius: 0,
                    borderWidth: 1,
                    fill: false,
                    lineTension: 0.5,
                };
                chartDatasets.push(data);
            }
            chartData = {
                labels: Array.from({ length: y[0].length }, (_, i) => i),
                datasets: chartDatasets,
            };
        } else {
            let data = {
                label: title,
                data: y,
                borderColor: color,
                radius: 0,
                borderWidth: 1,
                fill: false,
                lineTension: 0.5,
            };
            chartData = {
                labels: Array.from({ length: y.length }, (_, i) => i),
                datasets: [data],
            };
        }

        let ctx = document.getElementById(canvas); //.getContext("2d");
        if (!ctx) {
            console.error(`Canvas element with ID ${canvas} not found`);
        }
        // </block:data>

        // <block:animation:2>
        const render = [];

        for (let i = 0; i < y.length; i++) {
            render.push({ x: i, y: y[i] });
        }
        //ratio for sensitvity graphs is ? 1 : 32.78
        //const totalDuration = 2000;
        const totalDuration =
            canvas == "traitChartBirdThree" ||
            canvas == "traitChartBirdOne" ||
            canvas == "traitChartBirdTwo"
                ? 245
                : 4000;
        const delayBetweenPoints = totalDuration / render.length;

        const previousY = (ctx) =>
            ctx.index === 0
                ? ctx.chart.scales.y.getPixelForValue(100)
                : ctx.chart
                      .getDatasetMeta(ctx.datasetIndex)
                      .data[ctx.index - 1].getProps(["y"], true).y;

        const animation = {
            x: {
                type: "number",
                easing: "linear",
                duration: delayBetweenPoints,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                    if (ctx.type !== "data" || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                },
            },
            y: {
                type: "number",
                easing: "linear",
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                    if (ctx.type !== "data" || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                },
            },
        };
        // </block:animation>

        // <block:chartOptions:1>
        const chartOptions = {
            animation,
            interaction: {
                intersect: false,
            },
            plugins: {
                display: {
                    legend: true,
                },
            },
            scales: {
                x: {
                    type: "linear",
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: ylabel },
                    max: maxValue,
                },
            },
        };
        // </block:chartOptions>

        // <block:config:0>
        const config = {
            type: "line",
            data: chartData,
            options: chartOptions,
        };
        // </block:config>

        return new Chart(ctx, config);
    }

    function createCharts() {
        // Destroy existing charts if they exist
        if (traitBirdOneChartInstance) traitBirdOneChartInstance.destroy();
        if (traitBirdTwoChartInstance) traitBirdTwoChartInstance.destroy();
        if (traitBirdThreeChartInstance) traitBirdThreeChartInstance.destroy();
        if (fitnessBirdOneChartInstance) fitnessBirdOneChartInstance.destroy();
        if (fitnessBirdTwoChartInstance) fitnessBirdTwoChartInstance.destroy();
        if (fitnessBirdThreeChartInstance)
            fitnessBirdThreeChartInstance.destroy();

        traitBirdOneChartInstance = makeChart(
            "traitChartBirdOne",
            "Trait Value",
            VhistBlue,
            ["Gamete Maturation", "Parental Effort", "Mating Effort"],
            "rgba(210, 155, 90, 1)",
            5,
            "Trait Values - Blue Bird",
        );

        traitBirdTwoChartInstance = makeChart(
            "traitChartBirdTwo",
            "Trait Value",
            VhistRed,
            ["Gamete Maturation", "Parental Effort", "Mating Effort"],
            "rgba(210, 155, 90, 1)",
            5,
            "Trait Values - Red Bird",
        );

        traitBirdThreeChartInstance = makeChart(
            "traitChartBirdThree",
            "Trait Value",
            VhistPurple,
            ["Gamete Maturation", "Parental Effort", "Mating Effort"],
            "rgba(210, 155, 90, 1)",
            5,
            "Trait Values - Purple Bird",
        );

        if (showFitnessCharts) {
            fitnessBirdOneChartInstance = makeChart(
                "fitnessChartBirdOne",
                "Fitness",
                WhistBlue,
                ["Gamete Maturation", "Parental Effort", "Mating Effort"],
                "rgba(210, 155, 90, 1)",
                5,
                "Fitness - Purple Bird",
            );

            fitnessBirdTwoChartInstance = makeChart(
                "fitnessChartBirdTwo",
                "Fitness",
                WhistRed,
                ["Gamete Maturation", "Parental Effort", "Mating Effort"],
                "rgba(210, 155, 90, 1)",
                5,
                "Fitness - Red Bird",
            );

            fitnessBirdThreeChartInstance = makeChart(
                "fitnessChartBirdThree",
                "Fitness",
                WhistPurple,
                ["Gamete Maturation", "Parental Effort", "Mating Effort"],
                "rgba(210, 155, 90, 1)",
                5,
                "Fitness - Purple Bird",
            );
        }
    }
</script>

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Environmental Simulation
</h1>

<!-- Instructions -->
<div class="flex max-w-[1200px] flex-col gap-4 px-5 pb-5 m-auto">
    <p class="text-xl font-medium">
        Each bird differs in their capability to change their receptor sensitivity to hormones. 
        This ability allows birds to flexibly change the magntitude of their reaction with hormones, 
        leading to their optimal adaptation to external changes. A bird's maximum capacity to change 
        their sensitivity to hormones directly reflects how successful a bird is in producing an offspring
         in every reproductive cycle.
    </p>
    <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-bold mb-2">Recommended Exploration Steps</h2>
        <ul class="list-disc list-inside">
            <li class="mb-2">
                <strong>Step 1:</strong> Use the sliders below each bird to adjust their 
                ability to change hormone sensitivity. 
            </li>
            <li class="mb-2">
                <strong>Step 2:</strong> 
                Observe the behaviors expressed by the male
                birds. The birds optimize their chances of reproductive success by
                choosing whether to exhibit mating or parental behavior depending on 
                their external conditions.
            </li>
            <li class="mb-2">
                <strong>Step 3:</strong> Reference the table and graphs below. Compare a bird's Number 
                of Offspring to distinguish a bird's reproductive success. The Ratio between 
                Parental and Mating Effort represents which behavior a bird is attempting to prioritize 
                at each reproductive cycle. 
            </li>
        </ul>
    </div>
</div>

<div class="flex justify-center">
    <div class="flex flex-col items-center m-5">
        <h4 class="text-center text-base font-semibold">
            Low Ability to Change Hormone Sensitivity
        </h4>
        <img
            src="/bird_red.png"
            alt="Red Bird"
            class="w-16 h-16 object-cover"
        />

        <SliderInput
            id="Max change of sensitivity"
            min="0.01"
            max="1"
            step="0.01"
            bind:disabled={modelRan}
            bind:inputVar={$delSmax1}
            modalMessage="Changes the way the bird optimizes fitness. For the red bird, it will reach its hormonal optimum realy slowly compared to all other birds. It will invest in its most valued trait in near the end of the simulation or not at all. The max change of sensitivity is the maximum change a bird can change its sensitivity which also helps it adapt to its environment."
        />
    </div>

    <div class="flex flex-col items-center m-5">
        <h4 class="text-center text-base font-semibold">
            Average Ability to Change Hormone Sensitivity
        </h4>
        <img
            src="/bird_purple.png"
            alt="Purple Bird"
            class="w-16 h-16 object-cover"
        />

        <SliderInput
            id="Max change of sensitivity"
            min="0.01"
            max="1"
            step="0.01"
            bind:disabled={modelRan}
            bind:inputVar={$delSmax2}
            modalMessage="Changes the way the bird optimizes fitness. For the purple bird, it will reach its hormonal optimum relatively quickly compared to the red bird, but not as fast as the blue bird. It will invest in its most valued trait in near the middle of the simulation. The max change of sensitivity is the maximum change a bird can change its sensitivity which also helps it adapt to its environment."
        />
    </div>

    <div class="flex flex-col items-center m-5">
        <h4 class="text-center text-base font-semibold">
            High Ability to Change Hormone Sensitivity
        </h4>
        <img
            src="/bird_blue.png"
            alt="Blue Bird"
            class="w-16 h-16 object-cover"
        />

        <SliderInput
            id="Max change of sensitivity"
            min="0.01"
            max="1"
            step="0.01"
            bind:disabled={modelRan}
            bind:inputVar={$delSmax3}
            modalMessage="Changes the way the bird optimizes fitness. For the blue bird, it will reach its hormonal optimum faster, so it will invest in its most valued trait early on. The max change of sensitivity is the maximum change a bird can change its sensitivity which also helps it adapt to its environment."
        />
    </div>
</div>

{#if showFoodScarcitySlider}
    <div
        class="flex flex-wrap justify-center grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1"
    >
        <!-- Container for food shortage sliders-->
        <div class="flex flex-wrap justify-center w-full -mt-5">
            <SliderInput
                id="Food Scarcity"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$foodShort}
                modalMessage="Controls the worms available to the birds. The lower the value, the lower the food available to the organism."
            />
        </div>
    </div>
{/if}

<!-- Run Simulation Button -->
<div class="text-center -mt-4 mb-6">

    <!-- Run Simulation Button -->
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded {modelRan
            ? 'disable'
            : ''}"
        on:click={fetchData}>Run</button
    >
</div>


<div>

</div>
<!-- Animation stuff-->
<div class="flex flex-col gap-6 items-center justify-center mb-8">
    <!-- Reproductive Cycle Box -->
    <div class="">
        <span id="reproductiveCycle" class="text-center text-base font-semibold">Reproductive Cycle: 0</span>
    </div>

    <div class="rounded-container">
        <iframe
            width="800"
            height="590"
            src="{$rootURL}/ecosystem-sketch"
            id="iframeID"
            title="YouTube video player"
            frameborder="0"
            class="rounded-iframe"
        ></iframe>
    </div>
</div>

    <div class="container mx-auto mb-8">

        {#if modelRan}
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead class="bg-gray-200">
              <tr>
                <th class="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Color of Bird</th>
                <th class="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Number of Offspring</th>
                
                <!-- <th class="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Mate count</th>
                <th class="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Parental count</th> -->
                <th class="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Ratio between Parental <br> and Mating Effort</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="hover:bg-gray-100">
                <td class="py-2 px-4 text-sm text-gray-700">Red</td>
                <td id="bird1Offspring" class="py-2 px-4 text-sm text-gray-700">0</td>
                <!-- <td id="bird1Mating" class="py-2 px-4 text-sm text-gray-700">0</td>
                <td id="bird1Parental" class="py-2 px-4 text-sm text-gray-700">0</td> -->
                <td id="bird1Ratio" class="py-2 px-4 text-sm text-gray-700">0</td>
              </tr>
              <tr class="hover:bg-gray-100">
                <td class="py-2 px-4 text-sm text-gray-700">Purple</td>
                <td id="bird2Offspring" class="py-2 px-4 text-sm text-gray-700">0</td>
                <!-- <td id="bird2Mating" class="py-2 px-4 text-sm text-gray-700">0</td>
                <td id="bird2Parental" class="py-2 px-4 text-sm text-gray-700">0</td> -->
                <td id="bird2Ratio" class="py-2 px-4 text-sm text-gray-700">0</td>
              </tr>
              <tr class="hover:bg-gray-100">
                <td class="py-2 px-4 text-sm text-gray-700">Blue</td>
                <td id="bird3Offspring" class="py-2 px-4 text-sm text-gray-700">0</td>
                <!-- <td id="bird3Mating" class="py-2 px-4 text-sm text-gray-700">0</td>
                <td id="bird3Parental" class="py-2 px-4 text-sm text-gray-700">0</td> -->
                <td id="bird3Ratio" class="py-2 px-4 text-sm text-gray-700">0</td>
              </tr>
              <!-- Add more rows as needed -->
            </tbody>
          </table>
        </div>
        {/if}
    </div>


<!-- Creating Charts-->
<div class="flex flex-row flex-wrap gap-6 items-center justify-center mb-8">
    {#if modelRan}

    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Trait Values - Red Bird
        </h2>
        <canvas id="traitChartBirdTwo"></canvas>
    </div>

    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Trait Values - Purple Bird
        </h2>
        <canvas id="traitChartBirdThree"></canvas>
    </div>

    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Trait Values - Blue Bird
        </h2>
        <canvas id="traitChartBirdOne"></canvas>
    </div>
    {/if}

    {#if showFitnessCharts}
        <div
            class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
        >
            <h2 class="text-center text-xl font-semibold mb-4">
                Fitness - Red Bird
            </h2>
            <canvas id="fitnessChartBirdTwo"></canvas>
        </div>

        <div
            class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
        >
            <h2 class="text-center text-xl font-semibold mb-4">
                Fitness - Purple Bird
            </h2>
            <canvas id="fitnessChartBirdThree"></canvas>
        </div>

        <div
            class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
        >
            <h2 class="text-center text-xl font-semibold mb-4">
                Fitness - Blue Bird
            </h2>
            <canvas id="fitnessChartBirdOne"></canvas>
        </div>
    {/if}

</div>

<style>
    .rounded-container {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Adjust shadow as needed */
        width: 800px; /* Explicitly set width */
        height: 520px; /* Explicitly set height */
    }

    .rounded-iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 12px;
    }
</style>
