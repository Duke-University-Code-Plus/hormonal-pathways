<script>
    import Modal from './Modal.svelte';
    import axios from 'axios';

    export let data;
    let showModal = false;
    let modalMessage = null;

    async function runLlavaScript(base64Data) {
        try {
            const response = await fetch('http://localhost:5200/llavaserver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ base64: base64Data })
            });
            const result = await response.json();
            return result.message;
        } catch (error) {
            console.error('Error running script:', error);
        }
    }

    $: if (data) {
        handleDataChange();
    }

    async function handleDataChange() {
        const message = await runLlavaScript(data);
        modalMessage = message;
        setTimeout(() => {
            showModal = true;
        }, 2000);
    }
</script>

<div class="flex flex-row flex-wrap justify-end -mt-3 ml-1">
  {#if showModal}
      <Modal bind:showModal>
          <h2 class="m-top-5 mt-3 text-blue-gray-500" slot="header">
              Is this pizza?
          </h2>
          <div class="flex ms-auto inline-flex m-8">
              <p class="font-sans text-sm font-normal text-blue-gray-500">
                  {modalMessage}
              </p>
          </div>
      </Modal>
  {/if}
</div>




<!-- <script>
    import Chart from "chart.js/auto";
    import axios from "axios";
    import Modal from './Modal.svelte';
    import { get } from 'svelte/store';
    import { base64Data } from '../base64_store.js';

    function runLlavaScript() {
        const base64 = get(base64Data);  // Get the base64 data from the Svelte store
        console.log("Base64 data:", base64);
        // Use the base64 data to run your Python file
    }

    runLlavaScript();    

    export let data;

    let modalMessage = null;

    let showModal = false;



</script>

<div class="flex flex-row flex-wrap justify-end -mt-3 ml-1">
    <button on:click={() => (showModal = true) }> 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>          
    </button>

    <Modal bind:showModal>
      <h2 
        class="m-top-5 mt-3 text-blue-gray-500" 
        slot="header">
        {id}
      </h2>
      <div class="flex ms-auto inline-flex m-8">
        <p class="font-sans text-sm font-normal text-blue-gray-500">
          Useful information
        </p>
      </div>
    </Modal>
</div> -->