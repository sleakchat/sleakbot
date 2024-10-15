const sleakbotScriptTag = document.querySelector('#sleakbot');
const scriptCookies = sleakbotScriptTag.getAttribute('cookies');

async function injectSleakScript() {
  if (window.sleakScriptInjected) {
    return;
  }

  // env control
  const scriptSrc = sleakbotScriptTag.getAttribute('src');
  if (scriptSrc.includes('dev')) {
    var baseUrl = 'https://cdn.dev.sleak.chat';
  } else if (scriptSrc.includes('localhost')) {
    var baseUrl = 'http://localhost:3000';
  } else {
    var baseUrl = 'https://cdn.sleak.chat';
  }
  const placement = sleakbotScriptTag.getAttribute('placement');
  if (placement == 'fullwidth') {
    var fileName = 'sleakbot-fw';
  } else {
    var fileName = 'sleakbot';
  }

  const sleakHtml = `${baseUrl}/${fileName}.html`;
  const sleakJs = `${baseUrl}/${fileName}.js`;
  const sleakCss = `${baseUrl}/${fileName}.css`;

  async function appendStylesheet(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
  }
  appendStylesheet(sleakCss);

  async function fetchAndAppendHtml() {
    try {
      const response = await fetch(sleakHtml);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const sleak_html = await response.text();
      appendSleakHtmlToBody(sleak_html);
    } catch (error) {
      console.error('Error occurred while fetching sleak HTML:', error);
    }
  }

  // append js to body
  function appendSleakJsToBody() {
    const sleak_script = document.createElement('script');
    sleak_script.src = sleakJs;
    document.body.appendChild(sleak_script);
  }

  console.log('Fetching:', sleakHtml);

  function fetchAndAppendHtml() {
    return fetch(sleakHtml)
      .then(sleak_response => {
        console.log(sleak_response);
        return sleak_response.text();
      })
      .then(sleak_html => {
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
          console.log('sleak.chat initialized');
        })
        .catch(error => {
          console.error('Error occurred while loading sleak.chat:', error);
        });
    }, 10);
  }
  // };
}

if (!scriptCookies) {
  function loadScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadScript()
    .then(() => {
      injectSleakScript();
    })
    .catch(error => {
      console.error('Error occurred while loading js-cookie:', error);
    });
} else {
  injectSleakScript();
}
