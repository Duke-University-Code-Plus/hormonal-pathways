<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import FormInput from "../Nested/FormInput.svelte";
    import NavBar from "../Nested/navigation.svelte";
    import SliderInput from "../Nested/SliderInput.svelte";
    import Dropdown from "../Nested/Dropdown.svelte";
    
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
        variableName,
        variableRangeBegin,
        variableRangeEnd,
        numRuns,
        showValidationMessage,
        statRun
    } from "../data3_store.js";

    let Xhist = [];
    let Shist = [];
    let Chist = [];
    let Whist = [];
    let Wcuml = [];
    let XhistCon = [];
    let ChistCon = [];
    let WhistCon = [];
    let WcumlCon = [];
    let ShistI = [];
    let ShistJ = [];
    let ShistK = [];
    let ShistConI = [];
    let ShistConJ = [];
    let ShistConK = [];
    let ShistTemp = [];
    let ChosenTrait = 'I';
    
    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3]

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;

    const apiEndpoint = "http://127.0.0.1:5000"
    //const apiEndpoint =
    //    "https://hormonal-pathways-api-a4dcfa854663.herokuapp.com";

    //state
    let initialRun = false;

    onMount(() => {
        //fetchData();
    });

    async function fetchData() {
        if ($variableName === "Choose a Variable") {
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
                numRuns: $numRuns,
            };

            if (!$statRun) {
                params.variableName = $variableName;
                params.variableRangeBegin = $variableRangeBegin;
                params.variableRangeEnd = $variableRangeEnd;
            };

            const queryString = new URLSearchParams(params).toString();
            let response;
            // change query given which model you want to use
            if($statRun){
                 response = await axios.get(
                `${apiEndpoint}/statModel?${queryString}`,
                 );
            }
            else{
                response = await axios.get(
                    `${apiEndpoint}/multihormonemodel?${queryString}`,
                );
            }

            const data = response.data;

            // Data from API
            Xhist = data.Xhist;
            Chist = data.Chist;
            Whist = data.Whist;
            Wcuml = data.Wcuml;
            if($statRun){
                XhistCon = data.XhistCon;
                ChistCon = data.ChistCon;
                WhistCon = data.WhistCon;
                WcumlCon = data.WcumlCon;
                // Shist DataSets
                ShistI = data.ShistI;
                ShistJ = data.ShistJ;
                ShistK = data.ShistK;
                ShistConI = data.ShistConI;
                ShistConJ = data.ShistConJ;
                ShistConK = data.ShistConK;
            }
            else{
                Shist = data.Shist;
            }

            createCharts();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    // definechartOptions to higher scope
    const chartOptions = {
            plugins: {
                legend: {
                    display: false, // no legend
                },
            },
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

    function createDatasets(data, labelPrefix) {
        let numRunsValue = $numRuns; //Number of lines
        if ($statRun){
            numRunsValue = 1
        }

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
        let color = startColor;
        let dataSetRet;

        const datasets = Array.from({ length: numRunsValue }, (_, runIndex) => {
            const factor = runIndex / (numRunsValue - 1);
            if (!$statRun){
            color = interpolateColor(startColor, endColor, factor);
            dataSetRet = data.map((point) => point[runIndex])
            }
            else{
                dataSetRet = data
            }
            return {
                label: `${labelPrefix} ${runIndex + 1}`,
                data: dataSetRet,
                borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
                borderWidth: 1,
                radius: 0,
                fill: false,
            };
        });
        console.log(datasets)
        return datasets;
    }

    function createSensitivityDatasets(data, labelPrefix) {
        const numRunsValue = $numRuns;
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
                    radius: 0,
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

        //create Body Condition Chart
        bodyConditionChartInstance = new Chart(
            document.getElementById("bodyConditionChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Xhist.length }, (_, i) => i),
                    datasets: createDatasets(Xhist, "Body Condition"),
                },
                lineTension: .5,
                options: chartOptions,
            },
        );

        //createSensitivityChart if we are doing mutliRun else go to stat run sensitivity
        if ($statRun){
            switchSensitivityGraphs()
        }
        else{
            sensitivityChartInstance = new Chart(
                document.getElementById("sensitivityChart"),
                {
                    type: "line",
                    data: {
                        labels: Array.from(
                            { length: Shis[0].length },
                            (_, i) => i,
                        ),
                        datasets: createSensitivityDatasets(Shist, "Sensitivity"),
                    },
                    lineTension: .5,
                    options: chartOptions,
                },
            );
        }

        //create Production Chart
        productionChartInstance = new Chart(
            document.getElementById("productionChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Chist.length }, (_, i) => i),
                    datasets: createDatasets(Chist, "Production"),
                },
                lineTension: .5,
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
                lineTension: .5,
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
                lineTension: .5,
                options: chartOptions,
            },
        );
    }
    
    function switchSensitivityGraphs(ChosenTrait) {
    if (sensitivityChartInstance) sensitivityChartInstance.destroy();

    if (ChosenTrait === 'I') {
        ShistTemp = ShistI;
    } else if (ChosenTrait === 'J') {
        ShistTemp = ShistJ;
    } else {
        ShistTemp = ShistK;
    }

    sensitivityChartInstance = new Chart(
        document.getElementById("sensitivityChart"),
        {
            type: "line",
            data: {
                labels: Array.from(
                    { length: ShistTemp.length },
                    (_, i) => i
                ),
                datasets: createDatasets(ShistTemp, "Sensitivity"),
            },
            lineTension: 0.5,
            options: chartOptions,
        }
    );
}
    function handleDropdownChange() {
        if ($variableName === "Choose a Variable") {
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


const SenseChartoptions = [
    { value: 'I', label: 'Trait I' },
    { value: 'J', label: 'Trait J' },
    { value: 'K', label: 'Trait K' }
];
</script>

<NavBar multiPage="Multi" />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
    Hormone Model - Multi Run
</h1>

<div class="flex flex-wrap justify-center">
    <!-- Sliders -->
    <div
        class="flex flex-wrap grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1"
    >
        <!-- Container for Gamma Sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Selection against effort in trait i (γᵢ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma1}
                modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the first trait."
            />

            <SliderInput
                id="Selection against effort in trait j (γⱼ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma2}
                modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the second trait."
            />

            <SliderInput
                id="Selection against effort in trait k (γₖ, ₜ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$gamma3}
                modalMessage="A variable that determines the negative weight of a trait. The higher the value, the lower the value of the third trait."
            />
        </div>

        <!-- Container for Z sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Weight of first Trait (zᵢ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z1}
                modalMessage="The weight of the first trait in the role of the fitness function."
            />
            

            <SliderInput
                id="Weight of second trait (zⱼ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z2}
                modalMessage="The weight of the second trait in the role of the fitness function."
            />

            <SliderInput
                id="Weight of third trait (zₖ)"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$z3}
                modalMessage="The weight of the third trait in the role of the fitness function."
            />
        </div>

        <!-- Container for food shortage sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
                id="Food Shortage"
                min="0"
                max="1"
                step="0.1"
                bind:inputVar={$foodShort}
                modalMessage="A multiplier of current food."
            />

            <SliderInput
                id="Food shortage begins"
                min="0"
                max={$foodShortend}
                step="1"
                bind:inputVar={$foodShortbegin}
            />

            <SliderInput
                id="Food shortage ends"
                min="0"
                max={$N}
                step="1"
                bind:inputVar={$foodShortend}
            />
        </div>

        <!-- Container for G and mu sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput 
                id="Min hormone level for gamete maturation (G)" 
                min="0" 
                max="1"
                step="0.1" 
                bind:inputVar={$G} 
                modalMessage="Minimum level of circulating hormone for cells to mature at the end of gametogenesis. Produces cells capable of fertilization."/>

            <SliderInput
                id="Death probability (µ)"
                min="0"
                max="1"
                step="0.001"
                bind:inputVar={$mu}
                modalMessage="A fixed chance that the bird will die randomly."
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
            id="Min energy level for reproduction (xᵣₑₚ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Minimum energy required for the organism to reproduce. Energy available at time, t is determined by energy function"
            bind:inputVar={$Xmin}
        />

        <FormInput
            id="Max change of sensitivity to hormone (|ΔSᵢ, ₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the sensitivity in hormone in an organism. Not the same across tissues"
            bind:inputVar={$delSmax}
        />

        <FormInput
            id="Max change of circulating hormone (|ΔCₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max rate of change of the circulating hormone in an organism"
            bind:inputVar={$delCmax}
        />

        <FormInput
            id="Food availability (τ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Determines the food availible in the environment for the organism. "
            bind:inputVar={$tau}
        />

        <FormInput
            id="Michaelis-Menten constant (K)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="A constant used by the Michaelis-Menten Equation. Equal across all tissues."
            bind:inputVar={$K}
        />

        <FormInput
            id="First parameter of beta distribution (A)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Beta distribution is a function that takes to input variables to determine the shape of the distribution. Takes the form of beta.rvs(A, B) on the backend."
            bind:inputVar={$alpha}
        />

        <FormInput
            id="Second parameter of beta distribution (B)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Beta distribution is a function that takes to input variables to determine the shape of the distribution. Takes the form of beta.rvs(A, B) on the backend."
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
            id="Number of reproductive cycles (N)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="Number of reproductive cycles the simulation goes through. Once reached, the organism dies."
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
    <div class="flex flex-wrap justify-center">
           
        
    <!-- Trait for Sensitivity DropDown (temporary)-->
    <!-- To change options refer to the senseChartoptions Variable-->
    <Dropdown
    bind:ValueToChange={ChosenTrait}
    optionList={SenseChartoptions}
    changeFunction={(event) => {
        handleDropdownChange(event);
        switchSensitivityGraphs(event.target.value);
    }}
    showValidationMessage = {$showValidationMessage}
    messageForValidation = "Please select a Trait For the SensitivityGraph"
    />
    <!-- Choose variable drop down -->
    <div class="flex flex-wrap justify-center">
        <div class="w-72 m-2">
            <div class="relative h-10 w-72 min-w-[200px] invalid: iSum">
                <select
                id="variableDropDown"
                class="peer h-full w-full rounded-[7px] border border-gray-500 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                bind:value={$variableName}
                on:change={handleDropdownChange}>
                    <option selected>Choose a Variable</option>
                    <option value="alpha">First parameter of beta distribution (A)</option>
                    <option value="beta">Second parameter of beta distribution (B)</option>
                    <option value="delSmax">Max change of sensitivity to hormone (|ΔSᵢ, ₘₐₓ|)</option>
                    <option value="delCmax">Max change of circulating hormone (|ΔCₘₐₓ|)</option>
                    <option value="G">Min hormone level for gamete maturation (G)</option>
                    <option value="K">Michaelis-Menten constant (K)</option>
                    <option value="mu">Death probability (µ)</option>
                    <option value="tau">Food availability (τ)</option>
                    <option value="Xmin">Min energy level for reproduction (xᵣₑₚ)</option>
                </select>
                {#if $showValidationMessage}
                    <p class="text-red-500 text-sm">Please select a variable</p>
                {/if}
                <label
                for="variableDropDown"
                class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:text-blue-gray-500 peer-focus:after:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Select an option
                </label>
            </div>
        </div>
    </div>


        <FormInput
            id="Variable Range Begin"
            inputType="number"
            min="0"
            max={$variableRangeEnd}
            step="1"
            modalMessage="Sets the starting value for the chosen variable at the beginning of the number of runs."
            bind:inputVar={$variableRangeBegin}
        />
        <FormInput
            id="Variable Range End"
            inputType="number"
            min="0"
            max="1000000"
            step="1"
            modalMessage="Sets the ending value for the variable at the end of the number of runs."
            bind:inputVar={$variableRangeEnd}
        />
        <FormInput
            id="Number of Runs"
            inputType="number"
            min="0"
            max="1000000"
            step="1"
            modalMessage="Variable that runs the model multiple times. It overlays all simulations onto one graph."
            bind:inputVar={$numRuns}
        />
    </div>
</div>

<div class="text-center my-4">
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
                Energy of Organism
            </h2>
            <canvas id="bodyConditionChart"></canvas>
        </div>
        <div
            class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
        >
            <h2 class="text-center text-xl font-semibold mb-4">Sensitivity to Hormone</h2>
            <canvas id="sensitivityChart"></canvas>
        </div>
        <div
            class="w-[90%] sm:w-3/5 sm:max-w-[500px] bg-white shadow-md rounded-lg"
        >
            <h2 class="text-center text-xl font-semibold mb-4">Circulating Level Of Hormone</h2>
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
