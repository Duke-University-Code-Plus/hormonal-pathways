<svelte:head>
    <!-- link p5.js and its addons like p5.dom.js or p5.sound.js -->
    <script src="/p5.js" type="text/javascript"></script>
    <script src="/p5.dom.min.js" type="text/javascript"></script>
    <!-- link p5.play.js -->
    <script src="/p5.play.js" type="text/javascript"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import FormInput from "../Nested/FormInput.svelte";
    import NavBar from "../Nested/navigation.svelte";
    import SliderInput from "../Nested/SliderInput.svelte";
    import TissueSim from "./TissueSim.svelte";
    import TissueLegend from "./TissueLegend.svelte";
    import BirdButton from "./BirdButton.svelte";
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
    } from "../data_state_store.js";
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
                delSmax: 0.6,
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
        $gamma1_tissue = Shist[0][Shist[0].length - 1] / 2;
        console.log($gamma1_tissue);
        $gamma2_tissue = Shist[1][Shist[1].length - 1] / 2;
        console.log($gamma2_tissue);
        $gamma3_tissue = Shist[2][Shist[2].length - 1] / 2;
        console.log($gamma2_tissue);
        $hormoneCount = Math.ceil(Chist[Chist.length - 1] / 2);
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
        fetchData();
        returnData();
        if (bird == 1) {
            $gamma1_tissue = Math.ceil(Math.min(10, $gamma1_tissue));
            $gamma3_tissue = Math.ceil(Math.min(10, $gamma3_tissue));
            $gamma2_tissue = Math.ceil(Math.min(10, $gamma2_tissue));
        } else if (bird == 2) {
            $gamma1_tissue = Math.ceil(Math.min(10, $gamma1_tissue * 1.4));
            $gamma3_tissue = Math.ceil(Math.min(10, $gamma3_tissue * 1.4));
            $gamma2_tissue = Math.ceil(Math.min(10, $gamma2_tissue * 1.4));
        } else if (bird == 3) {
            $gamma1_tissue = Math.ceil(Math.min(10, $gamma1_tissue * 2));
            $gamma3_tissue = Math.ceil(Math.min(10, $gamma3_tissue * 2));
            $gamma2_tissue = Math.ceil(Math.min(10, $gamma2_tissue * 2));
        }
        console.log($gamma1);
    }

    function handleSliderChange() {
        $selectedBird = 0;
        console.log("Slider change");
    }
</script>

<NavBar multiPage="Single" />

<h1
    class="mt-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo"
>
    Tissue Simulation
</h1>

<!-- Instructions -->
<div class="flex max-w-[1200px] flex-col gap-4 p-5 m-auto">

    <p class="text-xl font-medium my-4">
        Each bird exhibits a unique level of tissue sensitivity, which
        influences the maximum number of receptors present in each tissue. These
        tissues, in turn, affect the expression of various traits. By
        manipulating these parameters, you can gain insights into the
        relationship between hormone levels, receptor counts, and trait
        expression in birds.
    </p>


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
    
</div>


<div class="flex items-center justify-center font-bold text-xl mt-4 mb-8">Click a bird to run the tissue model</div>

<!-- Bird buttons -->
<div class=" flex space-x-2 justify-center">
    <div class="flex, flex-col justify-center">
        <h2 class="text-center text-l font-semibold">Low Tissue Sensitivity</h2>
        <button
            on:click={() => updateSmax(1)}
        >
            <BirdButton BirdColor="red" BirdID=1 />
        </button>
    </div>

    <div class="flex, flex-col justify-center">
        <h2 class="text-center text-l font-semibold">Average Tissue Sensitivity</h2>
        <button
            on:click={() => updateSmax(2)}
        >
            <BirdButton BirdColor="purple" BirdID=2 />
        </button>
    </div>

    <div class="flex, flex-col justify-center">
        <h2 class="text-center text-l font-semibold">High Tissue Sensitivity</h2>
        <button
            on:click={() => updateSmax(3)}
        >
            <BirdButton BirdColor="blue" BirdID=3 />
        </button>
    </div>
</div>

<!-- Run Simulation Button-->
<div class="flex flex-row justify-center">
    <!-- <div class="text-center my-4">
        <button
            class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
            on:click={returnData}>Run</button
        >
    </div> -->

    <div>
        <SliderInput
            id="hormoneCount"
            sliderLabel="Hormone Count"
            min="0"
            max="30"
            step="1"
            bind:inputVar={$hormoneCount}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
        />
    </div>
</div>

<hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 z-[100]" />

<div class="flex flex-col justify-center items-center">
    <div class="mt-[-80px] mb-5 z-[-1]">
        <TissueLegend />
    </div>

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
            sliderLabel="Receptor Count"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma1_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            callback={handleSliderChange}
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
            sliderLabel="Receptor Count"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma2_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            callback={handleSliderChange}
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
            sliderLabel="Receptor Count"
            min="0"
            max="10"
            step="1"
            bind:inputVar={$gamma3_tissue}
            modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            callback={handleSliderChange}
        />
    </div>
</div>
