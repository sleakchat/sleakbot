async function injectSleakScript() {
  // env control
  const sleakbotScriptTag = document.querySelector("#sleakbot");
  const scriptSrc = sleakbotScriptTag.getAttribute("src");
  if (scriptSrc.includes("dev")) {
    var baseUrl = "https://cdn.dev.sleak.chat";
  } else {
    var baseUrl = "https://cdn.sleak.chat";
  }
  const sleakHtml = `${baseUrl}/sleakbot.html`;
  const sleakJs = `${baseUrl}/sleakbot.js`;
  const sleakCss = `${baseUrl}/sleakbot.css`;

  function appendStylesheet(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.head.appendChild(link);
  }

  appendStylesheet(sleakCss);

  // append div to body
  function appendSleakHtmlToBody(sleak_html) {
    const sleak_div = document.createElement("div");
    sleak_div.innerHTML = sleak_html;
    document.body.appendChild(sleak_div);
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

  window.onload = function () {
    setTimeout(function () {
      fetchAndAppendHtml()
        .then(() => {
          appendSleakJsToBody();
          console.log("Sleak initialized");
        })
        .catch((error) => {
          console.error("Error occurred while loading resources:", error);
        });
    }, 10);
  };
}

injectSleakScript();
