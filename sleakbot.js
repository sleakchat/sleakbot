async function sleakScript() {
  const sleakbotScriptTag = document.querySelector('#sleakbot');
  const scriptSrc = sleakbotScriptTag.getAttribute('src');
  const chatbotId = sleakbotScriptTag.getAttribute('chatbot-id');
  const scriptCookies = sleakbotScriptTag.getAttribute('cookies');
  // env control
  if (scriptSrc.includes('dev') || scriptSrc.includes('localhost')) {
    var widgetBaseUrl = 'https://staging.sleak.chat';
  } else {
    var widgetBaseUrl = 'https://widget.sleak.chat';
  }

  const timestamp = new Date().getTime();
  const chatbotConfigEndpoint = `${widgetBaseUrl}/api/chatbot/${chatbotId}?t=${timestamp}`;

  const chatbotConfigResponse = await fetch(chatbotConfigEndpoint, {
    method: 'get'
  });

  let visitorId;

  function createNewCookie() {
    visitorId = crypto.randomUUID();
    Cookies.set(`sleakVisitorId_${chatbotId}`, visitorId, {
      expires: 365,
      sameSite: 'None',
      secure: true
    });
  }

  if (!scriptCookies) {
    if (Cookies.get(`sleakVisitorId_${chatbotId}`)) {
      // console.log("cookie exists, value = ",Cookies.get(`sleakVisitorId_${chatbotId}`));
      // Resetting chat
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('resetChat')) {
        Cookies.remove(`sleakVisitorId_${chatbotId}`);
        createNewCookie();
        urlParams.delete('resetChat');
        const updatedParams = urlParams.toString();
        const newUrl = updatedParams ? `${window.location.origin}${window.location.pathname}?${updatedParams}` : `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState(null, '', newUrl);
      }

      visitorId = Cookies.get(`sleakVisitorId_${chatbotId}`);
    } else {
      createNewCookie();
      // console.log("new cookie = ", visitorId);
    }
  } else {
    // fallback to using localStorage
    if (localStorage.getItem(`sleakVisitorId_${chatbotId}`)) {
      // console.log("localStorage exists, value = ", localStorage.getItem(`sleakVisitorId_${chatbotId}`));
      visitorId = localStorage.getItem(`sleakVisitorId_${chatbotId}`);
    } else {
      visitorId = crypto.randomUUID();
      localStorage.setItem(`sleakVisitorId_${chatbotId}`, visitorId);
      // console.log("new localStorage = ", visitorId);
    }
  }

  // aawait chatbotConfig
  const chatbotConfig = await chatbotConfigResponse.json();
  // console.log("chatbotConfig =:", chatbotConfig);

  // main code
  if (chatbotConfig.publishing.published == true) {
    const sleakWrap = document.querySelector('#sleak-widgetwrap');
    const sleakButton = document.querySelector('#sleak-buttonwrap');
    var sleakPopup = document.querySelector('#sleak-popup-embed');
    const sleakEmbeddedWidget = document.querySelector('#sleak-body-embed');
    const sleakWidgetwrap = document.getElementById('sleak-widget-container');
    // const sleakBgOverlay = document.querySelector("#sleak-bgoverlay");

    var viewportWidth2 = window.innerWidth;
    // const mirrorring = { mobile: true, desktop: true };

    function setStylingMobile() {
      var mobilePopupHeight = chatbotConfig.btn_offset.y_mobile + 82;
      sleakButton.setAttribute('style', 'right: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + chatbotConfig.btn_offset.y_mobile + 'px;');
      sleakPopup.setAttribute('style', 'right: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + mobilePopupHeight + 'px;');
    }

    function setStylingDesktop() {
      sleakWrap.setAttribute('style', 'right: ' + chatbotConfig.btn_offset.x_desktop + 'px; bottom: ' + chatbotConfig.btn_offset.y_desktop + 'px;');
    }

    function setStylingMobileMirrored() {
      var mobilePopupHeight = chatbotConfig.btn_offset.y_mobile + 82;
      var mobilePopupHeight = chatbotConfig.btn_offset.y_mobile + 82;
      sleakButton.setAttribute('style', 'left: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + chatbotConfig.btn_offset.y_mobile + 'px;');
      sleakPopup.setAttribute('style', 'left: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + mobilePopupHeight + 'px;');
    }

    function setStylingDesktopMirrored() {
      sleakWrap.setAttribute(
        'style',
        'left: ' + chatbotConfig.btn_offset.x_desktop + 'px; bottom: ' + chatbotConfig.btn_offset.y_desktop + 'px;' + 'width: 100vw; justify-content: flex-start; align-items: flex-start;'
      );
      sleakWidgetwrap.setAttribute('style', 'width: 420px; height: 100%;');
      sleakPopup.setAttribute('style', 'right: unset; left: 0;');
      sleakButton.setAttribute('style', 'right: unset; left: 0; transform: scaleX(-1) !important');
    }

    if (viewportWidth2 < 479) {
      if (!chatbotConfig.btn_offset.mirrorring || chatbotConfig.btn_offset.mirrorring.mobile !== true) {
        setStylingMobile();
      } else {
        setStylingMobileMirrored();
      }
    } else {
      if (!chatbotConfig.btn_offset.mirrorring || chatbotConfig.btn_offset.mirrorring.mobile !== true) {
        setStylingDesktop();
      } else {
        setStylingDesktopMirrored();
      }
    }

    // render iframes
    var iframeBtn = document.getElementById('sleak-button-iframe');
    iframeBtn.src = widgetBaseUrl + `/button/${chatbotId}`;
    var iframeWidgetbody = document.getElementById('sleak-widget-iframe');
    iframeWidgetbody.src = widgetBaseUrl + `/${chatbotId}?id=${visitorId}`;
    var iframePopup = document.getElementById('sleak-popup-iframe');
    iframePopup.src = widgetBaseUrl + `/popup/${chatbotId}`;

    // btn visibility
    var sleakButtonWrap = document.querySelector('#sleak-buttonwrap');
    sleakButtonWrap.style.opacity = '0';
    sleakButtonWrap.style.transform = 'scale(0.8)';
    sleakButtonWrap.style.transition = 'all 0.1s ease';
    setTimeout(function () {
      sleakButtonWrap.style.opacity = '1';
      sleakButtonWrap.style.transform = 'scale(1)';
    }, 500);

    // delay setting shadow to avoid flickering
    async function setShadow() {
      await new Promise(resolve => setTimeout(resolve, 50));
      iframeWidgetbody.style.boxShadow = '0px 4px 8px -2px rgba(0, 0, 0, 0.1)';
    }

    function openSleakWidget() {
      sleakBodyEmbed.style.display = 'flex';
      // sleakBgOverlay.style.display = "block";

      sleakWidgetwrap.style.transform = 'translateY(20px)';
      sleakBodyEmbed.style.transform = 'translateY(800px)';
      sleakBodyEmbed.style.transform = 'scale(0.99)';

      sleakPopup.style.display = 'none';
      sleakBodyEmbed.style.opacity = '0';

      sleakBodyEmbed.style.transition = 'opacity 0.15s ease-in-out';
      sleakBodyEmbed.style.transition = 'transform 0.15s ease-in-out';
      sleakWidgetwrap.style.transition = 'transform 0.15s ease-in-out';

      setTimeout(function () {
        sleakBodyEmbed.style.opacity = '1';
        sleakWidgetwrap.style.transform = 'translateY(0)';
        sleakBodyEmbed.style.transform = 'translateY(0)';
        sleakBodyEmbed.style.transform = 'scale(1)';
      }, 50);
    }
    function closeSleakWidget() {
      sleakBodyEmbed.classList.remove('open');
      iframeWidgetbody.classList.remove('open');

      sleakEmbeddedWidget.style.display = 'none';
      // sleakBgOverlay.style.display = "none";
      sleakPopup.style.display = 'none';
    }

    // Handle widget opening

    async function changeButtonState(state) {
      var iframeBtnWindow = document.getElementById('sleak-button-iframe').contentWindow;

      if (state == true) {
        iframeBtnWindow.postMessage('openButton', '*');
        iframeWidgetbody.contentWindow.postMessage('openButton', '*');
      } else if (state == false) {
        iframeBtnWindow.postMessage('closeButton', '*');
      }
    }

    let sleakWidgetOpenState = false;
    let firstButtonClick = true;

    window.toggleSleakWidget = function () {
      // check if widget is open
      if (sleakWidgetOpenState == false) {
        sleakWidgetOpenState = true;
        // console.log(sleakWidgetOpenState);

        changeButtonState(true);

        openSleakWidget();
        if (window.matchMedia('(max-width: 768px)').matches) {
          document.body.style.overflow = 'hidden';
          // console.log("overflow hidden");
        }

        const viewportHeight = window.innerHeight;
        document.getElementById('sleak-widgetwrap').style.height = viewportHeight + 'px';
        document.getElementById('sleak-widgetwrap').style.minHeight = viewportHeight + 'px';
        // console.log("Viewport Height window:", viewportHeight);

        /// check for first button click of page load
        if (firstButtonClick & !scriptCookies) {
          const widgetOpenFlag = Cookies.get(`sleakWidget_${chatbotId}`);

          if (!widgetOpenFlag) {
            // for hiding popup after widget open
            // setting cookie for the first widget open flag
            let widgetOpenFlag = crypto.randomUUID();
            Cookies.set(`sleakWidget_${chatbotId}`, widgetOpenFlag, {
              expires: 365,
              sameSite: 'None',
              secure: true
            });
          }

          firstButtonClick = false;
        }
      } else if (sleakWidgetOpenState == true) {
        sleakWidgetOpenState = false;
        changeButtonState(false);
        // console.log(sleakWidgetOpenState);
        closeSleakWidget();

        if (window.matchMedia('(max-width: 768px)').matches) {
          document.body.style.overflow = 'auto';
          // console.log("overflow auto");
        }
      }
    };

    // event listener for scrolling
    window.addEventListener('scroll', function () {
      // console.log("scrolling");
      if (sleakWidgetOpenState == true) {
        const viewportHeightScroll = window.innerHeight;
        document.getElementById('sleak-widgetwrap').style.height = viewportHeightScroll + 'px';
        document.getElementById('sleak-widgetwrap').style.minHeight = viewportHeightScroll + 'px';
        // console.log("Viewport Height scroll:", viewportHeightScroll);
      }
    });

    // Chime & popup

    var sleakBodyEmbed = document.getElementById('sleak-body-embed');
    var sleakPopupOpen = document.getElementById('sleak-popup-embed');

    function showPopup() {
      sleakPopupOpen.style.display = 'flex';
      sleakPopupOpen.style.opacity = '0';
      sleakPopupOpen.style.transform = 'translateY(20px)';
      sleakPopupOpen.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(function () {
        sleakPopupOpen.style.opacity = '1';
        sleakPopupOpen.style.transform = 'translateY(0)';
      }, 50);
    }

    let sleakChime = new Audio('https://sygpwnluwwetrkmwilea.supabase.co/storage/v1/object/public/app/assets/sleak-chime.mp3');
    let sleakChimeOperator = new Audio('https://sygpwnluwwetrkmwilea.supabase.co/storage/v1/object/public/app/assets/sleak-chime-operatorjoined.mp3');

    function playSleakChime() {
      try {
        sleakChime.play();
      } catch (error) {}
    }

    function playSleakChimeOperator() {
      try {
        sleakChimeOperator.play();
      } catch (error) {}
    }

    // console.log(sleakWidgetOpenState);

    // disable popup/chime after first page load
    var sessionStorageKey = chatbotId + '_sleakPopupTriggered';
    var hasPopupBeenTriggered = sessionStorage.getItem(sessionStorageKey);
    // var hasPopupBeenTriggered = false; // remove line in prod

    if (!hasPopupBeenTriggered) {
      // console.log("popup localStorage does not exist");

      const viewportWidth = window.innerWidth;
      // console.log(viewportWidth);

      if (viewportWidth < 479) {
        if (chatbotConfig.popup.mobile == true) {
          setTimeout(function () {
            if (sleakWidgetOpenState == false) {
              showPopup();
              if (chatbotConfig.popup.chime.mobile == true) {
                playSleakChime();
              }
              sessionStorage.setItem(sessionStorageKey, 'true');
            }
          }, 6000);
        }
      } else {
        if (chatbotConfig.popup.desktop == true) {
          setTimeout(function () {
            if (sleakWidgetOpenState == false) {
              showPopup();
              if (chatbotConfig.popup.chime.desktop == true) {
                playSleakChime();
              }
              sessionStorage.setItem(sessionStorageKey, 'true');
            }
          }, 6000);
        }
      }
    }

    // child window event handling

    async function pushGtmEvent() {
      var dataLayer = window.dataLayer || (window.dataLayer = []);
      dataLayer.push({
        event: event.data,
        postMessageData: event
      });
      // console.log('Pushed to dataLayer:', event);
    }

    window.addEventListener('message', event => {
      if (event.origin === 'https://sleak.vercel.app' || event.origin === 'https://staging.sleak.chat' || event.origin === 'https://widget.sleak.chat') {
        console.log('Received message:', event);

        if (event.data === 'closePopup') {
          closeSleakWidget();
        } else if (event.data === 'toggleChat') {
          toggleSleakWidget();
        } else if (event.data === 'operatorMessage') {
          playSleakChime();
        } else if (event.data === 'operatorChanged') {
          playSleakChimeOperator();
        } else if (event.data === 'domInitialized') {
          setShadow();
        } else if (event.data === 'sleakChatInitiated') {
          pushGtmEvent(event);
        } else if (event.data === 'sleakSentContactDetails') {
          pushGtmEvent(event);
        } else if (event.data === 'sleakHumanHandoffActivated') {
          pushGtmEvent(event);
        } else if (event.data === 'createdChat') {
          console.log(event);
        } else {
          if (event.data.type !== 'showOutputLogsAdmin') console.log('no declared event');
        }
      }
    });

    // //// Background overlay for mobile //// LET OP: MOET MISSCHIEN NOG BLIJVEN (IN MAIN TOGGLECHAT FUNCTION VERWERKEN)

    // var sleakWidgetOpened = document.getElementById("sleak-widget-close");
    // var sleakWidgetClosed = document.getElementById("sleak-widget-closed");

    // if (window.matchMedia("(max-width: 768px)").matches) {
    //   sleakWidgetOpened.addEventListener("click", function () {
    //     document.body.style.overflow = "auto";
    //   });
    //   sleakWidgetClosed.addEventListener("click", function () {
    //     document.body.style.overflow = "hidden";
    //   });
    // }

    async function interceptDataLayerPush() {
      // Store a reference to the original dataLayer.push method
      const originalPush = window.dataLayer.push;
      console.log(originalPush);

      // Overwrite the dataLayer.push method to add custom functionality
      window.dataLayer.push = function () {
        // Call the original push method
        const args = Array.from(arguments);
        originalPush.apply(window.dataLayer, args);

        // Handle the intercepted event here (only new events after initialization)
        args.forEach(event => {
          if (event.event) {
            console.log('Intercepted DataLayer Event:', event.event);

            // Now push this event to the iframe
            const iframeWidgetbody = document.getElementById('sleak-widget-iframe');
            if (iframeWidgetbody) {
              console.log('postMessage to child window');
              iframeWidgetbody.contentWindow.postMessage(event, '*');
            }
          }
        });
      };
    }
    interceptDataLayerPush();

    async function interceptGlobalEvents() {
      // Events to listen for
      const eventsToCapture = ['click', 'submit', 'change'];

      // Function to handle and send event details to the iframe
      function handleEvent(event) {
        console.log('Captured Event:', event.type);

        // Send event details to the iframe
        const iframeWidgetbody = document.getElementById('sleak-widget-iframe');
        console.log('event pushed to child window: ', event);
        if (iframeWidgetbody) {
          const eventData = {
            type: event.data,
            payload: {
              timestamp: new Date().toISOString(),
              event: event.target
            }
          };
          iframeWidgetbody.contentWindow.postMessage(eventData, '*');
        }
      }

      eventsToCapture.forEach(eventType => {
        document.addEventListener(eventType, handleEvent, true);
      });
    }

    interceptGlobalEvents();
  }
}

sleakScript();
