<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart, { registerables } from "chart.js/auto";
    import ExportChart from "../Nested/ExportChart.svelte";
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
    } from "../data_store.js";
    import {apiEndpoint} from "../state_store.js"
    import {chartDescriptions} from "../message_store.js"

    let exportChartComponent;

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];
    //let Vhist = [];

    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3];

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;
    //let traitChartInstance = null;

    let chartMessage1 = '';

    let exportData1 = '';
    // let exportData2 = '';
    // let exportData3 = '';
    // let exportData4 = '';
    // let exportData5 = '';

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
                `${$apiEndpoint}/hormonemodel?${queryString}`,
            );
            const data = response.data;

            // Data from API
            Xhist = data.Xhist;
            Shist = data.Shist;
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;
            //Vhist = data.Vhist;

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

        let ctx = document.getElementById(canvas).getContext("2d");
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
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance)
            cumulativeFitnessChartInstance.destroy();
        //if (traitChartInstance) traitChartInstance.destroy();

        // Create Body Condition Chart
        bodyConditionChartInstance = makeChart(
            "bodyConditionChart",
            "Body Condition",
            Xhist,
            "rgba(75, 192, 192, 1)",
            20,
            "Energy of the organism"
        );

        // Create Sensitivity Chart
        sensitivityChartInstance = makeChart(
            "sensitivityChart",
            "Sensitivity",
            Shist,
            "rgba(255, 99, 132, 1)",
            20,
            "Sensitivity to hormone"
        );

        // Create Production Chart
        productionChartInstance = makeChart(
            "productionChart",
            "Production",
            Chist,
            "rgba(153, 102, 255, 1)",
            20,
            "Hormone concentration"
        );

        // Create Fitness Chart
        fitnessChartInstance = makeChart(
            "fitnessChart",
            "Fitness",
            Whist,
            "rgba(255, 159, 64, 1)",
            10,
            "Fitness"
        );

        // Create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = makeChart(
            "cumulativeFitnessChart",
            "Cumulative Fitness",
            Wcuml,
            "rgba(255, 206, 86, 1)",
            150,
            "Accumulated Fitness"
        );

        // traitChartInstance = makeChart(
        //     "traitChart",
        //     "Trait Value",
        //     Vhist,
        //     "rgba(210, 155, 90, 1)",
        //     2.5
        // )
    }

    function exportChartBase64(chartInstance){
        // console.log("chartInstance", chartInstance)
        const base64 = chartInstance.toBase64Image();
        // document.getElementById('chart-image-show').src = base64;
        return base64.slice(22)
    }

    function handleAIClickButton(number, chartInstance) {
        if ($chartDescriptions[number].length < 1){
            const imageData = exportChartBase64(chartInstance);
            console.log('button works?')
            exportChartComponent.open(number, imageData)
        } else {
            chartMessage1 = $chartDescriptions[number]
            console.log('the data did not change')
            exportChartComponent.open(number, null)
        }
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
                modalMessage="A variable that determines the negative weight of a trait. Gamma is used in the cost function, which dictates that the trait expression and hormone production are costly to the organism. While the cost of hormone production is so small that it is negligable, the higher the gamma value for the first trait, the more costly it is to the organism to invest in the first trait. Therefore, there is lower value of the first trait, and will get picked less."
            />

            <SliderInput
                id="Selection against effort in trait j (γⱼ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma2}
                modalMessage="A variable that determines the negative weight of a trait. Gamma is used in the cost function, which dictates that the trait expression and hormone production are costly to the organism. While the cost of hormone production is so small that it is negligable, the higher the gamma value for the second trait, the more costly it is to the organism to invest in the second trait. Therefore, there is lower value of the second trait, and will get picked less."
            />

            <SliderInput
                id="Selection against effort in trait k (γₖ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma3}
                modalMessage="A variable that determines the negative weight of a trait. Gamma is used in the cost function, which dictates that the trait expression and hormone production are costly to the organism. While the cost of hormone production is so small that it is negligable, the higher the gamma value for the third trait, the more costly it is to the organism to invest in the third trait. Therefore, there is lower value of the third trait, and will get picked less."
            />
        </div>

        <!-- Container for Z sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Weight of first trait (zᵢ)" 
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z1}
                modalMessage="The weight of the first trait in the role of the fitness function. There higher the z value, the more impactful a trait is in the fitness function. Does not necesarily mean that a higher z is better for the organism since there are also costs when investing into a trait."
            />

            <SliderInput
                id="Weight of second trait (zⱼ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z2}
                modalMessage="The weight of the second trait in the role of the fitness function. There higher the z value, the more impactful a trait is in the fitness function. Does not necesarily mean that a higher z is better for the organism since there are also costs when investing into a trait."
            />

            <SliderInput
                id="Weight of third trait (zₖ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z3}
                modalMessage="The weight of the third trait in the role of the fitness function. There higher the z value, the more impactful a trait is in the fitness function. Does not necesarily mean that a higher z is better for the organism since there are also costs when investing into a trait."
            />
        </div>

        <!-- Container for G and mu sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput 
                id="Hormone level for gamete maturation (G)" 
                min="0" 
                max="1" 
                step="0.1" 
                bind:inputVar={$G} 
                modalMessage="Minimum level of circulating hormone for cells to mature at the end of gametogenesis. Produces cells capable of fertilization. This is the minimum production of hormone that has to be present in the first trait (the first trait in our code) in order for gamete maturation to occur. A lower treshhold of hormone level (G) will result in lower costs in the energy level of the organism, and lower costs investing into parental effort."
                />

            <SliderInput
                id="Death probability (µ)"
                min="0"
                max="1"
                step="0.001"
                bind:inputVar={$mu}
                modalMessage="A fixed chance that the male songbird will die randomly."
            />
        </div>

        <!-- Line -->
        <hr
        class="m-auto w-[90%] h-px my-6 border-1 border-indigo-500 opacity-50"
        />


        <!-- Container for food shortage sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Food Shortage"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$foodShort}
                modalMessage="A multiplier of current food."
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
        <FormInput
            id="Min energy level for reproduction (xᵣₑₚ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Minimum energy required for the organism to reproduce. Energy available at time, t is determined by the cost function. Decreasing the minimum energy required for reproduction will reduce the costs of investing more into mating effort. However, this is at the expense of investing into parental effort, and at the expense of accumulating energy."
            bind:inputVar={$Xmin}
        />

        <FormInput
            id="Max change of sensitivity to hormone (|ΔSᵢ, ₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues. The organism maximizes its lifetime success by finding the optimal level of the |ΔSᵢ, ₘₐₓ| at a given target."
            bind:inputVar={$delSmax}
        />

        <FormInput
            id="Max change of circulating hormone (|ΔCₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the circulating hormone in an organism. The organism will try to optimize this value to maximize its lifetime success."
            bind:inputVar={$delCmax}
        />

        <FormInput
            id="Food availability (τ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Determines the food availible in the environment for the organism. Increasing the food availiability will increase the payoff when investing in foraging."
            bind:inputVar={$tau}
        />

        <FormInput
            id="Michaelis-Menten constant (K)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="A constant used by the Michaelis-Menten Equation. Equal across all tissues."
            bind:inputVar={$K}
        />

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
<div class="flex flex-row flex-wrap gap-6 items-center justify-center mb-8">
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <div class="flex justify-center items-center">
            <h2 class="text-center text-xl font-semibold mb-4">
                Energy of Organism
            </h2>
            <button on:click={()=>{ handleAIClickButton(0, bodyConditionChartInstance) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="peer size-6 ml-1 -mt-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>                             
            </button>
            <ExportChart
                bind:this={exportChartComponent}
            />   
        </div>
        <canvas id="bodyConditionChart"></canvas>
        
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <div class="flex justify-center items-center">
            <h2 class="text-center text-xl font-semibold mb-4">
                Sensitivity to Hormone
            </h2>
            <button on:click={()=>{ handleAIClickButton(1, sensitivityChartInstance) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="peer size-6 ml-1 -mt-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>                 
            </button>
            <ExportChart
                bind:this={exportChartComponent}
            />  
        </div>
        <canvas id="sensitivityChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <div class="flex justify-center items-center">
            <h2 class="text-center text-xl font-semibold mb-4">
                Circulating Level Of Hormone
            </h2>
            <button on:click={()=>{ handleAIClickButton(2, productionChartInstance) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="peer size-6 ml-1 -mt-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
            </button>
            <ExportChart
                bind:this={exportChartComponent}
            /> 
        </div>    
        <canvas id="productionChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <div class="flex justify-center items-center">
            <h2 class="text-center text-xl font-semibold mb-4">
                Fitness
            </h2>
            <button on:click={()=>{ handleAIClickButton(3, fitnessChartInstance) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="peer size-6 ml-1 -mt-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>                 
            </button>
            <ExportChart
                bind:this={exportChartComponent}
            /> 
        </div>
        <canvas id="fitnessChart"></canvas>
    </div>
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <div class="flex justify-center items-center">
            <h2 class="text-center text-xl font-semibold mb-4">
                Cumulative Fitness
            </h2>
            <button on:click={()=>{ handleAIClickButton(4, cumulativeFitnessChartInstance) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="peer size-6 ml-1 -mt-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>              
            </button>
            <ExportChart
                bind:this={exportChartComponent}
            />
        </div>    
        <canvas id="cumulativeFitnessChart"></canvas>
    </div>
    <!-- <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">
            Trait Values
        </h2>
        <canvas id="traitChart"></canvas>
    </div> -->
</div>