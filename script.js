/*Variables Global */
const menuToggle = document.getElementById('menu-toggle');
const menuList = document.getElementById('menu-list');
const audioToggle = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
const audioOverlay = document.getElementById('audio-overlay');
const durataSelect = document.getElementById('durata');
const paypalButtonWrapper = document.getElementById('paypal-button-wrapper');
const popup = document.getElementById('popup');
const copyrightPopup = document.getElementById('copyrightPopup');
const feedbackForm = document.getElementById('feedbackForm');
const msgFeedback = document.getElementById('msg-feedback');
let audioInitialized = false;
let menuOpen = false;

/* general initialization*/
document.addEventListener('DOMContentLoaded', function () {
  initializeParticles();
  initializeMenu();
  initializeAudio();
  initializePayPal();
  initializeServicePopups();
  initializeFAQ();
  initializeFeedbackForm();
});

/* Particles Background */
function initializeParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#ff0000' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#ff0000', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, out_mode: 'out' }
      },
      interactivity: {
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
      },
      retina_detect: true
    });
  }
}

/* Menù Hamburger */
function initializeMenu() {
  if (menuToggle && menuList) {
    menuToggle.addEventListener('click', toggleMenu);
    const menuLinks = menuList.querySelectorAll('a');
    menuLinks.forEach(link => { link.addEventListener('click', closeMenu) });
    document.addEventListener('click', function (event) {
      if (!menuToggle.contains(event.target) && !menuList.contains(event.target)) { closeMenu() }
    });
  }
}

function toggleMenu() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    menuList.classList.remove('hidden');
    menuToggle.setAttribute('aria-expanded', 'true');
  } else {
    menuList.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

function closeMenu() {
  menuOpen = false;
  menuList.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
}

/* Audio */
function initializeAudio() {
  if (audioToggle && bgMusic && audioOverlay) {
    audioToggle.addEventListener('click', toggleAudio);
    audioOverlay.addEventListener('click', initializeAudioOnMobile);
    if (isMobileDevice()) { audioOverlay.style.display = 'block' }
  }
}

function toggleAudio() {
  if (!audioInitialized) {
    initializeAudioPlayback();
  } else {
    if (bgMusic.paused) { playAudio() } else { pauseAudio() }
  }
}

function initializeAudioOnMobile() {
  initializeAudioPlayback();
  audioOverlay.style.display = 'none';
}

function initializeAudioPlayback() {
  bgMusic.play().then(() => {
    audioInitialized = true;
    updateAudioButton(false);
  }).catch(error => {
    console.log('Audio autoplay prevented:', error);
    updateAudioButton(true);
  });
}

function playAudio() {
  bgMusic.play().then(() => { updateAudioButton(false) })
    .catch(error => { console.log('Audio play failed:', error) })
}

function pauseAudio() {
  bgMusic.pause();
  updateAudioButton(true);
}

function updateAudioButton(isPaused) {
  if (audioToggle) { audioToggle.textContent = isPaused ? '🔇 Off' : '🔊 On' }
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/* Paypal  */
function initializePayPal() {
  if (durataSelect && paypalButtonWrapper) {
    durataSelect.addEventListener('change', handleDurationChange);
  }
  // Carica la SDK PayPal UNA SOLA VOLTA
  loadPayPalSdk();
}

function loadPayPalSdk() {
  if (!document.querySelector('script[src*="paypal.com/sdk/js"]')) {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AbTBBct2Vk495loQAh7L-ud7YPKLhZg3r-SgoipFANdxEbLnZBcMoTwj3BKARmrfO650wfPoNb08JjPI&currency=EUR&components=buttons,messages';
    script.onload = function () {
      // Renderizza il bottone con importo iniziale
      renderPayPalButton(durataSelect.value);
    };
    document.body.appendChild(script);
  } else {
    // SDK già caricata, renderizza il bottone
    renderPayPalButton(durataSelect.value);
  }
}

function handleDurationChange() {
  const amount = durataSelect.value;
  if (amount) {
    showPayPalButton();
    updatePayPalMessage(amount);
    // NON ricaricare la SDK, solo re-render del bottone
    renderPayPalButton(amount);
  } else {
    hidePayPalButton();
  }
}

function renderPayPalButton(amount) {
  if (typeof paypal !== 'undefined') {
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';
    paypal.Buttons({
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{ amount: { value: amount, currency_code: 'EUR' } }]
      }),
      onApprove: (data, actions) => actions.order.capture().then(details => {
        showPaymentPopup(
          `Grazie ${details.payer.name.given_name}! Il tuo ordine da ${amount}€ è stato processato. Sarai contattato a breve dal Coach per cominciare il tuo percorso!`,
          'success'
        );
        sendOrderConfirmation(details);
      }),
      onCancel: () => {
        showPaymentPopup('Il pagamento è stato annullato.', 'error')
      },
      onError: (err) => {
        showPaymentPopup('Si è verificato un errore con PayPal. Riprova.', 'error');
        console.error('PayPal Error:', err);
      }
    }).render('#paypal-button-container');
  }
}
 

