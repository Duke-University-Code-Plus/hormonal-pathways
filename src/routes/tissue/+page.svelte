<script>
  import TissueSim from '../simulationmodel/TissueSim.svelte';


  import {gamma1_tissue, gamma2_tissue, gamma3_tissue} from "../tissue_store.js"

  function fadeReturnData(){
        console.log("Button clicked")
        $gamma1_tissue = 5
    }

</script>


<button on:click={fadeReturnData}>Fake Data Update</button>




<TissueSim />