const scrollBtn = document.getElementById("scrollDown");
const target = document.getElementById("caseStudies");


scrollBtn.addEventListener("click", () => {
target.scrollIntoView({ behavior: "smooth" });
});
