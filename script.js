document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.getElementById('scrollDown');
  const target = document.getElementById('caseStudies');
  const heroBg = document.querySelector('.hero-bg');
  const tools = document.querySelectorAll('.tool-icon');

  if (scrollBtn && target) {
    scrollBtn.addEventListener('click', () => {
      target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Parallax effect for hero background
  const onScroll = () => {
    const scrolled = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.2}px)`;
    // simple reveal for cards
    const cards = document.querySelectorAll('.card');
    for (const c of cards) {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) c.classList.add('in-view');
    }
  };
  window.addEventListener('scroll', onScroll);
  // initial call to reveal any cards on load
  onScroll();

  // Micro interactions on tool icons
  tools.forEach((t, idx) => {
    t.style.transitionDelay = `${idx * 80}ms`;
  });
});
const scrollBtn = document.getElementById("scrollDown");
const target = document.getElementById("caseStudies");


scrollBtn.addEventListener("click", () => {
target.scrollIntoView({ behavior: "smooth" });
});
