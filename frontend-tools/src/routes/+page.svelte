<head>
    <!-- Responsive layout  -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style>
        /* Container for slider, acts as a template  */
        .slidecontainer {
            width: 50%;
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
    </style>
</head>

<body>
    <h1 class="text-center text-2xl font-serif font-bold p-4">Hormonal Pathways</h1>

    <div class="slidecontainer">
        <input
            type="range"
            min="1"
            max="100"
            value="50"
            class="slider"
            id="parameter1"
        />
        <p>Value: <span id="demo"></span></p>
    </div>

    <script>
        var slider = document.getElementById("parameter1");
        var output = document.getElementById("demo");
        output.innerHTML = slider.value;

        slider.oninput = function () {
            output.innerHTML = this.value;
        };
    </script>
</body>

<script>
    import { onMount } from "svelte";
    import axios from "axios";
    import Chart from "chart.js/auto";

    let responseData = {};

    // https://rapidapi.com/guides/axios-async-await
    onMount(async () => {
        try {
            //const response = await axios.get(`http://127.0.0.1:5000/test?input=8`);
            //const response = await axios.get('api/test?gammaIn1=8');
            const response = await axios.get("api/test");
            responseData = response.data;
            console.log("responseData: ", responseData);
            Charts();
        } catch (error) {
            console.error("Error:", error);
        }
    });

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
        var ctx = document.getElementById(canvas);
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
