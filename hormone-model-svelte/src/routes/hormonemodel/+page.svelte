<script>
  import axios from 'axios';
  import { onMount } from 'svelte';

  let data = {};

  onMount(async () => {
      try {
          const response = await axios.get('http://127.0.0.1:5000/hormonemodel');
          data = response.data;
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  });
</script>

<main>
  <h1>{data.message}</h1>
</main>