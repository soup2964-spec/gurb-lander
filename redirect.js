document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("redirected") === "true") return;

  const redirectUrlObj = new URL(window.location.href);
  redirectUrlObj.searchParams.set("redirected", "true");
  const redirectUrl = redirectUrlObj.toString();

  const isMetaPlatform = /Instagram|Threads|Barcelona|FBAN|FBAV/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // On Meta iOS in-app browsers, skip auto-redirect on load; user opens links via press-and-hold.
  if (isMetaPlatform && isIOS) return;

  window.openInExternalBrowser(redirectUrl);
});
