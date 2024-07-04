async function sleakScript() {
  const sleakbotScriptTag = document.querySelector("#sleakbot");
  const scriptSrc = sleakbotScriptTag.getAttribute("src");
  const chatbotId = sleakbotScriptTag.getAttribute("chatbot-id");
  // env control
  if (scriptSrc.includes("dev")) {
    var widgetBaseUrl = "https://staging.sleak.chat";
  } else {
    var widgetBaseUrl = "https://widget.sleak.chat";
  }

  const chatbotConfigEndpoint = `${widgetBaseUrl}/api/chatbot/${chatbotId}`;
  const chatbotConfigResponse = await fetch(chatbotConfigEndpoint, {
    method: "get",
  });

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

  async function loadScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js";
      script.onload = () => {
        console.log("js-cookie script loaded successfully.");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load js-cookie script.");
        reject();
      };
      document.head.appendChild(script);
    });
  }

  async function loadScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js";
      script.onload = () => {
        console.log("js-cookie script loaded successfully.");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load js-cookie script.");
        reject();
      };
      document.head.appendChild(script);
    });
  }

  async function loadScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js";
      script.onload = () => {
        console.log("js-cookie script loaded successfully.");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load js-cookie script.");
        reject();
      };
      document.head.appendChild(script);
    });
  }

  function handleCookies(Cookies) {
    console.log("handleCookies called.");

    // Ensure visitorId is defined within this function scope
    let visitorId;
    const cookieName = `sleakVisitorId_${chatbotId}`;

    if (Cookies.get(cookieName)) {
      visitorId = Cookies.get(cookieName);
      console.log(`Cookie exists, value = ${visitorId}`);
    } else {
      visitorId = crypto.randomUUID();
      Cookies.set(cookieName, visitorId, {
        expires: 365,
        sameSite: "None",
        secure: true,
      });
      console.log(`New cookie set, value = ${visitorId}`);
    }

    console.log("Visitor ID:", visitorId); // Debugging
  }

  async function initializeChatbot() {
    if (window.location.href === "https://www.zonwering-onderdelen.nl/") {
      console.log("Using mage/cookies for cookie handling.");
      require(["mage/cookies"], function (CookieHelper) {
        const Cookies = {
          get: function (name) {
            console.log(`Reading cookie: ${name}`);
            return CookieHelper.cookie.get(name);
          },
          set: function (name, value, options) {
            console.log(`Setting cookie: ${name} with value: ${value}`);
            CookieHelper.cookie.set(name, value, {
              expires: options.expires,
              path: options.path || "/",
              domain: options.domain,
              secure: options.secure,
              samesite: options.sameSite,
            });
          },
        };
        handleCookies(Cookies);
      });
    } else {
      console.log("Loading js-cookie script for cookie handling.");
      await loadScript();
      if (typeof Cookies !== "undefined") {
        console.log("js-cookie is defined, handling cookies.");
        handleCookies(Cookies);
      } else {
        console.error("Cookies library is not loaded");
      }
    }

    // Add your chatbot config code here
    const chatbotConfig = await lwgist_chatbotConfigResponses_json(); // Make sure this function is properly defined
    console.log("chatbotConfig =", chatbotConfig);

    // main code
    if (chatbotConfig.publishing.published == true) {
      const viewportWidth = window.innerWidth;

      const sleakWrap = document.querySelector("#sleak-widgetwrap");
      const sleakButton = document.querySelector("#sleak-buttonwrap");
      const sleakPopup = document.querySelector("#test-sleak-popup-embed");

      const setAttribute = (element, attribute, value) => {
        element.setAttribute(attribute, value);
      };

      if (viewportWidth < 479) {
        sleakButton.style.right = chatbotConfig.btn_offset.x_mobile + 82 + "px";
        setAttribute(
          sleakPopup,
          "style",
          "right:" +
            chatbotConfig.btn_offset.x_mobile +
            "px; bottom: " +
            chatbotConfig.btn_offset.y_mobile +
            "px;"
        );
      } else {
        setAttribute(
          sleakButton,
          "style",
          "right:" +
            chatbotConfig.btn_offset.x_mobile +
            "px; bottom: " +
            chatbotConfig.btn_offset.y_mobile +
            "px;"
        );
      }
    }
  }

  // Call the initializeChatbot function to start the process
  initializeChatbot();

  // aawait chatbotConfig
  const chatbotConfig = await chatbotConfigResponse.json();
  // console.log("chatbotConfig =:", chatbotConfig);

  // main code
  if (chatbotConfig.publishing.published == true) {
    var viewportWidth2 = window.innerWidth;

    const sleakWrap = document.querySelector("#sleak-widgetwrap");
    const sleakButton = document.querySelector("#sleak-buttonwrap");
    var sleakPopup = document.querySelector("#sleak-popup-embed");
    if (viewportWidth2 < 479) {
      var mobilePopupHeight = chatbotConfig.btn_offset.y_mobile + 82;
      sleakButton.setAttribute(
        "style",
        "right: " +
          chatbotConfig.btn_offset.x_mobile +
          "px; bottom: " +
          chatbotConfig.btn_offset.y_mobile +
          "px;"
      );
      sleakPopup.setAttribute(
        "style",
        "right: " +
          chatbotConfig.btn_offset.x_mobile +
          "px; bottom: " +
          mobilePopupHeight +
          "px;"
      );
    } else {
      sleakWrap.setAttribute(
        "style",
        "right: " +
          chatbotConfig.btn_offset.x_desktop +
          "px; bottom: " +
          chatbotConfig.btn_offset.y_desktop +
          "px;"
      );
    }

    // render iframes
    var iframeBtn = document.getElementById("sleak-button-iframe");
    iframeBtn.src = widgetBaseUrl + `/button/${chatbotId}`;
    var iframeWidgetbody = document.getElementById("sleak-widget-iframe");
    iframeWidgetbody.src = widgetBaseUrl + `/${chatbotId}?id=${visitorId}`;
    var iframePopup = document.getElementById("sleak-popup-iframe");
    iframePopup.src = widgetBaseUrl + `/popup/${chatbotId}`;

    // btn visibility
    var sleakButtonWrap = document.querySelector("#sleak-buttonwrap");
    sleakButtonWrap.style.opacity = "0";
    sleakButtonWrap.style.transform = "scale(0.8)";
    sleakButtonWrap.style.transition = "all 0.1s ease";
    setTimeout(function () {
      sleakButtonWrap.style.opacity = "1";
      sleakButtonWrap.style.transform = "scale(1)";
    }, 500);

    // delay setting shadow to avoid flickering
    async function setShadow() {
      await new Promise((resolve) => setTimeout(resolve, 50));
      iframeWidgetbody.style.boxShadow = "0px 4px 8px -2px rgba(0, 0, 0, 0.1)";
    }

    const sleakEmbeddedWidget = document.querySelector("#sleak-body-embed");
    const sleakWidgetwrap = document.getElementById("sleak-widget-container");
    // const sleakBgOverlay = document.querySelector("#sleak-bgoverlay");

    function openSleakWidget() {
      sleakBodyEmbed.style.display = "flex";
      // sleakBgOverlay.style.display = "block";

      sleakWidgetwrap.style.transform = "translateY(20px)";
      sleakBodyEmbed.style.transform = "translateY(800px)";
      sleakBodyEmbed.style.transform = "scale(0.99)";

      sleakPopup.style.display = "none";
      sleakBodyEmbed.style.opacity = "0";

      sleakBodyEmbed.style.transition = "opacity 0.15s ease-in-out";
      sleakBodyEmbed.style.transition = "transform 0.15s ease-in-out";
      sleakWidgetwrap.style.transition = "transform 0.15s ease-in-out";

      setTimeout(function () {
        sleakBodyEmbed.style.opacity = "1";
        sleakWidgetwrap.style.transform = "translateY(0)";
        sleakBodyEmbed.style.transform = "translateY(0)";
        sleakBodyEmbed.style.transform = "scale(1)";
      }, 50);
    }
    function closeSleakWidget() {
      sleakBodyEmbed.classList.remove("open");
      iframeWidgetbody.classList.remove("open");

      sleakEmbeddedWidget.style.display = "none";
      // sleakBgOverlay.style.display = "none";
      sleakPopup.style.display = "none";
    }

    // Handle widget opening

    async function changeButtonState(state) {
      var iframeBtnWindow = document.getElementById(
        "sleak-button-iframe"
      ).contentWindow;

      if (state == true) {
        iframeBtnWindow.postMessage("openButton", "*");
      } else if (state == false) {
        iframeBtnWindow.postMessage("closeButton", "*");
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
        if (window.matchMedia("(max-width: 768px)").matches) {
          document.body.style.overflow = "hidden";
          // console.log("overflow hidden");
        }

        const viewportHeight = window.innerHeight;
        document.getElementById("sleak-widgetwrap").style.height =
          viewportHeight + "px";
        document.getElementById("sleak-widgetwrap").style.minHeight =
          viewportHeight + "px";
        // console.log("Viewport Height window:", viewportHeight);

        /// check for first button click of page load
        if (firstButtonClick) {
          const widgetOpenFlag = Cookies.get(`sleakWidget_${chatbotId}`);

          if (!widgetOpenFlag) {
            // for hiding popup after widget open
            // setting cookie for the first widget open flag
            let widgetOpenFlag = crypto.randomUUID();
            Cookies.set(`sleakWidget_${chatbotId}`, widgetOpenFlag, {
              expires: 365,
              sameSite: "None",
              secure: true,
            });
          }

          firstButtonClick = false;
        }
      } else if (sleakWidgetOpenState == true) {
        sleakWidgetOpenState = false;
        changeButtonState(false);
        // console.log(sleakWidgetOpenState);
        closeSleakWidget();

        if (window.matchMedia("(max-width: 768px)").matches) {
          document.body.style.overflow = "auto";
          // console.log("overflow auto");
        }
      }
    };

    // event listener for scrolling
    window.addEventListener("scroll", function () {
      // console.log("scrolling");
      if (sleakWidgetOpenState == true) {
        const viewportHeightScroll = window.innerHeight;
        document.getElementById("sleak-widgetwrap").style.height =
          viewportHeightScroll + "px";
        document.getElementById("sleak-widgetwrap").style.minHeight =
          viewportHeightScroll + "px";
        // console.log("Viewport Height scroll:", viewportHeightScroll);
      }
    });

    // Chime & popup

    var sleakBodyEmbed = document.getElementById("sleak-body-embed");
    var sleakPopupOpen = document.getElementById("sleak-popup-embed");

    function showPopup() {
      sleakPopupOpen.style.display = "flex";
      sleakPopupOpen.style.opacity = "0";
      sleakPopupOpen.style.transform = "translateY(20px)";
      sleakPopupOpen.style.transition =
        "opacity 0.5s ease, transform 0.5s ease";
      setTimeout(function () {
        sleakPopupOpen.style.opacity = "1";
        sleakPopupOpen.style.transform = "translateY(0)";
      }, 50);
    }

    let sleakChime = new Audio(
      "https://sygpwnluwwetrkmwilea.supabase.co/storage/v1/object/public/app/assets/sleak-chime.mp3"
    );
    let sleakChimeOperator = new Audio(
      "https://sygpwnluwwetrkmwilea.supabase.co/storage/v1/object/public/app/assets/sleak-chime-operatorjoined.mp3"
    );

    function playSleakChime() {
      sleakChime.play();
    }
    function playSleakChimeOperator() {
      sleakChimeOperator.play();
    }

    // console.log(sleakWidgetOpenState);

    // disable popup/chime after first page load
    var sessionStorageKey = chatbotId + "_sleakPopupTriggered";
    // var hasPopupBeenTriggered = sessionStorage.getItem(sessionStorageKey);
    var hasPopupBeenTriggered = false; // remove line in prod

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
              sessionStorage.setItem(sessionStorageKey, "true");
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
              sessionStorage.setItem(sessionStorageKey, "true");
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
        postMessageData: event,
      });
      // console.log("Pushed to dataLayer:", event);
    }

    window.addEventListener("message", (event) => {
      if (
        event.origin === "https://sleak.vercel.app" ||
        event.origin === "https://staging.sleak.chat" ||
        event.origin === "https://widget.sleak.chat"
      ) {
        // console.log("Received message:", event);

        if (event.data === "closePopup") {
          closeSleakWidget();
        } else if (event.data === "toggleChat") {
          toggleSleakWidget();
        } else if (event.data === "operatorMessage") {
          playSleakChime();
        } else if (event.data === "operatorChanged") {
          playSleakChimeOperator();
        } else if (event.data === "domInitialized") {
          setShadow();
        } else if (event.data === "sleakChatInitiated") {
          pushGtmEvent(event);
        } else if (event.data === "sleakSentContactDetails") {
          pushGtmEvent(event);
        } else if (event.data === "sleakHumanHandoffActivated") {
          pushGtmEvent(event);
        } else {
          console.log("no declared event");
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
  }
}

sleakScript();
