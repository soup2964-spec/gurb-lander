(function () {
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

  function openInExternalBrowser(url) {
    const targetUrl = url;
    const device = detectDevice();
    const browser = detectBrowser();
    const ua = navigator.userAgent || "";

    if (browser !== "Unknown" && !isWebView()) {
      window.location.href = targetUrl;
      return;
    }

    if (device === "Desktop") {
      window.location.href = targetUrl;
      return;
    }

    if (device === "iOS") {
      if (/Barcelona/i.test(ua)) {
        window.location.replace("barcelona://extbrowser/?url=" + encodeURIComponent(targetUrl));
        return;
      }
      if (/Instagram/i.test(ua) && !/FBAN|FBAV/i.test(ua)) {
        window.location.replace("instagram://extbrowser/?url=" + encodeURIComponent(targetUrl));
        return;
      }
    }

    let timeoutId;
    let timeoutId2;
    let timeoutId3;
    let redirectAttempted = false;

    function tryOpen() {
      if (device === "iOS") {
        if (/Instagram|FBAN|FBAV/i.test(ua)) {
          if (!redirectAttempted) {
            redirectAttempted = true;
            window.location.href = targetUrl;
          }
        } else {
          timeoutId = window.setTimeout(function () {
            if (!redirectAttempted) {
              redirectAttempted = true;
              const chromeUrl = targetUrl.replace(/^https?:\/\//, "");
              window.location = `googlechrome://${chromeUrl}`;
            }
          }, 0);

          timeoutId2 = window.setTimeout(function () {
            if (!redirectAttempted) {
              redirectAttempted = true;
              window.location = `x-safari-${targetUrl}`;
            }
          }, 200);
        }
      } else if (device === "Android") {
        timeoutId = window.setTimeout(function () {
          if (!redirectAttempted) {
            redirectAttempted = true;
            intentRedirect(targetUrl);
          }
        }, 0);
      }

      timeoutId3 = window.setTimeout(function () {
        if (!redirectAttempted) {
          redirectAttempted = true;
          window.location = targetUrl;
        }
      }, 400);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        redirectAttempted = true;
        clearTimeout(timeoutId);
        clearTimeout(timeoutId2);
        clearTimeout(timeoutId3);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    tryOpen();
  }

  window.openInExternalBrowser = openInExternalBrowser;
})();
