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

  // cookie handling
  let visitorId;
  if (Cookies.get(`sleakVisitorId_${chatbotId}`)) {
    // console.log("cookie exists, value = ",Cookies.get(`sleakVisitorId_${chatbotId}`));
    visitorId = Cookies.get(`sleakVisitorId_${chatbotId}`);
  } else {
    visitorId = crypto.randomUUID();
    Cookies.set(`sleakVisitorId_${chatbotId}`, visitorId, {
      expires: 365,
      sameSite: "None",
      secure: true,
    });
    console.log("new cookie = ", visitorId);
  }

  // rendering iframes
  var iframeWidgetbody = document.getElementById("sleak-widget-iframe");
  iframeWidgetbody.src = widgetBaseUrl + `/${chatbotId}?id=${visitorId}`;

  async function mainScript(chatbotConfig) {
    // main code
    if (chatbotConfig.publishing.published == true) {
      var iframeBtn = document.getElementById("sleak-button-iframe");
      iframeBtn.src = widgetBaseUrl + `/button/${chatbotId}`;
      var iframePopup = document.getElementById("sleak-popup-iframe");
      iframePopup.src = widgetBaseUrl + `/popup/${chatbotId}`;

      // Set btn bg color and show btn
      var sleakButtonWrap = document.querySelector("#sleak-buttonwrap");
      sleakButtonWrap.style.opacity = "0";
      sleakButtonWrap.style.transform = "scale(0.8)";
      sleakButtonWrap.style.transition = "all 0.1s ease";
      setTimeout(function () {
        sleakButtonWrap.style.opacity = "1";
        sleakButtonWrap.style.transform = "scale(1)";
      }, 500);

      // // delay setting shadow to avoid flickering
      // async function setShadow() {
      //   await new Promise((resolve) => setTimeout(resolve, 3000));
      //   iframeWidgetbody.style.boxShadow =
      //     "0px 4px 8px -2px rgba(0, 0, 0, 0.1)";
      // }
      // setShadow();

      const sleakEmbeddedWidget = document.querySelector("#sleak-body-embed");
      const sleakEmbeddedPopup = document.querySelector("#sleak-popup-embed");
      const sleakWidgetwrap = document.getElementById("sleak-widget-container");
      // const sleakBgOverlay = document.querySelector("#sleak-bgoverlay");

      function openSleakWidget() {
        sleakBodyEmbed.style.display = "flex";
        sleakBgOverlay.style.display = "block";

        sleakWidgetwrap.style.transform = "translateY(20px)";
        sleakBodyEmbed.style.transform = "translateY(800px)";
        sleakBodyEmbed.style.transform = "scale(0.99)";

        sleakEmbeddedPopup.style.display = "none";
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
        sleakBgOverlay.style.display = "none";
        sleakEmbeddedPopup.style.display = "none";
      }

      // Handle widget opening

      let sleakWidgetOpenState = false;
      let firstButtonClick = true;

      function toggleSleakWidget() {
        // check if widget is open
        if (sleakWidgetOpenState == false) {
          sleakWidgetOpenState = true;
          // console.log(sleakWidgetOpenState);

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
          // console.log(sleakWidgetOpenState);
          closeSleakWidget();

          if (window.matchMedia("(max-width: 768px)").matches) {
            document.body.style.overflow = "auto";
            // console.log("overflow auto");
          }
        }
      }

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

      // disable popup/chime after first page

      var sessionStorageKey = chatbotId + "_sleakPopupTriggered";
      var hasPopupBeenTriggered = sessionStorage.getItem(sessionStorageKey);

      if (hasPopupBeenTriggered) {
        console.log("localStorage does exist");
        // remove this path of the condition in PROD (everything after this coment)

        // 479px
        const viewportWidth = window.innerWidth;
        console.log(viewportWidth);

        setTimeout(function () {
          if (sleakWidgetOpenState == false) {
            playSleakChime();
            showPopup();
            sessionStorage.setItem(sessionStorageKey, "true");
          }
        }, 6000);
      } else {
        console.log("localStorage does not exist");

        setTimeout(function () {
          if (sleakWidgetOpenState == false) {
            playSleakChime();
            showPopup();
            sessionStorage.setItem(sessionStorageKey, "true");
          }
        }, 6000);
      }

      // child window event handling

      async function pushGtmEvent() {
        var dataLayer = window.dataLayer || (window.dataLayer = []);
        dataLayer.push({
          event: event.data,
          postMessageData: event,
        });
        console.log("Pushed to dataLayer:", event);
      }

      window.addEventListener("message", (event) => {
        if (
          event.origin === "https://sleak.vercel.app" ||
          event.origin === "https://staging.sleak.chat" ||
          event.origin === "https://widget.sleak.chat"
        ) {
          console.log("Received message:", event);

          if (event.data === "closePopup") {
            closeSleakWidget();
          } else if (event.data === "toggleChat") {
            toggleSleakWidget();
          } else if (event.data === "operatorMessage") {
            playSleakChime();
          } else if (event.data === "operatorChanged") {
            playSleakChimeOperator();
          } else if (event.data === "domInitialized") {
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
  const response = await fetch(iframeWidgetbody.src);
  const rawChatbotConfig = response.headers.get("Data");
  const chatbotConfig = JSON.parse(rawChatbotConfig);
  console.log(chatbotConfig);
  mainScript(chatbotConfig);
}

sleakScript();
