async function injectSleakScript() {
  // env control
  const sleakbotScriptTag = document.querySelector("#sleakbot");
  const scriptSrc = sleakbotScriptTag.getAttribute("src");

  if (scriptSrc.includes("dev")) {
    console.log("dev path");
    var sleakHtml = "https://cdn.dev.sleak.chat/sleakbot.html";
    var sleakJs = "https://cdn.dev.sleak.chat/sleakbot.js";
  } else {
    console.log("prod path");
    var sleakHtml = "https://cdn.sleak.chat/sleakbot.html";
    var sleakJs = "https://cdn.sleak.chat/sleakbot.js";
  }

  // const sleak_htmlUrl = "https://cdn.dev.sleak.chat/sleakbot.html";
  // const sleak_jsUrl = "https://cdn.dev.sleak.chat/sleakbot.js";

  //  // append html to body
  //  function appendSleakHtmlToBody(sleak_html) {
  //    const sleak_parser = new DOMParser();
  //    const sleak_htmlDoc = sleak_parser.parseFromString(sleak_html, "text/html");
  //    document.body.appendChild(sleak_htmlDoc.documentElement);
  //  }

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
    }, 200);
  };
}

injectSleakScript();
