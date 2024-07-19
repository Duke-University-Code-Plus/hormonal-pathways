<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import FormInput from "../Nested/FormInput.svelte";
    import NavBar from "../Nested/navigation.svelte";
    import SliderInput from "../Nested/SliderInput.svelte";
    import TissueSim from "./TissueSim.svelte";
    import TissueLegend from "./TissueLegend.svelte";
    import { writable } from "svelte/store";
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
        foodShortend,
    } from "../data_store.js";
    import { apiEndpoint } from "../state_store.js";
    import {
        gamma1_tissue,
        gamma2_tissue,
        gamma3_tissue,
        hormoneCount,
        currRate1,
        currRate2,
        currRate3,
        receptorsBound1,
        receptorsBound2,
        receptorsBound3,
        labelToggle,
        selectedBird,
    } from "../tissue_store";

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

    let canvas1 = "gamma1_tissue";
    let canvas2 = "gamma2_tissue";
    let canvas3 = "gamma3_tissue";

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
                foodShortend: $foodShortend,
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(
                `${$apiEndpoint}/hormonemodel?${queryString}`,
            );
            const data = response.data;

            // Data from API
            Xhist = data.Xhist;
            Shist = data.Shist;
            //console.log(Shist);
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;
            Vhist = data.Vhist;

            //createCharts();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function fakeReturnData() {
        console.log("Button clicked");
        $gamma1_tissue = 5;
        $gamma2_tissue = 3;
        $gamma3_tissue = 9;
        $hormoneCount = 20;
    }

    function returnData() {
        //will call billys function here which updates tissue-stores based on delSmax and gamma vals?
        reset();
        $gamma1_tissue = 5;
        $gamma2_tissue = 3;
        $gamma3_tissue = 9;
        $hormoneCount = 20;
    }

    function reset() {
        //tissueSimKey += 1;
        // $gamma1_tissue = 0;
        // $gamma2_tissue = 0;
        // $gamma3_tissue = 0;
        // $hormoneCount = 0;
        $currRate1 = 0;
        $currRate2 = 0;
        $currRate3 = 0;

        $receptorsBound1 = 0;
        $receptorsBound2 = 0;
        $receptorsBound3 = 0;
    }

    function updateSmax(bird) {
        console.log("bird button clicked", bird);
        //reset();
        $selectedBird = bird;
        // if (bird == 1) {
        //     $delSmax = 10;
        // } else if (bird == 2) {
        //     $delSmax = 20;
        // } else if (bird == 3) {
        //     $delSmax = 30;
        // }
        returnData();
    }
    function handleSliderChange() {
        $selectedBird = 0;
        console.log("selectedBird", $selectedBird);
    }
</script>

<NavBar multiPage="Single" />

<!-- Instructions -->
<div class="flex max-w-[1200px] flex-col gap-4 p-5 m-auto">
    <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-bold mb-2">Simulation Steps</h2>
        <ul class="list-disc list-inside">
            <li class="mb-2">
                <strong>Step 1:</strong> Select a bird to begin the simulation. This
                selection will determine the baseline tissue sensitivity and receptor
                levels.
            </li>
            <li class="mb-2">
                <strong>Step 2:</strong> Observe how the number of receptors in each
                tissue affects the mRNA production within the cells.
            </li>
            <li class="mb-2">
                <strong>Step 3:</strong> Use the sliders to adjust the receptor count
                and hormone levels. This allows you to see how changes in receptor
                quantity impact mRNA production and, consequently, trait expression.
            </li>
            <li class="mb-2">
                <strong>Step 4:</strong> Feel free to experiment with different combinations
                of receptor and hormone levels to understand the role of receptors
                in mRNA production and trait expression.
            </li>
        </ul>
    </div>
    <p class="text-xl font-semibold mt-4">
        Each bird exhibits a unique level of tissue sensitivity, which
        influences the maximum number of receptors present in each tissue. These
        tissues, in turn, affect the expression of various traits. By manipulating these parameters, you can gain insights into the
        relationship between hormone levels, receptor counts, and trait
        expression in birds.
    </p>
