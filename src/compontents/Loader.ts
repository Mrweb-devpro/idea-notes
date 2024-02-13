export default function toggleloader(command: "open" | "close"): void {
  const loader = document.querySelector(".section-loader") as HTMLSelectElement;

  if (command === "close") loader.classList.add("popup-hide");
  else loader.classList.remove("popup-hide");
}
