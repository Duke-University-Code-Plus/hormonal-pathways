<script>
    import { registerables } from "chart.js";
    import { onMount } from "svelte";
  
    let width = 250;
    let height = 250;
  
    const numBoids = 100;
    const visualRange = 75;
  
    let boids = [];
  
    function initBoids() {
      for (let i = 0; i < numBoids; i += 1) {
        boids.push({
          x: Math.random() * width,
          y: Math.random() * height,
          dx: Math.random() * 10 - 5,
          dy: Math.random() * 10 - 5,
          history: [],
        });
      }
    }
  
    function distance(boid1, boid2) {
      return Math.sqrt(
        (boid1.x - boid2.x) * (boid1.x - boid2.x) +
          (boid1.y - boid2.y) * (boid1.y - boid2.y)
      );
    }
  
    function sizeCanvas() {
      const canvas = document.getElementById("boids");
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
  
    function keepWithinBounds(boid) {
      const margin = 0;
      const turnFactor = 1;
  
      if (boid.x < margin) {
        boid.dx += turnFactor;
      }
      if (boid.x > width - margin) {
        boid.dx -= turnFactor;
      }
      if (boid.y < margin) {
        boid.dy += turnFactor;
      }
      if (boid.y > height - margin) {
        boid.dy -= turnFactor;
      }
    }
  
    function flyTowardsCenter(boid) {
      const centeringFactor = 0.005;
  
      let centerX = 0;
      let centerY = 0;
      let numNeighbors = 0;
  
      for (let otherBoid of boids) {
        if (distance(boid, otherBoid) < visualRange) {
          centerX += otherBoid.x;
          centerY += otherBoid.y;
          numNeighbors += 1;
        }
      }
  
      if (numNeighbors) {
        centerX = centerX / numNeighbors;
        centerY = centerY / numNeighbors;
  
        boid.dx += (centerX - boid.x) * centeringFactor;
        boid.dy += (centerY - boid.y) * centeringFactor;
      }
    }
  
    function avoidOthers(boid) {
      const minDistance = 30;
      const avoidFactor = 0.05;
      let moveX = 0;
      let moveY = 0;
      for (let otherBoid of boids) {
        if (otherBoid !== boid) {
          if (distance(boid, otherBoid) < minDistance) {
            moveX += boid.x - otherBoid.x;
            moveY += boid.y - otherBoid.y;
          }
        }
      }
  
      boid.dx += moveX * avoidFactor;
      boid.dy += moveY * avoidFactor;
    }
  
    function matchVelocity(boid) {
      const matchingFactor = 0.05;
  
      let avgDX = 0;
      let avgDY = 0;
      let numNeighbors = 0;
  
      for (let otherBoid of boids) {
        if (distance(boid, otherBoid) < visualRange) {
          avgDX += otherBoid.dx;
          avgDY += otherBoid.dy;
          numNeighbors += 1;
        }
      }
  
      if (numNeighbors) {
        avgDX = avgDX / numNeighbors;
        avgDY = avgDY / numNeighbors;
  
        boid.dx += (avgDX - boid.dx) * matchingFactor;
        boid.dy += (avgDY - boid.dy) * matchingFactor;
      }
    }
  
    function limitSpeed(boid) {
      const speedLimit = 5;
  
      const speed = Math.sqrt(boid.dx * boid.dx + boid.dy * boid.dy);
      if (speed > speedLimit) {
        boid.dx = (boid.dx / speed) * speedLimit;
        boid.dy = (boid.dy / speed) * speedLimit;
      }
    }
  
    const DRAW_TRAIL = true;
    function drawBoid(ctx, boid) {
      const angle = Math.atan2(boid.dy, boid.dx);
      ctx.translate(boid.x, boid.y);
      ctx.rotate(angle);
      ctx.translate(-boid.x, -boid.y);
      ctx.fillStyle = "#558cf4";
      ctx.beginPath();
      ctx.moveTo(boid.x, boid.y);
      ctx.lineTo(boid.x - 15, boid.y + 5);
      ctx.lineTo(boid.x - 15, boid.y - 5);
      ctx.lineTo(boid.x, boid.y);
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
  
      if (DRAW_TRAIL) {
        ctx.strokeStyle = "#558cff66";
        ctx.beginPath();
        ctx.moveTo(boid.history[0][0], boid.history[0][1]);
        for (const point of boid.history) {
          ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
      }
    }
  
    function animationLoop() {
      for (let boid of boids) {
        flyTowardsCenter(boid);
        avoidOthers(boid);
        matchVelocity(boid);
        limitSpeed(boid);
        keepWithinBounds(boid);
  
        boid.x += boid.dx;
        boid.y += boid.dy;
        boid.history.push([boid.x, boid.y]);
        boid.history = boid.history.slice(-50);
      }
  
      const ctx = document.getElementById("boids").getContext("2d");
      ctx.clearRect(0, 0, width, height);
      for (let boid of boids) {
        drawBoid(ctx, boid);
      }
  
      window.requestAnimationFrame(animationLoop);
    }

    function handleKeyPress(event) {
    if (event.key === "Enter") {
      window.location.href = "/about";
    }
  }
  
    onMount(() => {
      window.addEventListener("resize", sizeCanvas, false);
      sizeCanvas();
      initBoids();
      window.requestAnimationFrame(animationLoop);
      addEventListener("keydown", handleKeyPress, false);
    });
  </script>
  
  <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <div class="text-center pointer-events-auto mb-4">
      <div class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-darkIndigo">
        The Hormonal Pathways <br> and Trait Expression Simulator
      </div>
    </div>
    <div class="pointer-events-auto z-30">
        <a href="/about" class="flex flex-row gap-4 font-semibold justify-center w-full px-3 py-1 text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-sm hover:from-purple-600 hover:to-indigo-500 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300">
          <span class="p-1">
            Enter
          </span>
        </a>
    </div>
  </div>
  <canvas id="boids" width="250" height="250" class="absolute inset-0 z-0"></canvas>
  
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
  </style>
  