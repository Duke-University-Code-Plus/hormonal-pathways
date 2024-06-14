<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import { writable, get } from "svelte/store";
    import Chart from "chart.js/auto";
    import FormInput from "./Nested/FormInput.svelte";
    import NavBar from "./Nested/navigation.svelte";
    import SliderInput from "./Nested/SliderInput.svelte";

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];

    //default values
    let gamma1 = writable(0.1);
    let gamma2 = writable(0.2);
    let gamma3 = writable(0.3);
    let G = writable(0.1);
    let Xmin = writable(1);
    let delSmax = writable(1);
    let delCmax = writable(1);
    let tau = writable(5);
    let K = writable(1);
    let alpha = writable(4);
    let beta = writable(2);
    let mu = writable(0.01);
    let z1 = writable(0.2);
    let z2 = writable(0.3);
    let z3 = writable(0.3);
    let N = writable(100);
    let foodShort = writable(0.4);
    let foodShortbegin = writable(8);
    let foodShortend = writable(20);
    let variableName = writable("Choose a Variable");
    let variableRangeBegin = writable(1);
    let variableRangeEnd = writable(2);
    let numRuns = writable(2);
    let showValidationMessage = writable(false);

    let gamma = writable([get(gamma1), get(gamma2), get(gamma3)]);
    let z = writable([get(z1), get(z2), get(z3)]);

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;

    const apiEndpoint =
        "https://hormonal-pathways-api-a4dcfa854663.herokuapp.com";

    //state
    let initialRun = false;

    onMount(() => {
        //fetchData();
    });

    async function fetchData() {
        if (get(variableName) === "Choose a Variable") {
            document
                .getElementById("variableDropDown")
                .classList.add("border-red-500");
            showValidationMessage.set(true);
            return;
        } else {
            document
                .getElementById("variableDropDown")
                .classList.remove("border-red-500");
            showValidationMessage.set(false);
        }

        try {
            if (!initialRun) initialRun = true;

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
                numRuns: get(numRuns),
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(
                `${apiEndpoint}/multihormonemodel?${queryString}`,
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

    function createDatasets(data, labelPrefix) {
        const numRunsValue = get(numRuns); // Number of lines

        function interpolateColor(startColor, endColor, factor) {
            const result = startColor.slice();
            for (let i = 0; i < 3; i++) {
                result[i] = Math.round(
                    result[i] + factor * (endColor[i] - startColor[i]),
                );
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
                data: data.map((point) => point[runIndex]),
                borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
                borderWidth: 1,
                fill: false,
            };
        });

        return datasets;
    }

    function createSensitivityDatasets(data, labelPrefix) {
        const numRunsValue = get(numRuns);
        const colors = [
            [255, 99, 132],
            [75, 192, 192],
            [153, 102, 255],
        ];
        const datasets = [];

        for (let i = 0; i < 3; i++) {
            datasets.push(
                ...Array.from({ length: numRunsValue }, (_, runIndex) => ({
                    label: `${labelPrefix} ${i + 1} Run ${runIndex + 1}`,
                    data: data[i].map((point) => point[runIndex]),
                    borderColor: `rgba(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]}, 1)`,
                    borderWidth: 1,
                    fill: false,
                })),
            );
        }

        return datasets;
    }

    function createCharts() {
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
        };

        //create Body Condition Chart
        bodyConditionChartInstance = new Chart(
            document.getElementById("bodyConditionChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Xhist.length }, (_, i) => i),
                    datasets: createDatasets(Xhist, "Body Condition"),
                },
                options: chartOptions,
            },
        );

        //create Sensitivity Chart
        sensitivityChartInstance = new Chart(
            document.getElementById("sensitivityChart"),
            {
                type: "line",
                data: {
                    labels: Array.from(
                        { length: Shist[0].length },
                        (_, i) => i,
                    ),
                    datasets: createSensitivityDatasets(Shist, "Sensitivity"),
                },
                options: chartOptions,
            },
        );

        //create Production Chart
        productionChartInstance = new Chart(
            document.getElementById("productionChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Chist.length }, (_, i) => i),
                    datasets: createDatasets(Chist, "Production"),
                },
                options: chartOptions,
            },
        );

        //create Fitness Chart
        fitnessChartInstance = new Chart(
            document.getElementById("fitnessChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Whist.length }, (_, i) => i),
                    datasets: createDatasets(Whist, "Fitness"),
                },
                options: chartOptions,
            },
        );

        //create Cumulative Fitness Chart
        cumulativeFitnessChartInstance = new Chart(
            document.getElementById("cumulativeFitnessChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Wcuml.length }, (_, i) => i),
                    datasets: createDatasets(Wcuml, "Cumulative Fitness"),
                },
                options: chartOptions,
            },
        );
    }
    function handleDropdownChange() {
        if (get(variableName) === "Choose a Variable") {
            document
                .getElementById("variableDropDown")
                .classList.add("border-red-500");
            showValidationMessage.set(true);
            return;
        } else {
            document
                .getElementById("variableDropDown")
                .classList.remove("border-red-500");
            showValidationMessage.set(false);
            switch ($variableName) {
                case "K":
                    variableRangeBegin.set($K);
                    variableRangeEnd.set($K + 1);
                    break;
                case "tau":
                    variableRangeBegin.set($tau);
                    variableRangeEnd.set($tau + 1);
                    break;
                case "mu":
                    variableRangeBegin.set($mu);
                    variableRangeEnd.set($mu + 0.001);
                    break;
                case "G":
                    variableRangeBegin.set($G);
                    variableRangeEnd.set($G + 0.1);
                    break;
                case "delSmax":
                    variableRangeBegin.set($delSmax);
                    variableRangeEnd.set($delSmax + 1);
                    break;
                case "delCmax":
                    variableRangeBegin.set($delCmax);
                    variableRangeEnd.set($delCmax + 1);
                    break;
                case "alpha":
                    variableRangeBegin.set($alpha);
                    variableRangeEnd.set($alpha + 1);
                    break;
                case "beta":
                    variableRangeBegin.set($beta);
                    variableRangeEnd.set($beta + 1);
                    break;
                case "Xmin":
                    variableRangeBegin.set($Xmin);
                    variableRangeEnd.set($Xmin + 1);
                    break;
            }
        }
    }
