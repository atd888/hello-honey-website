
document.addEventListener("DOMContentLoaded", () => {
  // Keep the first appointment offer visible across the customer pages.
  const announcement = document.querySelector(".announcement");
  if (announcement) {
    announcement.innerHTML = 'FIRST APPOINTMENT OFFER: 10% OFF &nbsp; <span>Tell us in your booking notes.</span> &nbsp; <a href="book.html#booking-form" style="color:#352d24;text-decoration:underline;font-weight:800;">BOOK NOW ↗</a>';
    Object.assign(announcement.style, {
      background: "#f0d76d",
      color: "#352d24",
      padding: "12px 15px",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: ".04em",
      boxShadow: "inset 0 -3px #dfac27",
      position: "sticky",
      top: "0",
      zIndex: "30",
    });

    const header = document.querySelector("header");
    const updateHeaderOffset = () => {
      if (header) header.style.top = announcement.offsetHeight + "px";
    };
    updateHeaderOffset();
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateHeaderOffset).observe(announcement);
    } else {
      window.addEventListener("resize", updateHeaderOffset, { passive: true });
    }
  }

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
