<script>
  import Navbar from "./Nested/navigation.svelte";
  import "../app.css";
</script>

<div class="m-0 p-0">
  <Navbar />
  <div class="pb-10 px-4">
    <slot />
  </div>
</div>
