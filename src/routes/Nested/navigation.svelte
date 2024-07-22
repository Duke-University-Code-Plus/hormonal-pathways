<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let isOpen = false;

    const toggleMenu = () => {
        isOpen = !isOpen;
    };

    onMount(() => {
        if (typeof document !== 'undefined') {
            // Select all dropdown toggle buttons
            const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

            dropdownToggles.forEach((toggle) => {
                toggle.addEventListener("click", () => {
                    // Find the next sibling element which is the dropdown menu
                    const dropdownMenu = toggle.nextElementSibling;

                    // Toggle the 'hidden' class to show or hide the dropdown menu
                    if (dropdownMenu.classList.contains("hidden")) {
                        // Hide any open dropdown menus before showing the new one
                        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
                            menu.classList.add("hidden");
                        });

                        dropdownMenu.classList.remove("hidden");
                    } else {
                        dropdownMenu.classList.add("hidden");
                    }
                });
            });

            // Optional: Clicking outside of an open dropdown menu closes it
            window.addEventListener("click", (event) => {
                if (!event.target.matches(".dropdown-toggle")) {
                    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
                        if (!menu.contains(event.target)) {
                            menu.classList.add("hidden");
                        }
                    });
                }
            });

            // Mobile menu toggle
            const mobileMenuButton = document.querySelector(".mobile-menu-button");
            const mobileMenu = document.querySelector(".navigation-menu");

            mobileMenuButton.addEventListener("click", () => {
                mobileMenu.classList.toggle("hidden");
                document.body.classList.toggle("menu-open", !mobileMenu.classList.contains("hidden"));
            });
        }
    });

    $: if (isOpen) {
        if (typeof document !== 'undefined') {
            document.body.classList.add('menu-open');
        }
    } else {
        if (typeof document !== 'undefined') {
            document.body.classList.remove('menu-open');
        }
    }
</script>

<style>
    body.menu-open {
        background-color: rgba(0, 0, 0, 0.5); /* Adjust the background color as needed */
    }
</style>

<nav class="bg-gray-100 dark:bg-gray-100 shadow shadow-gray-300 w-full px-8 md:px-auto">
    <div class="md:h-16 h-20 mx-auto md:px-4 py-6 container flex items-center justify-between flex-wrap md:flex-nowrap sm:block hidden">
        <a href="/" class="absolute left-0" style="top: 0;">
            <img src="/HM.png" alt="Blue Bird" class="w-32 h-32 object-cover" style="margin-top: -20px;"> 
        </a>
        <div class="flex w-full justify-between items-center">
            <div class="text-gray-500 w-full md:w-auto md:flex-1">
                <ul class="flex flex-row gap-8 font-semibold justify-center md:justify-end w-full">
                    <li class="{$page.url.pathname == '/about' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/about">About</a>
                    </li>
                    <li class="{$page.url.pathname == '/research' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/research">Research</a>
                    </li>
                    <li class="{$page.url.pathname == '/single-run' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/single-run">Single Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/multi-run' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/multi-run">Multi Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/tissue' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/tissue">Tissue</a>
                    </li>
                    <li class="{$page.url.pathname == '/environmental' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl">
                        <a href="/environmental">Environmental</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="sm:h-16 h-20 mx-auto sm:px-4 container flex items-center justify-between flex-wrap sm:flex-nowrap sm:hidden block">
        <div class="flex justify-center w-full">
            <a href="/" class="text-center">
                <span class="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">HM</span>
            </a>
        </div>
        <div class="sm:hidden flex items-center absolute left-5">
            <button class="mobile-menu-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <title>bars-3-bottom-left</title>
                    <g fill="none">
                        <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g>
                </svg>
            </button>
        </div>
        <div class="hidden sm:flex sm:flex-row flex-col items-center justify-start sm:space-x-1 navigation-menu pb-3 sm:pb-0 absolute right-0 top-16 bg-gray-100 w-full sm:w-auto z-40 p-5">
           <li class="{$page.url.pathname == '/about' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl block">
                        <a href="/about">About</a>
                    </li>
                    <li class="{$page.url.pathname == '/research' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl block">
                        <a href="/research">Research</a>
                    </li>
                    <li class="{$page.url.pathname == '/single-run' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl block">
                        <a href="/single-run">Single Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/multi-run' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl block">
                        <a href="/multi-run">Multi Run</a>
                    </li>
                    <li class="{$page.url.pathname == '/tissue' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl block">
                        <a href="/tissue">Tissue</a>
                    </li>
                    <li class="{$page.url.pathname == '/environmental' ? 'text-indigo-500' : ''} md:px-4 md:py-2 hover:text-indigo-600 text-xl block">
                        <a href="/environmental">Environmental</a>
                    </li>
            <!-- !! Old Dropdown Menu Code  !! -->
            <!-- <div class="relative">
                <button class="dropdown-toggle py-2 px-3 hover:bg-gray-700 flex items-center gap-2 rounded">
                    <span class="pointer-events-none">Graph Models</span>
                    <svg class="w-3 h-3 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>chevron-down</title>
                        <g fill="none">
                            <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </button>
                <div class="dropdown-menu absolute hidden bg-gray-700 text-white rounded-b-lg pb-2 w-48">
                    <a href="/single-run" class="block px-6 py-2 hover:bg-gray-800">Single Run</a>
                    <a href="/multi-run" class="block px-6 py-2 hover:bg-gray-800">Multi Run</a>
                </div>
            </div>
             Dropdown Menu for visual
            <div class="relative">
                <button class="dropdown-toggle py-2 px-3 hover:bg-gray-700 flex items-center gap-2 rounded">
                    <span class="pointer-events-none">Visual Models</span>
                    <svg class="w-3 h-3 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <title>bruh</title>
                        <g fill="none">
                            <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </button>
                <div class="dropdown-menu absolute hidden bg-gray-700 text-white rounded-b-lg pb-2 w-48">
                    <a href="/tissue" class="block px-6 py-2 hover:bg-gray-800">Tissue</a>
                    <a href="/environmental" class="block px-6 py-2 hover:bg-gray-800">Environmental</a>
                </div>
            </div> -->
        </div>
    </div>
</nav>

