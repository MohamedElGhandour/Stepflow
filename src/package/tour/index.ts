export function start() {
  const container = document.createElement("div");
  container.classList.add("tour");
  container.innerHTML =
    '<div class="onboarding-overlay" ></div>' + '<div class="onboarding-highlight" ></div>';
  document.body.appendChild(container);
}
