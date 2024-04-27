async function sleakScript() {
  // Function to load the js-cookie script dynamically
  async function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Load the js-cookie script
  await loadScript();

  const sleakbotScriptTag = document.querySelector("#sleakbot");
  const scriptSrc = sleakbotScriptTag.getAttribute("src");

  // if path contains "dev"
  if (scriptSrc.includes("dev")) {
    console.log("dev path");
    var widgetBaseUrl = "https://staging.sleak.chat";
  } else {
    console.log("prod path");
    var widgetBaseUrl = "https://widget.sleak.chat";
  }

  // const widgetBaseUrl = process.env.APP_BASE_URL;

  const chatbotId = sleakbotScriptTag.getAttribute("chatbot-id");
  console.log("chatbot id =", chatbotId);

  // cookie handling

  let visitorId;

  if (Cookies.get(`sleakVisitorId_${chatbotId}`)) {
    console.log(
      "cookie exists, value = ",
      Cookies.get(`sleakVisitorId_${chatbotId}`)
    );
    visitorId = Cookies.get(`sleakVisitorId_${chatbotId}`);
  } else {
    console.log("cookie does not exist");

    visitorId = crypto.randomUUID();
    Cookies.set(`sleakVisitorId_${chatbotId}`, visitorId, {
      expires: 365,
      sameSite: "None",
      secure: true,
    });

    console.log("new cookie = ", visitorId);

    // setting cookie for the first widget open flag
    let widgetOpenFlag = crypto.randomUUID();
    Cookies.set(`sleakWidget_${chatbotId}`, widgetOpenFlag, {
      expires: 365,
      sameSite: "None",
      secure: true,
    });

    // postMessage to parent window

    ///   try {
    //     var postObject = JSON.stringify({
    //       event: "create_chat",
    //        visitorId: visitorId,
    //     });

    //      parent.postMessage(postObject, "*"); // Send message to parent window
    //
    //   } catch (e) {
    //      window.console && window.console.log(e);
    //   }

    //    console.log("postObject:", postObject);
  }

  // const { btnImage } = getChatbotId();

  // // Set image when attribute present
  // if (btnImage) {
  //   var btnImages = document.querySelectorAll("#sleak-btn-openclosed img");
  //   var btnImageURL = btnImage;
  //   btnImages.forEach(function (image) {
  //     image.src = btnImageURL;
  //   });
  // }

  //// Set btn bg color and show btn btn (wordt een component/iframe) ////

  var sleakBtnContainer = document.querySelector("#sleak-btn-container");
  // var btnColor = getChatbotId().btnColor;
  var sleakButtonWrap = document.querySelector("#sleak-buttonwrap");
  // sleakBtnContainer.style.backgroundColor = btnColor;
  sleakButtonWrap.style.opacity = "0";
  sleakButtonWrap.style.transition = "opacity 0.2s ease";
  setTimeout(function () {
    sleakButtonWrap.style.opacity = "1";
  }, 500);

  // function generateUniqueId() {
  //   var visitorId = localStorage.getItem("visitorId");
  //   if (!visitorId) {
  //     visitorId =
  //       Math.random().toString(36).substring(2, 15) +
  //       Math.random().toString(36).substring(2, 15);
  //     localStorage.setItem("visitorId", visitorId);
  //   }
  //   return visitorId;
  // }

  //// rendering iframes //////

  var iframeWidgetbody = document.getElementById("sleak-widget-iframe");
  var iframePopup = document.getElementById("sleak-popup-iframe");
  var iframeBtn = document.getElementById("sleak-button-iframe");

  // var visitorId = generateUniqueId();

  iframePopup.src = widgetBaseUrl + `/popup/${chatbotId}`;
  iframeBtn.src = widgetBaseUrl + `/button/${chatbotId}`;

  // const iframeDelayed = `https://app.sleak.chat/?id=${chatbotId}&visitorId=${visitorId}`;

  iframeWidgetbody.src = widgetBaseUrl + `/${chatbotId}?id=${visitorId}`;

  // delay setting shadow to avoid flickering
  async function setShadow() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    iframeWidgetbody.style.boxShadow = "0px 4px 8px -2px rgba(0, 0, 0, 0.1)";
  }
  setShadow();

  // const iframeSource = `http://localhost:3000/${chatbotId}?id=${visitorId}`;

  // iframe.src = iframeSource;

  //// Elements visibility behaviour (widget body, popup) /////

  // Change element visibility on button click
  // const sleakClosedWidget = document.querySelector("#sleak-widget-closed");
  // const sleakOpenWidget = document.querySelector("#sleak-widget-open");
  const sleakEmbeddedWidget = document.querySelector("#sleak-body-embed");
  const sleakBgOverlay = document.querySelector("#sleak-bgoverlay");
  const sleakEmbeddedPopup = document.querySelector("#sleak-popup-embed");
  // const sleakNotification = document.querySelector("#sleak-btn-notification");
  const sleakIframe = document.querySelector("#sleak-widget-iframe");
  // const sleakPopupClose = document.querySelector("#sleak-popup-close");
  // const sleakMobileClose = document.querySelector("#sleak-widget-close");
  // const sleakLoading = document.querySelector("#sleak-loadingwrap");

  function openSleakWidget() {
    // sleakClosedWidget.style.display = "none";
    // sleakOpenWidget.style.display = "block";
    sleakEmbeddedWidget.style.display = "flex";
    sleakBgOverlay.style.display = "block";
    sleakEmbeddedPopup.style.display = "none";
    sleakEmbeddedWidget.style.opacity = "0";
    sleakEmbeddedWidget.style.transition = "opacity 0.2s ease";
    setTimeout(function () {
      sleakEmbeddedWidget.style.opacity = "1";
    }, 50);
  }

  function closeSleakWidget() {
    console.log("closeSleakWidget function called");
    // sleakClosedWidget.style.display = "block";
    // sleakOpenWidget.style.display = "none";
    sleakEmbeddedWidget.style.display = "none";
    sleakBgOverlay.style.display = "none";
    sleakEmbeddedPopup.style.display = "none";
  }

  let sleakWidgetOpenState = false; // flag for widget open state
  let firstButtonClick = true; // flag for first button click

  // Handle widget opening

  function toggleSleakWidget() {
    // check if widget is open

    if (sleakWidgetOpenState == false) {
      sleakWidgetOpenState = true; // update flag
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

      /// check if this is the first button click of this page load
      if (firstButtonClick) {
        // Create chat request

        // Check for the first widget open flag cookie (first open of the widget for this visitor id / cookie )
        const widgetOpenFlag = Cookies.get(`sleakWidget_${chatbotId}`);

        ////   if (widgetOpenFlag) {
        ////     // Cookie exists, delete it
        ////     Cookies.remove(`sleakWidget_${chatbotId}`);
        ////     console.log("First widget open flag cookie deleted");

        ////     // add session storage item for popup
        ////     sessionStorage.setItem(sessionStorageKey, "true");

        ////     // create chat
        ////     try {
        ////       let currentPage = window.location.href;

        ////       let createChatPayload = JSON.stringify({
        ////         chatbotId: chatbotId,
        ////         visitorId: visitorId,
        ////         currentPage: currentPage,
        ////       });
        ////       fetch("https://staging.sleak.chat/api/chat", {
        ////         method: "POST",
        ////         body: createChatPayload,
        ////       })
        ////         .then((response) => response.json())
        ////         .then((data) => {
        ////           console.log("Success:", data);
        ////         })
        ////         .catch((error) => {
        ////           console.error("Error:", error);
        ////         });
        ////     } catch (e) {
        ////       window.console && window.console.log(e);
        ////     }
        ////     console.log("createChatPayload:", createChatPayload);
        ////   } else {
        ////     // Cookie doesn't exist
        ////     console.log("First widget open flag cookie does not exist");
        ////   }
      }

      firstButtonClick = false; // update flag
    } else if (sleakWidgetOpenState == true) {
      sleakWidgetOpenState = false; // update flag
      // console.log(sleakWidgetOpenState);
      closeSleakWidget();

      if (window.matchMedia("(max-width: 768px)").matches) {
        document.body.style.overflow = "auto";
        // console.log("overflow auto");
      }
    }
  }

  // event listener for scrolling anywhere
  window.addEventListener("scroll", function () {
    // console.log("scrolling");
    if (sleakWidgetOpenState == true) {
      const viewportHeightScroll = window.innerHeight;
      document.getElementById("sleak-widgetwrap").style.height =
        viewportHeightScroll + "px";
      document.getElementById("sleak-widgetwrap").style.minHeight =
        viewportHeightScroll + "px";
      // console.log("Viewport Height scroll:", viewportHeightScroll);
      // console.log("scrolling function");
    }
  });

  // function for closing widget

  // // Main button click event listeners
  // sleakClosedWidget.addEventListener("click", openSleakWidget);
  // sleakEmbeddedPopup.addEventListener("click", openSleakWidget);

  // // Click event listener to widget open btn
  // sleakOpenWidget.addEventListener("click", function () {
  //   closeSleakWidget();
  // });

  //// Click event listener to popup close btn
  //sleakPopupClose.addEventListener("click", function (sleakCloseBtnEvent) {
  //  // stop event from propagating
  //  sleakCloseBtnEvent.stopPropagation();

  //  sleakEmbeddedPopup.style.display = "none";
  //});

  //// Add click event listener to widget close btn
  //sleakMobileClose.addEventListener(
  //  "click",
  //  function (sleakCloseMobileEvent) {
  //    // stop event from propagating
  //    sleakCloseMobileEvent.stopPropagation();

  //    sleakEmbeddedWidget.style.display = "none";
  //    sleakOpenWidget.style.display = "none";
  //    sleakClosedWidget.style.display = "block";
  //    sleakBgOverlay.style.display = "none";
  //  }
  //);

  //// Chime & popup ////

  var sleakBodyEmbed = document.getElementById("sleak-body-embed");
  var sleakPopupOpen = document.getElementById("sleak-popup-embed");

  // var sleakChime = document.getElementById("sleak-chime");

  function showPopup() {
    sleakPopupOpen.style.display = "flex";
    sleakPopupOpen.style.opacity = "0";
    sleakPopupOpen.style.transform = "translateY(20px)";
    sleakPopupOpen.style.transition = "opacity 0.5s ease, transform 0.5s ease";
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
    console.log("sleakChime played");
  }

  function playSleakChimeOperator() {
    sleakChimeOperator.play();
  }

  //// Disable popup/chime after first page ////

  var sessionStorageKey = chatbotId + "_sleakPopupTriggered";
  var hasPopupBeenTriggered = sessionStorage.getItem(sessionStorageKey);

  if (hasPopupBeenTriggered) {
    console.log("localStorage does exist");
    // remove next function in PROD
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

  async function pushGtmEvent() {
    var dataLayer = window.dataLayer || (window.dataLayer = []);
    dataLayer.push({
      event: event.data,
      postMessageData: event,
    });
    console.log("Pushed to dataLayer:", event);
  }

  // child window event listeners

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
        console.log("sleakChime called");
      } else if (event.data === "operatorChanged") {
        playSleakChimeOperator();
      } else if (event.data === "domInitialized") {
        console.log("domInitialized event");
      } else if (
        event.data === "sleakChatInitiated" ||
        event.data === "sleakChatInitiaded"
      ) {
        console.log("sleakChatInitiated event");
        pushGtmEvent(event);
      } else if (event.data === "sleakSentContactDetails") {
        console.log("sleakSentContactDetails event");
        pushGtmEvent(event);
      } else {
        console.log("no valid event");
      }
    }
  });

  // //// Background overlay for mobile //// LET OP: MOET WEL NOG GEBEUREN (IN MAIN TOGGLECHAT FUNCTION VERWERKEN)

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

  //// GTM events event listener for child window ////

  (function (window) {
    function isValidJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }

    window.addEventListener("message", function (message) {
      var data;

      if (typeof message.data !== "string" || !isValidJSON(message.data)) {
        return;
      }

      data = JSON.parse(message.data);

      var validEvents = ["sleakChatInitiated", "sleakLeadGenerated"];

      if (!data.event || validEvents.indexOf(data.event) === -1) {
        return;
      }

      console.log("Received message:", data);
      var dataLayer = window.dataLayer || (window.dataLayer = []);
      if (data.event) {
        dataLayer.push({
          event: data.event,
          postMessageData: data,
        });
        console.log("Pushed to dataLayer:", data);
      }
    });
  })(window);

  console.log("exit sleakScript");
}

sleakScript();
