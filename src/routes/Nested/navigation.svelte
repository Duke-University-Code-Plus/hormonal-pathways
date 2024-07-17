<script>
    import { page } from '$app/stores';
</script>

<nav class="bg-gray-100 dark:bg-gray-100 shadow shadow-gray-300 w-full px-8 md:px-auto sm:block hidden">
    <div class="md:h-16 h-20 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <a href="/" class="absolute left-5 top-5">
            <span class="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">HM</span>
        </a>
        <div class="flex w-full justify-between items-center">
            <div class="text-gray-500 w-full md:w-auto md:flex-1">
                <ul class="flex flex-row gap-8 font-semibold justify-center md:justify-end w-full">
                    <li class="{$page.url.pathname == '/about-us' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/about-us">About Us</a>
                    </li>
                    <li class="{$page.url.pathname == '/research' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/research'">Research</a>
                    </li>
                    <li class="{$page.url.pathname == '/singlemodel' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/singlemodel">Single Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/multimodel' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/multimodel">Multi Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/simulationmodel' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/simulationmodel">Tissue</a>
                    </li>
                    <li class="{$page.url.pathname == '/ecosystemsim' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/ecosystemsim">Ecosystem</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>
