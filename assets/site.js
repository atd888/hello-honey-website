
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation menu
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".navlinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");

      toggle.setAttribute(
        "aria-expanded",
        links.classList.contains("open") ? "true" : "false"
      );
    });
  }

  // Gallery category filters
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      document.querySelectorAll("[data-category]").forEach((card) => {
        card.hidden = !(
          filter === "all" || card.dataset.category === filter
        );
      });
    });
  });

  // Intentionally do not intercept the booking form here.
  // Its submission will be connected to Supabase in book.html.
});
