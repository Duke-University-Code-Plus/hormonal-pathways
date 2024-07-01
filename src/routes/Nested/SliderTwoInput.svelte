<script>
    import { onMount } from 'svelte';
    export let inputVarLow;
    export let inputVarLowName;
    export let inputVarHigh;
    export let inputVarHighName;
    export let minForVarLow;
    export let maxForVarHigh;
    export let step;

    function controlFromInput(event) {
        inputVarLow = parseInt(event.target.value);
        if (inputVarLow > inputVarHigh) {
            inputVarLow = inputVarHigh;
        }
        fillSlider();
    }

    function controlToInput(event) {
        inputVarHigh = parseInt(event.target.value);
        if (inputVarHigh < inputVarLow) {
            inputVarHigh = inputVarLow;
        }
        fillSlider();
    }

    function controlFromSlider(event) {
        inputVarLow = parseInt(event.target.value);
        if (inputVarLow > inputVarHigh) {
            inputVarLow = inputVarHigh;
        }
        fillSlider();
    }

    function controlToSlider(event) {
        inputVarHigh = parseInt(event.target.value);
        if (inputVarHigh < inputVarLow) {
            inputVarHigh = inputVarLow;
        }
        fillSlider();
    }

    function fillSlider() {
        if (typeof document === 'undefined') return;

        const fromSlider = document.getElementById('fromSlider');
        const toSlider = document.getElementById('toSlider');
        const sliderColor = '#C6C6C6';
        const rangeColor = '#25daa5';
        const rangeDistance = toSlider.max - toSlider.min;
        const fromPosition = inputVarLow - toSlider.min;
        const toPosition = inputVarHigh - toSlider.min;

        toSlider.style.background = `linear-gradient(
            to right,
            ${sliderColor} 0%,
            ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
            ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
            ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
            ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
            ${sliderColor} 100%)`;
    }

    function setToggleAccessible() {
        if (typeof document === 'undefined') return;

        const toSlider = document.getElementById('toSlider');
        if (inputVarHigh <= 0) {
            toSlider.style.zIndex = 2;
        } else {
            toSlider.style.zIndex = 0;
        }
    }

    onMount(() => {
        fillSlider();
        setToggleAccessible();
    });
</script>
<!-- container -->
<div class="range_container flex flex-col w-1/5">
    <div class="sliders_control relative min-h-12">
        <input id="fromSlider" type="range" step={step} bind:value={inputVarLow} min={minForVarLow}  max={maxForVarHigh} class="absolute w-full h-3 rounded-full appearance-none bg-gray-100 pointer-events-none z-10" on:input={controlFromSlider} />
        <input id="toSlider" type="range" step={step} bind:value={inputVarHigh} min={minForVarLow}  max={maxForVarHigh} class="absolute w-full h-3 rounded-full appearance-none bg-gray-100 pointer-events-none " on:input={controlToSlider} />
    </div>

<!-- input boxes and text -->
    <div class="form_control flex justify-between text-sm text-blue-gray-700 font-sans ">
        <div class="form_control_container flex flex-wrap items-center">
            <div>{inputVarLowName}</div>
            <input type="number" bind:value={inputVarLow} min={minForVarLow}  max={maxForVarHigh}  class="peer  bg-transparent text-blue-gray-700 font-sans l outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200
            border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100 text-[11px] w-12 h-8" on:input={controlFromInput} />
        </div>
        <div class="form_control_container flex flex-wrap items-center z-10">
            <div>{inputVarHighName}</div>
            <input type="number" bind:value={inputVarHigh} min={minForVarLow} max={maxForVarHigh}  class="peer  bg-transparent text-blue-gray-700 font-sans outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200
            border focus:border-2 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:border-purple-500 placeholder:text-blue-gray-100 text-[11px] w-12 h-8" on:input={controlToInput} />
        </div>
    </div>
</div>

<style>
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        width: 20px;
        height: 20px;
        background-color:#a855f7;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type=range]::-moz-range-thumb {
        pointer-events: all;
        width: 24px;
        height: 24px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #C6C6C6;
        cursor: pointer;
    }
</style>





