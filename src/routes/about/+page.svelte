<script>
    import Navbar from "../Nested/navigation.svelte";
    import GitHubIcon from "../Nested/GitHubIcon.svelte";
</script>
<Navbar multiPage="aboutus" />
<div>
    <h1 class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
        Project Background
    </h1>
</div>
<div class="flex m-5 max-w-[1000px] m-auto flex-col gap-4">
    The Hormonal Pathways and Trait Expression Simulator was 
developed the summer of 2024 by a team of students from Davidson 
College, Duke University, and North Carolina Central University. The team 
worked with Duke’s Office of Information Technology, Nicole M. Baran (a 
faculty researcher from in Biology at Davidson UniversityCollege), and other 
stakeholders to build an interactive app that allows exploration of a
mathematical model of hormone influence on traits, with particular examples
in songbirds.
    <p>
        The project grew out of an unpublished mathematical model developed by Nicole M. Baran, H.K. Reeve, F. 
Havlak, and E. Adkins-Regan. The model is a dynamic state variable model of
how organisms optimize their reproductive fitness using hormonal signals 
which influence multiple traits (i.e. hormonal pleiotropy)
    </p>
<div>
    <div class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
        Project Goals
    </div>
</div>
1. Develop an interactive website, enabling
researchers and students to test various
parameters of Dr. Baran’s male songbird model
<p>
2. Use graphical visualizations and simulations to
show effects on hormone concentration, receptor
sensitivity, and reproductive fitness
</p>
</div>


<div>
    <!-- TODO added more resources code+ program, Dr.Baron, Duke, NCShare -->
    <h2 class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
        Partners and Stakeholders
    </h2>
   <p class="text-center items-center justify-center flex">
         <!-- <a href="https:/github.com/aaronkutnick/hormonal-pathways" class="ml-4">
            <GitHubIcon width="64" height="64" fill="#24292f" />
        </a> -->
         <a href="https://codeplus.duke.edu/" class="ml-4">
            <img src="/Code+logo.png" alt="Duke Code+ logo" height=auto width=200>
       </a>
        <a href="https://www.davidson.edu/people/nicole-m-baran" class="ml-4">
            <img src="/davidson.png" alt="davidson logo" height=auto width=200 >
        </a>  
        <a href="https://www.nccu.edu/" class="ml-4">
            <img src="/NCCU.png" alt="NCCU logo" height=auto width=200>
        </a>
        <a href="https://nsf.gov" class="ml-4">
            <img src="/NSF_logo.png" alt="NSF logo" height=auto width=100>
        </a>
    </p>
</div>
<div>
    <h3 class="my-8 text-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-indigo-500 from-darkIndigo">
        Meet the Team
    </h3>
</div>
<div class="flex flex-wrap justify-center m-5">
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/AaronPic.png" alt="Photo of Aaron Kutnick, the Team Lead" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Team Lead: Aaron Kutnick</h4>
        <p class="text-center mt-2">Best Team Lead in Code+ <br>
            UX/UI Designer <br> Web Developer for Duke</p>
    </div>
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/BillyPic.png" alt="Photo of Billy McCune" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Billy McCune</h4>
        <p class="text-center mt-2">Duke Class of '27 <br> Majoring in Computer Science <br> and Mathematics</p>
    </div>
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/BrandonPic.png" alt="Photo of Brandon Rivera" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Brandon Rivera</h4>
        <p class="text-center mt-2">Davidson Class of '27 <br> Majoring in Computer Science</p>
    </div>
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/HarutaPic.png" alt="Photo of Haruta Otaki" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Haruta Otaki</h4>
        <p class="text-center mt-2">Davidson Class of '27 <br> Majoring in Computer Science</p>
    </div>
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/KarismaPic.png" alt="Photo of Karisma Lavana" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Karisma Lavana</h4>
        <p class="text-center mt-2">Duke Class of '27<br> Majoring in Computer Science</p>
    </div>
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/NelsonPic.png" alt="Photo of Nelson Anderson" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Nelson Anderson</h4>
        <p class="text-center mt-2">NCCU Class of '25 <br> Majoring in Information Technology</p>
    </div>
    <div class="m-5 p-5 border rounded shadow-lg">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="/VanessaPic.png" alt="Photo of Vanessa Lin" class="rounded-full w-32 h-32 mx-auto object-cover">
        <h4 class="text-center text-xl font-bold mt-4">Vanessa Lin</h4>
        <p class="text-center mt-2">Duke Class of '26 <br> Majoring in Biomedical Engineering <br> and Computer Science</p>
    </div>
</div>
