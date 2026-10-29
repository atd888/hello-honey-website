
document.addEventListener("DOMContentLoaded", () => {
  // Make the first appointment offer easy to spot across customer pages.
  const announcement = document.querySelector(".announcement");
  if (announcement) {
    announcement.innerHTML = '<span style="display:inline-block;background:#f2d35e;color:#342d24;padding:7px 12px;border-radius:999px;font-size:12px;font-weight:900;letter-spacing:.05em;">🍯 FIRST APPOINTMENT</span><strong style="font-size:19px;font-weight:900;letter-spacing:.02em;">10% OFF</strong><span style="font-size:14px;font-weight:650;">your first visit</span><a href="book.html#booking-form" style="display:inline-block;background:#fff9ed;color:#3c4030;text-decoration:none;font-size:13px;font-weight:900;padding:10px 18px;border-radius:999px;box-shadow:0 2px 0 rgba(0,0,0,.18);">BOOK NOW ↗</a>';
    Object.assign(announcement.style, {
      background: "#55313b",
      color: "#fff9ed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "8px 14px",
      padding: "12px 16px",
      fontSize: "15px",
      fontWeight: "750",
      textAlign: "center",
      boxShadow: "inset 0 -4px #e6bd4d",
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
