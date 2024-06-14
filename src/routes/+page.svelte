<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import { writable, get } from "svelte/store";
    import Chart from "chart.js/auto";
    import FormInput from "./multimodel/Nested/FormInput.svelte";
    import NavBar from "./multimodel/Nested/navigation.svelte";

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];

    // Initialize writable stores with default values
    let gamma = writable([0.1, 0.2, 0.3]);
    let G = writable(0.1);
    let Xmin = writable(1);
    let delSmax = writable(1);
    let delCmax = writable(1);
    let tau = writable(5);
    let K = writable(1);
    let alpha = writable(4);
    let beta = writable(2);
    let mu = writable(0.01);
    let z = writable([0.2, 0.3, 0.3]);
    let N = writable(100);
    let foodShort = writable(0.4);
    let foodShortbegin = writable(8);
    let foodShortend = writable(20);

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;

    const apiEndpoint =
        "https://hormonal-pathways-api-a4dcfa854663.herokuapp.com";

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        try {
            const params = {
                gamma: get(gamma).join(","), // Convert array to comma-separated string
                G: get(G),
                Xmin: get(Xmin),
                delSmax: get(delSmax),
                delCmax: get(delCmax),
                tau: get(tau),
                K: get(K),
                alpha: get(alpha),
                beta: get(beta),
                mu: get(mu),
                z: get(z).join(","), // Convert array to comma-separated string
                N: get(N),
                foodShort: get(foodShort),
                foodShortbegin: get(foodShortbegin),
                foodShortend: get(foodShortend),
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

            createCharts();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function makeChart(canvas, title, y, color) {
        const chartOptions = {
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "y label" },
                },
            },
        };

        let chartData = {};
        const is2dArray = (array) => array.every((item) => Array.isArray(item));
        if (is2dArray(y)) {
            let chartDatasets = [];
            for (let i = 0; i < y.length; i++) {
                let data = {
                    label: title + " " + i,
                    data: y[i],
                    borderColor: color,
                    borderWidth: 1,
                    fill: false,
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
                borderWidth: 1,
                fill: false,
            };
            chartData = {
                labels: Array.from({ length: y.length }, (_, i) => i),
                datasets: [data],
            };
        }

        let ctx = document.getElementById(canvas);
        return new Chart(ctx, {
            type: "line",
            data: chartData,
            options: chartOptions,
        });
    }

    function createCharts() {
        // Destroy existing charts if they exist
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance)
            cumulativeFitnessChartInstance.destroy();

        // Create Body Condition Chart
        bodyConditionChartInstance = makeChart(
            "bodyConditionChart",
            "Body Condition",
            Xhist,
            "rgba(75, 192, 192, 1)",
        );

        // Create Sensitivity Chart
        sensitivityChartInstance = makeChart(
            "sensitivityChart",
            "Sensitivity",
            Shist,
            "rgba(255, 99, 132, 1)",
        );

        // Create Production Chart
        productionChartInstance = makeChart(
            "productionChart",
            "Production",
            Chist,
            "rgba(153, 102, 255, 1)",
        );

        // Create Fitness Chart
        fitnessChartInstance = makeChart(
            "fitnessChart",
            "Fitness",
            Whist,
            "rgba(255, 159, 64, 1)",
        );

        // Create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = makeChart(
            "cumulativeFitnessChart",
            "Cumulative Fitness",
            Wcuml,
            "rgba(255, 206, 86, 1)",
        );
    }
</script>

<NavBar multiPage="nope" />

<!-- <nav>
    <a href="/">home</a>
    <a href="/multimodel">multimodel</a>
</nav>-->

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Hormone Model Visualization
</h1>

<div class="flex flex-wrap justify-center">
    <!-- Input fields for parameters with labels -->

    <!--input for gamma-->
    <FormInput id="Gamma" inputType="text" bind:inputVar={$gamma} />

    <!--input for G-->
    <FormInput
        id="G"
        inputType="number"
        min="0"
        max="1"
        step="0.1"
        bind:inputVar={$G}
    />

    <!--input for Xmin-->
    <FormInput
        id="Xmin"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$Xmin}
    />

    <FormInput
        id="delSmax"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$delSmax}
    />

    <FormInput
        id="delCmax"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$delCmax}
    />

    <FormInput
        id="Tau"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$tau}
    />

    <FormInput
        id="K"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$K}
    />

    <FormInput
        id="Alpha"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$alpha}
    />

    <FormInput
        id="Beta"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$beta}
    />

    <!--input for mu-->
    <FormInput
        id="Mu"
        inputType="number"
        min="0"
        max="1"
        step="0.001"
        bind:inputVar={$mu}
    />

    <FormInput id="Z" inputType="text" bind:inputVar={$z} />

    <FormInput
        id="N"
        inputType="number"
        min="0"
        max="10000"
        step="1"
        bind:inputVar={$N}
    />

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
</div>
<div class="flex justify-center m-4">
    <button
        class="text-center bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        on:click={fetchData}>Run</button
    >
</div>

<div class="flex flex-row flex-wrap gap-6 items-center justify-center">
    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Body Condition</h2>
        <canvas id="bodyConditionChart"></canvas>
    </div>

    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Sensitivity</h2>
        <canvas id="sensitivityChart"></canvas>
    </div>

    <div
        class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
    >
        <h2 class="text-center text-xl font-semibold mb-4">Production</h2>
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
</div>

<!-- <div class="chart-container">
        <canvas id="bodyConditionChart"></canvas>
        <canvas id="sensitivityChart"></canvas>
        <canvas id="productionChart"></canvas>
        <canvas id="fitnessChart"></canvas>
        <canvas id="cumulativeFitnessChart"></canvas>
    </div> -->

<!--STYLING / HTML
<style>
    body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f4f4f9;
    }

    h1 {
        text-align: center;
        color: #333;
    }

    .input-container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        margin: 5px;
    }

    .input-group label {
        margin-bottom: 5px;
        font-weight: bold;
    }

    .input-group input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 120px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .input-container button {
        margin: 5px;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        background-color: #28a745;
        color: white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .input-container button:hover {
        background-color: #218838;
    }

    .chart-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    canvas {
        max-width: 100%;
        margin: 20px 0;
    }
</style>-->
