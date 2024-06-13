<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import { writable, get } from "svelte/store";
    import Chart from 'chart.js/auto'
    import FormInput from './FormInput.svelte'
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
                `http://127.0.0.1:5000/hormonemodel?${queryString}`,
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

    function createCharts() {
        // Destroy existing charts if they exist
        if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
        if (sensitivityChartInstance) sensitivityChartInstance.destroy();
        if (productionChartInstance) productionChartInstance.destroy();
        if (fitnessChartInstance) fitnessChartInstance.destroy();
        if (cumulativeFitnessChartInstance)
            cumulativeFitnessChartInstance.destroy();

        const chartOptions = {
                    scales: {
                        x: { beginAtZero: true },
                        y: { beginAtZero: true },
                    },
                }

        // Create Body Condition Chart
        bodyConditionChartInstance = new Chart(
            document.getElementById("bodyConditionChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Xhist.length }, (_, i) => i),
                    datasets: [
                        {
                            label: "Body Condition",
                            data: Xhist,
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: chartOptions,
            },
        );

        // Create Sensitivity Chart
        sensitivityChartInstance = new Chart(
            document.getElementById("sensitivityChart"),
            {
                type: "line",
                data: {
                    labels: Array.from(
                        { length: Shist[0].length },
                        (_, i) => i,
                    ),
                    datasets: [
                        {
                            label: "Sensitivity 1",
                            data: Shist[0],
                            borderColor: "rgba(255, 99, 132, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                        {
                            label: "Sensitivity 2",
                            data: Shist[1],
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                        {
                            label: "Sensitivity 3",
                            data: Shist[2],
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: chartOptions,
            },
        );

        // Create Production Chart
        productionChartInstance = new Chart(
            document.getElementById("productionChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Chist.length }, (_, i) => i),
                    datasets: [
                        {
                            label: "Production",
                            data: Chist,
                            borderColor: "rgba(153, 102, 255, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: chartOptions,
            },
        );

        // Create Fitness Chart
        fitnessChartInstance = new Chart(
            document.getElementById("fitnessChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Whist.length }, (_, i) => i),
                    datasets: [
                        {
                            label: "Fitness",
                            data: Whist,
                            borderColor: "rgba(255, 159, 64, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: chartOptions,
            },
        );

        // Create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = new Chart(
            document.getElementById("cumulativeFitnessChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Wcuml.length }, (_, i) => i),
                    datasets: [
                        {
                            label: "Cumulative Fitness",
                            data: Wcuml,
                            borderColor: "rgba(255, 206, 86, 1)",
                            borderWidth: 1,
                            fill: false,
                        },
                    ],
                },
                options: chartOptions,
            },
        );
    }
</script>



<NavBar
multiPage = "nope"/>


<!-- <nav>
    <a href="/">home</a>
    <a href="/multimodel">multimodel</a>
</nav>-->

    <h1
        class="mb-4 text-center text-2xl font-extrabold md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo p-3"
    >
        Hormone Model Visualization
    </h1>

    <div class="flex flex-wrap justify-center">
        <!-- Input fields for parameters with labels -->

        <!--input for gamma-->
        <FormInput
            id="gamma"
            inputType="text"
            bind:inputVar={$gamma}
        />


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


        

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="delSmax"
                    type="number"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$delSmax}
                />
                <label
                    for="delSmax"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >delSmax</label
                >
            </div>
        </div>

        <!--<div class="input-group">
            <label for="delSmax">delSmax</label>
            <input
                id="delSmax"
                type="text"
                placeholder="1"
                bind:value={$delSmax}
            />
        </div>-->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="delCmax"
                    type="number"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$delCmax}
                />
                <label
                    for="delCmax"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >delCmax</label
                >
            </div>
        </div>

        <!-- <div class="input-group">
            <label for="delCmax">delCmax</label>
            <input
                id="delCmax"
                type="text"
                placeholder="1"
                bind:value={$delCmax}
            />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="tau"
                    type="number"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$tau}
                />
                <label
                    for="tau"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Tau</label
                >
            </div>
        </div>
        <!-- <div class="input-group">
            <label for="tau">Tau</label>
            <input id="tau" type="text" placeholder="5" bind:value={$tau} />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="K"
                    type="number"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$K}
                />
                <label
                    for="K"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >K</label
                >
            </div>
        </div>
        <!-- <div class="input-group">
            <label for="K">K</label>
            <input id="K" type="text" placeholder="1" bind:value={$K} />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="alpha"
                    type="number"
                    min="0"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$alpha}
                />
                <label
                    for="alpha"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Alpha</label
                >
            </div>
        </div>

        <!-- <div class="input-group">
            <label for="alpha">Alpha</label>
            <input id="alpha" type="text" placeholder="2" bind:value={$alpha} />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="beta"
                    type="number"
                    min="0"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$beta}
                />
                <label
                    for="beta"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Beta</label
                >
            </div>
        </div>
        <!-- <div class="input-group">
            <label for="beta">Beta</label>
            <input id="beta" type="text" placeholder="2" bind:value={$beta} />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="mu"
                    type="number"
                    min="0"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$mu}
                />
                <label
                    for="mu"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Mu</label
                >
            </div>
        </div>

        <!-- <div class="input-group">
            <label for="mu">Mu</label>
            <input id="mu" type="text" placeholder="0.5" bind:value={$mu} />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="z"
                    type="text"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$z}
                />
                <label
                    for="z"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Z</label
                >
            </div>
        </div>
        <!-- <div class="input-group">
            <label for="z">Z</label>
            <input
                id="z"
                type="text"
                placeholder="0.2,0.3,0.3"
                bind:value={$z}
            />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="N"
                    type="number"
                    min="0"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$N}
                />
                <label
                    for="N"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >N</label
                >
            </div>
        </div>

        <!-- <div class="input-group">
            <label for="N">N</label>
            <input id="N" type="text" placeholder="100" bind:value={$N} />
        </div> -->
        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="foodShort"
                    type="number"
                    min="0"
                    max="1"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$foodShort}
                />
                <label
                    for="foodShort"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Food Short</label
                >
            </div>
        </div>

        <!-- <div class="input-group">
            <label for="foodShort">Food Short</label>
            <input
                id="foodShort"
                type="text"
                placeholder="0.4"
                bind:value={$foodShort}
            />
        </div> -->

        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="foodShortbegin"
                    type="number"
                    min="0"
                    max={$N}
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$foodShortbegin}
                />
                <label
                    for="foodShortbegin"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Food Short Begin</label
                >
            </div>
        </div>

        <!-- <div class="input-group">
            <label for="foodShortbegin">Food Short Begin</label>
            <input
                id="foodShortbegin"
                type="text"
                placeholder="8"
                bind:value={$foodShortbegin}
            />
        </div> -->
        <div class="w-72 m-2">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    id="foodShortend"
                    type="number"
                    min={$foodShortbegin}
                    max={$N}
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0
                focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border
                placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2
                border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200
                focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$foodShortend}
                />
                <label
                    for="foodShortend"
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
                peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
                peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
                peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
                before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
                before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
                after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
                peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
                after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
                peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
                peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"
                    >Food Short End</label
                >
            </div>
        </div>
        <!-- <div class="input-group">
            <label for="foodShortend">Food Short End</label>
            <input
                id="foodShortend"
                type="text"
                placeholder="20"
                bind:value={$foodShortend}
            />
        </div> -->

        <!-- Run button to fetch data -->
    </div>
    <div class="flex justify-center m-4">
        <button
            class="text-center bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            on:click={fetchData}>Run</button
        >
    </div>
    <div class="carousel-container">
        <div class="carousel-button" id="prevButton">&#9664;</div>
        <div class="carousel">
            <div class="carousel-item bg-white shadow-md rounded-lg">
                <h2 class="text-center text-xl font-semibold mb-4">
                    Body Condition
                </h2>
                <canvas id="bodyConditionChart"></canvas>
            </div>
            <div class="carousel-item bg-white shadow-md rounded-lg">
                <h2 class="text-center text-xl font-semibold mb-4">
                    Sensitivity
                </h2>
                <canvas id="sensitivityChart"></canvas>
            </div>
            <div class="carousel-item bg-white shadow-md rounded-lg">
                <h2 class="text-center text-xl font-semibold mb-4">
                    Production
                </h2>
                <canvas id="productionChart"></canvas>
            </div>
            <div class="carousel-item bg-white shadow-md rounded-lg">
                <h2 class="text-center text-xl font-semibold mb-4">Fitness</h2>
                <canvas id="fitnessChart"></canvas>
            </div>
            <div class="carousel-item bg-white shadow-md rounded-lg">
                <h2 class="text-center text-xl font-semibold mb-4">
                    Cumulative Fitness
                </h2>
                <canvas id="cumulativeFitnessChart"></canvas>
            </div>
        </div>
        <div class="carousel-button" id="nextButton">&#9654;</div>
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

<style>
    .carousel {
        scroll-snap-type: x mandatory;
        overflow-x: auto;
        display: flex;
        scroll-behavior: smooth;
        gap: 1rem;
    }

    .carousel-item {
        scroll-snap-align: start;
        flex: none;
        width: 80%;
        max-width: 600px;
        padding: 1rem;
    }

    .carousel-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .carousel-button {
        background-color: #4a5568;
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        user-select: none;
    }

    .carousel-button:hover {
        background-color: #2d3748;
    }
</style>