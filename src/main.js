import "./styles.css";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  const setMenuOpen = (open) => {
    mobileMenu.hidden = !open;
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-is-open", open);
    document.querySelector("main").inert = open;
    document.querySelector(".site-footer").inert = open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  };
  setMenuOpen(false);
  menuToggle.addEventListener("click", () => setMenuOpen(mobileMenu.hidden));
  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !mobileMenu.hidden) {
      const controls = [
        ...document.querySelectorAll(
          ".header-inner a, .menu-toggle, .mobile-menu a",
        ),
      ].filter((element) => element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "Escape" && !mobileMenu.hidden) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenuOpen(false);
  });
  window
    .matchMedia("(min-width: 1440px)")
    .addEventListener("change", () => setMenuOpen(false));
}

const registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!registerForm.reportValidity()) return;
    const status = registerForm.querySelector(".form-status");
    status.textContent =
      "Registration is currently unavailable. Your details have not been sent.";
    status.hidden = false;
  });
}

const eventSelect = document.querySelector("#event");
document.querySelectorAll(".event-register").forEach((link) => {
  link.addEventListener("click", () => {
    if (eventSelect) eventSelect.value = link.dataset.event;
  });
});
