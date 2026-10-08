import './styles.css';

const yearNode = document.querySelector('#year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const registerForm = document.querySelector('#register-form');
const successModal = document.querySelector('#success-modal');

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!registerForm.checkValidity()) {
      registerForm.reportValidity();
      return;
    }

    registerForm.reset();

    if (successModal) {
      successModal.classList.add('is-visible');
      successModal.setAttribute('aria-hidden', 'false');
    }
  });
}

const closeModalButtons = document.querySelectorAll('[data-close="true"], .modal-close, .modal-button');
closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (successModal) {
      successModal.classList.remove('is-visible');
      successModal.setAttribute('aria-hidden', 'true');
    }
  });
});
