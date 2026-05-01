/* =========================================================
   Portfolio Yuga — Interactive Behaviors
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Mobile menu (with backdrop & scroll lock) ---------- */
    const menuIcon = document.getElementById("pmenu-icon");
    const navbar = document.querySelector(".pnavbar");
    const menuBackdrop = document.getElementById("menu-backdrop");
    if (menuIcon && navbar) {
        const setOpen = (open) => {
            navbar.classList.toggle("active", open);
            menuIcon.classList.toggle("fa-bars", !open);
            menuIcon.classList.toggle("fa-xmark", open);
            if (menuBackdrop) menuBackdrop.classList.toggle("show", open);
            document.body.style.overflow = open ? "hidden" : "";
        };
        const closeNav = () => setOpen(false);
        menuIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            setOpen(!navbar.classList.contains("active"));
        });
        navbar.querySelectorAll("a.nav-link").forEach(link => {
            link.addEventListener("click", closeNav);
        });
        if (menuBackdrop) menuBackdrop.addEventListener("click", closeNav);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeNav();
        });
    }

    /* ---------- Scroll progress + header + back-to-top + scroll spy ---------- */
    const progress = document.getElementById("scroll-progress");
    const header = document.getElementById("pheader");
    const backTop = document.getElementById("back-to-top");
    const stickySocial = document.getElementById("social-sticky");
    const navLinks = document.querySelectorAll(".pnavbar a.nav-link");
    const sectionDots = document.querySelectorAll(".section-dots a");
    const allHrefs = new Set([
        ...Array.from(navLinks).map(l => l.getAttribute("href")),
        ...Array.from(sectionDots).map(d => d.getAttribute("href"))
    ]);
    const sections = Array.from(document.querySelectorAll("section[id]"))
        .filter(s => allHrefs.has("#" + s.id));

    // Cache section offsets — recomputed on resize/load only.
    // Reading offsetTop inside scroll RAF causes forced layout reflow every frame (jank).
    let sectionOffsets = [];
    const recomputeOffsets = () => {
        sectionOffsets = sections.map(sec => ({ id: sec.id, top: sec.offsetTop }));
    };
    // Track last applied state to skip redundant DOM writes
    let lastHeader = null, lastBackTop = null, lastSticky = null, lastCurrent = "";

    let rafId = null;
    const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            const h = document.documentElement;
            const st = h.scrollTop;
            const max = h.scrollHeight - h.clientHeight;
            const scrolled = max > 0 ? st / max : 0;

            if (progress) progress.style.transform = `scaleX(${scrolled})`;

            const headerOn = st > 30;
            if (header && headerOn !== lastHeader) {
                header.classList.toggle("scrolled", headerOn);
                lastHeader = headerOn;
            }

            if (backTop) {
                const btOn = st > 400;
                if (btOn !== lastBackTop) {
                    backTop.classList.toggle("show", btOn);
                    lastBackTop = btOn;
                }
                backTop.style.setProperty("--scroll", Math.round(scrolled * 100));
            }

            // Sticky social bar (merged into same RAF — no extra scroll listener)
            if (stickySocial) {
                const ssOn = st > 600;
                if (ssOn !== lastSticky) {
                    stickySocial.classList.toggle("show", ssOn);
                    lastSticky = ssOn;
                }
            }

            // Scroll spy — uses cached offsets (no forced reflow)
            let current = "";
            const offset = 140;
            const cursor = st + offset;
            for (let i = 0; i < sectionOffsets.length; i++) {
                if (cursor >= sectionOffsets[i].top) current = sectionOffsets[i].id;
            }
            if (current !== lastCurrent) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
                });
                sectionDots.forEach(dot => {
                    dot.classList.toggle("active", dot.getAttribute("data-section") === current);
                });
                lastCurrent = current;
            }
            rafId = null;
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recomputeOffsets, { passive: true });
    window.addEventListener("load", recomputeOffsets);
    recomputeOffsets();
    onScroll();

    if (backTop) {
        backTop.addEventListener("click", () =>
            window.scrollTo({ top: 0, behavior: prefersReduce ? "auto" : "smooth" })
        );
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && !prefersReduce) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                entry.target.querySelectorAll?.(".bar-fill").forEach(b => {
                    const lvl = b.getAttribute("data-level") || "70";
                    b.style.width = lvl + "%";
                    const pbar = b.closest(".pbar");
                    if (pbar) pbar.setAttribute("data-level", lvl);
                });
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
    } else {
        // Fallback: show everything immediately
        revealEls.forEach(el => {
            el.classList.add("show");
            el.querySelectorAll?.(".bar-fill").forEach(b => {
                const lvl = b.getAttribute("data-level") || "70";
                b.style.width = lvl + "%";
                const pbar = b.closest(".pbar");
                if (pbar) pbar.setAttribute("data-level", lvl);
            });
        });
    }

    /* (3D tilt removed — CSS-only hover lift used instead) */
    const isTouch = window.matchMedia("(hover: none)").matches;

    /* (hero parallax removed for performance) */

    /* ---------- Theme toggle ---------- */
    const themeBtn = document.getElementById("theme-toggle");
    const root = document.documentElement;
    const setIcon = (name) => {
        const i = themeBtn?.querySelector("i");
        if (!i) return;
        i.className = `fa-solid ${name}`;
    };
    const savedTheme = localStorage.getItem("yuga-theme");
    if (savedTheme === "light") {
        root.setAttribute("data-theme", "light");
        setIcon("fa-sun");
    }
    themeBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        const isLight = root.getAttribute("data-theme") === "light";
        if (isLight) {
            root.removeAttribute("data-theme");
            localStorage.setItem("yuga-theme", "dark");
            setIcon("fa-moon");
            toast("Mode gelap aktif", "info");
        } else {
            root.setAttribute("data-theme", "light");
            localStorage.setItem("yuga-theme", "light");
            setIcon("fa-sun");
            toast("Mode terang aktif", "info");
        }
    });

    /* ---------- Toast helper ---------- */
    const toastBox = document.getElementById("toast-container");
    function toast(message, type = "info") {
        if (!toastBox) return;
        const el = document.createElement("div");
        el.className = `toast ${type}`;
        const icon = type === "success" ? "fa-circle-check"
                    : type === "error" ? "fa-circle-xmark"
                    : "fa-circle-info";
        el.innerHTML = `<i class="fa-solid ${icon}"></i><span></span>`;
        el.querySelector("span").textContent = message;
        toastBox.appendChild(el);
        requestAnimationFrame(() => el.classList.add("show"));
        setTimeout(() => {
            el.classList.remove("show");
            setTimeout(() => el.remove(), 400);
        }, 3000);
    }

    /* ---------- Contact form: validation + dual delivery (Email / WhatsApp) ---------- */
    const RECEIVER_EMAIL = "yugaadvance@gmail.com";
    const WA_NUMBER = "6287780313222";

    const VALIDATORS = {
        "f-name":    { regex: /^[A-Za-zÀ-ÿ' .\-]{3,50}$/,                          msg: "Nama 3-50 karakter (huruf saja)" },
        "f-email":   { regex: /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/, msg: "Format email tidak valid (cth: nama@domain.com)" },
        "f-phone":   { regex: /^(\+62|62|0)8[0-9]{8,11}$/,                         msg: "Nomor harus berawal 08/62/+62 dan total 11-13 digit" },
        "f-subject": { regex: /^.{3,100}$/,                                        msg: "Subjek minimal 3 karakter" },
        "f-message": { regex: /^[\s\S]{10,1000}$/,                                  msg: "Pesan minimal 10 karakter, maks 1000" }
    };

    const form = document.getElementById("contact-form");
    if (form) {
        const validateField = (id) => {
            const el = document.getElementById(id);
            const hint = form.querySelector(`.field-hint[data-for="${id}"]`);
            if (!el) return true;
            const val = el.value.trim();
            const v = VALIDATORS[id];
            if (!val && !el.required) {
                el.classList.remove("invalid", "valid");
                if (hint) hint.textContent = "";
                return true;
            }
            const ok = !!val && v.regex.test(val);
            el.classList.toggle("invalid", !ok);
            el.classList.toggle("valid",   ok);
            if (hint) hint.textContent = ok ? "" : v.msg;
            return ok;
        };

        // Live validation: validate on blur (first time) + on input (after first error shown)
        Object.keys(VALIDATORS).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener("blur",  () => validateField(id));
            el.addEventListener("input", () => { if (el.classList.contains("invalid")) validateField(id); });
        });

        const validateAll = () => Object.keys(VALIDATORS).every(validateField);

        const getData = () => ({
            name:    document.getElementById("f-name").value.trim(),
            email:   document.getElementById("f-email").value.trim(),
            phone:   document.getElementById("f-phone").value.trim(),
            subject: document.getElementById("f-subject").value.trim(),
            message: document.getElementById("f-message").value.trim()
        });

        const buildMailto = (d) => {
            const subject = encodeURIComponent(`[Portfolio] ${d.subject}`);
            const body = encodeURIComponent(
                `Halo Yuga,\n\n${d.message}\n\n` +
                `---\n` +
                `Nama  : ${d.name}\n` +
                `Email : ${d.email}\n` +
                `Telp  : ${d.phone}\n`
            );
            return `mailto:${RECEIVER_EMAIL}?subject=${subject}&body=${body}`;
        };

        const buildWaLink = (d) => {
            const text = encodeURIComponent(
                `Halo Yuga, saya *${d.name}*.\n\n` +
                `*Subjek:* ${d.subject}\n\n` +
                `${d.message}\n\n` +
                `_Email: ${d.email}_\n` +
                `_Telp: ${d.phone}_`
            );
            return `https://wa.me/${WA_NUMBER}?text=${text}`;
        };

        const resetFormUI = () => {
            form.reset();
            Object.keys(VALIDATORS).forEach(id => {
                const el = document.getElementById(id);
                const hint = form.querySelector(`.field-hint[data-for="${id}"]`);
                el?.classList.remove("invalid", "valid");
                if (hint) hint.textContent = "";
            });
        };

        // Debounce helper: prevent double-click while window is opening
        const lockBtn = (btn, ms = 1500) => {
            if (!btn) return;
            btn.disabled = true;
            btn.classList.add("is-sending");
            setTimeout(() => {
                btn.disabled = false;
                btn.classList.remove("is-sending");
            }, ms);
        };

        const submitEmailBtn = document.getElementById("submit-bae");
        const submitWaBtn    = document.getElementById("submit-wa");

        // Email submit (form's default submit button)
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (submitEmailBtn?.disabled) return;
            if (!validateAll()) {
                toast("Mohon perbaiki kolom yang ditandai merah", "error");
                return;
            }
            const d = getData();
            lockBtn(submitEmailBtn);
            window.location.href = buildMailto(d);
            toast(`Membuka aplikasi email — tinggal kirim ya, ${d.name}!`, "success");
            setTimeout(resetFormUI, 800);
        });

        // WhatsApp button (button type="button" — no form submit)
        submitWaBtn?.addEventListener("click", () => {
            if (submitWaBtn.disabled) return;
            if (!validateAll()) {
                toast("Mohon perbaiki kolom yang ditandai merah", "error");
                return;
            }
            const d = getData();
            lockBtn(submitWaBtn);
            window.open(buildWaLink(d), "_blank", "noopener,noreferrer");
            toast(`Pesan disiapkan di WhatsApp, ${d.name}!`, "success");
            setTimeout(resetFormUI, 800);
        });
    }

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Preloader ---------- */
    const preloader = document.getElementById("preloader");
    const hidePreloader = () => preloader?.classList.add("hidden");
    if (document.readyState === "complete") {
        setTimeout(hidePreloader, 400);
    } else {
        window.addEventListener("load", () => setTimeout(hidePreloader, 400));
        // safety fallback in case load never fires
        setTimeout(hidePreloader, 3000);
    }

    /* ---------- Floating particles in hero ---------- */
    const particlesBox = document.getElementById("particles");
    if (particlesBox && !prefersReduce && !isTouch) {
        const PARTICLE_COUNT = 6; // reduced from 10 for better perf + cleaner look
        const frag = document.createDocumentFragment();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = document.createElement("span");
            p.className = "particle";
            const size = 2 + Math.random() * 4;
            p.style.width = p.style.height = size + "px";
            p.style.left = Math.random() * 100 + "%";
            p.style.bottom = "-10px";
            p.style.animationDuration = (10 + Math.random() * 14) + "s";
            p.style.animationDelay = (Math.random() * 10) + "s";
            p.style.opacity = (0.2 + Math.random() * 0.4).toString();
            frag.appendChild(p);
        }
        particlesBox.appendChild(frag);
    }

    /* ---------- Counter animation ---------- */
    const animateCount = (el) => {
        const target = parseInt(el.getAttribute("data-count") || "0", 10);
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toString();
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target.toString() + "+";
        };
        requestAnimationFrame(tick);
    };
    const counters = document.querySelectorAll(".stat-number");
    if ("IntersectionObserver" in window) {
        const cio = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    cio.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(c => cio.observe(c));
    } else {
        counters.forEach(animateCount);
    }

    /* ---------- Theme toggle click flip animation ---------- */
    const themeToggleEl = document.getElementById("theme-toggle");
    if (themeToggleEl && !prefersReduce) {
        themeToggleEl.addEventListener("click", () => {
            themeToggleEl.classList.add("flip");
            setTimeout(() => themeToggleEl.classList.remove("flip"), 500);
        });
    }

    /* ---------- Timeline draw on view ---------- */
    const timelineEl = document.querySelector(".timeline");
    if (timelineEl && "IntersectionObserver" in window && !prefersReduce) {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                timelineEl.classList.add("in-view");
            }
        }, { threshold: 0.15 }).observe(timelineEl);
    } else if (timelineEl) {
        timelineEl.classList.add("in-view");
    }

    /* ---------- Hero photo click burst ---------- */
    const heroPhotoEl = document.getElementById("hero-photo");
    if (heroPhotoEl && !prefersReduce) {
        heroPhotoEl.addEventListener("click", () => {
            heroPhotoEl.classList.remove("burst");
            void heroPhotoEl.offsetWidth; // restart animation
            heroPhotoEl.classList.add("burst");
            setTimeout(() => heroPhotoEl.classList.remove("burst"), 600);
        });
    }

    /* ---------- Nav slide indicator (desktop only, hover-only - no leftover) ---------- */
    const navbarEl = document.querySelector(".pnavbar");
    if (navbarEl && window.matchMedia("(min-width: 996px)").matches && !prefersReduce) {
        const positionIndicator = (link) => {
            const navRect = navbarEl.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            navbarEl.style.setProperty("--nav-x", (linkRect.left - navRect.left) + "px");
            navbarEl.style.setProperty("--nav-w", linkRect.width + "px");
            navbarEl.style.setProperty("--nav-op", "1");
        };
        const hideIndicator = () => {
            navbarEl.style.setProperty("--nav-op", "0");
        };
        navLinks.forEach(link => {
            link.addEventListener("mouseenter", () => positionIndicator(link));
        });
        navbarEl.addEventListener("mouseleave", hideIndicator);
    }

    /* ---------- Click ripple effect on buttons (CSS-driven) ---------- */
    document.querySelectorAll(".btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            if (prefersReduce) return;
            const rect = btn.getBoundingClientRect();
            const r = Math.max(rect.width, rect.height);
            const ripple = document.createElement("span");
            ripple.className = "ripple";
            ripple.style.width = ripple.style.height = r + "px";
            ripple.style.left = (e.clientX - rect.left - r / 2) + "px";
            ripple.style.top  = (e.clientY - rect.top  - r / 2) + "px";
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ---------- Pause animations when off-screen ---------- */
    const heroEl = document.getElementById("phome");
    const marqueeEl = document.querySelector(".tech-marquee");
    if ("IntersectionObserver" in window) {
        if (heroEl) {
            new IntersectionObserver(([entry]) => {
                heroEl.classList.toggle("paused", !entry.isIntersecting);
            }, { threshold: 0 }).observe(heroEl);
        }
        if (marqueeEl) {
            new IntersectionObserver(([entry]) => {
                marqueeEl.classList.toggle("paused-mq", !entry.isIntersecting);
            }, { threshold: 0 }).observe(marqueeEl);
        }
        // Pause skill bar shimmer when section off-screen
        const skillsEl = document.getElementById("pskill");
        if (skillsEl) {
            new IntersectionObserver(([entry]) => {
                skillsEl.classList.toggle("paused-skills", !entry.isIntersecting);
            }, { threshold: 0 }).observe(skillsEl);
        }
        // SHARED observer: toggle .paused on every section that has a .scene-decor or .pheading.
        // One observer is cheaper than creating N observers (one per section).
        const sectionsToWatch = new Set();
        document.querySelectorAll("section .pheading, section .scene-decor").forEach(el => {
            const sec = el.closest("section");
            if (sec) sectionsToWatch.add(sec);
        });
        if (sectionsToWatch.size) {
            const sectionPauseObs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    e.target.classList.toggle("paused", !e.isIntersecting);
                });
            }, { threshold: 0, rootMargin: "100px 0px" }); // 100px buffer so animations resume just-before scrolling in
            sectionsToWatch.forEach(sec => sectionPauseObs.observe(sec));
        }

        // Hide mobile WhatsApp FAB when contact OR footer visible (avoid overlap with footer social icons)
        const fabEl = document.querySelector(".mobile-fab");
        const contactEl = document.getElementById("contact");
        const footerEl = document.querySelector(".pfooter");
        if (fabEl && (contactEl || footerEl)) {
            const visibleSet = new Set();
            const fabObserver = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) visibleSet.add(e.target);
                    else visibleSet.delete(e.target);
                });
                fabEl.classList.toggle("fab-hide", visibleSet.size > 0);
            }, { threshold: 0.05 });
            if (contactEl) fabObserver.observe(contactEl);
            if (footerEl)  fabObserver.observe(footerEl);
        }
    }

    /* ---------- Sticky social bar visibility — merged into main RAF onScroll above ---------- */

    /* ---------- Welcome toast (first visit per session only) ---------- */
    try {
        if (!sessionStorage.getItem("yuga-welcomed")) {
            setTimeout(() => toast("Selamat datang di portfolio Yuga!", "success"), 1200);
            sessionStorage.setItem("yuga-welcomed", "1");
        }
    } catch (_) {
        // sessionStorage not available (private mode) — fallback: always show
        setTimeout(() => toast("Selamat datang di portfolio Yuga!", "success"), 1200);
    }
});
