import { links } from "./config.js";

document.querySelectorAll("[data-link]").forEach((element) => {
  const key = element.dataset.link;
  const url = links[key]?.trim();

  if (!url) {
    element.removeAttribute("href");
    element.setAttribute("aria-disabled", "true");
    return;
  }

  element.href = url;
  element.target = "_blank";
  element.rel = "noopener noreferrer";
  element.removeAttribute("aria-disabled");
});
