(function () {
  const HOLD_THRESHOLD_MS = 500;
  const config = window.SITE_CONFIG;
  const theme = config.theme || {};

  function ensureProtocol(url) {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  }

  function openUrl(url) {
    window.location.href = ensureProtocol(url);
  }

  function attachPressHold(element, url) {
    let holdTimer = null;
    let pressStart = 0;
    let holdCompleted = false;

    const clearHold = () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      element.classList.remove("is-holding");
    };

    const beginHold = () => {
      holdCompleted = false;
      pressStart = Date.now();
      clearHold();
      element.classList.add("is-holding");

      holdTimer = window.setTimeout(() => {
        holdCompleted = true;
        element.classList.remove("is-holding");
        openUrl(url);
      }, HOLD_THRESHOLD_MS);
    };

    const endHold = (event) => {
      const heldMs = Date.now() - pressStart;

      if (!holdCompleted && heldMs < HOLD_THRESHOLD_MS) {
        event.preventDefault();
      }

      clearHold();
    };

    element.addEventListener("mousedown", beginHold);
    element.addEventListener("mouseup", endHold);
    element.addEventListener("mouseleave", clearHold);
    element.addEventListener("touchstart", beginHold, { passive: true });
    element.addEventListener("touchend", endHold);
    element.addEventListener("touchcancel", clearHold);
    element.addEventListener("click", (event) => {
      event.preventDefault();
    });
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      beginHold();
    });
    element.addEventListener("keyup", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      endHold(event);
    });
  }

  function showPressHoldOverlay(overlay) {
    document.querySelectorAll(".press-hold-overlay.is-visible").forEach((node) => {
      if (node !== overlay) node.classList.remove("is-visible");
    });
    overlay.classList.add("is-visible");
  }

  function createLink(link, index) {
    const card = document.createElement("div");
    card.className = "link-card animate-in";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.style.animationDelay = `${0.3 + index * 0.03}s`;

    const inner = document.createElement("div");
    inner.className = "link-card-inner";
    inner.style.borderRadius = theme.borderRadius || "14px";
    inner.style.backgroundColor = theme.linkBackground || "rgba(255, 255, 255, 0.08)";

    const simple = document.createElement("div");
    simple.className = "link-simple";

    const textWrap = document.createElement("div");
    textWrap.className = "link-text";

    const title = document.createElement("div");
    title.className = "link-title";
    title.textContent = link.title;

    textWrap.appendChild(title);

    if (link.subtitle) {
      const subtitle = document.createElement("div");
      subtitle.className = "link-subtitle";
      subtitle.textContent = link.subtitle;
      textWrap.appendChild(subtitle);
    }

    const arrow = document.createElement("i");
    arrow.className = "fas fa-chevron-right link-arrow";

    simple.appendChild(textWrap);
    simple.appendChild(arrow);
    inner.appendChild(simple);

    const overlay = document.createElement("div");
    overlay.className = "press-hold-overlay";
    overlay.setAttribute("role", "button");
    overlay.setAttribute("tabindex", "0");
    overlay.setAttribute("aria-label", "Press and hold to open link");
    overlay.innerHTML =
      '<span class="press-hold-label">Press &amp; Hold to Open</span>' +
      '<span class="press-hold-hint">Tapping won\u2019t work \u2014 hold the button</span>' +
      '<span class="press-hold-progress" aria-hidden="true"></span>';

    attachPressHold(overlay, link.url);

    card.addEventListener("mouseenter", () => {
      inner.style.backgroundColor = theme.linkHoverBackground || "rgba(255, 255, 255, 0.12)";
    });

    card.addEventListener("mouseleave", () => {
      inner.style.backgroundColor = theme.linkBackground || "rgba(255, 255, 255, 0.08)";
    });

    const revealOverlay = (event) => {
      event.preventDefault();
      showPressHoldOverlay(overlay);
    };

    card.addEventListener("click", revealOverlay);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        revealOverlay(event);
      }
    });

    card.appendChild(inner);
    card.appendChild(overlay);
    return card;
  }

  function render() {
    const profile = config.profile || {};
    const app = document.getElementById("app");
    const pageTitle = config.pageTitle || `${profile.name || "Links"} - Links`;

    document.title = pageTitle;
    document.getElementById("page-title").textContent = pageTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = profile.name || "";

    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    ogTitle.content = profile.name || "";
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle);

    const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement("meta");
    ogImage.setAttribute("property", "og:image");
    ogImage.content = profile.avatar || "";
    if (!ogImage.parentNode) document.head.appendChild(ogImage);

    const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.createElement("meta");
    twitterImage.setAttribute("name", "twitter:image");
    twitterImage.content = profile.avatar || "";
    if (!twitterImage.parentNode) document.head.appendChild(twitterImage);

    const bgBlur = document.createElement("div");
    bgBlur.className = "bg-blur";
    if (profile.avatar) {
      bgBlur.style.backgroundImage = `url(${profile.avatar})`;
    }

    const bgOverlay = document.createElement("div");
    bgOverlay.className = "bg-overlay";

    const card = document.createElement("div");
    card.className = "card animate-in";
    card.style.backgroundColor = theme.cardBackground || "#1a1a1a";

    const profileSection = document.createElement("div");
    profileSection.className = "profile-section";

    const profileBg = document.createElement("div");
    profileBg.className = "profile-bg";
    if (profile.avatar) {
      profileBg.style.backgroundImage = `url(${profile.avatar})`;
    }

    const profileGradient = document.createElement("div");
    profileGradient.className = "profile-gradient";

    const profileContent = document.createElement("div");
    profileContent.className = "profile-content";

    const profileName = document.createElement("h1");
    profileName.className = "profile-name";
    profileName.textContent = profile.name || "";

    profileContent.appendChild(profileName);
    profileSection.append(profileBg, profileGradient, profileContent);

    const linksSection = document.createElement("div");
    linksSection.className = "links-section";
    linksSection.style.backgroundColor = theme.cardBackground || "#1a1a1a";

    const linksList = document.createElement("div");
    linksList.className = "links-list";

    (config.links || []).forEach((link, index) => {
      linksList.appendChild(createLink(link, index));
    });

    linksSection.appendChild(linksList);
    card.append(profileSection, linksSection);
    app.append(bgBlur, bgOverlay, card);

    document.addEventListener("click", (event) => {
      const openOverlay = document.querySelector(".press-hold-overlay.is-visible");
      if (!openOverlay) return;
      if (openOverlay.closest(".link-card")?.contains(event.target)) return;
      openOverlay.classList.remove("is-visible");
    });
  }

  render();
})();
