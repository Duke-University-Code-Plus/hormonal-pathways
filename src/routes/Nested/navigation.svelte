<script>
   	import { page } from '$app/stores';
</script>

<nav class="bg-gray-100 dark:bg-gray-100 shadow shadow-gray-300 w-full px-8 md:px-auto">
    <div class="md:h-16 h-20 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div class="flex w-full justify-center md:justify-between items-center">
            <div class="text-gray-500 order-2 md:order-1 w-full md:w-auto md:flex-1">
                <ul class="flex flex-row gap-8 font-semibold justify-center w-full">
                    <li class="{$page.url.pathname == '/about-us' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/about-us">About Us</a>
                    </li>
                    <li class="{$page.url.pathname == '/singlemodel' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/singlemodel">Single Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/multimodel' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/multimodel">Multi Run</a>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col justify-center ml-3"></div>
        </div>
    </div>
</nav>
