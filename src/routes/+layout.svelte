<script>
  import { page } from '$app/stores';
  import Navbar from "./Nested/navigation.svelte";
  import "../app.css";
</script>

<div class="m-0 p-0">
  {#if $page.url.pathname == '/' || $page.url.pathname == '/ecosystem-sketch'}
    <slot />
  {:else}
    <Navbar />
    <div class="pb-10 px-4">
      <slot />
    </div>
  {/if}
</div>