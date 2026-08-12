/* =========================================================
   باربری حرفه‌ای | script.js
   نسخه کامل سمت کاربر
   ========================================================= */

"use strict";

/* =========================================================
   تنظیمات اصلی
   ========================================================= */

const CONFIG = {
    currency: "تومان",
    trackingPrefix: "BR",
    storagePrefix: "barbari_"
};


/* =========================================================
   ابزارهای عمومی
   ========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

function storageKey(name) {
    return CONFIG.storagePrefix + name;
}

function getStorage(name, fallback = null) {
    try {
        const value = localStorage.getItem(storageKey(name));
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function setStorage(name, value) {
    try {
        localStorage.setItem(storageKey(name), JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

function removeStorage(name) {
    try {
        localStorage.removeItem(storageKey(name));
    } catch {}
}

function formatNumber(number) {
    return new Intl.NumberFormat("fa-IR").format(
        Number(number || 0)
    );
}

function generateId(prefix = CONFIG.trackingPrefix) {
    const time = Date.now().toString(36).toUpperCase();
    const random = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `${prefix}-${time}-${random}`;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   اعلان‌های سایت
   ========================================================= */

function createToastContainer() {
    let container = $("#toast-container");

    if (container) return container;

    container = document.createElement("div");
    container.id = "toast-container";

    Object.assign(container.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "99999",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "min(380px, 90vw)"
    });

    document.body.appendChild(container);

    return container;
}

function showToast(message, type = "success", duration = 3500) {
    const container = createToastContainer();

    const toast = document.createElement("div");

    const colors = {
        success: "#00b894",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#0b5cff"
    };

    Object.assign(toast.style, {
        background: "#ffffff",
        color: "#172033",
        borderRight: `5px solid ${colors[type] || colors.info}`,
        padding: "14px 18px",
        borderRadius: "12px",
        boxShadow: "0 15px 40px rgba(0,0,0,.15)",
        fontWeight: "700",
        direction: "rtl",
        animation: "barbariToastIn .3s ease",
        cursor: "pointer"
    });

    toast.textContent = message;

    toast.addEventListener("click", () => {
        toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(20px)";

        setTimeout(() => toast.remove(), 300);
    }, duration);
}


/* =========================================================
   انیمیشن اعلان
   ========================================================= */

