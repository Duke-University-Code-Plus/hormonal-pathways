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
