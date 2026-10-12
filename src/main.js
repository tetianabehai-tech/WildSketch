import "./styles.css";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  const setMenuOpen = (open) => {
    const wasOpen = mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-is-open", open);
    if (open || wasOpen) {
      document.querySelector("main").inert = open;
      document.querySelector(".site-footer").inert = open;
    }
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  };
  setMenuOpen(false);
  menuToggle.addEventListener("click", () =>
    setMenuOpen(!mobileMenu.classList.contains("is-open")),
  );
  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && mobileMenu.classList.contains("is-open")) {
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
    if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenuOpen(false);
  });
  window
    .matchMedia("(min-width: 768px)")
    .addEventListener("change", () => setMenuOpen(false));
}

const registerForm = document.querySelector("#register-form");
const modal = document.querySelector("[data-subscription-modal]");

let modalTrigger;
const modalBackground = [...document.body.children].filter(
  (element) => element !== modal && element.tagName !== "SCRIPT",
);
const backgroundState = new Map();
const setModalOpen = (open) => {
  if (!modal) return;
  if (open) {
    modalTrigger = document.activeElement;
    for (const element of modalBackground) {
      backgroundState.set(element, element.inert);
      element.inert = true;
    }
  } else {
    for (const [element, inert] of backgroundState) element.inert = inert;
    backgroundState.clear();
  }
  modal.classList.toggle("subscription-open", open);
  document.body.classList.toggle("subscription-is-open", open);
  if (open) modal.querySelector(".modal .button").focus();
  else modalTrigger?.focus();
};

if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!registerForm.reportValidity()) return;
    setModalOpen(true);
  });
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-modal-close]"))
      setModalOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("subscription-open")) return;
    if (event.key === "Escape") setModalOpen(false);
    if (event.key === "Tab") {
      const controls = [...modal.querySelectorAll("button")];
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
