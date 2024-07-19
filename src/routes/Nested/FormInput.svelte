<script>
  export let id;
  export let inputType;
  export let min;
  export let max;
  export let step = 1;
  export let inputVar; 
  export let modalMessage;
  import Modal from './Modal.svelte';

	let showModal = false;

</script>

<div class="w-72 m-2">
  <div class="flex flex-row flex-wrap justify-end ">
    <button on:click={() => (showModal = true)}> 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" size-5 -mt-px ">
        <path fill-rule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clip-rule="evenodd">
        </path>
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
          {modalMessage}
        </p>
      </div>
    </Modal>
  </div>

  <div class="relative w-full min-w-[200px] h-10">
    <!--{#if inputType === 'number'}-->
    <!--Old Styling Code-->
    <!--"peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"-->
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      step={step}
      class="peer h-full w-full rounded-[7px] border border-gray-500 border-t-transparent
      focus:border-t-transparent border-1 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-500 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-500 focus:border-2 focus:border-purple-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
      bind:value={inputVar}
    />
    <!--
    {:else}
      <input
        id={id}
        type="text"
        class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100"
        bind:value={inputVar}
      />
    {/if}-->
    <!--Old Styling Code-->
    <!--"flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate
      peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent
      peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px]
      peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px]
      before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2
      before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
      after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1
      peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2
      after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
      peer-placeholder-shown:leading-[3.75] text-blue-gray-400 peer-focus:text-purple-500 before:border-blue-gray-200
      peer-focus:before:!border-purple-500 after:border-blue-gray-200 peer-focus:after:!border-purple-500"-->
    <label
      for={id}
      class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-900 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-purple-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-purple-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-purple-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:after:border-t-transparent peerpeer-disabled:peer-placeholder-shown:text-blue-gray-500"
    >{id}</label>
  </div>
</div>

