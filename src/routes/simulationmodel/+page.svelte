<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import FormInput from "../Nested/FormInput.svelte";
    import NavBar from "../Nested/navigation.svelte";
    import SliderInput from "../Nested/SliderInput.svelte";
    import SliderTwoInput from "../Nested/SliderTwoInput.svelte";
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
        foodShortend
    } from "../data4_store.js";

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

    const apiEndpoint = "http://127.0.0.1:5000"
    //const apiEndpoint = "https://hormonal-pathways-api-a4dcfa854663.herokuapp.com";

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
                foodShortend: $foodShortend
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(
                `${apiEndpoint}/hormonemodel?${queryString}`,
            );
            const data = response.data;

            // Data from API
            Xhist = data.Xhist;
            Shist = data.Shist;
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;
            Vhist = data.Vhist;

            createCharts();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    
    function makeChart(canvas, title, y, color, maxValue) {
        // <block:data:3>
        let chartData = {};
        const is2dArray = (array) => array.every((item) => Array.isArray(item));
        if (is2dArray(y)) {
            let chartDatasets = [];
            for (let i = 0; i < y.length; i++) {
                let data = {
                    label: title + " " + i,
                    data: y[i],
                    borderColor: color,
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
        const totalDuration = canvas == 'sensitivityChart' ? 122 : 4000;
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
            animation,
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
                    title: { display: true, text: "y label" },
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
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance)
            cumulativeFitnessChartInstance.destroy();
        if (traitChartInstance) traitChartInstance.destroy();

        // Create Body Condition Chart
        // bodyConditionChartInstance = makeChart(
        //     "bodyConditionChart",
        //     "Body Condition",
        //     Xhist,
        //     "rgba(75, 192, 192, 1)",
        //     3.5
        // );

        // Create Sensitivity Chart
        // sensitivityChartInstance = makeChart(
        //     "sensitivityChart",
        //     "Sensitivity",
        //     Shist,
        //     "rgba(255, 99, 132, 1)",
        //     2.5
        // );

        // Create Production Chart
        // productionChartInstance = makeChart(
        //     "productionChart",
        //     "Production",
        //     Chist,
        //     "rgba(153, 102, 255, 1)",
        //     10
        // );

        // Create Fitness Chart
        // fitnessChartInstance = makeChart(
        //     "fitnessChart",
        //     "Fitness",
        //     Whist,
        //     "rgba(255, 159, 64, 1)",
        //     1.2
        // );

        // Create Cumulative Fitness Chart
        // cumulativeFitnessChartInstance = makeChart(
        //     "cumulativeFitnessChart",
        //     "Cumulative Fitness",
        //     Wcuml,
        //     "rgba(255, 206, 86, 1)",
        //     20
        // );

        traitChartInstance = makeChart(
            "traitChart",
            "Trait Value",
            Vhist,
            "rgba(210, 155, 90, 1)",
            2.5
        )
    }
</script>

<NavBar multiPage="Single" />

<!-- <nav>
    <a href="/">home</a>
    <a href="/multimodel">multimodel</a>
</nav>-->

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
        <!-- Container for Gamma Sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Selection against effort in trait i (γᵢ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma1}
            />

            <SliderInput
                id="Selection against effort in trait j (γⱼ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma2}
            />
            <!--
            <SliderInput
                id="Selection against effort in each trait k (γₖ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma3}
            />
            -->
        </div>

        <!-- Container for Z sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Weight of first trait (zᵢ)" 
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z1}
            />

            <SliderInput
                id="Weight of second trait (zⱼ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z2}
            />
            <!--
            <SliderInput
                id="Weight of third trait (zₖ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z3}
            />
            -->
        </div>

        <!-- Container for food shortage sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Food Shortage"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$foodShort}
            />

            <SliderTwoInput
                bind:inputVarHigh={$foodShortend}
                bind:maxForVarHigh={$N}
                bind:inputVarLow={$foodShortbegin}
                inputVarHighName="Food Shortage End"
                inputVarLowName="Food Shortage Begin"
                minForVarLow=0
                step=1
            />
        </div>

        <!-- Container for G and mu sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <!--
            <SliderInput 
                id="Min hormone level for gamete maturation (G)" 
                min="0" 
                max="1" 
                step="0.1" 
                bind:inputVar={$G} />
            -->

            <SliderInput
                id="Death probability (µ)"
                min="0"
                max="1"
                step="0.001"
                bind:inputVar={$mu}
            />
        </div>
    </div>

    <!-- Form Inputs-->
    <div class="flex flex-wrap justify-center">
        <!--input for gamma-->
        <!--
        <FormInput
            id="Gamma"
            inputType="text"
            bind:inputVar={$gamma}
        />
        -->

        <!--input for G-->
        <!--
        <FormInput
            id="G"
            inputType="number"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$G}
        />
        -->

        <!--input for Xmin-->
        <!--
        <FormInput
            id="Min energy level for reproduction (xᵣₑₚ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Minimum energy required for the organism to reproduce. Energy available at time, t is determined by energy function"
            bind:inputVar={$Xmin}
        />
        -->

        <FormInput
            id="Max change of sensitivity to hormone (|ΔSᵢ, ₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues"
            bind:inputVar={$delSmax}
        />

        <FormInput
            id="Max change of circulating hormone (|ΔCₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the circulating hormone in an organism"
            bind:inputVar={$delCmax}
        />

        <FormInput
            id="Food availability (τ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Determines the food availible in the environment for the organism. "
            bind:inputVar={$tau}
        />
        <!--
        <FormInput
            id="Michaelis-Menten constant (K)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="A constant used by the Michaelis-Menten Equation. Equal across all tissues."
            bind:inputVar={$K}
        />
        -->

        <FormInput
            id="First parameter of beta distribution (A)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Beta distribution is a function that takes to input variables to determine the shape of the distribution. Takes the form of beta.rvs(A, B) on the backend."
            bind:inputVar={$alpha}
        />

        <FormInput
            id="Second parameter of beta distribution (B)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Beta distribution is a function that takes to input variables to determine the shape of the distribution. Takes the form of beta.rvs(A, B) on the backend."
            bind:inputVar={$beta}
        />

        <!--input for mu-->
        <!--
        <FormInput
            id="Mu"
            inputType="number"
            min="0"
            max="1"
            step="0.001"
            bind:inputVar={$mu}
         />
         -->

        <!--
         <FormInput
            id="Z"
            inputType="text"
            bind:inputVar={$z}
        />
        -->

        <FormInput
            id="Number of reproductive cycles (N)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Number of reproductive cycles the simulation goes through. Once reached, the organism dies."
            bind:inputVar={$N}
        />

        <!--

         <FormInput
            id="Food Short"
            inputType="number"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$foodShort}
         />

         <FormInput
            id="Food Short Begin"
            inputType="number"
            min="0"
            max={$foodShortend}
            step="1"
            bind:inputVar={$foodShortbegin}
         />

         <FormInput
            id="Food Short End"
            inputType="number"
            min="0"
            max={$N}
            step="1"
            bind:inputVar={$foodShortend}
         />
         -->
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
<div class="flex flex-row flex-wrap gap-6 items-center justify-center">
    <!--
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Energy of Organism
        </h2>
        <canvas id="bodyConditionChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Sensitivity to Hormone</h2>
        <canvas id="sensitivityChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Circulating Level Of Hormone </h2>
        <canvas id="productionChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Fitness</h2>
        <canvas id="fitnessChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Cumulative Fitness
        </h2>
        <canvas id="cumulativeFitnessChart"></canvas>
    </div>
    -->
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Trait Values
        </h2>
        <canvas id="traitChart"></canvas>
    </div>
</div>