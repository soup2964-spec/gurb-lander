(function () {
  function initClarity(projectId) {
    if (!projectId || window.__clarityInitialized) return;
    window.__clarityInitialized = true;

    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);
  }

  function trackClarityEvent(name) {
    if (typeof window.clarity === "function") {
      window.clarity("event", name);
    }
  }

  window.initClarity = initClarity;
  window.trackClarityEvent = trackClarityEvent;
})();
