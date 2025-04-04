// /public/js/main.js
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Modal handling
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const modalClosers = document.querySelectorAll("[data-close]");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const targetModal = document.getElementById(this.dataset.modal);
      if (targetModal) {
        targetModal.style.display = "flex";
        document.body.classList.add("modal-open");
      }
    });
  });

  modalClosers.forEach((closer) => {
    closer.addEventListener("click", function () {
      const targetModal =
        document.getElementById(this.dataset.close) || this.closest(".modal");
      if (targetModal) {
        targetModal.style.display = "none";
        document.body.classList.remove("modal-open");
      }
    });
  });

  // Close modals when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });

  // Switch between login and signup forms
  const switchToSignup = document.getElementById("switchToSignup");
  const switchToLogin = document.getElementById("switchToLogin");

  if (switchToSignup) {
    switchToSignup.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("loginModal").style.display = "none";
      document.getElementById("signupModal").style.display = "flex";
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("signupModal").style.display = "none";
      document.getElementById("loginModal").style.display = "flex";
    });
  }
});
