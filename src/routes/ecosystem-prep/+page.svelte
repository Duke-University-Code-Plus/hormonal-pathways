<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import NavBar from "../Nested/navigation.svelte";
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
        foodShortend
    } from "../data5_store.js";
    import {apiEndpoint} from "../state_store.js"


    let VhistBlue = [];
    let VhistRed = [];
    let VhistPurple = [];
    let VhistBlueRatio = [];
    let VhistRedRatio = [];
    let VhistPurpleRatio = [];

    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3];

    let traitBirdOneChartInstance = null;
    let traitBirdTwoChartInstance = null;
    let traitBirdThreeChartInstance = null;

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        try {
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
                foodShortend: $foodShortend
            };

            // Making 3 Requests to the server in one Fetch

            // Blue Bird

            // Setting gamma a z values to create more weight for parental effort
            // params['gamma'] = [$gamma1, $gamma2, $gamma3].join(",");
            // params['z'] = [$z1, $z2, $z3].join(",");
            params['delSmax'] = $delSmax3;

            const queryStringBlue = new URLSearchParams(params).toString();
            const responseBlue = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryStringBlue}`,
            );
            const dataBlue = responseBlue.data;

            // Red Bird

            // Setting gamma a z values to create more weight for mating effort
            // params['gamma'] = [$gamma1, $gamma3, $gamma2].join(",");
            // params['z'] = [$z1, $z3, $z2].join(",");
            params['delSmax'] = $delSmax1;
            
            const queryStringRed = new URLSearchParams(params).toString();
            const responseRed = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryStringRed}`,
            );
            const dataRed = responseRed.data;
            
            // Purple Bird

            // Setting gamma a z values to put equal weight on each trait
            // params['gamma'] = [$gamma1, $gamma1, $gamma1].join(",");
            // params['z'] = [$z1, $z1, $z1].join(",");
            params['delSmax'] = $delSmax2;

            const queryStringPurple = new URLSearchParams(params).toString();
            const responsePurple = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryStringPurple}`,
            );
            const dataPurple = responsePurple.data;

            // Making the bird data
            VhistBlue = dataBlue.Vhist;
            VhistRed = dataRed.Vhist;
            VhistPurple = dataPurple.Vhist;

            // Making the Bird Ratios
            for (let i = 0; i < VhistBlue[0].length; i++) {
                    VhistBlueRatio.push(VhistBlue[1][i]/VhistBlue[2][i]);
                    VhistRedRatio.push(VhistRed[1][i]/VhistRed[2][i]);
                    VhistPurpleRatio.push(VhistPurple[1][i]/VhistPurple[2][i]);
                }

            // RATIOS OUTPUT TO CONSOLE
            console.log(VhistBlueRatio);
            console.log(VhistRedRatio);
            console.log(VhistPurpleRatio);            

            createCharts();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    
    function makeChart(canvas, title, y, color, maxValue, ylabel) {
        // <block:data:3>
        let color_pool = [[216, 27, 96], 
                          [9, 224, 188], 
                          [124, 181, 24]]
        let chartData = {};
        const is2dArray = (array) => array.every((item) => Array.isArray(item));
        if (is2dArray(y)) {
            let chartDatasets = [];
            for (let i = 0; i < y.length; i++) {
                color = color_pool[i]
                let r = color[0];
                let g = color[1];
                let b = color[2];
                let data = {
                    label: title + " " + i,
                    data: y[i],
                    borderColor: "rgba(" + r + ", " + g + ", " + b + ", 1)",
                    radius: 0,
                    borderWidth: 1,
                    fill: false,
                    lineTension: .5,
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
                lineTension: .5,
            };
            chartData = {
                labels: Array.from({ length: y.length }, (_, i) => i),
                datasets: [data],
            };
        }

        let ctx = document.getElementById(canvas) //.getContext("2d");
        if (!ctx) {
            console.error(`Canvas element with ID ${canvas} not found`)
        }
        // </block:data>


        // <block:animation:2>
        const render = [];

        for (let i = 0; i < y.length; i++) {
            render.push({x: i, y: y[i]});
        }
        //ratio for sensitvity graphs is ? 1 : 32.78
        //const totalDuration = 2800;
        const totalDuration = canvas == 'sensitivityChart' || canvas == 'traitChart' ? 122 : 4000;
        const delayBetweenPoints = totalDuration / render.length;

        const previousY = (ctx) => ctx.index === 0 
                ? ctx.chart.scales.y.getPixelForValue(100) 
                : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

        const animation = {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
                }
            }
        };
        // </block:animation>

        // <block:chartOptions:1>
        const chartOptions = {
            //animation,
            interaction: {
                intersect: false
            },
            plugins: {
                display:{
                    legend: true
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: ylabel },
                    max: maxValue
                },
            },
        };
        // </block:chartOptions>

        // <block:config:0>
        const config = {
            type: 'line',
            data: chartData,
            options: chartOptions
        };
        // </block:config>

        return new Chart(ctx, config);
    }

    function createCharts() {
        // Destroy existing charts if they exist
        if (traitBirdOneChartInstance) traitBirdOneChartInstance.destroy();
        if (traitBirdTwoChartInstance) traitBirdTwoChartInstance.destroy();
        if (traitBirdThreeChartInstance) traitBirdThreeChartInstance.destroy();

        traitBirdOneChartInstance = makeChart(
            "traitChartBirdOne",
            "Trait Value",
            VhistBlue,
            "rgba(210, 155, 90, 1)",
            5,
            "Trait Values - Blue Bird"
        )

        traitBirdTwoChartInstance = makeChart(
            "traitChartBirdTwo",
            "Trait Value",
            VhistRed,
            "rgba(210, 155, 90, 1)",
            5,
            "Trait Values - Red Bird"
        )

        traitBirdThreeChartInstance = makeChart(
            "traitChartBirdThree",
            "Trait Value",
            VhistPurple,
            "rgba(210, 155, 90, 1)",
            5,
            "Trait Values - Purple Bird"
        )

    }
</script>

<NavBar multiPage="Single" />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Hormone Model - Single Run
</h1>

<!--Input Parameters -->
<div class="flex flex-wrap justify-center">
    <div
        class="flex flex-wrap justify-center grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1"
    >
        <!-- Container for food shortage sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Food Availability Multiplier"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$foodShort}
                modalMessage="A multiplier of current food. The lower the value, the lower the food available to the organism."
            />
        </div>
    </div>

    <div class="flex flex-wrap justify-center">
        <SliderInput
            id="Max change of sensitivity to hormone - Blue Bird"
            min="0.01"
            max=".5"
            step="0.01"
            bind:inputVar={$delSmax3}
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues"
        />

        <SliderInput
            id="Max change of sensitivity to hormone - Purple Bird"
            min="0.01"
            max=".5"
            step="0.01"
            bind:inputVar={$delSmax2}
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues"
        />

        <SliderInput
            id="Max change of sensitivity to hormone - Red Bird"
            min="0.01"
            max=".5"
            step="0.01"
            bind:inputVar={$delSmax1}
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues"
        />
    </div>
</div>

<!-- Run Simulation Button-->
<div class="text-center my-4">
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
        on:click={fetchData}>Run</button
    >
</div>

<!-- Creating Charts-->
<div class="flex flex-row flex-wrap gap-6 items-center justify-center mb-8">     
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Trait Values - Blue Bird
        </h2>
        <canvas id="traitChartBirdOne"></canvas>
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
            Trait Values - Red Bird
        </h2>
        <canvas id="traitChartBirdTwo"></canvas>
    </div> 
    
</div>