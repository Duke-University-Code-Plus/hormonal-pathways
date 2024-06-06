<nav>
    <a href="/">Home</a>
    <a href="/multimodel">Multi-Run</a>
</nav>
<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import { writable, get } from "svelte/store";

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];

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
    let variableName = writable("Gamma");
    let variableRangeBegin = writable(10);
    let variableRangeEnd = writable(20);
    let numRuns = writable(20);

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;
    let errorMessage = writable('');

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        try {
            const params = {
                gamma: get(gamma).join(','), // Convert array to comma-separated string
                G: get(G),
                Xmin: get(Xmin),
                delSmax: get(delSmax),
                delCmax: get(delCmax),
                tau: get(tau),
                K: get(K),
                alpha: get(alpha),
                beta: get(beta),
                mu: get(mu),
                z: get(z).join(','), // Convert array to comma-separated string
                N: get(N),
                foodShort: get(foodShort),
                foodShortbegin: get(foodShortbegin),
                foodShortend: get(foodShortend),
                numRuns: get(numRuns),
                variableName: get(variableName),
                variableRangeBegin: get(variableRangeBegin),
                variableRangeEnd: get(variableRangeEnd),
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(`http://127.0.0.1:5000/multihormonemodel?${queryString}`);
            const data = response.data;

            // Data from API
            Xhist = data.Xhist || [];
            Shist = data.Shist || [];
            Chist = data.Chist || [];
            Whist = data.Whist || [];
            Wcuml = data.Wcuml || [];

            createCharts();
        } catch (error) {
            console.error('Error fetching data:', error);
            errorMessage.set(`Error fetching data: ${error.response ? error.response.data.error : error.message}`);
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function createCharts() {
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance) cumulativeFitnessChartInstance.destroy();

        const numRunsValue = get(numRuns);
        const NValue = get(N);

        // Create Body Condition Chart
        const bodyConditionDatasets = [];
        for (let run = 0; run < numRunsValue; run++) {
            bodyConditionDatasets.push({
                label: `Run ${run}`,
                data: Array.from({ length: NValue }, (_, i) => Xhist[0][i][run]),
                borderColor: getRandomColor(),
                borderWidth: 1,
                fill: false
            });
        }
        bodyConditionChartInstance = new Chart(document.getElementById('bodyConditionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: NValue }, (_, i) => i),
                datasets: bodyConditionDatasets
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Sensitivity Chart
        const sensitivityDatasets = [];
        for (let i = 0; i < 3; i++) {
            for (let run = 0; run < numRunsValue; run++) {
                sensitivityDatasets.push({
                    label: `Run ${run} - Sensitivity ${i + 1}`,
                    data: Array.from({ length: NValue }, (_, j) => Shist[i][j][run]),
                    borderColor: getRandomColor(),
                    borderWidth: 1,
                    fill: false
                });
            }
        }
        sensitivityChartInstance = new Chart(document.getElementById('sensitivityChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: NValue }, (_, i) => i),
                datasets: sensitivityDatasets
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Production Chart
        const productionDatasets = [];
        for (let run = 0; run < numRunsValue; run++) {
            productionDatasets.push({
                label: `Run ${run}`,
                data: Array.from({ length: NValue }, (_, i) => Chist[0][i][run]),
                borderColor: getRandomColor(),
                borderWidth: 1,
                fill: false
            });
        }
        productionChartInstance = new Chart(document.getElementById('productionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: NValue }, (_, i) => i),
                datasets: productionDatasets
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Fitness Chart
        const fitnessDatasets = [];
        for (let run = 0; run < numRunsValue; run++) {
            fitnessDatasets.push({
                label: `Run ${run}`,
                data: Array.from({ length: NValue }, (_, i) => Whist[0][i][run]),
                borderColor: getRandomColor(),
                borderWidth: 1,
                fill: false
            });
        }
        fitnessChartInstance = new Chart(document.getElementById('fitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: NValue }, (_, i) => i),
                datasets: fitnessDatasets
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Cumulative Fitness Chart
        const cumulativeFitnessDatasets = [];
        for (let run = 0; run < numRunsValue; run++) {
            cumulativeFitnessDatasets.push({
                label: `Run ${run}`,
                data: Array.from({ length: NValue }, (_, i) => Wcuml[0][i][run]),
                borderColor: getRandomColor(),
                borderWidth: 1,
                fill: false
            });
        }
        cumulativeFitnessChartInstance = new Chart(document.getElementById('cumulativeFitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: NValue }, (_, i) => i),
                datasets: cumulativeFitnessDatasets
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });
    }
</script>

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

    .dropbtn {
        background-color: #0d6de3;
        color: white;
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
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
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
        background-color: #463e8e;
    }

    #run-button {
        margin: 0;
        position: absolute;
        top: 65%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .error {
        color: red;
        font-weight: bold;
        text-align: center;
    }
</style>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hormone Model Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
</head>
<body>
    <h1>Hormone Model Multi-Run Visualization</h1>
    
    <div class="input-container">
        <!-- Input fields for parameters with labels -->
        <div class="input-group">
            <label for="gamma">Gamma</label>
            <input id="gamma" type="text" placeholder="0.1,0.2,0.3" bind:value={$gamma} />
        </div>
        <div class="input-group">
            <label for="G">G</label>
            <input id="G" type="number" placeholder="0.1" bind:value={$G} />
        </div>
        <div class="input-group">
            <label for="Xmin">Xmin</label>
            <input id="Xmin" type="number" placeholder="1" bind:value={$Xmin} />
        </div>
        <div class="input-group">
            <label for="delSmax">delSmax</label>
            <input id="delSmax" type="number" placeholder="1" bind:value={$delSmax} />
        </div>
        <div class="input-group">
            <label for="delCmax">delCmax</label>
            <input id="delCmax" type="number" placeholder="1" bind:value={$delCmax} />
        </div>
        <div class="input-group">
            <label for="tau">Tau</label>
            <input id="tau" type="number" placeholder="5" bind:value={$tau} />
        </div>
        <div class="input-group">
            <label for="K">K</label>
            <input id="K" type="number" placeholder="1" bind:value={$K} />
        </div>
        <div class="input-group">
            <label for="alpha">Alpha</label>
            <input id="alpha" type="number" min="0" placeholder="2" bind:value={$alpha} />
        </div>
        <div class="input-group">
            <label for="beta">Beta</label>
            <input id="beta" type="number" min="0" placeholder="2" bind:value={$beta} />
        </div>
        <div class="input-group">
            <label for="mu">Mu</label>
            <input id="mu" type="number" min="0" max="1" step="0.001" placeholder="0.01" bind:value={$mu} />
        </div>
        <div class="input-group">
            <label for="z">Z</label>
            <input id="z" type="text" placeholder="0.2,0.3,0.3" bind:value={$z} />
        </div>
        <div class="input-group">
            <label for="N">N</label>
            <input id="N" type="number" min="0" placeholder="100" bind:value={$N} />
        </div>
        <div class="input-group">
            <label for="foodShort">Food Short</label>
            <input id="foodShort" type="number" min="0" max="1" step="0.1" placeholder="0.4" bind:value={$foodShort} />
        </div>
        <div class="input-group">
            <label for="foodShortbegin">Food Short Begin</label>
            <input id="foodShortbegin" type="number" min="0" max={$N} placeholder="8" bind:value={$foodShortbegin} />
        </div>
        <div class="input-group">
            <label for="foodShortend">Food Short End</label>
            <input id="foodShortend" type="number" min={$foodShortbegin} max={$N} placeholder="20" bind:value={$foodShortend} />
        </div>
        <div class="dropdown">
            <button class="dropbtn">Select Variable to Experiment With</button>
            <div class="dropdown-content">
                <button on:click={() => variableName.set("G")}>G</button>
                <button on:click={() => variableName.set("Xmin")}>Xmin</button>
                <button on:click={() => variableName.set("delSmax")}>delSmax</button>
                <button on:click={() => variableName.set("delCmax")}>delCmax</button>
                <button on:click={() => variableName.set("Tau")}>Tau</button>
                <button on:click={() => variableName.set("K")}>K</button>
                <button on:click={() => variableName.set("Alpha")}>Alpha</button>
                <button on:click={() => variableName.set("Beta")}>Beta</button>
                <button on:click={() => variableName.set("Mu")}>Mu</button>
            </div>
        </div>
        <h3>Variable You Chose: {$variableName}</h3>
        <div class="input-group">
            <label for="variableRangeBegin">Variable Range Begin</label>
            <input id="variableRangeBegin" type="number" placeholder="10" bind:value={$variableRangeBegin} />
        </div>
        <div class="input-group">
            <label for="variableRangeEnd">Variable Range End</label>
            <input id="variableRangeEnd" type="number" placeholder="20" bind:value={$variableRangeEnd} />
        </div>
        <div class="input-group">
            <label for="numRuns">Number of Runs</label>
            <input id="numRuns" type="number" placeholder="20" bind:value={$numRuns} />
        </div>
        <p>
            The range of the {$variableName} is from {$variableRangeBegin} to {$variableRangeEnd} and the number of lines is {$numRuns}.
            Thus the variable will iterate from {$variableRangeBegin} to {$variableRangeEnd} in steps of size {($variableRangeEnd - $variableRangeBegin) / $numRuns}.
            This can be seen in the chart below.
            With blue being the lowest value and red being the highest value.
        </p>
        <!-- Run button to fetch data -->
        <button id="run-button" on:click={fetchData}>Run</button>
    </div>

    <div class="chart-container">
        <canvas id="bodyConditionChart"></canvas>
        <canvas id="sensitivityChart"></canvas>
        <canvas id="productionChart"></canvas>
        <canvas id="fitnessChart"></canvas>
        <canvas id="cumulativeFitnessChart"></canvas>
    </div>
    {#if $errorMessage}
        <p class="error">{$errorMessage}</p>
    {/if}
</body>