/* Popup Servizi */
function initializeServicePopups() {
  const servicesList = document.getElementById('servizi-list');
  const closeBtn = document.querySelector('.close-btn');
  if (servicesList) {
    const serviceItems = servicesList.querySelectorAll('li');
    serviceItems.forEach(item => { item.addEventListener('click', () => showServicePopup(item)) });
  }
  if (closeBtn) { closeBtn.addEventListener('click', closeServicePopup) }
  if (popup) {
    popup.addEventListener('click', function (event) {
      if (event.target === popup) { closeServicePopup() }
    });
  }
}

function showServicePopup(serviceItem) {
  const title = serviceItem.textContent;
  const description = serviceItem.getAttribute('data-desc');
  const popupTitle = document.getElementById('popup-title');
  const popupText = document.getElementById('popup-text');
  if (popupTitle && popupText && popup) {
    popupTitle.textContent = title;
    popupText.textContent = description;
    popup.style.display = 'block';
    setTimeout(() => { popup.style.opacity = '1' }, 10);
  }
}

function closeServicePopup() {
  if (popup) {
    popup.style.opacity = '0';
    setTimeout(() => { popup.style.display = 'none' }, 300);
  }
}

/* Faq */
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('active')
      });
      if (!isActive) {
        this.classList.add('active');
        answer.classList.add('active');
      }
    });
  });
}

/* Feedback Form */
function initializeFeedbackForm() {
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      try {
        const response = await fetch(form.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          showSuccessMessage("Grazie per il tuo feedback!");
          form.reset();
        } else { showErrorMessage("Si è verificato un errore. Riprova più tardi.") }
      } catch (error) {
        showErrorMessage("Errore di rete. Controlla la connessione.");
      }
    });
  }
}

/* Copyright Popup */
function openCopyrightPopup() {
  if (copyrightPopup) { copyrightPopup.style.display = 'block' }
}
function closeCopyrightPopup() {
  if (copyrightPopup) { copyrightPopup.style.display = 'none' }
}
function closePopup(event) {
  if (event.target === copyrightPopup) { closeCopyrightPopup() }
}

/* Notifications */
function showSuccessMessage(message) {
  const notification = createNotification(message, 'success');
  document.body.appendChild(notification);
  setTimeout(() => { notification.remove() }, 5000);
}
function showErrorMessage(message) {
  const notification = createNotification(message, 'error');
  document.body.appendChild(notification);
  setTimeout(() => { notification.remove() }, 5000);
}

function createNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
 `;
  if (type === 'success') {
    notification.style.background = '#28a745';
    notification.style.border = '2px solid #1e7e34';
  } else if (type === 'error') {
    notification.style.background = '#dc3545';
    notification.style.border = '2px solid #bd2130';
  }
  setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)' }, 10);
  setTimeout(() => { notification.style.opacity = '0'; notification.style.transform = 'translateX(100%)' }, 4500);
  return notification;
}

/* Navigation + keyboard */
document.addEventListener('click', function (event) {
  if (event.target.matches('a[href^="#"]')) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeServicePopup();
    closeCopyrightPopup();
    closeMenu();
  }
  if (event.key === 'Enter') {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains('close-btn')) { closeServicePopup() }
    if (focusedElement.id === 'audio-overlay') { initializeAudioOnMobile() }
  }
});

/* Payment Popup */
function showPaymentPopup(message, type) {
  const popupTitle = document.getElementById('popup-title');
  const popupText = document.getElementById('popup-text');
  const popup = document.getElementById('popup');
  if (popupTitle && popupText && popup) {
    popupTitle.textContent = type === 'success' ? 'Pagamento completato' : 'Pagamento annullato';
    popupText.textContent = message;
    popup.style.display = 'block';
    setTimeout(() => { popup.style.opacity = '1' }, 10);
    setTimeout(() => {
      popup.style.opacity = '0';
      setTimeout(() => { popup.style.display = 'none' }, 300)
    }, 15000);
  }
}

window.openCopyrightPopup = openCopyrightPopup;
window.closeCopyrightPopup = closeCopyrightPopup;
window.closePopup = closePopup;

requestIdleCallback(function (deadline) { while (deadline.timeRemaining() > 0) { } });

/* Intall App (PWA) */
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') { console.log('App installata!'); }
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }
});

/* ⭐ Rating */
const stars = document.querySelectorAll('#starRating span');
const ratingValue = document.getElementById('ratingValue');
const sendBtn = document.getElementById('send-rating');

let selectedRating = 0;

/* ⭐ Rating + reset */
stars.forEach((star, i) => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value'));

    // reset
    stars.forEach(s => s.classList.remove('selected'));

    // illumina fino al valore cliccato
    for (let j = 0; j < selectedRating; j++) {
      stars[j].classList.add('selected');
    }

    ratingValue.textContent = `Hai dato ${selectedRating}/5 stelle.`;
  });
});

/* send button */
sendBtn.addEventListener('click', () => {
  const popupTitle = document.getElementById('popup-title');
  const popupText = document.getElementById('popup-text');
  const popup = document.getElementById('popup');

  if (selectedRating > 0) {
    if (popupTitle && popupText && popup) {
      popupTitle.textContent = "Valutazione inviata!";
      popupText.textContent = `Hai dato ${selectedRating} ⭐. Grazie per il tuo supporto! La tua opinione ci aiuta a crescere!!`;
      popup.style.display = 'block';
      setTimeout(() => { popup.style.opacity = '1' }, 10);

      // Close Popup
      setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => { popup.style.display = 'none' }, 300);
      }, 8000);
    }

    // Reset stars
    stars.forEach(s => s.classList.remove('selected'));
    ratingValue.textContent = "";
    selectedRating = 0;
  } else {
    if (popupTitle && popupText && popup) {
      popupTitle.textContent = "Attenzione!";
      popupText.textContent = "Seleziona prima una valutazione!";
      popup.style.display = 'block';
      setTimeout(() => { popup.style.opacity = '1' }, 10);
      setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => { popup.style.display = 'none' }, 300);
      }, 5000);
    }
  }
});

/* Upsell Cross-Selling PayPal */
const upsellBanner = document.createElement('div');const upsellBanner1 = document.createElement('div');
upsellBanner.id = 'upsell-banner';upsellBanner1.id = 'upsell-banner1';
upsellBanner.textContent = '🔥 Considera il piano da 3 mesi per ottenere più sconti!';
upsellBanner1.textContent = '🔥 Considera il piano da 6 mesi per ottenere più sconti!';
document.body.appendChild(upsellBanner);document.body.appendChild(upsellBanner1);

let upsellTimeout;let upsell1Timeout;

  // 3 Months upsell //
if (durataSelect) {
  durataSelect.addEventListener('change', () => {
    const selectedValue = parseInt(durataSelect.value);

    clearTimeout(upsellTimeout);
    upsellBanner.classList.remove('show');

    if (selectedValue < 155) { 
      upsellTimeout = setTimeout(() => {
        upsellBanner.classList.add('show');
      }, 500); // leggero delay per animazione
    }
  });
}
upsellBanner.addEventListener('click', () => {
  // Cambia la selezione al piano superiore
  durataSelect.value = '160'; // esempio: piano superiore 3 mesi
  durataSelect.dispatchEvent(new Event('change')); // trigger PayPal update
  upsellBanner.classList.remove('show');
});
// 6 Months upsell //
if (durataSelect) {
  durataSelect.addEventListener('change', () => {
    const selectedValue = parseInt(durataSelect.value);

    clearTimeout(upsell1Timeout);
    upsellBanner1.classList.remove('show');

    if (selectedValue >= 120 && selectedValue < 180) { 
      upsell1Timeout = setTimeout(() => {
        upsellBanner1.classList.add('show');
      }, 500); // leggero delay per animazione
    }
  });
}
upsellBanner1.addEventListener('click', () => {
  // Cambia la selezione al piano superiore
  durataSelect.value = '270'; // esempio: piano superiore 3 mesi
  durataSelect.dispatchEvent(new Event('change')); // trigger PayPal update
  upsellBanner1.classList.remove('show');
});
