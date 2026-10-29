(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/admin-sw.js", { scope: "/" }).catch(() => {});
  }

  if (!["/", "/index.html", "/book.html"].includes(window.location.pathname)) return;
  const hero = document.querySelector(".hero, .page-hero");
  if (!hero) return;

  const styles = document.createElement("style");
  styles.textContent = [
    ".phone-save-card{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:24px;margin:24px auto;padding:24px 28px;background:#f6e8e5;border:1px solid #ead5cf;border-radius:18px;color:#413b2e}",
    ".phone-save-card .eyebrow{margin:0 0 6px}",
    ".phone-save-card h2{margin:0 0 8px;font-size:clamp(1.35rem,2.4vw,1.8rem)}",
    ".phone-save-card p{margin:0 0 10px;line-height:1.55}",
    ".phone-save-card details{margin-top:10px}",
    ".phone-save-card summary{cursor:pointer;font-weight:650;text-decoration:underline;text-underline-offset:3px}",
    ".phone-save-card .phone-save-steps{padding-left:20px;margin:10px 0 0}",
    ".phone-save-card .phone-save-steps li{margin:7px 0;line-height:1.5}",
    ".phone-save-card .phone-install-button{white-space:nowrap}",
    ".phone-save-card .phone-install-button[hidden]{display:none}",
    "@media(max-width:700px){.phone-save-card{align-items:flex-start;flex-direction:column;gap:10px;margin:18px auto;padding:20px}.phone-save-card .phone-install-button{width:100%}}"
  ].join("");
  document.head.append(styles);

  const card = document.createElement("section");
  card.className = "phone-save-card wrap";
  card.setAttribute("aria-labelledby", "phone-save-title");
  card.innerHTML = [
    '<div>',
    '  <div class="eyebrow">Keep us close</div>',
    '  <h2 id="phone-save-title">Save Hello Honey on your phone.</h2>',
    '  <p>Add our booking site to your Home Screen for quick access next time.</p>',
    '  <details>',
    '    <summary>Show me how</summary>',
    '    <ol class="phone-save-steps">',
    '      <li><strong>iPhone:</strong> Open this page in Safari, tap Share, then <strong>Add to Home Screen</strong> and Add.</li>',
    '      <li><strong>Android:</strong> Tap Install Hello Honey, or open Chrome menu (⋮) and choose <strong>Install app</strong> or <strong>Add to Home Screen</strong>.</li>',
    '    </ol>',
    '  </details>',
    '</div>',
    '<button class="btn phone-install-button" type="button" hidden>Install Hello Honey</button>'
  ].join("");
  hero.after(card);

  const installButton = card.querySelector(".phone-install-button");
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    installButton.disabled = true;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } finally {
      installPrompt = null;
      installButton.hidden = true;
      installButton.disabled = false;
    }
  });

  window.addEventListener("appinstalled", () => {
    installButton.hidden = true;
  });
})();
