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

  // append div to body
  function appendSleakHtmlToBody(sleak_html) {
    const sleakHtml = document.createElement('div');
    sleakHtml.innerHTML = sleak_html;
    if (placement === 'fullwidth') {
      sleakHtml.style.width = '100%';
      sleakHtml.style.height = '100%';
      sleakbotScriptTag.parentNode.insertBefore(sleakHtml, sleakbotScriptTag.nextSibling);
    } else {
      document.body.appendChild(sleakHtml);
    }
  }

  // append js to body
  function appendSleakJsToBody() {
    const sleak_script = document.createElement('script');
    sleak_script.src = sleakJs;
    document.body.appendChild(sleak_script);
  }

  async function fetchAndAppendHtml() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', sleakHtml, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        appendSleakHtmlToBody(xhr.responseText);
      } else {
        console.error('XHR Error: ', xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error('XHR Error: Request failed');
    };
    xhr.send();
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
