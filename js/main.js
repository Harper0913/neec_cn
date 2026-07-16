(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const isHome = document.body.classList.contains("page-home");

  /* Solid header on inner pages */
  if (!isHome && header) {
    header.classList.add("is-solid");
  }

  /* Scroll state for home hero */
  const onScroll = () => {
    if (!header) return;
    if (isHome) {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (toggle && navList) {
    const setOpen = (open) => {
      toggle.classList.toggle("is-open", open);
      navList.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () => {
      setOpen(!toggle.classList.contains("is-open"));
    });

    navList.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  /* Active nav link */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === path ||
      (path === "" && href === "index.html") ||
      (path === "index.html" && href === "index.html")
    ) {
      link.classList.add("is-active");
    }
  });

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Publication year filters — scroll to year headings */
  const filters = document.querySelectorAll(".filter-btn[data-target]");
  if (filters.length) {
    const stickyBar = document.querySelector(".pub-filters-sticky");

    const navOffset = () => {
      const header = document.querySelector(".site-header");
      const headerH = header ? header.offsetHeight : 72;
      const barH = stickyBar ? stickyBar.offsetHeight : 0;
      return headerH + barH + 12;
    };

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const id = btn.getAttribute("data-target");
        const target = id && document.getElementById(id);
        if (!target) return;

        const top =
          target.getBoundingClientRect().top + window.scrollY - navOffset();
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    });
  }

  /* Contact form — send via FormSubmit to lab email */
  const form = document.querySelector(".contact-form");
  if (form) {
    const note = form.querySelector(".form-note");
    const submitBtn = form.querySelector('button[type="submit"]');
    const endpoint =
      form.getAttribute("action")?.replace(
        "https://formsubmit.co/",
        "https://formsubmit.co/ajax/"
      ) || "https://formsubmit.co/ajax/h.zhao@pku.edu.cn";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!note || !submitBtn) return;

      note.hidden = false;
      note.classList.remove("is-error", "is-success");
      note.textContent = "正在发送…";
      submitBtn.disabled = true;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error("send failed");

        note.classList.add("is-success");
        note.textContent = "留言已发送，我们会尽快通过邮箱回复。";
        form.reset();
      } catch (err) {
        note.classList.add("is-error");
        note.textContent =
          "发送失败，请稍后重试，或直接邮件联系 h.zhao@pku.edu.cn";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
