<script>
    export let id;
    export let inputType;
    export let min;
    export let max;
    export let step;
    export let inputVar; 
  
  </script>
  
  <div class="w-72 m-2">
    <div class="relative w-full min-w-[200px] h-10">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          class="peer w-full h-full bg-transparent font-sans text-sm appearance-none [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-pink-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
          bind:value={inputVar}
        />
        
        <label
            for={id}
            class="flex absolute left-0 font-normal truncate leading-tight -top-1.5 text-[11px]">{id}
        </label>
        
        <span class="absolute text-[11px] -mr-1 bottom-0  right-0 -top-1.5 -mb-6">{inputVar}</span>

      
    </div>
  </div>