</script>

<NavBar multiPage="true" />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Hormone Multi-Run Model Visualization
</h1>

<div class="flex flex-wrap justify-center">
    <!-- Sliders -->
    <div class="grid grid-cols-2 gap-6 ">
        <!-- Container for Gamma Sliders-->
        <div>
            <SliderInput
                id="Gamma 1"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma1}
            />

            <SliderInput
                id="Gamma 2"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma2}
            />

            <SliderInput
                id="Gamma 3"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma3}
            />
        </div>

        <!-- Container for Z sliders-->
        <div>
            <SliderInput
                id="Z 1"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z1}
            />

            <SliderInput
                id="Z 2"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z2}
            />

            <SliderInput
                id="Z 3"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z3}
            />
        </div>

        <!-- Container for food shortage sliders-->
        <div>
            <SliderInput
                id="Food Short"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$foodShort}
            />

            <SliderInput
                id="Food Short Begin"
                min="0"
                max={$foodShortend}
                step="1"
                bind:inputVar={$foodShortbegin}
            />

            <SliderInput
                id="Food Short End"
                min="0"
                max={$N}
                step="1"
                bind:inputVar={$foodShortend}
            />
        </div>

        <!-- Container for G and mu sliders-->
        <div>
            <SliderInput id="G" min="0" max="1" step="0.1" bind:inputVar={$G} />

            <SliderInput
                id="Mu"
                min="0"
                max="1"
                step="0.001"
                bind:inputVar={$mu}
            />
        </div>
    </div>

    <!-- Form Inputs -->
    <div class="flex flex-wrap justify-center">
        <!--input for gamma-->
        <!--
        <FormInput id="Gamma" inputType="text" bind:inputVar={$gamma} />
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
        <FormInput id="Z" inputType="text" bind:inputVar={$z} />
        -->

        <FormInput
            id="N"
            inputType="number"
            min="0"
            max="10000"
            step="1"
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

    <!-- Line -->
    <hr
        class="m-auto w-[90%] h-px my-6 border-1 border-indigo-500 opacity-50"
    />

    <!-- Choose bariable drop down -->
    <div class="flex flex-wrap justify-center">
        <div class="w-72 m-2">
            <form class="relative w-full min-w-[200px] h-10 invalid: iSum">
                <label
                    for="variableDropDown"
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
                    >Select an option</label
                >
                <select
                    id="variableDropDown"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
                    bind:value={$variableName}
                    on:change={handleDropdownChange}
                >
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
                    <p class="text-red-500 text-sm">Please select a variable</p>
                {/if}
            </form>
        </div>

        <FormInput
            id="Variable Range Begin"
            inputType="number"
            min="0"
            max={$variableRangeEnd}
            step="1"
            bind:inputVar={$variableRangeBegin}
        />
        <FormInput
            id="Variable Range End"
            inputType="number"
            min="0"
            max="1000000"
            step="1"
            bind:inputVar={$variableRangeEnd}
        />
        <FormInput
            id="Number of Runs"
            inputType="number"
            min="0"
            max="1000000"
            step="1"
            bind:inputVar={$numRuns}
        />
    </div>
</div>

<div class="text-center mt-4">
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
        on:click={fetchData}>Run</button
    >
</div>

{#if initialRun}
    <div class="flex flex-row flex-wrap gap-6 items-center justify-center">
        <div
            class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
        >
            <h2 class="text-center text-xl font-semibold mb-4">
                Body Condition
            </h2>
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
{/if}
