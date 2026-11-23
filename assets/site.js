
document.addEventListener("DOMContentLoaded", () => {
  // Make the first appointment offer easy to spot across customer pages.
  const announcement = document.querySelector(".announcement");
  if (announcement) {
    // Winter offer: 30% off for bookings made 17 November – 6 December 2026 (acrylics excluded).
    // After 6 December the banner goes back to the first-appointment offer by itself.
    const winterOfferEnds = Date.UTC(2026, 11, 7, 0, 0, 0); // midnight London time, 7 Dec 2026
    const pill = 'display:inline-block;background:#f2d35e;color:#342d24;padding:7px 12px;border-radius:999px;font-size:14px;font-weight:900;letter-spacing:.05em;';
    const bookBtn = '<a href="book.html#booking-form" style="display:inline-block;background:#fff9ed;color:#3c4030;text-decoration:none;font-size:16px;font-weight:900;padding:10px 18px;border-radius:999px;box-shadow:0 2px 0 rgba(0,0,0,.18);">BOOK NOW ↗</a>';
    if (Date.now() < winterOfferEnds) {
      announcement.innerHTML = '<span style="' + pill + '">🍯 WINTER OFFER</span><strong style="font-size:22px;font-weight:900;letter-spacing:.02em;">30% OFF</strong><span style="font-size:16px;font-weight:650;">book by 6 December · acrylics excluded</span>' + bookBtn;
    } else {
      announcement.innerHTML = '<span style="' + pill + '">🍯 FIRST APPOINTMENT</span><strong style="font-size:22px;font-weight:900;letter-spacing:.02em;">10% OFF</strong><span style="font-size:16px;font-weight:650;">automatically on your first appointment</span>' + bookBtn;
    }
    Object.assign(announcement.style, {
      background: "#55313b",
      color: "#fff9ed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "8px 14px",
      padding: "12px 16px",
      fontSize: "16px",
      fontWeight: "750",
      textAlign: "center",
      letterSpacing: ".02em",
      textTransform: "none",
      boxShadow: "inset 0 -4px #e6bd4d",
      position: "sticky",
      top: "0",
      zIndex: "30",
    });

    const header = document.querySelector("header");
    const updateHeaderOffset = () => {
      if (header) header.style.top = window.matchMedia("(max-width:700px)").matches
        ? "0px" : announcement.offsetHeight + "px";
    };
    updateHeaderOffset();
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateHeaderOffset).observe(announcement);
    } else {
      window.addEventListener("resize", updateHeaderOffset, { passive: true });
    }
  }

  // Hide time-limited offer notes once their end date has passed.
  document.querySelectorAll("[data-offer-until]").forEach((el) => {
    const end = Date.parse(el.dataset.offerUntil + "T00:00:00Z");
    if (!isNaN(end) && Date.now() >= end) el.hidden = true;
  });

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
