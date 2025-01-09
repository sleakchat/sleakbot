const sleakbotScriptTag = document.querySelector('#sleakbot');
const scriptCookies = sleakbotScriptTag.getAttribute('cookies');
const chatbotId2 = sleakbotScriptTag.getAttribute('chatbot-id');

async function injectSleakScript() {
  if (window.sleakScriptInjected) {
    return;
  }

  // env control
  const scriptSrc = sleakbotScriptTag.getAttribute('src');
  if (scriptSrc.includes('dev')) {
    var baseUrl = 'https://cdn.dev.sleak.chat';
  } else if (scriptSrc.includes('localhost')) {
    var baseUrl = 'http://localhost:8000';
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

  function appendSleakHtmlToBody(sleak_html) {
    // Create a container for the Shadow DOM
    const container = document.createElement('div');

    // Attach the Shadow DOM to the container
    const shadow = container.attachShadow({ mode: 'open' });

    // Add stylesheet to the Shadow DOM
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = sleakCss;
    shadow.appendChild(link);

    // Append the container to the DOM
    sleakbotScriptTag.parentNode.insertBefore(container, sleakbotScriptTag.nextSibling);

    // Apply placement styles if 'fullwidth'
    if (placement === 'fullwidth') {
      container.style.width = '100%';
      container.style.height = '100%';
    }

    // Create a div for the HTML content and append it to the Shadow DOM
    const content = document.createElement('div');
    content.innerHTML = sleak_html;
    shadow.appendChild(content);
  }

  // append js to body
  function appendSleakJsToBody() {
    const sleak_script = document.createElement('script');
    sleak_script.src = sleakJs;
    document.body.appendChild(sleak_script);
  }

  function fetchAndAppendHtml() {
    return fetch(sleakHtml)
      .then(sleak_response => {
        // console.log(sleak_response);
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

if (chatbotId2 == 'f1c0ba70-cb59-41d5-826c-d00ae14d83ec' || chatbotId2 == '7785e220-6b5b-4c3c-80ba-f08f52ac99de') {
  // console.log('sleak.chat is enabled for this chatbot');
} else {
  // console.log('sleak.chat is disabled for this chatbot');
}
