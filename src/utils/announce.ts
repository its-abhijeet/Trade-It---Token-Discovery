// Minimal DOM-based live announcer — works in any component/hook by importing announce()
export function announce(message: string) {
  if (typeof window === "undefined") return;
  let el = document.getElementById("a11y-announcer");
  if (!el) {
    el = document.createElement("div");
    el.id = "a11y-announcer";
    el.setAttribute("aria-live", "polite");
    el.setAttribute("role", "status");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.overflow = "hidden";
    document.body.appendChild(el);
  }
  // set text to announce; clearing afterwards prevents repeated announcements stacking
  el.textContent = message;
  window.setTimeout(() => {
    if (el) el.textContent = "";
  }, 2000);
}
