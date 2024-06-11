<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";

    let responseData = {};

    let GIn = 0.1;
    let XminIn = 1;
    let delSmaxIn = 1;
    let delCmaxIn = 1;
    let tauIn = 5;
    let KIn = 1;
    let alphaIn = 2;
    let betaIn = 2;
    let muIn = 0.0001;
    let NIn = 100;
    let foodShort = 0.5;
    let foodShortbegin = 8;
    let foodShortend = 20;

    async function fetchData() {
        try {
            const response = await axios.get(
                `api/test?GIn=${GIn}&XminIn=${XminIn}&delSmaxIn=${delSmaxIn}&delCmaxIn=${delCmaxIn}&tauIn=${tauIn}&KIn=${KIn}&alphaIn=${alphaIn}&betaIn=${betaIn}&muIn=${muIn}&NIn=${NIn}&foodShort=${foodShort}&foodShortbegin=${foodShortbegin}&foodShortend=${foodShortend}`,
            );
            responseData = response.data;
            console.log("responseData: ", responseData);
            Charts();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function Charts() {
        createChart(
            "Xhist",
            "Energy",
            responseData[0].Xhist,
            "rgba(240, 102, 148, 0.8)",
        );
        createChart(
            "Shist_1",
            "Sensitivity 1",
            responseData[1].Shist[0],
            "rgba(174, 102, 240, 0.8)",
        );
        createChart(
            "Shist_2",
            "Sensitivity 2",
            responseData[1].Shist[1],
            "rgba(102, 137, 240, 0.8)",
        );
        createChart(
            "Shist_3",
            "Sensitivity 3",
            responseData[1].Shist[2],
            "rgba(102, 203, 240, 0.8)",
        );
        createChart(
            "Chist",
            "Concentration",
            responseData[2].Chist,
            "rgba(102, 240, 194, 0.8)",
        );
        createChart(
            "Whist",
            "Fitness",
            responseData[3].Whist,
            "rgba(220, 240, 102, 0.8)",
        );
        createChart(
            "Wcuml",
            "Cumulative Fitness",
            responseData[4].Wcuml,
            "rgba(240, 174, 102, 0.8)",
        );
    }

    function createChart(canvas, chartTitle, y, color) {
        var ctx = document.getElementById(canvas).getContext("2d");
        var x = Array.from({ length: y.length }, (_, i) => i + 1);
        new Chart(ctx, {
            type: "line",
            data: {
                labels: x,
                datasets: [
                    {
                        label: chartTitle,
                        data: y,
                        borderColor: color,
                        tension: 0.1,
                    },
                ],
            },
        });
    }
</script>

<head>
    <style>
        /* Container for slider, acts as a template  */
        .slidecontainer {
            display: flex; /* allows elements to spread evenly */
            flex-wrap: wrap; /* wrap to another line if not enough space */
            justify-content: space-between;
            width: 100%;
            padding: 10px;
        }

        /* Slider */
        .slider {
            -webkit-appearance: none; /* No default browser styling */
            width: 50%;
            height: 10px;
            background: #d3d3d3; /* Slider color */
            outline: none;
            opacity: 0.7;
            -webkit-transition: 0.2s; /* Allows it to be smoother*/
            transition: opacity 0.2s;
        }

        /* Slidding part, styling for WebKit-based browsers such as Safari and Chrome */
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 25px;
            height: 25px;
            background: #04aa6d;
            cursor: pointer; /* Change cursor to pointer when hovering */
        }

        /* Also slidding part but for styling for Mozilla-based browsers such as Firefox */
        .slider::-moz-range-thumb {
            width: 25px;
            height: 25px;
            background: #04aa6d;
            cursor: pointer;
        }

        .button {
            background-color: white;
            border: 2px solid pink;
            color: black;
            padding: 10px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 10px 10px;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <h1 class="text-center text-2xl font-serif font-bold p-4">
        Hormonal Pathways
    </h1>

    <!-- First row of sliders -->
    <div class="slidecontainer">
        <div>
            <label for="GIn_slider">GIn: </label>
            <!-- Label for slider -->
            <input
                type="range"
                min="0.0"
                max="0.5"
                step="0.1"
                bind:value={GIn}
                class="slider"
                id="GIn_slider"
            />
            <span id="GIn_output">0.1</span>
            <!-- Label for value of slider -->
        </div>

        <div>
            <label for="XminIn_slider">XminIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={XminIn}
                class="slider"
                id="XminIn_slider"
            />
            <span id="XminIn_output">1</span>
        </div>

        <div>
            <label for="delSmaxIn_slider">delSmaxIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={delSmaxIn}
                class="slider"
                id="delSmaxIn_slider"
            />
            <span id="delSmaxIn_output">1</span>
        </div>

        <div>
            <label for="delCmaxIn_slider">delCmaxIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={delCmaxIn}
                class="slider"
                id="delCmaxIn_slider"
            />
            <span id="delCmaxIn_output">1</span>
        </div>

        <div>
            <label for="tauIn_slider">tauIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={tauIn}
                class="slider"
                id="tauIn_slider"
            />
            <span id="tauIn_output">5</span>
        </div>

        <div>
            <label for="KIn_slider">KIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={KIn}
                class="slider"
                id="KIn_slider"
            />
            <span id="KIn_output">1</span>
        </div>

        <div>
            <label for="alphaIn_slider">alphaIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={alphaIn}
                class="slider"
                id="alphaIn_slider"
            />
            <span id="alphaIn_output">2</span>
        </div>

        <div>
            <label for="betaIn_slider">betaIn: :</label>
            <input
                type="range"
                min="0"
                max="5"
                step="1"
                bind:value={betaIn}
                class="slider"
                id="betaIn_slider"
            />
            <span id="betaIn_output">2</span>
        </div>

        <div>
            <label for="muIn_slider">muIn: :</label>
            <input
                type="range"
                min="0"
                max="0.0005"
                step="0.0001"
                bind:value={muIn}
                class="slider"
                id="muIn_slider"
            />
            <span id="muIn_output">0.0001</span>
        </div>

        <div>
            <label for="NIn_slider">NIn: :</label>
            <input
                type="range"
                min="100"
                max="200"
                step="20"
                bind:value={NIn}
                class="slider"
                id="NIn_slider"
            />
            <span id="NIn_output">100</span>
        </div>

        <div>
            <label for="foodShort_slider">foodShort: </label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                bind:value={foodShort}
                class="slider"
                id="foodShort_slider"
            />
            <span id="foodShort_output">0.5</span>
        </div>

        <div>
            <label for="foodShortbegin_slider">foodShortbegin: </label>
            <input
                type="range"
                min="0"
                max="50"
                step="1"
                bind:value={foodShortbegin}
                class="slider"
                id="foodShortbegin_slider"
            />
            <span id="foodShortbegin_output">8</span>
        </div>

        <div>
            <label for="foodShortend_slider">foodShortend: </label>
            <input
                type="range"
                min="0"
                max="150"
                step="1"
                bind:value={foodShortend}
                class="slider"
                id="foodShortend_slider"
            />
            <span id="foodShortend_output">20</span>
        </div>

    </div>

    <button class="button" on:click={fetchData}>Run Simulation</button>

    <script>
        // Update slider values
        function updateSliderValue(sliderID, outputID) {
            var slider = document.getElementById(sliderID); //retrieves slider
            var output = document.getElementById(outputID); //retrieves output
            output.innerHTML = slider.value; //sets inner HTML content of output element to value of slider

            slider.oninput = function () {
                //event: when slider value changes, function is executed
                output.innerHTML = this.value; //this refers to slider element that triggered the event
            };
        }

        // Update values for each slider
        updateSliderValue("GIn_slider", "GIn_output");
        updateSliderValue("XminIn_slider", "XminIn_output");
        updateSliderValue("delSmaxIn_slider", "delSmaxIn_output");
        updateSliderValue("delCmaxIn_slider", "delCmaxIn_output");
        updateSliderValue("tauIn_slider", "tauIn_output");
        updateSliderValue("KIn_slider", "KIn_output");
        updateSliderValue("alphaIn_slider", "alphaIn_output");
        updateSliderValue("betaIn_slider", "betaIn_output");
        updateSliderValue("muIn_slider", "muIn_output");
        updateSliderValue("NIn_slider", "NIn_output");
        updateSliderValue("foodShort_slider", "foodShort_output");
        updateSliderValue("foodShortbegin_slider", "foodShortbegin_output");
        updateSliderValue("foodShortend_slider", "foodShortend_output");
    </script>
</body>

<div class="p-8">
    <canvas id="Xhist"></canvas>
    <!-- Energy -->
    <canvas id="Shist_1"></canvas>
    <!-- Sensitivity 1 -->
    <canvas id="Shist_2"></canvas>
    <!-- Sensitivity 2 -->
    <canvas id="Shist_3"></canvas>
    <!-- Sensitivity 3 -->
    <canvas id="Chist"></canvas>
    <!-- Concentration -->
    <canvas id="Whist"></canvas>
    <!-- Fitness -->
    <canvas id="Wcuml"></canvas>
    <!-- Cumulative Fitness -->
</div>
