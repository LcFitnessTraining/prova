// Selezione elementi DOM
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

// Variabili globali
let audioInitialized = false;
let menuOpen = false;
let deferredPrompt;

// Inizializzazione principale
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeMenu();
    initializeAudio();
    initializePayPal();
    initializeServicePopups();
    initializeFAQ();
    initializeFeedbackForm();
    initializePWA();
});

// Inizializzazione particelle
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

// Gestione menu
function initializeMenu() {
    if (menuToggle && menuList) {
        menuToggle.addEventListener('click', toggleMenu);
        
        const menuLinks = menuList.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
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

// Gestione audio
function initializeAudio() {
    if (audioToggle && bgMusic && audioOverlay) {
        audioToggle.addEventListener('click', toggleAudio);
        audioOverlay.addEventListener('click', initializeAudioOnMobile);
        
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
    bgMusic.play().then(() => {
        audioInitialized = true;
        updateAudioButton(false);
    }).catch(error => {
        console.log('Audio autoplay prevented:', error);
        updateAudioButton(true);
    });
}

function playAudio() {
    bgMusic.play().then(() => {
        updateAudioButton(false);
    }).catch(error => {
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

// Gestione PayPal
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
    script.src = 'https://www.paypal.com/sdk/js?client-id=ASpd4SC2Ii_o-AQAWzj-s3VnmrxHIqz-CpXL4AfEpHvS8PtZXl4JJ3Hho3sI9eO-GjXxWj8oiTzDFenm&currency=EUR&components=buttons,messages';
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
                    showPaymentPopup(
                        `Grazie ${details.payer.name.given_name}! Il tuo ordine da ${amount}€ è stato processato. Sarai contattato a breve dal Coach per cominciare il tuo percorso!`,
                        'success'
                    );
                    sendOrderConfirmation(details);
                });
            },
            onCancel: function(data) {
                showPaymentPopup('Il pagamento è stato annullato.', 'error');
            },
            onError: function(err) {
                showPaymentPopup('Si è verificato un errore durante il pagamento.', 'error');
                console.error('PayPal Error:', err);
            }
        }).render('#paypal-button-container');
    }
}

// Gestione popup servizi
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

// Gestione FAQ
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Chiudi tutte le FAQ
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Apri quella cliccata se non era già attiva
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// Gestione form feedback
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
                    headers: {
                        'Accept': 'application/json'
                    }
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

// Gestione popup copyright
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

// Gestione notifiche
function showSuccessMessage(message) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showErrorMessage(message) {
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
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
    }, 4500);
    
    return notification;
}

function showPaymentPopup(message, type) {
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popup = document.getElementById('popup');
    
    if (popupTitle && popupText && popup) {
        popupTitle.textContent = type === 'success' ? 'Pagamento completato' : 'Pagamento annullato';
        popupText.textContent = message;
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }, 15000);
    }
}

// Gestione PWA
function initializePWA() {
    const installBtn = document.getElementById('installBtn');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) {
            installBtn.style.display = 'inline-block';
        }
    });
    
    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(choice => {
                    if (choice.outcome === 'accepted') {
                        console.log('App installata!');
                    }
                    deferredPrompt = null;
                    installBtn.style.display = 'none';
                });
            }
        });
    }
}

// Event listeners globali
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeServicePopup();
        closeCopyrightPopup();
        closeMenu();
    }
    
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

// Esposizione funzioni globali
window.openCopyrightPopup = openCopyrightPopup;
window.closeCopyrightPopup = closeCopyrightPopup;
window.closePopup = closePopup;

// Ottimizzazione performance
requestIdleCallback(function(deadline) {
    while (deadline.timeRemaining() > 0) {
        // Operazioni di background quando il browser è idle
    }
});

// Funzione mancante per conferma ordine
function sendOrderConfirmation(details) {
    // Implementa l'invio della conferma ordine se necessario
    console.log('Order confirmation:', details);
}
