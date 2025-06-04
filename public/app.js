window.addEventListener('DOMContentLoaded', () => {
  // Efecto interactivo para card3
  const $card3 = document.getElementById('card3');
  let bounds;

function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
    $card3.style.transform = `
scale3d(1.07, 1.07, 1.07)
rotate3d(
${center.y / 100},
${-center.x / 100},
0,
${Math.log(distance) * 2}deg
)
`;
    $card3.querySelector(".glow").style.backgroundImage = `
radial-gradient(
circle at
${center.x * 2 + bounds.width / 2}px
${center.y * 2 + bounds.height / 2}px,
#ffffff55,
#0000000f
)
`;
}

$card3.addEventListener("mouseenter", () => {
    bounds = $card3.getBoundingClientRect();
    document.addEventListener("mousemove", rotateToMouse);
});

$card3.addEventListener("mouseleave", () => {
    document.removeEventListener("mousemove", rotateToMouse);
    $card3.style.transform = "";
    $card3.querySelector(".glow").style.backgroundImage = "";
});

  // Animaciones reveal en scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
