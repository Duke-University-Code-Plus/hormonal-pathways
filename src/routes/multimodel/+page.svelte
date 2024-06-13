<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { writable, get } from 'svelte/store';
    import Chart from 'chart.js/auto';
    import NavBar from './Nested/navigation.svelte';

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];

    //default values
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
    let variableName = writable('Choose a Variable');
    let variableRangeBegin = writable(1);
    let variableRangeEnd = writable(2);
    let numRuns = writable(2);
    let showValidationMessage = writable(false);

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        if (get(variableName) === "Choose a Variable") {
            document.getElementById('variableDropDown').classList.add('border-red-500');
            showValidationMessage.set(true);
            return;
        } else {
            document.getElementById('variableDropDown').classList.remove('border-red-500');
            showValidationMessage.set(false);
        }

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

        //create Body Condition Chart
        bodyConditionChartInstance = new Chart(document.getElementById('bodyConditionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Xhist.length }, (_, i) => i),
                datasets: createDatasets(Xhist, 'Body Condition')
            },
            options: chartOptions
        });

        //create Sensitivity Chart
        sensitivityChartInstance = new Chart(document.getElementById('sensitivityChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Shist[0].length }, (_, i) => i),
                datasets: createSensitivityDatasets(Shist, 'Sensitivity')
            },
            options: chartOptions
        });

        //create Production Chart
        productionChartInstance = new Chart(document.getElementById('productionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Chist.length }, (_, i) => i),
                datasets: createDatasets(Chist, 'Production')
            },
            options: chartOptions
        });

        //create Fitness Chart
        fitnessChartInstance = new Chart(document.getElementById('fitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Whist.length }, (_, i) => i),
                datasets: createDatasets(Whist, 'Fitness')
            },
            options: chartOptions
        });

        //create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = new Chart(document.getElementById('cumulativeFitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Wcuml.length }, (_, i) => i),
                datasets: createDatasets(Wcuml, 'Cumulative Fitness')
            },
            options: chartOptions
        });
    }
    function handleDropdownChange(){
        if (get(variableName) === "Choose a Variable") {
            document.getElementById('variableDropDown').classList.add('border-red-500');
            showValidationMessage.set(true);
            return;
        } else {
            document.getElementById('variableDropDown').classList.remove('border-red-500');
            showValidationMessage.set(false);
            switch($variableName){
                case "K":
                    variableRangeBegin.set($K)
                    variableRangeEnd.set($K+1)
                    break;
                case "tau":
                    variableRangeBegin.set($tau)
                    variableRangeEnd.set($tau+1)
                    break;
                case "mu":
                variableRangeBegin.set($mu)
                variableRangeEnd.set($mu+0.001)
                    break;
                case "G":
                variableRangeBegin.set($G)
                    variableRangeEnd.set($G+0.1)
                    break;
                case "delSmax":
                variableRangeBegin.set($delSmax)
                    variableRangeEnd.set($delSmax+1)
                    break;
                case "delCmax":
                variableRangeBegin.set($delCmax)
                variableRangeEnd.set($delCmax+1)
                    break;
                case "alpha":
                variableRangeBegin.set($alpha)
                    variableRangeEnd.set($alpha+1)
                    break;
                case "beta":
                variableRangeBegin.set($beta)
                variableRangeEnd.set($beta+1)
                    break;
                case "Xmin":
                variableRangeBegin.set($Xmin)
                variableRangeEnd.set($Xmin+1)
                    break;

            }

        }
    }

</script>

<NavBar
multiPage = "bruh"/>

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
        <input id="G" type="number" min="0" max="1" placeholder="0.1" step = 0.1 bind:value={$G} class="form-input mt-1 block w-full" />
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
        <input id="mu" type="number" min="0" max="1" placeholder="0.01" step = 0.001 bind:value={$mu} class="form-input mt-1 block w-full" />
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
        <input id="foodShort" type="number" min="0" max="1" placeholder="0.4" step = 0.1 bind:value={$foodShort} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="foodShortbegin" class="block text-gray-700">Food Short Begin</label>
        <input id="foodShortbegin" type="number" min="0" max={$N} placeholder="8" bind:value={$foodShortbegin} class="form-input mt-1 block w-full" />
    </div>
    <div class="w-64 m-2">
        <label for="foodShortend" class="block text-gray-700">Food Short End</label>
        <input id="foodShortend" type="number" min={$foodShortbegin} max={$N} placeholder="20" bind:value={$foodShortend} class="form-input mt-1 block w-full" />
    </div>
<div>
  
    <form class="w-64 m-2 invalid: iSum">
        <label for="variableDropDown" class="block mb-2 text-gray-700 dark:text-white">Select an option</label>
        <select id="variableDropDown" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={$variableName} on:change={handleDropdownChange}>
          <option selected>Choose a Variable</option>
          <option value="alpha">alpha</option>
          <option value="beta">beta</option>
          <option value="delSmax">delSmax</option>
          <option value="delCmax">delCmax</option>  
          <option value="G">G</option>
          <option value="K">K</option>
          <option value="mu">mu</option>
          <option value="tau">tau</option>
          <option value="Xmin">Xmin</option>
        </select>
        {#if $showValidationMessage}
                <p class="mt-2 text-red-500 text-sm">Please select a variable</p>
           {/if}
    </form>

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










