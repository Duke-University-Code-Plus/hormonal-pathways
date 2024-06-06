<div>
    <canvas id="lineChart"></canvas> <!-- creating canvas -->
</div>

<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Chart from 'chart.js/auto';
  
    let responseData = {};

    // https://rapidapi.com/guides/axios-async-await
    onMount(
        async () => {
            try {
                const response = await axios.get('http://localhost:5000');
                responseData = response.data
                Charts();
            } catch (error) {
                console.error(error);
            }
        }
    );

    function Charts() {
        var ctx = document.getElementById('lineChart');
        var x = Array.from({ length: responseData[0].Xhist.length }, (_, i) => i + 1);
        new Chart(ctx, { 
            type: 'line', 
            data: {
                labels: x, 
                datasets: [
                    {
                    label: 'Energy',
                    data: responseData[0].Xhist,
                    borderColor: 'rgba(75, 75, 75, 1)', 
                    tension: 0.1 
                    }
                ]
                }
            });
        }

</script>
  