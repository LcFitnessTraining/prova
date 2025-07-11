// DOM Elements
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

// State
let audioInitialized = false;
let menuOpen = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
initializeParticles();
initializeMenu();
initializeAudio();
initializePayPal();
initializeServicePopups();
initializeFAQ();
initializeFeedbackForm();
});
// Particles.js initialization
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ff0000'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ff0000',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// Menu functionality
function initializeMenu() {
    if (menuToggle && menuList) {
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking on links
        const menuLinks = menuList.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !menuList.contains(event.target)) {
                closeMenu();
            }
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

// Audio functionality
function initializeAudio() {
    if (audioToggle && bgMusic && audioOverlay) {
        audioToggle.addEventListener('click', toggleAudio);
        audioOverlay.addEventListener('click', initializeAudioOnMobile);

        // Show overlay on mobile devices
        if (isMobileDevice()) {
            audioOverlay.style.display = 'block';
        }
    }
}
function toggleAudio() {
    if (!audioInitialized) {
        initializeAudioPlayback();
    } else {
        if (bgMusic.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    }
}
function initializeAudioOnMobile() {
    initializeAudioPlayback();
    audioOverlay.style.display = 'none';
}
function initializeAudioPlayback() {
    bgMusic.play()
        .then(() => {
            audioInitialized = true;
            updateAudioButton(false);
        })
        .catch(error => {
            console.log('Audio autoplay prevented:', error);
            updateAudioButton(true);
        });
}
function playAudio() {
    bgMusic.play()
        .then(() => {
            updateAudioButton(false);
        })
        .catch(error => {
            console.log('Audio play failed:', error);
        });
}
function pauseAudio() {
    bgMusic.pause();
    updateAudioButton(true);
}
function updateAudioButton(isPaused) {
    if (audioToggle) {
        audioToggle.textContent = isPaused ? '🔇 Off' : '🔊 On';
    }
}
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// PayPal functionality

function initializePayPal() {
  if (durataSelect && paypalButtonWrapper) {
    durataSelect.addEventListener('change', handleDurationChange);
  }
}

function handleDurationChange() {
  const amount = durataSelect.value;
  if (amount) {
    showPayPalButton();
    updatePayPalMessage(amount);
    loadPayPalScript(amount);
  } else {
    hidePayPalButton();
  }
}
function loadPayPalScript(amount) {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=AQY44jd2y1IUT-RpjuU79wngDCQGzJ7FXeESa7pJjKIQNRi2-z0jABKr-kLgQtqI6h3etMYdEKaa8_qT&currency=EUR&components=buttons,messages';
  script.onload = function() {
    renderPayPalButton(amount);
  };
  document.body.appendChild(script);
}


function showPayPalButton() {
    paypalButtonWrapper.style.display = 'block';
    setTimeout(() => {
        paypalButtonWrapper.classList.add('fade');
    }, 10);
}
function hidePayPalButton() {
    paypalButtonWrapper.style.display = 'none';
    paypalButtonWrapper.classList.remove('fade');
}
function updatePayPalMessage(amount) {
    const paypalMessage = document.getElementById('paypal-message');
    if (paypalMessage) {
        paypalMessage.setAttribute('data-pp-amount', amount);
    }
}
function renderPayPalButton(amount) {
    if (typeof paypal !== 'undefined') {
        // Clear existing PayPal buttons
        const container = document.getElementById('paypal-button-container');
        if (container) {
            container.innerHTML = '';
        }
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount,
                            currency_code: 'EUR'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showPaymentPopup(`Grazie ${details.payer.name.given_name}! Il tuo ordine è stato processato.Sarai contattato a breve dal Coach per cominciare il tuo percorso!!!`, 'success');
                    sendOrderConfirmation(details);
                });
            },
            onCancel: function(data) {
    showPaymentPopup('Il pagamento è stato annullato. Scegli il piano più adatto a te e riprova !!!', 'error');
},
            onError: function(err) {
                console.error('PayPal Error:', err);
                showPaymentPopup('Si è verificato un errore durante il pagamento. Utilizza un altro metodo o contattaci !!1', 'error');
            }
        }).render('#paypal-button-container');
    }
}

// Service popups
function initializeServicePopups() {
    const servicesList = document.getElementById('servizi-list');
    const closeBtn = document.querySelector('.close-btn');
    if (servicesList) {
        const serviceItems = servicesList.querySelectorAll('li');
        serviceItems.forEach(item => {
            item.addEventListener('click', () => showServicePopup(item));
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeServicePopup);
    }
    if (popup) {
        popup.addEventListener('click', function(event) {
            if (event.target === popup) {
                closeServicePopup();
            }
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

        // Add animation
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);
    }
}
function closeServicePopup() {
    if (popup) {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
}

// FAQ functionality
function initializeFAQ() {
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
question.addEventListener('click', function() {
const answer = this.nextElementSibling;
const isActive = this.classList.contains('active');

// Close all FAQ items
faqQuestions.forEach(q => {
q.classList.remove('active');
q.nextElementSibling.classList.remove('active');
 });

 // Open clicked item if it wasn't active
if (!isActive) {
this.classList.add('active');
answer.classList.add('active');
}
});
 });
}

// Feedback form
function initializeFeedbackForm() {
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          showSuccessMessage("Grazie per il tuo feedback!");
          form.reset();
        } else {
          showErrorMessage("Si è verificato un errore. Riprova più tardi.");
        }
      } catch (error) {
        showErrorMessage("Errore di rete. Controlla la connessione.");
      }
    });
  }
}

// Copyright popup
function openCopyrightPopup() {
    if (copyrightPopup) {
        copyrightPopup.style.display = 'block';
    }
}
function closeCopyrightPopup() {
    if (copyrightPopup) {
        copyrightPopup.style.display = 'none';
    }
}
function closePopup(event) {
    if (event.target === copyrightPopup) {
        closeCopyrightPopup();
    }
}

// Utility functions
function showSuccessMessage(message) {
    // Create and show success notification
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}
function showErrorMessage(message) {
    // Create and show error notification
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
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
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Animate out after 4.5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
    }, 4500);
    return notification;
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    // Close popups with Escape key
    if (event.key === 'Escape') {
        closeServicePopup();
        closeCopyrightPopup();
        closeMenu();
    }

    // Handle Enter key on focusable elements
    if (event.key === 'Enter') {
        const focusedElement = document.activeElement;

        if (focusedElement.classList.contains('close-btn')) {
            closeServicePopup();
        }

        if (focusedElement.id === 'audio-overlay') {
            initializeAudioOnMobile();
        }
    }
});

function showPaymentPopup(message, type) {
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popup = document.getElementById('popup');

    if (popupTitle && popupText && popup) {
        popupTitle.textContent = type === 'success' ? 'Pagamento completato' : 'Pagamento annullato';
        popupText.textContent = message;
        popup.style.display = 'block';

        // Add animation
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        // Close popup after 3 seconds
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }, 3000);
    }
}

// Global functions for inline event handlers (to maintain compatibility)
window.openCopyrightPopup = openCopyrightPopup;
window.closeCopyrightPopup = closeCopyrightPopup;
window.closePopup = closePopup;
requestIdleCallback(function(deadline) {
  // Codice da eseguire quando il browser è inattivo
  while (deadline.timeRemaining() > 0) {
    // Esegui il codice qui
  }
});