(function addToastAnimation() {
    if ($("#barbari-toast-style")) return;

    const style = document.createElement("style");
    style.id = "barbari-toast-style";

    style.textContent = `
        @keyframes barbariToastIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;

    document.head.appendChild(style);
})();


/* =========================================================
   منوی موبایل
   ========================================================= */

function initMobileMenu() {
    const navigation = $(".navigation");

    if (!navigation) return;

    let toggle = $(".menu-toggle");

    if (!toggle) {
        toggle = document.createElement("button");

        toggle.className = "menu-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "باز کردن منو");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = "☰";

        const headerContent =
            $(".header-content") ||
            navigation.parentElement;

        if (headerContent) {
            headerContent.appendChild(toggle);
        }
    }

    toggle.addEventListener("click", () => {
        const opened = navigation.classList.toggle("show");

        toggle.setAttribute(
            "aria-expanded",
            opened ? "true" : "false"
        );

        toggle.innerHTML = opened ? "✕" : "☰";
    });

    $$(".nav-link", navigation).forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("show");
            toggle.setAttribute("aria-expanded", "false");
            toggle.innerHTML = "☰";
        });
    });

    document.addEventListener("click", event => {
        if (
            navigation.classList.contains("show") &&
            !navigation.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            navigation.classList.remove("show");
            toggle.setAttribute("aria-expanded", "false");
            toggle.innerHTML = "☰";
        }
    });
}


/* =========================================================
   لینک‌های داخلی
   ========================================================= */

function initSmoothLinks() {
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = $(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);
        });
    });
}


/* =========================================================
   فعال کردن لینک بخش فعلی
   ========================================================= */

function initActiveNavigation() {
    const links = $$(".nav-link");

    if (!links.length) return;

    const sections = links
        .map(link => {
            const id = link.getAttribute("href");

            if (!id || !id.startsWith("#")) return null;

            return $(id);
        })
        .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                links.forEach(link => {
                    link.classList.remove("active");
                });

                const active = links.find(
                    link =>
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                );

                if (active) {
                    active.classList.add("active");
                }
            });
        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    sections.forEach(section => observer.observe(section));
}


/* =========================================================
   سیستم رهگیری بار
   ========================================================= */

function getShipments() {
    return getStorage("shipments", []);
}

function saveShipments(shipments) {
    setStorage("shipments", shipments);
}

function findShipment(trackingCode) {
    const shipments = getShipments();

    return shipments.find(
        shipment =>
            String(shipment.trackingCode).toLowerCase() ===
            String(trackingCode).trim().toLowerCase()
    );
}

function renderTrackingResult(shipment, container) {
    if (!container) return;

    if (!shipment) {
        container.innerHTML = `
            <div class="alert alert-danger">
                بار با این کد رهگیری پیدا نشد.
            </div>
        `;
        return;
    }

    const statusLabels = {
        registered: "ثبت اولیه",
        confirmed: "تأیید شده",
        pickup: "در انتظار بارگیری",
        transit: "در مسیر",
        delivered: "تحویل شده",
        cancelled: "لغو شده"
    };

    container.innerHTML = `
        <div class="card">
            <span class="badge badge-success">
                ${escapeHTML(
                    statusLabels[shipment.status] ||
                    shipment.status ||
                    "در حال بررسی"
                )}
            </span>

            <h3 style="margin-top:15px">
                کد رهگیری:
                ${escapeHTML(shipment.trackingCode)}
            </h3>

            <p>
                مبدأ:
                <strong>
                    ${escapeHTML(shipment.origin || "-")}
                </strong>
            </p>

            <p>
                مقصد:
                <strong>
                    ${escapeHTML(shipment.destination || "-")}
                </strong>
            </p>

            <p>
                نوع بار:
                <strong>
                    ${escapeHTML(shipment.cargo || "-")}
                </strong>
            </p>

            <p>
                نوع خودرو:
                <strong>
                    ${escapeHTML(shipment.vehicle || "-")}
                </strong>
            </p>
        </div>
    `;
}

function initTracking() {
    const forms = $$("form");

    forms.forEach(form => {
        const inputs = $$("input", form);

        const trackingInput = inputs.find(input => {
            const text = `
                ${input.name || ""}
                ${input.id || ""}
                ${input.placeholder || ""}
            `.toLowerCase();

            return (
                text.includes("tracking") ||
                text.includes("رهگیری") ||
                text.includes("کد رهگیری")
            );
        });

        if (!trackingInput) return;

        form.addEventListener("submit", event => {
            event.preventDefault();

            const code = trackingInput.value.trim();

            if (!code) {
                showToast(
                    "لطفاً کد رهگیری را وارد کنید.",
                    "warning"
                );
                trackingInput.focus();
                return;
            }

            const shipment = findShipment(code);

            let result =
                $(".tracking-result", form) ||
                $(".tracking-result");

            if (!result) {
                result = document.createElement("div");
                result.className = "tracking-result";
                result.style.marginTop = "20px";

                form.parentElement?.appendChild(result);
            }

            renderTrackingResult(shipment, result);
        });
    });
}


/* =========================================================
   محاسبه تقریبی هزینه حمل
   ========================================================= */

const vehicleRates = {
    "وانت": 1200000,
    "نیسان": 1800000,
    "خاور": 3200000,
    "کامیون": 4800000,
    "تریلی": 7200000
};

function calculateShippingPrice(data) {
    const vehicle = data.vehicle || "";
    const distance = Number(data.distance || 0);
    const weight = Number(data.weight || 0);

    const base =
        vehicleRates[vehicle] ||
        1500000;

    const distanceCost =
        distance > 50
            ? (distance - 50) * 18000
            : 0;

    const weightCost =
        weight > 1000
            ? (weight - 1000) * 120
            : 0;

    return Math.round(
        base +
        distanceCost +
        weightCost
    );
}

function initPriceCalculator() {
    const forms = $$("form");

    forms.forEach(form => {
        const text = form.textContent.toLowerCase();

        if (
            !text.includes("قیمت") &&
            !text.includes("استعلام")
        ) {
            return;
        }

        const inputs = $$("input, select", form);

        const vehicleInput = inputs.find(input => {
            const value = `
                ${input.name || ""}
                ${input.id || ""}
                ${input.placeholder || ""}
            `.toLowerCase();

            return (
                value.includes("vehicle") ||
                value.includes("خودرو")
            );
        });

        const distanceInput = inputs.find(input => {
            const value = `
                ${input.name || ""}
                ${input.id || ""}
                ${input.placeholder || ""}
            `.toLowerCase();

            return (
                value.includes("distance") ||
                value.includes("مسافت") ||
                value.includes("کیلومتر")
            );
        });

        const weightInput = inputs.find(input => {
            const value = `
                ${input.name || ""}
                ${input.id || ""}
                ${input.placeholder || ""}
            `.toLowerCase();

            return (
                value.includes("weight") ||
                value.includes("وزن")
            );
        });

        if (!vehicleInput && !distanceInput && !weightInput) {
            return;
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            const price = calculateShippingPrice({
                vehicle: vehicleInput?.value,
                distance: distanceInput?.value,
                weight: weightInput?.value
            });

            let result =
                $(".price-result", form);

            if (!result) {
                result = document.createElement("div");
                result.className = "price-result";
                result.style.marginTop = "20px";
                form.appendChild(result);
            }

            result.innerHTML = `
                <div class="alert alert-success">
                    هزینه تقریبی حمل:
                    <strong>
                        ${formatNumber(price)}
                        ${CONFIG.currency}
                    </strong>
                </div>
            `;
        });
    });
}


/* =========================================================
   ثبت سفارش حمل
   ========================================================= */

function initOrderForms() {
    $$("form").forEach(form => {
        const text = form.textContent.toLowerCase();

        const isOrderForm =
            text.includes("ثبت سفارش") ||
            text.includes("ثبت بار") ||
            form.dataset.form === "order";

        if (!isOrderForm) return;

        form.addEventListener("submit", event => {
            event.preventDefault();

            const formData = new FormData(form);

            const order = {
                id: generateId("ORD"),
                trackingCode: generateId(),
                customerName:
                    formData.get("customerName") ||
                    formData.get("name") ||
                    "",
                phone:
                    formData.get("phone") ||
                    "",
                origin:
                    formData.get("origin") ||
                    "",
                destination:
                    formData.get("destination") ||
                    "",
                cargo:
                    formData.get("cargo") ||
                    "",
                vehicle:
                    formData.get("vehicle") ||
                    "",
                weight:
                    formData.get("weight") ||
                    "",
                description:
                    formData.get("description") ||
                    "",
                status: "registered",
                createdAt: new Date().toISOString()
            };

            const shipments = getShipments();

            shipments.push(order);

            saveShipments(shipments);

            form.reset();

            showToast(
                `سفارش شما ثبت شد. کد رهگیری: ${order.trackingCode}`,
                "success",
                6000
            );

            form.dispatchEvent(
                new CustomEvent("orderCreated", {
                    detail: order
                })
            );
        });
    });
}


/* =========================================================
   اعتبارسنجی شماره موبایل
   ========================================================= */

function isValidIranianMobile(phone) {
    const normalized = String(phone)
        .replace(/\s+/g, "")
        .replace(/-/g, "");

    return /^(?:\+98|0098|98|0)?9\d{9}$/.test(
        normalized
    );
}

function initPhoneValidation() {
    $$("input[type='tel']").forEach(input => {
        input.addEventListener("blur", () => {
            if (!input.value.trim()) return;

            if (!isValidIranianMobile(input.value)) {
                input.style.borderColor = "#ef4444";

                showToast(
                    "شماره موبایل واردشده معتبر نیست.",
                    "warning"
                );
            } else {
                input.style.borderColor = "#00b894";
            }
        });
    });
}


/* =========================================================
   جلوگیری از ارسال فرم خالی
   ========================================================= */

function initFormValidation() {
    $$("form").forEach(form => {
        form.addEventListener("submit", event => {
            const requiredInputs =
                $$("[required]", form);

            let valid = true;

            requiredInputs.forEach(input => {
                if (!String(input.value).trim()) {
                    valid = false;
                    input.style.borderColor = "#ef4444";
                } else {
                    input.style.borderColor = "";
                }
            });

            if (!valid) {
                event.preventDefault();

                showToast(
                    "لطفاً تمام فیلدهای ضروری را تکمیل کنید.",
                    "warning"
                );
            }
        });
    });
}


/* =========================================================
   دکمه‌های کپی کد رهگیری
   ========================================================= */

function initCopyButtons() {
    $$("[data-copy]").forEach(button => {
        button.addEventListener("click", async () => {
            const selector =
                button.dataset.copy;

            const element = $(selector);

            if (!element) return;

            const value =
                element.value ||
                element.textContent;

            try {
                await navigator.clipboard.writeText(
                    value.trim()
                );

                showToast(
                    "کد با موفقیت کپی شد.",
                    "success"
                );
            } catch {
                showToast(
                    "کپی کردن انجام نشد.",
                    "error"
                );
            }
        });
    });
}


/* =========================================================
   اسکرول به بالا
   ========================================================= */

function initBackToTop() {
    const button = document.createElement("button");

    button.type = "button";
    button.innerHTML = "↑";
    button.setAttribute(
        "aria-label",
        "بازگشت به بالای صفحه"
    );

    Object.assign(button.style, {
        position: "fixed",
        left: "20px",
        bottom: "20px",
        width: "48px",
        height: "48px",
        border: "none",
        borderRadius: "50%",
        background: "#0b5cff",
        color: "#fff",
        fontSize: "22px",
        fontWeight: "900",
        cursor: "pointer",
        zIndex: "9990",
        opacity: "0",
        visibility: "hidden",
        transition: "all .3s ease",
        boxShadow: "0 10px 25px rgba(11,92,255,.25)"
    });

    document.body.appendChild(button);

    window.addEventListener(
        "scroll",
        () => {
            const visible =
                window.scrollY > 500;

            button.style.opacity =
                visible ? "1" : "0";

            button.style.visibility =
                visible ? "visible" : "hidden";
        },
        { passive: true }
    );

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================================
   انیمیشن ورود بخش‌ها
   ========================================================= */

function initRevealAnimation() {
    const elements = $$(
        ".card, .service-card, .feature-card, .stat, .form-box, .tracking-box, .cta"
    );

    if (!elements.length) return;

    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    elements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform =
            "translateY(25px)";
        element.style.transition =
            "opacity .6s ease, transform .6s ease";
    });

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(element =>
        observer.observe(element)
    );
}


/* =========================================================
   جلوگیری از دوبار اجرای اسکریپت
   ========================================================= */

function init() {
    initMobileMenu();
    initSmoothLinks();
    initActiveNavigation();
    initTracking();
    initPriceCalculator();
    initOrderForms();
    initPhoneValidation();
    initFormValidation();
    initCopyButtons();
    initBackToTop();
    initRevealAnimation();

    console.log(
        "🚛 سیستم باربری حرفه‌ای با موفقیت فعال شد."
    );
}


/* =========================================================
   اجرای برنامه
   ========================================================= */

if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        init,
        { once: true }
    );
} else {
    init();
      }
