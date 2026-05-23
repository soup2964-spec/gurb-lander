document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const hasBeenRedirected = urlParams.get("redirected") === "true";

  const redirectUrlObj = new URL(window.location.href);
  redirectUrlObj.searchParams.set("redirected", "true");
  const redirectUrl = redirectUrlObj.toString();

  function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return "Android";
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
    return "Desktop";
  }

  function detectBrowser() {
    const userAgent = navigator.userAgent;

    if (/chrome|chromium|crios/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome";
    if (/firefox|fxios/i.test(userAgent)) return "Firefox";
    if (/safari/i.test(userAgent) && !/chrome|crios|fxios|opr|edg/i.test(userAgent)) return "Safari";
    if (/opr\//i.test(userAgent)) return "Opera";
    if (/edg/i.test(userAgent)) return "Edge";
    if (/FBAN|FBAV/i.test(userAgent)) return "Facebook";
    return "Unknown";
  }

  function isFbBrowser() {
    return /FBAN|FBAV/i.test(navigator.userAgent);
  }

  function intentRedirect(url) {
    try {
      const targetUrl = new URL(url);
      const intentUrl =
        `intent://${targetUrl.host}${targetUrl.pathname}${targetUrl.search}` +
        `#Intent;scheme=${targetUrl.protocol.replace(":", "")};package=com.android.chrome;` +
        `S.browser_fallback_url=${encodeURIComponent(url)};end`;
      window.location.href = intentUrl;
    } catch (error) {
      window.location = url;
    }
  }

  function isWebView() {
    const userAgent = navigator.userAgent;
    return (
      (window.hasOwnProperty("webkit") && window.webkit.hasOwnProperty("messageHandlers")) ||
      (navigator.hasOwnProperty("standalone") && !navigator.standalone && !/CriOS/.test(userAgent)) ||
      (typeof window.webkit !== "undefined" && !/CriOS/.test(userAgent)) ||
      isFbBrowser() ||
      /Instagram|Twitter|LinkedIn|Pinterest|Snapchat|WhatsApp|Messenger|TikTok/i.test(userAgent)
    );
  }

  function redirect() {
    if (hasBeenRedirected) return;

    const browser = detectBrowser();
    const device = detectDevice();

    if (browser !== "Unknown" && !isWebView()) {
      window.location.replace(redirectUrl);
      return;
    }

    let timeoutId;
    let timeoutId2;
    let timeoutId3;
    let redirectAttempted = false;

    if (device === "Desktop") {
      window.location.replace(redirectUrl);
      return;
    }

    function tryOpenApp() {
      if (device === "iOS") {
        if (/Instagram|FBAN|FBAV/i.test(navigator.userAgent)) {
          if (!redirectAttempted) {
            redirectAttempted = true;
            window.location.href = redirectUrl;
          }
        } else {
          timeoutId = window.setTimeout(function () {
            if (!redirectAttempted) {
              redirectAttempted = true;
              const chromeUrl = redirectUrl.replace(/^https?:\/\//, "");
              window.location = `googlechrome://${chromeUrl}`;
            }
          }, 0);

          timeoutId2 = window.setTimeout(function () {
            if (!redirectAttempted) {
              redirectAttempted = true;
              window.location = `x-safari-${redirectUrl}`;
            }
          }, 200);
        }
      } else if (device === "Android") {
        timeoutId = window.setTimeout(function () {
          if (!redirectAttempted) {
            redirectAttempted = true;
            intentRedirect(redirectUrl);
          }
        }, 0);
      }

      timeoutId3 = window.setTimeout(function () {
        if (!redirectAttempted) {
          redirectAttempted = true;
          window.location = redirectUrl;
        }
      }, 400);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        redirectAttempted = true;
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
        clearTimeout(timeoutId3);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    tryOpenApp();
  }

  const isMetaPlatform = /Instagram|Threads|Barcelona|FBAN|FBAV/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isMetaPlatform && isIOS) {
    document.addEventListener(
      "click",
      function (event) {
        const link = event.target.closest("a[href]");
        if (!link || !link.href) return;

        const href = link.href;
        const ua = navigator.userAgent || "";

        if (/Barcelona/i.test(ua)) {
          event.preventDefault();
          window.location.replace("barcelona://extbrowser/?url=" + encodeURIComponent(href));
          return;
        }

        if (/Instagram/i.test(ua) && !/FBAN|FBAV/i.test(ua)) {
          event.preventDefault();
          window.location.replace("instagram://extbrowser/?url=" + encodeURIComponent(href));
        }
      },
      true
    );
    return;
  }

  redirect();
});
