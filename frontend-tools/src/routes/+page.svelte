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
                const response = await axios.get('http://localhost:5000/', {});
                responseData = response.data
                createCharts();
            } catch (error) {
                console.error('Error :', error);
                }
            }
        );

    function createCharts() {
        const ctx = document.getElementById('lineChart');
        new Chart(ctx, {
            type: 'line', 
            data: {
                labels: Array.from({ length: responseData[0].Xhist.length }, (_, i) => i + 1), // Generating labels from 1 to N
                datasets: [
                    {
                    label: 'Energy',
                    data: responseData[0].Xhist,
                    borderColor: 'rgba(75, 75, 75, 1)', 
                    tension: 0.1 
                    }]
                }
            });
        }

</script>
  