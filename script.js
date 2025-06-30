// === ELEMENTI POPUP ===
const popup = document.getElementById('popup'),
      popupTitle = document.getElementById('popup-title'),
      popupText = document.getElementById('popup-text'),
      closeBtn = document.querySelector('.close-btn');

// === PARALLAX SCROLL ===
window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax').forEach(el => {
    const speed = el.getAttribute('data-speed');
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

// === PARTICLES.JS CONFIG ===
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    color: { value: "#ff0000" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  }
});

// === DOM READY ===
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll('.faq-item'),
        audio = document.getElementById("bg-music"),
        audioOverlay = document.getElementById("audio-overlay"),
        audioToggle = document.getElementById("audio-toggle");

  let isPlaying = false;

  // Mostra popup se pagamento annullato
  if (localStorage.getItem('paypalCancel') === '1') {
    localStorage.removeItem('paypalCancel');
    showPopup("❌ Pagamento annullato", "Hai annullato il processo di pagamento. Se vuoi riprovare, seleziona il piano e clicca su Paga.");
  }

  // === TOGGLE FAQ ===
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
    });
  });

  // === AUDIO CONTROLLER ===
  const startAudio = () => {
    if (!isPlaying) {
      audio.play();
      isPlaying = true;
      audioOverlay.style.display = "none";
      audioToggle.textContent = "🔇 Off";
    }
  };

  audioOverlay.addEventListener("click", startAudio);
  audioOverlay.addEventListener("keydown", e => {
    if (["Enter", " "].includes(e.key)) startAudio();
  });

  audioToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      audioToggle.textContent = "🔇 Off";
    } else {
      audio.pause();
      audioToggle.textContent = "🔊 On";
    }
  });

  // === POPUP SERVIZI ===
  document.querySelectorAll('#servizi-list li').forEach(item => {
    item.addEventListener('click', () => {
      showPopup(item.textContent, item.getAttribute('data-desc'));
    });
  });

  // === ANIMAZIONI INGRESSO ===
  document.querySelectorAll('#servizi-list li, #titoli-list li, .contatti ul li').forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), 1000 + i * 300);
  });

  // === CHIUSURA POPUP ===
  const closePopup = () => {
    popup.classList.add('fade-out');
    setTimeout(() => {
      popup.style.display = 'none';
      popup.classList.remove('fade-out');
    }, 500);
  };

  closeBtn.addEventListener('click', closePopup);
  closeBtn.addEventListener('keydown', e => {
    if (["Enter", " "].includes(e.key)) closePopup();
  });

  window.addEventListener('click', e => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', e => {
    if (e.key === "Escape" && popup.style.display === 'flex') closePopup();
  });
});

// === MOSTRA POPUP PERSONALIZZATO ===
function showPopup(title, htmlText) {
  popupTitle.textContent = title;
  popupText.innerHTML = htmlText;
  popup.style.display = 'flex';
}

// === VERIFICA DURATA SELEZIONATA ===
function isValidDurata() {
  const durata = document.getElementById("durata");
  return !!durata.value;
}

// === CONFIG PAYPAL BUTTON ===
if (document.getElementById('paypal-button-container')) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      if (!isValidDurata()) {
        alert("Seleziona una durata valida prima di procedere all'acquisto.");
        throw new Error("Durata non selezionata");
      }
      return actions.order.create({
        purchase_units: [{ amount: { value: document.getElementById("durata").value } }]
      });
    },
    onApprove: (data, actions) => actions.order.capture().then(details => {
      showPopup("✅ Pagamento completato", `Grazie per il tuo acquisto, <strong>${details.payer.name.given_name}</strong>!<br>Verrai contattato a breve per iniziare il tuo percorso. 💪🔥`);
    }),
    onCancel: () => {
      try { localStorage.setItem('paypalCancel', '1'); } catch (e) {}
      location.reload();
    },
    onError: () => {
      showPopup("⚠️ Errore durante il pagamento", "Si è verificato un errore tecnico durante il pagamento. Ti consigliamo di riprovare tra qualche minuto.<br><br>Se il problema persiste, contattaci per assistenza.");
    }
  }).render('#paypal-button-container');
}

// === INVIO FEEDBACK (GOOGLE APPS SCRIPT) ===
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const msgBox = document.getElementById('msg-feedback');
  msgBox.textContent = 'Invio in corso...';

  fetch('https://script.google.com/macros/s/AKfycbwlJaaj_Fg2Bw2Ilhfb9HCiid-xlKOTC2_TA0h2cHO5ROnC_MpmwKsuygY-rrt5UeLZgQ/exec', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      nome: document.getElementById('nome').value,
      commento: document.getElementById('commento').value
    })
  }).then(() => {
    msgBox.textContent = 'Grazie per il tuo feedback!';
    document.getElementById('feedbackForm').reset();
  }).catch(() => {
    msgBox.textContent = "Errore nell'invio. Riprova più tardi.";
  });
});

// === COPYRIGHT POPUP ===
function openCopyrightPopup() {
  document.getElementById("copyrightPopup").style.display = "flex";
}
function closeCopyrightPopup() {
  document.getElementById("copyrightPopup").style.display = "none";
}
function closeCopyrightPopupOnClick(event) {
  if (event.target.id === "copyrightPopup") {
    closeCopyrightPopup();
  }
}

// === TOGGLE MENU MOBILE ===
document.querySelectorAll('#menu-list a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('menu-list').classList.remove('show');
    document.getElementById('audio-toggle').style.display = 'block';
  });
});

document.getElementById('menu-toggle').addEventListener('click', () => {
  const menuList = document.getElementById('menu-list');
  const audioToggle = document.getElementById('audio-toggle');
  menuList.classList.toggle('show');
  audioToggle.style.display = menuList.classList.contains('show') ? 'none' : 'block';
});