</div>

<!-- Bird buttons -->
<div class=" flex space-x-2 justify-center my-4">
    <button
        class="px-4 py-2 border rounded transition-colors duration-200"
        class:bg-gray-400={$selectedBird === 1}
        class:text-white={$selectedBird === 1}
        class:bg-white={$selectedBird !== 1}
        class:text-black={$selectedBird !== 1}
        on:click={() => updateSmax(1)}
    >
        Bird 1
    </button>
    <button
        class="px-4 py-2 border rounded transition-colors duration-200"
        class:bg-gray-400={$selectedBird === 2}
        class:text-white={$selectedBird === 2}
        class:bg-white={$selectedBird !== 2}
        class:text-black={$selectedBird !== 2}
        on:click={() => updateSmax(2)}
    >
        Bird 2
    </button>
    <button
        class="px-4 py-2 border rounded transition-colors duration-200"
        class:bg-gray-400={$selectedBird === 3}
        class:text-white={$selectedBird === 3}
        class:bg-white={$selectedBird !== 3}
        class:text-black={$selectedBird !== 3}
        on:click={() => updateSmax(3)}
    >
        Bird 3
    </button>
</div>

<!-- Run Simulation Button-->
<div class="flex flex-row justify-center">
    <!-- <div class="text-center my-4">
        <button
            class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
            on:click={returnData}>Run</button
        >
    </div> -->

    <label class="inline-flex items-center cursor-pointer m-4">
        <!-- Added margin-left here -->
        <input
            type="checkbox"
            value=""
            class="sr-only peer"
            on:click={() => ($labelToggle = !$labelToggle)}
        />
        <div
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
        ></div>
        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Show Simulation Labels</span
        >
    </label>
</div>

<div class="flex flex-col justify-center items-center">
    <div>
        <SliderInput
            id="hormoneCount"
            min="0"
            max="30"
            step="1"
            bind:inputVar={$hormoneCount}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
        />
    </div>
    <div>
        <TissueLegend />
    </div>
</div>

<!-- Simulations -->
<div class="flex flex-row flex-wrap items-center justify-center p-5 space-x-10">
    <div class="flex flex-col justify-center">
        <h2 class="text-center text-xl font-semibold">
            Gamete Maturation <em>(V<sub>g</sub> ,<sub>t</sub>)</em>
        </h2>
        <div class="rounded-lg overflow-hidden shadow-md my-5">
            <TissueSim canvas={canvas1} />
            <p>Current Rate: {$currRate1} receptors bound/min</p>
            <p>Total Number of Receptors Bound: {$receptorsBound1}</p>
        </div>
        <SliderInput
            id="gamma1_tissue"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma1_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
        />
    </div>

    <div class="flex flex-col">
        <h2 class="text-center text-xl font-semibold">
            Parental Effort <em>(V<sub>m</sub> ,<sub>t</sub>)</em>
        </h2>
        <div class="rounded-lg overflow-hidden shadow-md my-5">
            <TissueSim canvas={canvas2} />
            <p>Current Rate: {$currRate2} receptors bound/min</p>
            <p>Total Number of Receptors Bound: {$receptorsBound2}</p>
        </div>
        <SliderInput
            id="gamma2_tissue"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma2_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            on:input={handleSliderChange}
        />
    </div>

    <div class="flex flex-col">
        <h2 class="text-center text-xl font-semibold">
            Mating Effort <em>(V<sub>p</sub> ,<sub>t</sub>)</em>
        </h2>
        <div class="rounded-lg overflow-hidden shadow-md my-5">
            <TissueSim canvas={canvas3} />
            <p>Current Rate: {$currRate3} receptors bound/min</p>
            <p>Total Number of Receptors Bound: {$receptorsBound3}</p>
        </div>
        <SliderInput
            id="gamma3_tissue"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma3_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            oninput="handleSliderChange()"
        />
    </div>
</div>
