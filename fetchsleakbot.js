async function injectSleakScript() {
  if (window.sleakScriptInjected) {
    return;
  }

  const sleakbotScriptTag = document.querySelector("#sleakbot");
  const scriptCookies = sleakbotScriptTag.getAttribute("cookies");

  if (!scriptCookies) {
    async function loadScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    loadScript();
  }

  // env control
  const scriptSrc = sleakbotScriptTag.getAttribute("src");
  if (scriptSrc.includes("dev")) {
    var baseUrl = "https://cdn.dev.sleak.chat";
  } else if (scriptSrc.includes("localhost")) {
    var baseUrl = "http://localhost:3000";
  } else {
    var baseUrl = "https://cdn.sleak.chat";
  }
  const placement = sleakbotScriptTag.getAttribute("placement");
  if (placement == "fullwidth") {
    var fileName = "sleakbot-fw";
  } else {
    var fileName = "sleakbot";
  }

  const sleakHtml = `${baseUrl}/${fileName}.html`;
  const sleakJs = `${baseUrl}/${fileName}.js`;
  const sleakCss = `${baseUrl}/${fileName}.css`;

  async function appendStylesheet(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.head.appendChild(link);
  }
  appendStylesheet(sleakCss);

  // append div to body
  function appendSleakHtmlToBody(sleak_html) {
    const sleakHtml = document.createElement("div");
    sleakHtml.innerHTML = sleak_html;
    if (placement === "fullwidth") {
      sleakHtml.style.width = "100%";
      sleakHtml.style.height = "100%";
      sleakbotScriptTag.parentNode.insertBefore(
        sleakHtml,
        sleakbotScriptTag.nextSibling
      );
    } else {
      document.body.appendChild(sleakHtml);
    }
  }
  // append js to body
  function appendSleakJsToBody() {
    const sleak_script = document.createElement("script");
    sleak_script.src = sleakJs;
    document.body.appendChild(sleak_script);
  }

  // fetch sleak, append to dom
  function fetchAndAppendHtml() {
    return fetch(sleakHtml)
      .then((sleak_response) => sleak_response.text())
      .then((sleak_html) => {
        appendSleakHtmlToBody(sleak_html);
      });
  }

  // window.onload = function () {
  if (!window.sleakScriptInjected) {
    window.sleakScriptInjected = true;
    setTimeout(function () {
      fetchAndAppendHtml()
        .then(() => {
          appendSleakJsToBody();
          console.log("sleak.chat initialized");
        })
        .catch((error) => {
          console.error("Error occurred while loading sleak.chat:", error);
        });
    }, 10);
  }
  // };
}

injectSleakScript();
