<script>
    export let multiPage;
</script>

<nav class="bg-gray-100 dark:bg-gray-100 shadow shadow-gray-300 w-full px-8 md:px-auto">
    <div class="md:h-16 h-20 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div class="flex w-full justify-center md:justify-between items-center">
            <div class="text-gray-500 order-2 md:order-1 w-full md:w-auto md:flex-1">
                <ul class="flex flex-row gap-8 font-semibold justify-center w-full">
                    <li class="{multiPage != 'true' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-500 text-xl">
                        <a href="/">SingleModel</a>
                    </li>
                    <li class="{multiPage == 'true' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-500 text-xl">
                        <a href="/multimodel">Multimodel</a>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col justify-center ml-3"></div>
        </div>
    </div>
</nav>
