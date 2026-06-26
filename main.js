/* ============================================================
   GAB FLORES — Main JS
   ============================================================ */
   

// ── Liquid Metal Banner Canvas ────────────────────────────────
(function () {
  const canvas = document.getElementById('liquidCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const RES = 120;
  const off = document.createElement('canvas');
  const octx = off.getContext('2d');
  let W = 0, H = 0, t = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = Math.round(rect.width);
    H = Math.round(rect.height);
    canvas.width  = W;
    canvas.height = H;
    off.width  = RES;
    off.height = Math.max(1, Math.round(RES * (H / Math.max(W, 1))));
  }

  function render() {
    t += 0.006;
    const ow = off.width, oh = off.height;
    const img = octx.createImageData(ow, oh);
    const d = img.data;
    for (let y = 0; y < oh; y++) {
      for (let x = 0; x < ow; x++) {
        const nx = (x / ow) * 4.0;
        const ny = (y / oh) * 2.8;
        const v1 = Math.sin(nx * 1.7 + t);
        const v2 = Math.sin(ny * 2.2 - t * 0.75);
        const v3 = Math.sin((nx + ny) * 1.3 + t * 0.55);
        const v4 = Math.sin(Math.sqrt(
          (nx - 2.0 + Math.sin(t * 0.5) * 1.1) ** 2 +
          (ny - 1.4 + Math.cos(t * 0.4) * 0.9) ** 2
        ) * 2.6);
        const v = (v1 + v2 + v3 + v4) * 0.25;
        const b = (v + 1) * 0.5;
        const s = Math.pow(b, 2.4);
        const i = (y * ow + x) * 4;
        d[i]     = (s * 195) | 0;
        d[i + 1] = (s * 205 + b * 4) | 0;
        d[i + 2] = Math.min(255, (s * 248 + b * 16 + 8) | 0);
        d[i + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(off, 0, 0, W, H);
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  render();
})();

// Project data
const PROJECTS = {
  anvis: {
    title: 'Anvis Designery',
    img: 'image/Capture4.JPG',
    overview: `A static, customer-facing website designed and developed for an architectural firm. Showcases best-selling items, business information, operating hours, and contact details with a clean, professional aesthetic.`,

  },
  orworz: {
    title: 'Thorworkz Autoparts',
    img: 'image/Capture6.JPG',
    overview: 'An e-commerce platform for automotive parts, built with a strong focus on product discovery, clean UI, and seamless checkout experience.',

  },
  gean: {
    title: 'Gean Library',
    img: 'image/Capture2.JPG',
    overview: 'A digital library management system designed to streamline book cataloging, borrowing workflows, and member management for a local library.',

  },

};

// ── Nav burger ──────────────────────────────────────────────
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
  const closeMobileMenu = () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

// ── Modal ────────────────────────────────────────────────────
const modal        = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalImg     = document.getElementById('modalImg');
const modalTitle   = document.getElementById('modalTitle');
const modalOverview    = document.getElementById('modalOverview');
const modalCategories  = document.getElementById('modalCategories');
const modalDate        = document.getElementById('modalDate');
const modalClient      = document.getElementById('modalClient');

function openModal(key) {
  const p = PROJECTS[key];
  if (!p || !modal) return;

  modalImg.src = p.img;
  modalImg.alt = p.title;
  modalTitle.textContent = p.title;
  modalOverview.innerHTML = formatOverview(p.overview);
  modalCategories.textContent = p.categories;
  modalDate.textContent = p.date;
  modalClient.textContent = p.client;


  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function formatOverview(text) {
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    if (line.startsWith('•')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.slice(1).trim()}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (line.trim()) html += `<p>${line}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
if (modalClose)   modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Attach to cards
document.querySelectorAll('[data-project]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
});

// ── Scroll reveal ────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.project-card, .featured__banner, .tech-card, .skill-pill, ' +
  '.projects-grid__item, .about-intro__center, .about-intro__right, ' +
  '.contact-form-wrap, .contact-info, .about-cta__text, .about-archive__item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ── Hero scroll zoom ──────────────────────────────────────────
const heroPhoto = document.querySelector('.hero__photo');
if (heroPhoto) {
  const updateHeroZoom = () => {
    const y = Math.min(window.scrollY, 900);
    const scale = 1 + y * 0.00115;
    const lift = y * -0.025;
    const fade = Math.max(0.72, 1 - y * 0.00018);
    heroPhoto.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
    heroPhoto.style.opacity = fade.toFixed(3);
  };

  updateHeroZoom();
  window.addEventListener('scroll', updateHeroZoom, { passive: true });
}

// ── Nav logo fallback (SVG inline) ───────────────────────────
document.querySelectorAll('.nav__logo-img').forEach(img => {
  img.addEventListener('error', () => {
    const parent = img.parentElement;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    svg.setAttribute('viewBox', '0 0 28 28');
    svg.innerHTML = `
      <circle cx="14" cy="14" r="13" fill="#0a0a0a"/>
      <text x="14" y="19" text-anchor="middle" fill="white" font-size="11" font-family="Inter,sans-serif" font-weight="700">GF</text>
    `;
    img.replaceWith(svg);
  });
});

// ── Featured banner fallback ──────────────────────────────────
const banner = document.querySelector('.featured__banner-img');
if (banner) {
  banner.addEventListener('error', () => {
    const wrap = banner.parentElement;
    wrap.innerHTML = '';
    wrap.style.background = 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 30%, #0a0a1a 60%, #1a0a2e 100%)';
    // animate via CSS class already applied
    wrap.style.animation = 'gradientShift 6s ease infinite';
    wrap.style.backgroundSize = '400% 400%';
  });
}

// ── Contact form ──────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.contact-form__submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        btn.textContent = 'Sent ✓';
        form.reset();
      } else {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Error — try again';
      btn.disabled = false;
    }
  });
}

// ── Projects Chrome Carousel + Project Modal ─────────────────
document.addEventListener("DOMContentLoaded", () => {
  const projectSlides = document.querySelectorAll(".projects-slide");
  const projectTitle = document.getElementById("projectTitle");
  const projectPrev = document.getElementById("projectPrev");
  const projectNext = document.getElementById("projectNext");

  const openProjectModalBtn = document.getElementById("openProjectModal");
  const projectPageModal = document.getElementById("projectPageModal");
  const projectPageModalOverlay = document.getElementById("projectPageModalOverlay");
  const projectPageModalClose = document.getElementById("projectPageModalClose");

  const projectPageModalImage = document.getElementById("projectPageModalImage");
  const projectPageModalTitle = document.getElementById("projectPageModalTitle");
  const projectPageModalDesc = document.getElementById("projectPageModalDesc");
  const projectPageModalCategory = document.getElementById("projectPageModalCategory");
  const projectPageModalDate = document.getElementById("projectPageModalDate");
  const projectPageModalClient = document.getElementById("projectPageModalClient");
  const projectGalleryStrip = document.getElementById("projectGalleryStrip");
  const projectPageModalLive = document.getElementById("projectPageModalLive");
  const projectPageModalGithub = document.getElementById("projectPageModalGithub");

  if (!projectSlides.length || !projectTitle || !projectPrev || !projectNext) return;

  let projectIndex = 0;

  const projectModalData = [
    {
      title: "Anvis Designery",
      desc: "A clean architectural portfolio website designed to present services, project visuals, and brand identity with a polished user experience.\n\nA static, customer-facing website designed and developed for an architectural firm. Showcases best-selling items, business information, operating hours, and contact details with a clean, professional aesthetic.\n\nKey Features\n• Designed and developed as a static showcase website\n• Business info, operating hours, and services display\n• Clean, professional architectural aesthetic",
      category: "Architectural Website",
      date: "May 28, 2026",
      client: "Anvis Designery",
      live: "https://anvisdesignery.netlify.app/",
      github: "https://github.com/code-gab18/Anvis-designery",
      gallery: [
        "image/Capture4.JPG",
        "image/Capture8.JPG",
        "image/Capture5.JPG"
      ]
    },
    {
      title: "Thorworkz Autoparts",
      desc: "An e-commerce website concept focused on product discovery, clean navigation, and a smooth shopping experience for automotive parts, and A platform for automotive parts, built with a strong focus on product discovery, clean UI, and seamless checkout experience.\n\nKey Features\n• Designed wireframes and prototypes for user flow planning\n• Created full UI/UX ensuring clean and user-friendly experience\n• Product browsing, shopping cart, and user authentication",
      category: "E-Commerce Website",
      date: "July 06, 2024",
      client: "Thesis Project",
      live: "https://thorworkz.netlify.app/",
      github: "https://github.com/code-gab18/Thorworkz",
      gallery: [
        "image/Capture6.JPG",
        "image/Capture11.JPG",
        "image/Capture1.JPG"
      ]
    },
    {
      title: "Gean Library",
      desc: "A library management platform designed to organize resources, support borrowing workflows, and improve usability for staff and students.\n\nA digital library management system designed to streamline book cataloging, borrowing workflows, and member management for a local library.\n\nKey Features\n• Front-end UI & UX implementation with interaction design\n• Documented application features for team coordination\n• User interaction flows for library staff and students",
      category: "Library System",
      date: "Nov 27, 2024",
      client: "Academic Project",
      live: "https://geanlibrary.netlify.app/",
      github: "https://github.com/code-gab18/GEAN-Library",
      gallery: [
        "image/Capture2.JPG",
        "image/Capture22.JPG",
        "image/Capture3.JPG"
      ]
    }
  ];

  function updateProjectsCarousel() {
    projectSlides.forEach((slide, i) => {
      slide.classList.remove("active", "prev", "next");

      if (i === projectIndex) {
        slide.classList.add("active");
      } else if (i === (projectIndex - 1 + projectSlides.length) % projectSlides.length) {
        slide.classList.add("prev");
      } else if (i === (projectIndex + 1) % projectSlides.length) {
        slide.classList.add("next");
      }
    });

    const activeSlide = projectSlides[projectIndex];
    const gray = activeSlide.dataset.titleGray || "";
    const black = activeSlide.dataset.titleBlack || "";

    projectTitle.style.opacity = "0";
    projectTitle.style.transform = "translateY(10px)";

    setTimeout(() => {
      projectTitle.innerHTML = `<span>${gray}</span> ${black}`;
      projectTitle.style.opacity = "1";
      projectTitle.style.transform = "translateY(0)";
    }, 160);

    projectSlides.forEach((slide) => {
      const video = slide.querySelector(".projects-slide__video");
      if (!video) return;

      if (slide.classList.contains("active")) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function buildProjectGallery(images) {
    if (!projectGalleryStrip) return;

    projectGalleryStrip.innerHTML = "";

    images.forEach((src, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `project-gallery__thumb ${index === 0 ? "active" : ""}`;

      btn.innerHTML = `<img src="${src}" alt="Project gallery image ${index + 1}">`;

      btn.addEventListener("click", () => {
        document.querySelectorAll(".project-gallery__thumb").forEach(item => {
          item.classList.remove("active");
        });

        btn.classList.add("active");

        projectPageModalImage.style.opacity = "0";
        projectPageModalImage.style.transform = "scale(1.04)";

        setTimeout(() => {
          projectPageModalImage.src = src;
          projectPageModalImage.alt = `Project gallery image ${index + 1}`;
          projectPageModalImage.style.opacity = "1";
          projectPageModalImage.style.transform = "scale(1)";
        }, 180);
      });

      projectGalleryStrip.appendChild(btn);
    });
  }

  function openProjectPageModal() {
    if (!projectPageModal) return;

    const data = projectModalData[projectIndex];

    projectPageModalTitle.textContent = data.title;
    projectPageModalDesc.textContent = data.desc;
    projectPageModalCategory.textContent = data.category;
    projectPageModalDate.textContent = data.date;
    projectPageModalClient.textContent = data.client;

    projectPageModalImage.src = data.gallery[0];
    projectPageModalImage.alt = data.title;

    projectPageModalLive.href = data.live;
    projectPageModalGithub.href = data.github;

    buildProjectGallery(data.gallery);

    projectPageModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProjectPageModal() {
    if (!projectPageModal) return;
    projectPageModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  projectNext.addEventListener("click", () => {
    projectIndex = (projectIndex + 1) % projectSlides.length;
    updateProjectsCarousel();
  });

  projectPrev.addEventListener("click", () => {
    projectIndex = (projectIndex - 1 + projectSlides.length) % projectSlides.length;
    updateProjectsCarousel();
  });

  if (openProjectModalBtn) {
    openProjectModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openProjectPageModal();
    });
  }

  if (projectPageModalOverlay) {
    projectPageModalOverlay.addEventListener("click", closeProjectPageModal);
  }

  if (projectPageModalClose) {
    projectPageModalClose.addEventListener("click", closeProjectPageModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectPageModal && projectPageModal.classList.contains("open")) {
      closeProjectPageModal();
    }
  });

  updateProjectsCarousel();
});

const aboutHero = document.querySelector(".about-hero");

if (aboutHero) {
  setTimeout(() => {
    aboutHero.classList.add("is-visible");
  }, 150);
}

/* CERTIFICATIONS SMOOTH STACK */
const aboutArchive = document.getElementById("aboutArchive");
const archiveCards = document.querySelectorAll(".about-archive__card");

const archiveMetaNum = document.getElementById("archiveMetaNum");
const archiveMetaTitle = document.getElementById("archiveMetaTitle");
const archiveMetaType = document.getElementById("archiveMetaType");
const archiveMetaYear = document.getElementById("archiveMetaYear");

if (aboutArchive && archiveCards.length) {
  let targetProgress = 0;
  let currentProgress = 0;

  function getTargetProgress() {
    const rect = aboutArchive.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    targetProgress = Math.min(Math.max(-rect.top / total, 0), 1);
  }

  function renderArchiveStack() {
    currentProgress += (targetProgress - currentProgress) * 0.075;

    const count = archiveCards.length;
    const activeIndex = Math.min(count - 1, Math.round(currentProgress * (count - 1)));

    archiveCards.forEach((card, index) => {
      const distance = index - currentProgress * (count - 1);

      const y = distance * 92;
      const scale = 1 - Math.min(Math.abs(distance) * 0.055, 0.22);
      const opacity = 1 - Math.min(Math.abs(distance) * 0.08, 0.35);
      const blur = Math.min(Math.abs(distance) * 5, 12);
      const z = 100 - Math.round(Math.abs(distance) * 10);

      card.style.zIndex = z;
      card.style.opacity = opacity;
      card.style.transform = `
        translate(-50%, calc(-50% + ${y}px))
        scale(${scale})
      `;

      const img = card.querySelector("img");
      if (img) {
        img.style.transform = `scale(${Math.abs(distance) < 0.35 ? 1 : 1.02})`;
      }

      card.classList.toggle("is-active", index === activeIndex);
    });

    const activeCard = archiveCards[activeIndex];

    if (activeCard) {
      archiveMetaNum.textContent = `(${String(activeIndex + 1).padStart(2, "0")})`;
      archiveMetaTitle.textContent = activeCard.dataset.title;
      archiveMetaType.textContent = activeCard.dataset.type;
      archiveMetaYear.textContent = `© ${activeCard.dataset.year}`;
    }

    requestAnimationFrame(renderArchiveStack);
  }

  getTargetProgress();
  window.addEventListener("scroll", getTargetProgress, { passive: true });
  window.addEventListener("resize", getTargetProgress);
  renderArchiveStack();
}

/* CERTIFICATIONS IMAGE PREVIEW */
const archivePreview = document.getElementById("archivePreview");
const archivePreviewImg = document.getElementById("archivePreviewImg");
const archivePreviewClose = document.getElementById("archivePreviewClose");

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".archive-view-btn");
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const card = btn.closest(".about-archive__card");
  const img = card ? card.querySelector("img") : null;

  if (!archivePreview || !archivePreviewImg || !img) return;

  archivePreviewImg.src = img.getAttribute("src");
  archivePreview.classList.add("open");
  document.body.style.overflow = "hidden";
});

if (archivePreviewClose) {
  archivePreviewClose.addEventListener("click", () => {
    archivePreview.classList.remove("open");
    document.body.style.overflow = "";
  });
}

if (archivePreview) {
  archivePreview.addEventListener("click", (e) => {
    if (e.target === archivePreview) {
      archivePreview.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
}