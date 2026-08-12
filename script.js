"use strict";

/* =========================================================
   BARBARI WEBSITE — MAIN JAVASCRIPT
   نسخه کامل و یک‌تکه
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTS
  ======================================================= */

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector("#menuButton");
  const navigation = document.querySelector(".navigation");
  const contactButton = document.querySelector("#contactButton");
  const yearElements = document.querySelectorAll("#year");
  const navLinks = document.querySelectorAll(".nav-link");
  const buttons = document.querySelectorAll("a.button, button.button");

  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("show");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuButton.setAttribute(
        "aria-label",
        isOpen
          ? "بستن منو"
          : "باز کردن منو"
      );

      menuButton.textContent = isOpen
        ? "✕"
        : "☰";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("show");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        menuButton.setAttribute(
          "aria-label",
          "باز کردن منو"
        );

        menuButton.textContent = "☰";
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        navigation.contains(event.target);

      const clickedMenuButton =
        menuButton.contains(event.target);

      if (
        !clickedInsideMenu &&
        !clickedMenuButton &&
        navigation.classList.contains("show")
      ) {
        navigation.classList.remove("show");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        menuButton.setAttribute(
          "aria-label",
          "باز کردن منو"
        );

        menuButton.textContent = "☰";
      }
    });
  }

  /* =======================================================
     HEADER SCROLL EFFECT
  ======================================================= */

  const updateHeader = () => {
    if (!header) {
      return;
    }

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );

  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const updateActiveNavigation = () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop =
        section.offsetTop - 140;

      const sectionBottom =
        sectionTop + section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionBottom
      ) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      const target =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === `#${currentSection}`
      );
    });
  };

  updateActiveNavigation();

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );

  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        const headerHeight =
          header
            ? header.offsetHeight
            : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          10;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      });
    });

  /* =======================================================
     CONTACT BUTTON
  ======================================================= */

  if (contactButton) {
    contactButton.addEventListener(
      "click",
      () => {
        const contactSection =
          document.querySelector("#contact");

        if (contactSection) {
          const headerHeight =
            header
              ? header.offsetHeight
              : 0;

          const position =
            contactSection.getBoundingClientRect()
              .top +
            window.scrollY -
            headerHeight -
            10;

          window.scrollTo({
            top: position,
            behavior: "smooth"
          });
        }

        showNotification(
          "بخش تماس آماده توسعه است 🚚",
          "success"
        );
      }
    );
  }

  /* =======================================================
     BUTTON RIPPLE EFFECT
  ======================================================= */

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      function (event) {
        const rect =
          this.getBoundingClientRect();

        const ripple =
          document.createElement("span");

        ripple.className =
          "button-ripple";

        ripple.style.left =
          `${event.clientX - rect.left}px`;

        ripple.style.top =
          `${event.clientY - rect.top}px`;

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
    );
  });

  /* =======================================================
     REVEAL ON SCROLL
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".feature-card, .service-card, .hero-card, .contact-box"
    );

  if (
    "IntersectionObserver" in window &&
    revealElements.length
  ) {
    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "is-visible"
              );

              observerInstance.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach((element) => {
      element.classList.add("reveal");

      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =======================================================
     NOTIFICATION SYSTEM
  ======================================================= */

  function showNotification(
    message,
    type = "info"
  ) {
    let container =
      document.querySelector(
        "#notification-container"
      );

    if (!container) {
      container =
        document.createElement("div");

      container.id =
        "notification-container";

      container.setAttribute(
        "aria-live",
        "polite"
      );

      document.body.appendChild(
        container
      );
    }

    const notification =
      document.createElement("div");

    notification.className =
      `site-notification ${type}`;

    const icon =
      type === "success"
        ? "✓"
        : type === "error"
        ? "!"
        : "i";

    notification.innerHTML = `
      <span class="notification-icon">
        ${icon}
      </span>

      <span class="notification-message">
        ${escapeHTML(message)}
      </span>

      <button
        type="button"
        class="notification-close"
        aria-label="بستن"
      >
        ×
      </button>
    `;

    container.appendChild(
      notification
    );

    requestAnimationFrame(() => {
      notification.classList.add(
        "visible"
      );
    });

    const closeButton =
      notification.querySelector(
        ".notification-close"
      );

    closeButton.addEventListener(
      "click",
      () => {
        removeNotification(
          notification
        );
      }
    );

    setTimeout(() => {
      removeNotification(
        notification
      );
    }, 4500);
  }

  function removeNotification(
    notification
  ) {
    if (!notification) {
      return;
    }

    notification.classList.remove(
      "visible"
    );

    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  /* =======================================================
     SAFE HTML ESCAPE
  ======================================================= */

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* =======================================================
     KEYBOARD ACCESSIBILITY
  ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        navigation &&
        navigation.classList.contains(
          "show"
        )
      ) {
        navigation.classList.remove(
          "show"
        );

        if (menuButton) {
          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

          menuButton.setAttribute(
            "aria-label",
            "باز کردن منو"
          );

          menuButton.textContent =
            "☰";
        }
      }
    }
  );

  /* =======================================================
     PREVENT DOUBLE SUBMIT
     برای فرم‌هایی که بعداً اضافه می‌کنیم
  ======================================================= */

  document
    .querySelectorAll("form")
    .forEach((form) => {
      form.addEventListener(
        "submit",
        () => {
          const submitButton =
            form.querySelector(
              'button[type="submit"]'
            );

          if (!submitButton) {
            return;
          }

          submitButton.dataset.originalText =
            submitButton.textContent;

          submitButton.disabled = true;

          submitButton.textContent =
            "در حال پردازش...";

          setTimeout(() => {
            submitButton.disabled =
              false;

            submitButton.textContent =
              submitButton.dataset
                .originalText;
          }, 3000);
        }
      );
    });

  /* =======================================================
     CONSOLE
  ======================================================= */

  console.log(
    "🚚 سایت باربری با موفقیت بارگذاری شد."
  );

  console.log(
    "نسخه JavaScript: 1.0"
  );
});
