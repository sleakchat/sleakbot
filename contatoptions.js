setTimeout(() => {
  console.log('creating event listeneres for chat channels');
  // channels navigation
  let activeChannelsTab = 'chat';
  const channelTabs = document.querySelectorAll('[channels-tab]');

  const channelContainers = document.querySelectorAll('[channels-container]');
  const chatContainer = document.querySelector('[channels-container="chat"]');
  const formContainer = document.querySelector('[channels-container="form"]');
  const phoneContainer = document.querySelector('[channels-container="phone"]');
  const whatsappContainer = document.querySelector('[channels-container="whatsapp"]');

  function updateChannelVisibility() {
    channelContainers.forEach(container => {
      container.style.display = 'none';
    });

    switch (activeChannelsTab) {
      case 'chat':
        chatContainer.style.display = 'flex';
        break;
      case 'form':
        formContainer.style.display = 'flex';
        break;
      case 'phone':
        phoneContainer.style.display = 'flex';
        break;
      case 'whatsapp':
        whatsappContainer.style.display = 'flex';
        break;
    }
  }

  channelTabs.forEach(tab => {
    tab.addEventListener('click', event => {
      console.log(tab);
      const tabName = event.currentTarget.getAttribute('channels-tab');

      document.querySelectorAll('[channels-tab-icon-wrapper]').forEach(element => {
        // element.style.backgroundColor = "transparent";
        element.classList.remove('active');
      });
      tab.querySelectorAll('[channels-tab-icon-wrapper]').forEach(element => {
        // element.style.backgroundColor = "rgba(126, 121, 240, 0.3)";
        element.classList.add('active');
      });

      activeChannelsTab = tabName;
      updateChannelVisibility();
    });
  });

  document.querySelectorAll('[channels-tab-icon-wrapper]')[0].classList.add('active');
}, 1000);
