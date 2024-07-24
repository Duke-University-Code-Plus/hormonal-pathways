<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";
    import FormInput from "../Nested/FormInput.svelte";
    import NavBar from "../Nested/navigation.svelte";
    import SliderInput from "../Nested/SliderInput.svelte";
    import SliderTwoInput from "../Nested/SliderTwoInput.svelte";
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
    import {apiEndpoint} from "../state_store.js"

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
    let maxValue = 0;
    let ShistConTemp = [];
    let YminCon = 0;
    let YmaxCon = 0;
    let currprefix = "";
    
    let gamma = [$gamma1, $gamma2, $gamma3];
    let z = [$z1, $z2, $z3]

    let bodyConditionChartInstance = null;
    let sensitivityChartInstance = null;
    let productionChartInstance = null;
    let fitnessChartInstance = null;
    let cumulativeFitnessChartInstance = null;

    //state
    let initialRun = false;

    onMount(() => {
        //fetchData();
    });

    async function fetchData() {
        if ($variableName === "Choose a Variable" && !$statRun) {
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
                `${$apiEndpoint}/statModel?${queryString}`,
                 );
            }
            else{
                response = await axios.get(
                    `${$apiEndpoint}/multihormonemodel?${queryString}`,
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

    // if (canvas == bodyConditionChart || canvas == sensitivityChart) {
    //     maxValue = 10
    // } else if (canvas == cumulativeFitnessChart) {
    //     maxValue = 50
    // } else if (canvas == productionChart) {
    //     maxValue = 20
    // } else {
    //     maxValue = 5
    // };


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
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true},
                    //max: maxValue
                },
            },
        };

        function createDatasets(data, ConfidenceData, labelPrefix) {
    let numRunsValue = $numRuns; // Number of lines
    if ($statRun) {
        numRunsValue = 1;
    }

    function interpolateColor(startColor, endColor, factor) {
        const result = startColor.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(
                result[i] + factor * (endColor[i] - startColor[i])
            );
        }
        return result;
    }

    const endColor = [0, 0, 255]; // Blue
    const startColor = [255, 0, 0]; // Red
    if(!$statRun){
        currprefix = labelPrefix + " " + $variableName;
    }
    let color = startColor;
    const datasets = Array.from({ length: numRunsValue }, (_, runIndex) => {
        const factor = runIndex / (numRunsValue - 1);
        let stepInValueChange = ($variableRangeEnd-$variableRangeBegin)/(numRunsValue-1);
        let valueForLabel = $variableRangeBegin+stepInValueChange*(runIndex);
        if(!$statRun){
        labelPrefix = currprefix + "=" + valueForLabel
        }
        if (!$statRun) {
            color = interpolateColor(startColor, endColor, factor);
            return {
                label: `${labelPrefix}`,
                data: data.map((point) => point[runIndex]),
                borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
                borderWidth: 1,
                radius: 0,
                fill: false,
            };
        } else {
            const mainDataset = {
                label: labelPrefix,
                data: data,
                borderColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`,
                borderWidth: 1,
                radius: 0,
                fill: '+2',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
            };

            const lowerBoundDataset = {
                label: `${labelPrefix} Lower Bound`,
                data: data.map((point, idx) =>  Math.max(point - ConfidenceData[idx],0)),
                borderColor: 'rgba(75,0,130)', 
                borderWidth: 1,
                radius: 0,
                fill: '-1',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
            };

            const upperBoundDataset = {
                label: `${labelPrefix} Upper Bound`,
                data: data.map((point, idx) => point + ConfidenceData[idx]),
                borderColor: 'rgba(75,0,130)', 
                borderWidth: 1,
                radius: 0,
                fill: false,
            };

            return [mainDataset, lowerBoundDataset, upperBoundDataset];
        }
    }).flat(); // Flatten the array to merge all datasets

    return datasets;
}

function createCharts() {
    if (bodyConditionChartInstance) bodyConditionChartInstance.destroy();
    if (sensitivityChartInstance) sensitivityChartInstance.destroy();
    if (productionChartInstance) productionChartInstance.destroy();
    if (fitnessChartInstance) fitnessChartInstance.destroy();
    if (cumulativeFitnessChartInstance)
        cumulativeFitnessChartInstance.destroy();

    // Create Body Condition Chart
    bodyConditionChartInstance = new Chart(
        document.getElementById("bodyConditionChart"),
        {
            type: "line",
            data: {
                labels: Array.from({ length: Xhist.length }, (_, i) => i),
                datasets: createDatasets(Xhist, XhistCon, "Body Condition "),
            },
            options:{
            plugins: {
                legend: {
                    display: true, // no legend
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true,text: "Body Condition"},
                    //max: maxValue
                },
            },
            },
        }
    );

    // Create Sensitivity Chart
    if ($statRun) {
        switchSensitivityGraphs();
    } else {
        sensitivityChartInstance = new Chart(
            document.getElementById("sensitivityChart"),
            {
                type: "line",
                data: {
                    labels: Array.from({ length: Shist[0].length }, (_, i) => i),
                    datasets: createSensitivityDatasets(Shist, "Sensitivity"),
                },
                options:{
            plugins: {
                legend: {
                    display: true, // no legend
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text:"Sensitivity"},
                    //max: maxValue
                },
            },
            },
            }
        );
    }

    // Create Production Chart
    productionChartInstance = new Chart(
        document.getElementById("productionChart"),
        {
            type: "line",
            data: {
                labels: Array.from({ length: Chist.length }, (_, i) => i),
                datasets: createDatasets(Chist, ChistCon, "Production"),
            },
            options:{
            plugins: {
                legend: {
                    display: true, // no legend
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Production"},
                    //max: maxValue
                },
            },
            },
        }
    );

    // Create Fitness Chart
    fitnessChartInstance = new Chart(
        document.getElementById("fitnessChart"),
        {
            type: "line",
            data: {
                labels: Array.from({ length: Whist.length }, (_, i) => i),
                datasets: createDatasets(Whist, WhistCon, "Fitness"),
            },
            options:{
            plugins: {
                legend: {
                    display: true, // no legend
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true,text:"Fitness"},
                    //max: maxValue
                },
            },
            },
            }
    );

    // Create Cumulative Fitness Chart
    cumulativeFitnessChartInstance = new Chart(
        document.getElementById("cumulativeFitnessChart"),
        {
            type: "line",
            data: {
                labels: Array.from({ length: Wcuml.length }, (_, i) => i),
                datasets: createDatasets(Wcuml, WcumlCon, "Cumulative Fitness"),
            },
            options:{
            plugins: {
                legend: {
                    display: true, // no legend
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true,text:"Cumulative Fitness"},
                    //max: maxValue
                },
            },
        }
        }
    );
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
                label: `${labelPrefix} ${$variableName}=${$variableRangeBegin+(($variableRangeEnd-$variableRangeBegin)/(numRunsValue-1))*runIndex}`,
                data: data[i].map((point) => point[runIndex]),
                borderColor: `rgba(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]}, 1)`,
                borderWidth: 1,
                radius: 0,  
                fill: false,
            }))
        );
    }

    return datasets;
}

 function switchSensitivityGraphs(ChosenTrait) {
    if (sensitivityChartInstance) sensitivityChartInstance.destroy();

    if (ChosenTrait === 'I') {
        ShistTemp = ShistI;
        ShistConTemp = ShistConI;
    } else if (ChosenTrait === 'J') {
        ShistTemp = ShistJ;
        ShistConTemp = ShistConJ;
    } else {
        ShistTemp = ShistK;
        ShistConTemp = ShistConK;
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
                datasets: createDatasets(ShistTemp,ShistConTemp, "Sensitivity"),
            },
            lineTension: 0.5,
            options:{
            plugins: {
                legend: {
                    display: true, // no legend
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: "Reproductive Cycle" },
                    max: $N,
                },
                y: {
                    beginAtZero: true,
                    title: { display: true,text:"Sensitivity"},
                    //max: maxValue
                },
            },
            },
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

function bruh() {
            $statRun = !$statRun
}
</script>

<NavBar multiPage="Multi" />

<h1
    class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
    Hormone Model - Multi Run
</h1>

<div class="flex max-w-[1200px] flex-col gap-4 px-5 pb-5 m-auto">
    <p class="text-xl font-medium">
        A male songbird tries to optimize its chances of reproductive success by choosing whether to invest in mating effort, parental effort, or gamete maturation. These three traits are mediated by hormones, which also affect the songbird's energy and fitness. The songbird tries to optimize its fitness based on its sensitivity to hormones and the concentration of hormones. Here we examine the output of many simulations to more easily visualize the impact of changes in the various parameters of the model.  
    </p>

    <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-bold mb-2">Recommended Exploration Steps</h2>
       <strong>There are two ways to explore the model using the multi-run version of the model:</strong> 
        <ol class="list-inside space-y-4 mb-2">
            <li>1. Explore the output of 100 simulations using the same set of parameters. Remember that there are several random variables that affect the output of the model, including the variable β (which affects reproductive efficacy at each time point) and µ (which is the probability that the organism dies at each time point). Running the model exploring the output of many simulations allows us to see how the organism optimizes its fitness given this element of randomness. You can access this model by selecting the ‘Median and Confidence Interval Graph’  option above the ‘Run’ button. </li>
            <ul class="list-disc list-inside space-y-4 mb-2">
                <li>
                    <strong>Step 1:</strong> Use the sliders and form inputs to change the model's values. Consult the tooltip icons on the upper right of each input to gain further insight into the model's inner workings.
                <li>
                    <strong>Step 2:</strong> Now choose a trait and select the option for "Median and Confidence Interval Graph." This will run the model 100 times. Run the model. The confidence interval is characterized by the curves above and below the middle curve (the median).
                </li>
                <li>
                    <strong>Step 3:</strong> Play around with the variables to understand how each affects the model and to learn about the relationships between each variable.
                </li>
            </ul>
            <li>
               2. Explore the output of the model across a range of possible values for a given parameter. For example, suppose you wanted to explore how |ΔCₘₐₓ| affects the output of the model, you can run the model looking at, for example, 20 increments of |ΔCₘₐₓ| ranging from 1 to 5. You can access this model by selecting the ‘Multiple Lines Graph’  option above the ‘Run’ button. 
            </li>
            <ul class="list-disc list-inside space-y-4 mb-2">
                <li>
                    <strong>Step 1:</strong> Ignore choosing a trait at the bottom of the page. Instead, choose a variable and pick a variable to change. 
                <li>
                    <strong>Step 2:</strong> Next to the dropdown, select the starting value and the ending value of a value of the chosen variable, as well as the number of runs. Run the model to see an immediate output of all variables coming together. Make sure you click the option for "Multiple Lines Graph." Observe each of the graphs to determine what exactly we are tracking. We recommend running the model three times, each with a different number of increments  to display different outputs.
                </li>
                <li>
                    <strong>Step 3:</strong> Play around with the variables to understand how each affects the model and to learn about the relationships between each variable.
                </li>
            </ul>
    </ol>
    </div>
</div>


<div class="flex flex-wrap justify-center">
    <!-- Sliders -->
    <div
        class="flex flex-wrap grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-1"
    >
        <!-- Container for Gamma Sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
            id="Investment cost for Gametes (γ₉, ₜ)"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$gamma1}
            modalMessage="A variable that determines the negative weight of gamete maturation. Gamma is used in the cost function, which dictates that the trait expression and hormone production are costly to the organism. While the cost of hormone production is so small that it is negligible, the higher the gamma value for gamete maturation, the more costly it is to the organism to invest in gamete maturation. Therefore, as the cost of gamete production increases, the benefits for investing in gamete maturation decrease."
        />

        <SliderInput
            id="Investment cost for Mating Effort (γₘ, ₜ)"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$gamma2}
            modalMessage="A variable that determines the negative weight of mating effort. Gamma is used in the cost function, which dictates that the trait expression and hormone production are costly to the organism. While the cost of hormone production is so small that it is negligible, the higher the gamma value for mating effort, the more costly it is to the organism to invest in mating effort. Therefore, as the cost of mating effort increases, the benefits for investing in mating effort decrease."
        />

        <SliderInput
            id="Investment cost for Parental Effort (γₚ, ₜ)"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$gamma3}
            modalMessage="A variable that determines the negative weight of parental effort. Gamma is used in the cost function, which dictates that the trait expression and hormone production are costly to the organism. While the cost of hormone production is so small that it is negligible, the higher the gamma value for parental effort, the more costly it is to the organism to invest in parental effort. Therefore, as the cost of parental effort increases, the benefits for investing in parental effort decrease."
        />
        </div>

        <!-- Container for Z sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
            id="Weight of Gamete Maturation Trait (z₉)" 
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$z1}
            modalMessage="The weight of the gamete maturation trait in the role of the fitness function. There higher the z value, the more impactful a trait is in the fitness function. Does not necesarily mean that a higher z is better for the organism since there are also costs when investing into a trait."
        />

        <SliderInput
            id="Weight of Mating Effort Trait (zₘ)"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$z2}
            modalMessage="The weighting of the gamete maturation trait in the fitness function, also known as the selection index. As the z value for a trait increases, the more impactful that trait is in the fitness function. However, a higher z is not necessarily always better for the organism since there are also costs when investing into a trait."
        />

        <SliderInput
            id="Weight of Parental Effort Trait (zₚ)"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$z3}
            modalMessage="The weighting of the parental effort trait in the fitness function, also known as the selection index. As the z value for a trait increases, the more impactful that trait is in the fitness function. However, a higher z is not necessarily always better for the organism since there are also costs when investing into a trait."
        />
        </div>

        <div class="flex flex-wrap justify-center w-full">
            <SliderInput 
            id="Minimum hormone level for Mature Gametes (G)" 
            min="0" 
            max="1" 
            step="0.1" 
            bind:inputVar={$G} 
            modalMessage="Minimum level of circulating hormone required for cells to mature at the end of gametogenesis, leading to the production of sperm/eggs capable of fertilization. This is the minimum production of hormone that must be present in the gamete maturation trait in order for gamete maturation to occur. Gamete maturation is required for any reproductive success, so as G increases, the organism must invest more of its resources in gamete production in order to achieve any fitness, which limits its ability to invest in other activities, including gaining energy, mating effort, and parental effort.  "
            />

        <SliderInput
            id="Mortality probability (µ)"
            min="0"
            max="1"
            step="0.001"
            bind:inputVar={$mu}
            modalMessage="In any given reproductive cycle, mu is the probability that the organism will die."
        />
        </div>

        <hr
        class="m-auto w-[90%] h-px my-6 border-1 border-indigo-500 opacity-50"
        />

        <!-- Container for food shortage sliders-->
        <div class="flex flex-wrap justify-center w-full">
            <SliderInput
            id="Food Availability Multiplier"
            min="0"
            max="1"
            step="0.1"
            bind:inputVar={$foodShort}
            modalMessage="A multiplier of current food. The lower the value, the less energy is accrued by organism during each reproductive cycle."
        />


            <SliderTwoInput
                bind:inputVarHigh={$foodShortend}
                bind:maxForVarHigh={$N}
                bind:inputVarLow={$foodShortbegin}
                inputVarHighName="Food Shortage End"
                inputVarLowName="Food Shortage Begin"
                minForVarLow=0
                step=1
            />
        </div>

        <!-- Container for G and mu sliders-->
        
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
            modalMessage="Minimum energy required for the organism to reproduce. Energy available at time, t is determined by the cost function. Decreasing the minimum energy required for reproduction will mean that more resources are available to invest in mating, parental effort, and accumulating more resources."
            bind:inputVar={$Xmin}
        />

        <FormInput
            id="Max change of sensitivity to hormone (|ΔSᵢ, ₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max change of the sensitivity in hormone in an organism. This is not the same across tissues. The organism seeks to maximizes its lifetime reproductive success by choosing the optimal level of the S at each target tissue, but it is constrained in reaching that optimum by |ΔSᵢ, ₘₐₓ| because it cannot change more that this value each cycle. Thus, as |ΔSᵢ, ₘₐₓ| increases, the faster that the organism can change its S values at each tissue to reach a phenotypic optimum."
            bind:inputVar={$delSmax}
        />

        <FormInput
            id="Max change of circulating hormone (|ΔCₘₐₓ|)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The absolute value of the max change of the circulating hormone in an organism. The organism seeks to maximizes its lifetime reproductive success by choosing the optimal level of C at each reproductive cycle, but it is constrained in reaching that optimum by |Cₘₐₓ| because it cannot change more that this value each cycle. Thus, as |Cₘₐₓ| increases, the faster that the organism can change its  hormone production to reach a phenotypic optimum"
            bind:inputVar={$delCmax}
        />

        <FormInput
            id="Food availability (τ)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="•	Determines the food available in the environment for the organism. Increasing the food availability will increase the payoff when investing in foraging."
            bind:inputVar={$tau}
        />

        <FormInput
            id="Michaelis-Menten constant (K)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="The Michaelis constant used by the Michaelis-Menten Equation. It is assumed to be equal across all tissues. K is the concentration of a substrate (in this case the hormone) at which the reaction between hormones and receptors reaches half of its maximum velocity. As K increases, more hormone is needed to achieve the same velocity of the reaction. "
            bind:inputVar={$K}
        />

        <FormInput
            id="First parameter of beta distribution (A)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="•	The individual is in an environment that is variable from one period to the next, captured by the random variable β that affects reproductive efficacy at each time point. The distribution is defined by two positive parameters, alpha (A) and beta (B), that together control the shape of the distribution. For more information, see: https://en.wikipedia.org/wiki/Beta_distribution."
            bind:inputVar={$alpha}
        />

        <FormInput
            id="Second parameter of beta distribution (B)"
            inputType="number"
            min="0"
            max="10000"
            step="1"
            modalMessage="•	The individual is in an environment that is variable from one period to the next, captured by the random variable β that affects reproductive efficacy at each time point. The distribution is defined by two positive parameters, alpha (A) and beta (B), that together control the shape of the distribution. For more information, see: https://en.wikipedia.org/wiki/Beta_distribution."
            bind:inputVar={$beta}
        />

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
    messageForValidation = "Please select a Trait For the Sensitivity Graph"
    />
    <!-- Choose variable drop down -->
    <div class="flex flex-wrap justify-center">
        <div class="w-72 m-2 mt-[27px]">
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
                    <option value="G">Hormone level for gamete maturation (G)</option>
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
            modalMessage="This specifies the beginning of the range. For the multiple run version of the model where you are exploring a range of values, you specify the beginning and end of the range and the number of increments to explore within that range. So, you might choose a variable to range from 1 to 5 with 16 increments will look at values of that variable at 1, 1.25, 1.5, 1.75, 2, etc. up to 5."
            bind:inputVar={$variableRangeBegin}
        />
        <FormInput
            id="Variable Range End"
            inputType="number"
            min="0"
            max="1000000"
            step="1"
            modalMessage="This specifies the end of the range. For the multiple run version of the model where you are exploring a range of values, you specify the beginning and end of the range and the number of increments to explore within that range. So, you might choose a variable to range from 1 to 5 with 16 increments will look at values of that variable at 1, 1.25, 1.5, 1.75, 2, etc. up to 5."
            bind:inputVar={$variableRangeEnd}
        />
        <FormInput
            id="Number of increments"
            inputType="number"
            min="0"
            max="1000000"
            step="1"
            modalMessage="For the multiple run version of the model where you are exploring a range of values, you specify the beginning and end of the range and the number of increments to explore within that range. This specifies the number of increments. So, you might choose a variable to range from 1 to 5 with 16 increments will look at values of that variable at 1, 1.25, 1.5, 1.75, 2, etc."
            bind:inputVar={$numRuns}
        />
    </div>
</div>
<div class="flex items-center text-center justify-center ">
<button
  on:click={bruh}
  class="px-4 py-2 rounded-md focus:outline-none transition-colors duration-300"
  class:bg-indigo-500={!$statRun}
  class:text-white={!$statRun}
  class:bg-indigo-600={$statRun}
  class:text-gray-100={$statRun}
>
  {!$statRun ? 'Multiple Lines Graph' : 'Median and Confidence Interval Graph'}
</button>
</div>

<div class="text-center my-4">
    <button
        class="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-4 py-2 rounded"
        on:click={fetchData}>Run</button
    >
</div>

{#if initialRun}
    <div class="flex flex-row flex-wrap gap-6 items-center justify-center mb-8">
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
