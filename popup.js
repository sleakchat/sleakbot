document.addEventListener('DOMContentLoaded', function () {
  let mm = gsap.matchMedia();

  const excludedPaths = ['/tarieven'];

  const popupModal = document.querySelector('[popupmodal=sidebar]');
  function popupLogic() {
    const openButton = document.querySelector('[openmodal=webinar]');

    let modalAlreadyShown = localStorage.getItem('cbsPopupModalShown');
    // modalAlreadyShown = false;

    function showPopup() {
      if (!modalAlreadyShown) {
        gsap.set(popupModal, { x: -20, opacity: 0, display: 'flex' });
        gsap.to(popupModal, { duration: 0.4, y: 0, opacity: 1, display: 'flex', x: 0 });
        showCards();

        localStorage.setItem('cbsPopupModalShown', 'true');
        gtag('event', 'showChatbotServicePopup', {});
      }
    }

    if (!excludedPaths.includes(window.location.pathname)) {
      setTimeout(showPopup, 12000);
    }

    if (openButton)
      openButton.addEventListener('click', function () {
        localStorage.setItem('cbsPopupModalShown', 'true');
      });
  }
  popupLogic();

  // chatbot cards
  const cardsContainer = document.querySelector('.cards-container');
  const randomizeWrap = document.querySelector('.randomnize-wrap');
  const allRandomCards = Array.from(randomizeWrap.children);
  const cardsWrapper = document.querySelector('.cards-wrapper');
  const cardsShuffleBtn = document.querySelector('.cards-shuffle-btn');
  const widgetCards = document.querySelectorAll('.wiget-card');

  function showCards() {
    cardsContainer.innerHTML = '';

    const selectedCards = [];
    while (selectedCards.length < 3) {
      const randomCard = allRandomCards[Math.floor(Math.random() * allRandomCards.length)];
      if (!selectedCards.includes(randomCard)) {
        selectedCards.push(randomCard.cloneNode(true));
      }
    }

    selectedCards.forEach((card, index) => {
      cardsContainer.appendChild(card);
      if (index === 0) {
        card.classList.add('left');
        gsap.set(card, { x: 80, rotation: 0, y: 40 });
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: -6,
          opacity: 1,
          duration: 0.5
        });
      } else if (index === 1) {
        card.classList.add('middle');
        gsap.set(card, { x: 0, rotation: 0, y: 60 });
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.5
        });
      } else if (index === 2) {
        card.classList.add('right');
        gsap.set(card, { x: -80, rotation: 0, y: 40 });
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 6,
          opacity: 1,
          duration: 0.5
        });
      }
    });
  }

  // Attach click event to shuffle cards
  cardsContainer.addEventListener('click', () => {
    showCards();
    setTimeout(() => {
      gsap.to(cardsShuffleBtn, { opacity: 0, duration: 0.3 });
      gsap.to(cardsContainer, { opacity: 1, duration: 0.3 });
    }, 300);
  });

  // Hover effect on the cards wrapper

  mm.add('(min-width: 769px)', () => {
    cardsWrapper.addEventListener('mouseenter', () => {
      gsap.to(cardsShuffleBtn, { opacity: 1, duration: 0.2 });
      gsap.to(cardsContainer, { opacity: 0.5, duration: 0.2 });

      gsap.to(widgetCards, {
        y: -10,
        duration: 0.2,
        stagger: 0.05
      });
    });

    cardsWrapper.addEventListener('mouseleave', () => {
      gsap.to(cardsShuffleBtn, { opacity: 0, duration: 0.2 });
      gsap.to(cardsContainer, { opacity: 1, duration: 0.2 });

      gsap.to(widgetCards, {
        y: 0,
        duration: 0.2,
        stagger: 0.05
      });
    });
  });

  mm.add('(max-width: 768px)', () => {
    gsap.to(cardsShuffleBtn, { opacity: 1, duration: 0.2 });
  });

  // socialproof marquee
  gsap.to('.marquee-logowrap', {
    x: '-50%',
    duration: 40,
    repeat: -1,
    ease: 'none'
  });

  // cb-service form
  const startInputForm = document.querySelector('[cbservice-form="start-input"]');
  const sidebarInnerPopup = document.querySelector('[cbservice-form="sidebar-inpopupner"]');
  const form = document.querySelector('[cbservice-form="form"]');
  const formInitial = document.querySelector('[cbservice-form="form-init"]');
  const button = document.querySelector('[cbservice-form="button"]');
  const websiteUrlInput = document.querySelector('[cbservice-form="website-input"]');
  const progressBar = document.querySelector('[cbservice-form="progress-bar"]');
  const checkboxes = document.querySelectorAll('[cbservice-form="checkbox"]');

  async function submitEmail(event) {
    event.preventDefault();
    const formData = new FormData(formInitial);
    const payload = {};
    formData.forEach((value, key) => {
      const inputElement = formInitial.querySelector(`[name="${key}"]`);
      if (inputElement && inputElement.hasAttribute('input-name')) {
        const inputName = inputElement.getAttribute('input-name');
        payload[inputName] = value;
      } else {
        payload[key] = value;
      }
    });

    try {
      const response = await fetch('https://api.misc.sleak.chat/webhook/ce3d31a1-e855-4b6d-b288-960b561ad3d6', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        const recordId = jsonResponse.id;
        localStorage.setItem('chatbotServiceId', recordId);
      } else {
        console.error('Error calling webhook:', response.statusText);
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
    }
  }

  formInitial.addEventListener('submit', function (event) {
    event.preventDefault();
    submitEmail(event);
    sidebarInnerPopup.style.display = 'flex';
    websiteUrlInput.value = event.target.elements[0].value;
    requestAnimationFrame(() => {
      progressBar.style.width = '90%';
    });
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      const inputElement = form.querySelector(`[name="${key}"]`);
      if (inputElement && inputElement.hasAttribute('input-name')) {
        const inputName = inputElement.getAttribute('input-name');
        payload[inputName] = value;
      } else {
        payload[key] = value;
      }
    });
    recordId = localStorage.getItem('chatbotServiceId');
    payload['recordId'] = recordId;
    payload['placement'] = 'popup';
    payload['goal'] = 'none';

    try {
      const response = await fetch('https://api.misc.sleak.chat/webhook/a7494424-89e9-4440-acf4-033fb8a901f7', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        gsap.set(popupModal, { x: -20, opacity: 0, display: 'flex' });
        localStorage.removeItem('chatbotServiceId');

        setTimeout(() => {
          window.location.href = 'https://www.sleak.chat/succesverhalen?chatbotservice=true';
        }, 200);
      } else {
        console.error('Error calling webhook:', response.statusText);
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var dataLayer = window.dataLayer || (window.dataLayer = []);
    dataLayer.push({
      event: 'chatbotServiceRequested'
    });
    gtag('event', 'chatbotServiceRequestedPopup', {});
    handleSubmit(event);
  });
});
