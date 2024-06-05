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

    .input-container input {
        margin: 5px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 80px;
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
</style>

<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { writable, get } from 'svelte/store';

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
    let alpha = writable(2);
    let beta = writable(2);
    let mu = writable(0.001);
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
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(`http://127.0.0.1:5000/hormonemodel?${queryString}`);
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

    function createCharts() {
        // Destroy existing charts if they exist
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance) cumulativeFitnessChartInstance.destroy();

        // Create Body Condition Chart
        bodyConditionChartInstance = new Chart(document.getElementById('bodyConditionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Xhist.length }, (_, i) => i),
                datasets: [{
                    label: 'Body Condition',
                    data: Xhist,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Sensitivity Chart
        sensitivityChartInstance = new Chart(document.getElementById('sensitivityChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Shist[0].length }, (_, i) => i),
                datasets: [
                    {
                        label: 'Sensitivity 1',
                        data: Shist[0],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Sensitivity 2',
                        data: Shist[1],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Sensitivity 3',
                        data: Shist[2],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Production Chart
        productionChartInstance = new Chart(document.getElementById('productionChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Chist.length }, (_, i) => i),
                datasets: [{
                    label: 'Production',
                    data: Chist,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Fitness Chart
        fitnessChartInstance = new Chart(document.getElementById('fitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Whist.length }, (_, i) => i),
                datasets: [{
                    label: 'Fitness',
                    data: Whist,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = new Chart(document.getElementById('cumulativeFitnessChart'), {
            type: 'line',
            data: {
                labels: Array.from({ length: Wcuml.length }, (_, i) => i),
                datasets: [{
                    label: 'Cumulative Fitness',
                    data: Wcuml,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    fill: false
                }]
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

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hormone Model Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
</head>
<body>
    <h1>Hormone Model Visualization</h1>
    
    <div class="input-container">
        <!-- Input fields for parameters -->
        <input type="text" placeholder="gamma" bind:value={$gamma} />
        <input type="text" placeholder="G" bind:value={$G} />
        <input type="text" placeholder="Xmin" bind:value={$Xmin} />
        <input type="text" placeholder="delSmax" bind:value={$delSmax} />
        <input type="text" placeholder="delCmax" bind:value={$delCmax} />
        <input type="text" placeholder="tau" bind:value={$tau} />
        <input type="text" placeholder="K" bind:value={$K} />
        <input type="text" placeholder="alpha" bind:value={$alpha} />
        <input type="text" placeholder="beta" bind:value={$beta} />
        <input type="text" placeholder="mu" bind:value={$mu} />
        <input type="text" placeholder="z" bind:value={$z} />
        <input type="text" placeholder="N" bind:value={$N} />
        <input type="text" placeholder="foodShort" bind:value={$foodShort} />
        <input type="text" placeholder="foodShortbegin" bind:value={$foodShortbegin} />
        <input type="text" placeholder="foodShortend" bind:value={$foodShortend} />

        <!-- Run button to fetch data -->
        <button on:click={fetchData}>Run</button>
    </div>

    <div class="chart-container">
        <canvas id="bodyConditionChart"></canvas>
        <canvas id="sensitivityChart"></canvas>
        <canvas id="productionChart"></canvas>
        <canvas id="fitnessChart"></canvas>
        <canvas id="cumulativeFitnessChart"></canvas>
    </div>
</body>
