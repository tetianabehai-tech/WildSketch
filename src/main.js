import "./styles.css";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  const setMenuOpen = (open) => {
    mobileMenu.hidden = !open;
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
