const bell = document.getElementById("bell");
const panel = document.getElementById("notifPanel");

bell.addEventListener("click", () => {
  panel.classList.toggle("active");
});
document.addEventListener("click", (e) => {
  if (!bell.contains(e.target) && !panel.contains(e.target)) {
    panel.classList.remove("active");
  }
});