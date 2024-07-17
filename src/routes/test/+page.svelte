<script>
  import axios from "axios";
  import { writable, get } from "svelte/store";
  import { onMount } from "svelte";

  let Xhist = [];
  let Shist = [];
  let Chist = [];
  let Whist = [];
  let Wcuml = [];

  //default values
  let gamma1 = writable(0.1);
  let gamma2 = writable(0.2);
  let gamma3 = writable(0.3);
  let G = writable(0.1);
  let Xmin = writable(1);
  let delSmax = writable(1);
  let delCmax = writable(2);
  let tau = writable(5);
  let K = writable(1);
  let alpha = writable(4);
  let beta = writable(2);
  let mu = writable(0);
  let z1 = writable(0.2);
  let z2 = writable(0.3);
  let z3 = writable(0.3);
  let N = writable(100);
  let foodShort = writable(1);
  let foodShortbegin = writable(0);
  let foodShortend = writable(0);

  let gamma = writable([get(gamma1), get(gamma2), get(gamma3)]);
  let z = writable([get(z1), get(z2), get(z3)]);

  const apiEndpoint = "http://127.0.0.1:5000";

  //state
  let initialRun = false;

  onMount(() => {
    fetchData();
  });

  async function fetchData() {

    try {
      if (!initialRun) initialRun = true;

      gamma = writable([get(gamma1), get(gamma2), get(gamma3)]);
      z = writable([get(z1), get(z2), get(z3)]);

      const params = {
        gamma: get(gamma),
        G: get(G),
        Xmin: get(Xmin),
        delSmax: get(delSmax),
        delCmax: get(delCmax),
        tau: get(tau),
        K: get(K),
        alpha: get(alpha),
        beta: get(beta),
        mu: get(mu),
        z: get(z),
        N: get(N),
        foodShort: get(foodShort),
        foodShortbegin: get(foodShortbegin),
        foodShortend: get(foodShortend),
      };
      const queryString = new URLSearchParams(params).toString();
      console.log("Query URL:", `${apiEndpoint}/hormonemodel?${queryString}`);
      console.log(queryString)
      const response = await axios.get(`${apiEndpoint}/hormonemodel?${queryString}`);
      console.log("Response data:", response.data);
      const data = response.data;
      // Data from API
      Xhist = data.Xhist;
      Shist = data.Shist;
      Chist = data.Chist;
      Whist = data.Whist;
      Wcuml = data.Wcuml;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  $: C = Math.round(Chist.length > 0 ? Chist[Chist.length - 1] : 0);
  $: S0 = Math.round(Shist.length > 0 && Shist[0].length > 0 ? Shist[0][Shist[0].length - 1] : 0);
  $: S1 = Math.round(Shist.length > 1 && Shist[1].length > 0 ? Shist[1][Shist[1].length - 1] : 0);
  $: S2 = Math.round(Shist.length > 2 && Shist[2].length > 0 ? Shist[2][Shist[2].length - 1] : 0);
</script>

<h>
  {C}
  {S0}
  {S1}
  {S2}
</h>

  