import "modern-normalize/modern-normalize.css";
import "./css/styles.css";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".menu-close");
if (menuToggle && mobileMenu && menuClose) {
  const background = [".site-header", "main", ".site-footer"].map((selector) =>
    document.querySelector(selector),
  );
  const setMenuOpen = (open, restoreFocus = false) => {
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-is-open", open);
    background.forEach((element) => {
      element.inert = open;
    });
    menuToggle.setAttribute("aria-expanded", String(open));
    if (open) menuClose.focus();
    else if (restoreFocus) menuToggle.focus();
  };
  menuToggle.addEventListener("click", () => setMenuOpen(true));
  menuClose.addEventListener("click", () => setMenuOpen(false, true));
  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false, true);
  });
  document.addEventListener("keydown", (event) => {
    if (!mobileMenu.classList.contains("is-open")) return;
    if (event.key === "Escape") setMenuOpen(false, true);
    if (event.key === "Tab") {
      const controls = [...mobileMenu.querySelectorAll("a, button")];
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window
    .matchMedia("(min-width: 768px)")
    .addEventListener("change", (event) => {
      if (event.matches) setMenuOpen(false);
    });
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
