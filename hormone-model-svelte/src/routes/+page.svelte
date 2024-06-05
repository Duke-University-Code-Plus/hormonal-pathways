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
    let mu = writable(0.5);
    let z = writable([0.2, 0.3, 0.3]);
    let N = writable(100);
    let foodShort = writable(0.4);
    let foodShortbegin = writable(8);
    let foodShortend = writable(20);

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
        // Create Body Condition Chart
        new Chart(document.getElementById('bodyConditionChart'), {
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
        new Chart(document.getElementById('sensitivityChart'), {
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
        new Chart(document.getElementById('productionChart'), {
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
        new Chart(document.getElementById('fitnessChart'), {
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
        new Chart(document.getElementById('cumulativeFitnessChart'), {
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
    
    <!-- Input fields for parameters -->
    <input type="text" placeholder="Enter gamma value" bind:value={$gamma} />
    <input type="text" placeholder="Enter G value" bind:value={$G} />
    <input type="text" placeholder="Enter Xmin value" bind:value={$Xmin} />
    <input type="text" placeholder="Enter delSmax value" bind:value={$delSmax} />
    <input type="text" placeholder="Enter delCmax value" bind:value={$delCmax} />
    <input type="text" placeholder="Enter tau value" bind:value={$tau} />
    <input type="text" placeholder="Enter K value" bind:value={$K} />
    <input type="text" placeholder="Enter alpha value" bind:value={$alpha} />
    <input type="text" placeholder="Enter beta value" bind:value={$beta} />
    <input type="text" placeholder="Enter mu value" bind:value={$mu} />
    <input type="text" placeholder="Enter z value" bind:value={$z} />
    <input type="text" placeholder="Enter N value" bind:value={$N} />
    <input type="text" placeholder="Enter foodShort value" bind:value={$foodShort} />
    <input type="text" placeholder="Enter foodShortbegin value" bind:value={$foodShortbegin} />
    <input type="text" placeholder="Enter foodShortend value" bind:value={$foodShortend} />

    <!-- Run button to fetch data -->
    <button on:click={fetchData}>Run</button>

    <canvas id="bodyConditionChart"></canvas>
    <canvas id="sensitivityChart"></canvas>
    <canvas id="productionChart"></canvas>
    <canvas id="fitnessChart"></canvas>
    <canvas id="cumulativeFitnessChart"></canvas>
</body>
