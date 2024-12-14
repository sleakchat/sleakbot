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

  function createNewCookie(key, value) {
    Cookies.set(key, value, {
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
        visitorId = crypto.randomUUID();
        createNewCookie(`sleakVisitorId_${chatbotId}`, visitorId);
        urlParams.delete('resetChat');
        const updatedParams = urlParams.toString();
        const newUrl = updatedParams ? `${window.location.origin}${window.location.pathname}?${updatedParams}` : `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState(null, '', newUrl);
      }

      visitorId = Cookies.get(`sleakVisitorId_${chatbotId}`);
    } else {
      visitorId = crypto.randomUUID();
      createNewCookie(`sleakVisitorId_${chatbotId}`, visitorId);
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

  let chatCreated = Cookies.get(`slkChatCreated_${chatbotId}_${visitorId}`) ? true : false;
  console.log('chatCreated = ', chatCreated);

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
    const liveChatPopup = document.getElementById('sleak-operatorchanged-popup');
    const chatInput = document.querySelector('.sleak-popup-chatinpupt-input-wrapper');
    const btnPulse = document.querySelector('#sleak-button-pulse');
    const btnNotificaiton = document.querySelector('#sleak-btn-notification-count');
    const isTypingIndicator = document.querySelector('#sleak-loader-container');
    const popupListWrap = document.querySelector('#popup-list-wrap');

    var viewportWidth2 = window.innerWidth;
    // const mirrorring = { mobile: true, desktop: true };
    // chatbotConfig.btn_offset = {
    //   x_mobile: 40,
    //   y_mobile: 40,
    //   x_desktop: 600,
    //   y_desktop: 300,
    //   mirrorring: mirrorring
    // };
    console.log('mirrorring:', chatbotConfig.btn_offset.align_right);

    function setStylingMobile() {
      var mobilePopupHeight = chatbotConfig.btn_offset.y_mobile + 82;
      sleakButton.setAttribute('style', 'right: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + chatbotConfig.btn_offset.y_mobile + 'px;');
      popupListWrap.setAttribute('style', 'right: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + mobilePopupHeight + 'px;');
    }

    function setStylingDesktop() {
      sleakWrap.setAttribute('style', 'right: ' + chatbotConfig.btn_offset.x_desktop + 'px; bottom: ' + chatbotConfig.btn_offset.y_desktop + 'px;');
    }

    function setStylingMobileMirrored() {
      var mobilePopupHeight = chatbotConfig.btn_offset.y_mobile + 82;
      sleakButton.setAttribute('style', 'left: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + chatbotConfig.btn_offset.y_mobile + 'px;');
      popupListWrap.setAttribute('style', 'left: ' + chatbotConfig.btn_offset.x_mobile + 'px; bottom: ' + mobilePopupHeight + 'px; align-items: start;');
      sleakWrap.style.alignItems = 'flex-start';
      sleakEmbeddedWidget.setAttribute('style', 'justify-content: flex-start !important');
    }

    function setStylingDesktopMirrored() {
      sleakWrap.setAttribute(
        'style',
        'left: ' + chatbotConfig.btn_offset.x_desktop + 'px; bottom: ' + chatbotConfig.btn_offset.y_desktop + 'px;' + 'width: 100vw; justify-content: flex-start; align-items: flex-start;'
      );
      sleakWidgetwrap.setAttribute('style', 'width: 420px; height: 100%;');
      popupListWrap.setAttribute('style', 'right: unset; left: 0;');
      sleakButton.setAttribute('style', 'right: unset; left: 0; transform: scaleX(-1) !important');
      document.querySelector('#popup-list-wrap').style.alignItems = 'start';
    }

    if (viewportWidth2 < 479) {
      if (!chatbotConfig.btn_offset.align_right || chatbotConfig.btn_offset.align_right.mobile !== false) {
        setStylingMobile();
      } else {
        setStylingMobileMirrored();
      }
    } else {
      if (!chatbotConfig.btn_offset.align_right || chatbotConfig.btn_offset.align_right.desktop !== false) {
        setStylingDesktop();
      } else {
        setStylingDesktopMirrored();
        console.log('mirrored desktop');
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
      sleakEmbeddedWidget.style.display = 'flex';
      // sleakBgOverlay.style.display = "block";

      sleakWidgetwrap.style.transform = 'translateY(20px)';
      sleakEmbeddedWidget.style.transform = 'translateY(800px)';
      sleakEmbeddedWidget.style.transform = 'scale(0.99)';

      sleakEmbeddedWidget.style.opacity = '0';
      sleakPopup.style.display = 'none';
      chatInput.style.display = 'none';
      liveChatPopup.style.display = 'none';
      btnPulse.style.display = 'none';
      btnNotificaiton.style.display = 'none';
      isTypingIndicator.style.display = 'none';

      sleakEmbeddedWidget.style.transition = 'opacity 0.15s ease-in-out';
      sleakEmbeddedWidget.style.transition = 'transform 0.15s ease-in-out';
      sleakWidgetwrap.style.transition = 'transform 0.15s ease-in-out';

      setTimeout(function () {
        sleakEmbeddedWidget.style.opacity = '1';
        sleakWidgetwrap.style.transform = 'translateY(0)';
        sleakEmbeddedWidget.style.transform = 'translateY(0)';
        sleakEmbeddedWidget.style.transform = 'scale(1)';
      }, 50);
    }
    function closeSleakWidget() {
      sleakEmbeddedWidget.classList.remove('open');
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
        sleakWrap.style.height = viewportHeight + 'px';
        sleakWrap.style.minHeight = viewportHeight + 'px';
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

    function showPopup() {
      sleakPopup.style.display = 'flex';
      sleakPopup.style.opacity = '0';
      sleakPopup.style.transform = 'translateY(20px)';
      sleakPopup.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(function () {
        sleakPopup.style.opacity = '1';
        sleakPopup.style.transform = 'translateY(0)';
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

    let blockDefaultPopup = false;
    var sessionStorageKey = chatbotId + '_sleakTriggerbasedPopupTriggered';

    let pagePath = window.location.pathname;
    // pagePath = '/asdf'; // remove limne in prod
    console.log('pagePath:', pagePath);
    const popupRules = chatbotConfig.popups?.rules || [];
    console.log('popupRules:', popupRules);

    if (popupRules.length > 0) {
      const pagePopup = popupRules.find(rule => rule.page == pagePath);
      if (pagePopup) {
        console.log('disabling default popup as pagePopup exists = ', pagePopup);
        blockDefaultPopup = true;
        console.log('blockDefaultPopup = ', blockDefaultPopup);
      }
    }

    async function showTriggerBasedPopup(payload) {
      console.log('showing livechat popup with payload = ', payload);

      liveChatPopup.querySelector('#sleak-operatorchanged-avatar').src = payload.avatar;
      liveChatPopup.querySelector('#sleak-operatorchanged-name').innerText = payload.name;

      if (!sleakWidgetOpenState) {
        liveChatPopup.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        liveChatPopup.style.transform = 'translateY(20px)';
        liveChatPopup.style.opacity = '0';
        liveChatPopup.style.display = 'flex';
        setTimeout(function () {
          liveChatPopup.style.opacity = '1';
          liveChatPopup.style.transform = 'translateY(0)';
        }, 50);

        setTimeout(() => (isTypingIndicator.style.display = 'flex'), 1000);

        playSleakChimeOperator();
      }
      setTimeout(() => (isTypingIndicator.style.display = 'none'), 6000);
      setTimeout(function () {
        blockDefaultPopup = false;
        if (!chatCreated) {
          console.log('showing main popup');
          if (!sleakWidgetOpenState) {
            showPopup();
            playSleakChime();
          }
        }
        setTimeout(function () {
          if (!sleakWidgetOpenState) {
            chatInput.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            chatInput.style.transform = 'translateY(20px)';
            chatInput.style.opacity = '0';
            chatInput.style.display = 'flex';
            setTimeout(function () {
              chatInput.style.opacity = '1';
              chatInput.style.transform = 'translateY(0)';
            }, 50);

            btnPulse.style.display = 'flex';
            btnPulse.style.opacity = '1';
            btnPulse.style.transform = 'scale(1)';

            btnNotificaiton.style.transform = 'scale(0.5)';
            btnNotificaiton.style.display = 'flex';
            setTimeout(function () {
              btnNotificaiton.style.opacity = '1';
              btnNotificaiton.style.transform = 'scale(1)';
            }, 50);
          }
        }, 500);
      }, 7000);

      sessionStorage.setItem(sessionStorageKey, 'true');
    }

    if (!hasPopupBeenTriggered && !blockDefaultPopup) {
      console.log('popup localStorage does not exist');

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
        // console.log('Received message:', event);

        if (event.data === 'closePopup') {
          closeSleakWidget();
        } else if (event.data === 'toggleChat') {
          toggleSleakWidget();
        } else if (event.data === 'operatorMessage') {
          playSleakChime();
        } else if (event.data === 'operatorChanged') {
          playSleakChimeOperator();
        } else if (event.data === 'domInitialized') {
          const sleakPageLoad = {
            type: 'sleakPageLoad',
            payload: {
              currentPath: pagePath,
              fullUrl: window.location.href
            }
          };
          // console.log('sleakPageLoad message posted =', sleakPageLoad);
          iframeWidgetbody.contentWindow.postMessage(sleakPageLoad, '*');
          iframePopup.contentWindow.postMessage(sleakPageLoad, '*');

          setShadow();
          eventHandling();
        } else if (event.data === 'sleakChatInitiated') {
          pushGtmEvent(event);
        } else if (event.data === 'sleakSentContactDetails') {
          pushGtmEvent(event);
        } else if (event.data === 'sleakHumanHandoffActivated') {
          pushGtmEvent(event);
        } else if (event.data.type === 'chatCreated') {
          console.log('chat created = ', event);
          createNewCookie(`slkChatCreated_${chatbotId}_${visitorId}`, 'true');
          Cookies.remove(`slkLocalEventQueue_${chatbotId}_${visitorId}`);
          chatCreated = true;
          console.log('created chat cookie');
        } else if (event.data.type === 'initiateTriggerBasedPopup') {
          console.log('trigger initiateTriggerBasedPopup = ', event);
          showTriggerBasedPopup(event.data.payload);
        } else {
          if (event.data.type !== 'showOutputLogsAdmin') console.log('no declared event');
        }
      }
    });

    function eventHandling() {
      if (!chatCreated) {
        if (!Cookies.get(`slkLocalEventQueue_${chatbotId}_${visitorId}`)) {
          createNewCookie(`slkLocalEventQueue_${chatbotId}_${visitorId}`, JSON.stringify([]));
          // console.log('created slkLocalEventQueue cookie');
        } else {
          const rawEvents = Cookies.get(`slkLocalEventQueue_${chatbotId}_${visitorId}`);
          const parsedEvents = JSON.parse(rawEvents);

          handleEvent({
            type: 'sleakInitialEvents',
            payload: {
              events: parsedEvents
            }
          });
          // console.log('posted initial events =', parsedEvents);
          // Cookies.remove(`slkChatCreated_${chatbotId}_${visitorId}`);
          // console.log('removed chat created cookie');
        }
      }

      function handleEvent(event) {
        // console.log('Captured Event:', event);

        if (!chatCreated && event.type == 'sleakNewEvent') {
          const cookieKey = `slkLocalEventQueue_${chatbotId}_${visitorId}`;
          // console.log('cookieKey in handle event function', cookieKey);
          let currentEvents = Cookies.get(cookieKey);

          currentEvents = currentEvents ? JSON.parse(currentEvents) : [];

          currentEvents.push(event);

          createNewCookie(cookieKey, JSON.stringify(currentEvents));
          const updatedCookie = Cookies.get(cookieKey);
          // console.log('updated cookie', updatedCookie);
        }

        if (iframeWidgetbody && iframeWidgetbody.contentWindow) {
          iframeWidgetbody.contentWindow.postMessage(event, '*');
        }
      }

      async function interceptGlobalEvents() {
        // Group-based structure for events and their aliases
        const eventGroups = {
          form_submission: ['submit', 'formSubmit'],
          purchase: ['purchase', 'orderComplete', 'orderPlaced', 'order_complete', 'order_placed'],
          add_to_cart: ['addToCart', 'add_to_cart'],
          login: ['logIn', 'log_in', 'login'],
          sign_up: ['signUp', 'signup', 'sign_up'],
          click: ['click', 'clickEvent']
        };

        function extractEventConfig(event) {
          const eventConfig = {};

          // For form submissions, extract the target element details
          if (event.type === 'submit' || event.type === 'formSubmit') {
            eventConfig.formName = event.target ? event.target.name || event.target.id || null : null;
          }

          // For e-commerce-related events, extract order details if available
          if (['purchase', 'orderComplete', 'orderPlaced', 'order_complete', 'order_placed'].includes(event.type)) {
            // Check if event has a `detail` property containing order info
            if (event.detail) {
              eventConfig = event.detail || {};
            }
          }

          return eventConfig;
        }

        // Loop through each group and set up listeners for its events
        Object.entries(eventGroups).forEach(([group, events]) => {
          events.forEach(event => {
            document.addEventListener(event, function (eventDetails) {
              // console.log('group', group);
              handleEvent({
                type: 'sleakNewEvent', // Custom event type
                payload: {
                  timestamp: new Date().toISOString(), // Capture event time
                  type: 'web_event', // Fixed type for standard events
                  event_group: group, // Use the group name directly
                  event: eventDetails.type, // The raw event name/type
                  event_config: extractEventConfig(eventDetails) // Optional event details
                }
              });
            });
          });
        });
      }

      // Initialize the global event listener
      interceptGlobalEvents();

      async function currentUrlEvent() {
        handleEvent({
          type: 'sleakNewEvent',
          payload: {
            timestamp: new Date().toISOString(),
            type: 'web_event',
            event_group: 'page_view',
            event: 'DOMContentLoaded',
            event_config: {
              url: window.location.href
            }
          }
        });
      }
      currentUrlEvent();

      // custom fields
      function customFields() {
        const customFieldsConfig = chatbotConfig.custom_fields_config;
        // // example payload for the custom_fields_config object
        // customFieldsConfig = [
        //   {
        //     key: 'email',
        //     updateChatName: true
        //   },
        //   {
        //     key: 'user_id',
        //     updateChatName: false
        //   }
        // ];
        // console.log('customFieldsConfig:', customFieldsConfig);

        // end user will push custom fields in an object to this functionnn
        window.sleakPushCustomFields = function (customFields) {
          // validate if the object is valid
          if (!customFields || typeof customFields !== 'object') {
            console.error('invalid type. object expected.');
            return;
          }
          // validate if the object is valid, not empty, and the keys exist in customFields
          const validKeys = Object.keys(customFields).filter(key => customFieldsConfig.map(cf => cf.key).includes(key));
          const invalidKeys = Object.keys(customFields).filter(key => !customFieldsConfig.map(cf => cf.key).includes(key));

          if (invalidKeys.length > 0) {
            console.error(`invalid custom fields: ${invalidKeys.join(', ')}`);
            return;
          }
          if (validKeys.length === 0) {
            console.error('no valid custom fields to push');
            return;
          }
          // validate if there are empty values
          const emptyValues = validKeys.filter(key => customFields[key] === '');
          if (emptyValues.length > 0) {
            console.error(`empty custom field values: ${emptyValues.join(', ')}`);
            return;
          }

          console.log('valid custom fields:', customFields);

          // push the valid custom fields
          handleEvent({
            type: 'updateCustomFields',
            payload: {
              timestamp: new Date().toISOString(),
              customFields: customFields
            }
          });
        };

        // dispatch event when custom fields can be updated
        window.dispatchEvent(new CustomEvent('sleakCustomFieldsHandlerInitialized'));

        // set example payload for the customFields argument and call function
        // examplePayload = {
        //   email: 'email@email.com',
        //   user_id: '123456'
        // };
        // window.sleakPushCustomFields(examplePayload);
      }

      // console.log('chatbotConfig', chatbotConfig);
      if (chatbotConfig.custom_fields_config) customFields();
    }
  }
}

sleakScript();
