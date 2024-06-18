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

  // cookie handling
  let visitorId;
  if (Cookies.get(`sleakVisitorId_${chatbotId}`)) {
    visitorId = Cookies.get(`sleakVisitorId_${chatbotId}`);
  } else {
    visitorId = crypto.randomUUID();
    Cookies.set(`sleakVisitorId_${chatbotId}`, visitorId, {
      expires: 365,
      sameSite: "None",
      secure: true,
    });
  }

  // aawait chatbotConfig
  const chatbotConfig = await chatbotConfigResponse.json();

  // main code
  if (chatbotConfig.publishing.published == true) {
    var iframeWidgetbody = document.getElementById("sleak-widget-iframe");
    iframeWidgetbody.src = widgetBaseUrl + `/${chatbotId}?id=${visitorId}`;

    // delay setting shadow to avoid flickering
    async function setShadow() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      iframeWidgetbody.style.boxShadow = "0px 4px 8px -2px rgba(0, 0, 0, 0.1)";
    }

    const sleakEmbeddedWidget = document.querySelector("#sleak-body-embed");
    const sleakWidgetwrap = document.getElementById("sleak-widget-container");

    let sleakChimeOperator = new Audio(
      "https://sygpwnluwwetrkmwilea.supabase.co/storage/v1/object/public/app/assets/sleak-chime-operatorjoined.mp3"
    );

    function playSleakChimeOperator() {
      sleakChimeOperator.play();
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

        if (event.data === "operatorMessage") {
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
  }
}

sleakScript();
