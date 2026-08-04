const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}


// Cinematic page entrance
window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
});

// Smooth page exits for internal links
document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;

  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add("page-leaving");
    window.setTimeout(() => {
      window.location.href = href;
    }, 420);
  });
});

// Subtle parallax movement
const parallaxItems = document.querySelectorAll("[data-parallax-speed]");
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallaxSpeed || 0);
    item.style.translate = `0 ${scrollY * speed}px`;
  });
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

// Falling leaves
const leafField = document.querySelector(".leaf-field");
if (leafField && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let index = 0; index < 14; index += 1) {
    const leaf = document.createElement("span");
    leaf.className = "floating-leaf";
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.setProperty("--leaf-duration", `${10 + Math.random() * 13}s`);
    leaf.style.setProperty("--leaf-delay", `${Math.random() * -18}s`);
    leaf.style.setProperty("--leaf-drift", `${-120 + Math.random() * 240}px`);
    leaf.style.scale = `${0.55 + Math.random() * 1.15}`;
    leafField.appendChild(leaf);
  }
}

// Golden cursor glow for pointer devices
if (window.matchMedia("(pointer: fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.classList.add("active");
  });

  document.documentElement.addEventListener("mouseleave", () => glow.classList.remove("active"));
}

// Lightweight glitter canvas
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const canvas = document.createElement("canvas");
  canvas.id = "glitter-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  let glitter = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function resizeGlitter() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = Math.min(90, Math.max(32, Math.floor(width / 18)));
    glitter = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.35 + Math.random() * 1.35,
      alpha: 0.08 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.018,
      drift: -0.05 + Math.random() * 0.1
    }));
  }

  function drawGlitter(time) {
    context.clearRect(0, 0, width, height);
    glitter.forEach((spark) => {
      spark.y -= spark.speed * 5;
      spark.x += spark.drift;
      if (spark.y < -4) {
        spark.y = height + 4;
        spark.x = Math.random() * width;
      }

      const pulse = (Math.sin(time * spark.speed + spark.phase) + 1) / 2;
      const alpha = spark.alpha * (0.25 + pulse * 0.75);
      context.beginPath();
      context.fillStyle = `rgba(240, 210, 142, ${alpha})`;
      context.shadowColor = `rgba(240, 210, 142, ${alpha})`;
      context.shadowBlur = 7;
      context.arc(spark.x, spark.y, spark.radius * (0.7 + pulse * 0.7), 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(drawGlitter);
  }

  resizeGlitter();
  window.addEventListener("resize", resizeGlitter);
  requestAnimationFrame(drawGlitter);
}
