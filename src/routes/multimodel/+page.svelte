<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { writable, get } from 'svelte/store';
    import Chart from 'chart.js/auto';

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];

    // Initialize writable stores with default values
    let gamma = writable("0.1,0.2,0.3");
    let G = writable(0.1);
    let Xmin = writable(1);
    let delSmax = writable(1);
    let delCmax = writable(1);
    let tau = writable(5);
    let K = writable(1);
    let alpha = writable(4);
    let beta = writable(2);
    let mu = writable(0.01);
    let z = writable("0.2,0.3,0.3");
    let N = writable(100);
    let foodShort = writable(0.4);
    let foodShortbegin = writable(8);
    let foodShortend = writable(20);
    let variableName = writable('delSmax');
    let variableRangeBegin = writable(1);
    let variableRangeEnd = writable(2);
    let numRuns = writable(2);

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        try {
            const params = {
                gamma: get(gamma),
                G: get(G),
                Xmin: get(Xmin),
                delSmax: get(delSmax),
                delCmax: get(delCmax),
                tau: get(tau),
                K: get(K),
                alpha: get(alpha),
                beta: get(beta),
                mu: get(mu),
                z: get(z),
                N: get(N),
                foodShort: get(foodShort),
                foodShortbegin: get(foodShortbegin),
                foodShortend: get(foodShortend),
                variableName: get(variableName),
                variableRangeBegin: get(variableRangeBegin),
                variableRangeEnd: get(variableRangeEnd),
                numRuns: get(numRuns)
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(`http://127.0.0.1:5000/multihormonemodel?${queryString}`);
            const data = response.data;

            // Data from API
            Xhist = data.Xhist;
            Shist = data.Shist;
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;

            createCharts();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function createDatasets(data, labelPrefix) {
        const numRunsValue = get(numRuns); // Number of lines

        function interpolateColor(startColor, endColor, factor) {
            const result = startColor.slice();
            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
            }
            return result;
        }

        const startColor = [0, 0, 255]; // Blue
        const endColor = [255, 0, 0]; // Red

        const datasets = Array.from({ length: numRunsValue }, (_, runIndex) => {
            const factor = runIndex / (numRunsValue - 1);
            const color = interpolateColor(startColor, endColor, factor);
            return {
                label: `${labelPrefix} ${runIndex + 1}`,
                data: data.map(point => point[runIndex]),
                borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
                borderWidth: 1,
                fill: false
            };
        });

        return datasets;
    }

    function createSensitivityDatasets(data, labelPrefix) {
        const numRunsValue = get(numRuns);
        const colors = [[255, 99, 132], [75, 192, 192], [153, 102, 255]];
        const datasets = [];

        for (let i = 0; i < 3; i++) {
            datasets.push(...Array.from({ length: numRunsValue }, (_, runIndex) => ({
                label: `${labelPrefix} ${i + 1} Run ${runIndex + 1}`,
                data: data[i].map(point => point[runIndex]),
                borderColor: `rgba(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]}, 1)`,
                borderWidth: 1,
                fill: false
            })));
        }

        return datasets;
    }

    function createCharts() {
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance) cumulativeFitnessChartInstance.destroy();

        const chartOptions = {
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        };

        // Create Body Condition Chart
        bodyConditionChartInstance = new Chart(document.getElementById('bodyConditionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Xhist.length }, (_, i) => i),
                datasets: createDatasets(Xhist, 'Body Condition')
            },
            options: chartOptions
        });

        // Create Sensitivity Chart
        sensitivityChartInstance = new Chart(document.getElementById('sensitivityChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Shist[0].length }, (_, i) => i),
                datasets: createSensitivityDatasets(Shist, 'Sensitivity')
            },
            options: chartOptions
        });

        // Create Production Chart
        productionChartInstance = new Chart(document.getElementById('productionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Chist.length }, (_, i) => i),
                datasets: createDatasets(Chist, 'Production')
            },
            options: chartOptions
        });

        // Create Fitness Chart
        fitnessChartInstance = new Chart(document.getElementById('fitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Whist.length }, (_, i) => i),
                datasets: createDatasets(Whist, 'Fitness')
            },
            options: chartOptions
        });

        // Create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = new Chart(document.getElementById('cumulativeFitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Wcuml.length }, (_, i) => i),
                datasets: createDatasets(Wcuml, 'Cumulative Fitness')
            },
            options: chartOptions
        });
    }
</script>

<nav class="bg-gray-100 dark:bg-gray-100 shadow shadow-gray-300 w-full px-8 md:px-auto">
    <div class="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div class="flex w-full justify-center md:justify-between items-center">
            <div class="text-gray-500 order-2 md:order-1 w-full md:w-auto md:flex-1">
                <ul class="flex font-semibold justify-center w-full">
                    <li class="md:px-4 md:py-2 hover:text-indigo-500 text-xl">
                        <a href="/">Home</a>
                    </li>
                    <li class="md:px-4 md:py-2 text-indigo-500 text-xl">
                        <a href="/multimodel">Multimodel</a>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col justify-center ml-3"></div>
        </div>
    </div>
