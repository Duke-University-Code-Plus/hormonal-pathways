<script>
    export let id;
    export let min;
    export let max;
    export let step;
    export let inputVar;
</script>

<div class="w-72 m-2">
    <div class="relative w-full min-w-[200px] h-10">
        <!-- Slider-->
        <input
            {id}
            type="range"
            {min}
            {max}
            {step}
            class="peer w-3/4 h-full bg-transparent font-sans text-sm appearance-none [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
            bind:value={inputVar}
        />

        <!-- Input Box -->
        <input
            {id}
            type="number"
            {min}
            {max}
            {step}
            class="peer w-1/4 h-3/4 bg-transparent text-blue-gray-700 font-sans font-normal outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200
            border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100 absolute text-[11px] -mr-1 bottom-0 right-0 -top-0.5"
            bind:value={inputVar}
        />

        <!-- Variable Label -->
        <label
            for={id}
            class="flex absolute left-0 font-normal truncate leading-tight -top-1.5 text-[11px]"
            >{id}
        </label>

        <!-- Slider Value -->
        <!--
        <span class="absolute text-[11px] -mr-1 bottom-0  right-0 -top-1.5 -mb-6">{inputVar}</span>
        -->
    </div>
</div>
