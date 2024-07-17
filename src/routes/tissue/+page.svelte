<script>
  import TissueSim from '../simulationmodel/TissueSim.svelte';


  import {gamma1_tissue, gamma2_tissue, gamma3_tissue, hormoneCount} from "../tissue_store.js"

  function fakeReturnData(){
        console.log("Button clicked")
        $gamma1_tissue = 5;
        $gamma2_tissue = 3;
        $gamma3_tissue = 9;
        $hormoneCount = 20;
    }

</script>


<button on:click={fakeReturnData}>Fake Data Update</button>




<TissueSim canvas={'gamma1_tissue'}/>