</nav>

<h1 class="mb-4 text-center text-2xl font-extrabold md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo p-3">
    Hormone Multi-Run Model Visualization
</h1>

<div class="flex flex-wrap justify-center space-x-4">
    <div class="w-64 m-2">
        <label for="gamma" class="block text-gray-700">Gamma</label>
        <input id="gamma" type="text" placeholder="0.1,0.2,0.3" bind:value={$gamma} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="G" class="block text-gray-700">G</label>
        <input id="G" type="number" min="0" max="1" placeholder="0.1" bind:value={$G} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="Xmin" class="block text-gray-700">Xmin</label>
        <input id="Xmin" type="number" placeholder="1" bind:value={$Xmin} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="delSmax" class="block text-gray-700">delSmax</label>
        <input id="delSmax" type="number" placeholder="1" bind:value={$delSmax} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="delCmax" class="block text-gray-700">delCmax</label>
        <input id="delCmax" type="number" placeholder="1" bind:value={$delCmax} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="tau" class="block text-gray-700">Tau</label>
        <input id="tau" type="number" placeholder="5" bind:value={$tau} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="K" class="block text-gray-700">K</label>
        <input id="K" type="number" placeholder="1" bind:value={$K} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="alpha" class="block text-gray-700">Alpha</label>
        <input id="alpha" type="number" min="0" placeholder="2" bind:value={$alpha} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="beta" class="block text-gray-700">Beta</label>
        <input id="beta" type="number" min="0" placeholder="2" bind:value={$beta} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="mu" class="block text-gray-700">Mu</label>
        <input id="mu" type="number" min="0" max="1" placeholder="0.5" bind:value={$mu} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="z" class="block text-gray-700">Z</label>
        <input id="z" type="text" placeholder="0.2,0.3,0.3" bind:value={$z} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="N" class="block text-gray-700">N</label>
        <input id="N" type="number" min="0" placeholder="100" bind:value={$N} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="foodShort" class="block text-gray-700">Food Short</label>
        <input id="foodShort" type="number" min="0" max="1" placeholder="0.4" bind:value={$foodShort} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="foodShortbegin" class="block text-gray-700">Food Short Begin</label>
        <input id="foodShortbegin" type="number" min="0" max={$N} placeholder="8" bind:value={$foodShortbegin} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="foodShortend" class="block text-gray-700">Food Short End</label>
        <input id="foodShortend" type="number" min={$foodShortbegin} max={$N} placeholder="20" bind:value={$foodShortend} class="form-input mt-1 block w-full" />
    </div>
    <div class="dropdown">
        <button class="dropbtn bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded">Select Variable to Experiment With</button>
        <div class="dropdown-content">
            <button on:click={() => variableName.set("G")}>G</button>
            <button on:click={() => variableName.set("Xmin")}>Xmin</button>
            <button on:click={() => variableName.set("delSmax")}>delSmax</button>
            <button on:click={() => variableName.set("delCmax")}>delCmax</button>
            <button on:click={() => variableName.set("tau")}>Tau</button>
            <button on:click={() => variableName.set("K")}>K</button>
            <button on:click={() => variableName.set("alpha")}>Alpha</button>
            <button on:click={() => variableName.set("beta")}>Beta</button>
            <button on:click={() => variableName.set("mu")}>Mu</button>
        </div>
    <h3>Variable You Chose: {$variableName}</h3>
</div>
    <div class="w-64 m-2">
        <label for="variableRangeBegin" class="block text-gray-700">Variable Range Begin</label>
        <input id="variableRangeBegin" type="number" placeholder="10" bind:value={$variableRangeBegin} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="variableRangeEnd" class="block text-gray-700">Variable Range End</label>
        <input id="variableRangeEnd" type="number" placeholder="20" bind:value={$variableRangeEnd} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="numRuns" class="block text-gray-700">Number of Runs</label>
        <input id="numRuns" type="number" placeholder="20" bind:value={$numRuns} class="form-input mt-1 block w-full" />
    </div>
</div>

<div class="text-center mt-4">
    <button class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded" on:click={fetchData}>Run</button>
</div>

<div class="chart-container">
    <canvas id="bodyConditionChart"></canvas>
    <canvas id="sensitivityChart"></canvas>
    <canvas id="productionChart"></canvas>
    <canvas id="fitnessChart"></canvas>
    <canvas id="cumulativeFitnessChart"></canvas>
</div>

<style>
    .dropbtn {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        border-radius: 4px;
    }

       .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }
       .dropdown-content button {
        background: none;
        border: none;
        color: black;
        padding: 12px 16px;
        text-align: left;
        width: 100%;
        cursor: pointer;
    }

    .dropdown-content button:hover {
        background-color: #f1f1f1;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown:hover .dropbtn {
        background-color: bg-indigo-400;
    }
</style>









