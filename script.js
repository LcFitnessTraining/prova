const popup = document.getElementById('popup'),
  popupTitle = document.getElementById('popup-title'),
  popupText = document.getElementById('popup-text'),
  closeBtn = document.querySelector('.close-btn');

window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax').forEach(el => {
    const speed = el.getAttribute('data-speed');
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

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

document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll('.faq-item'),
    audio = document.getElementById("bg-music"),
    audioOverlay = document.getElementById("audio-overlay"),
    audioToggle = document.getElementById("audio-toggle");
  let isPlaying = false;

  if (localStorage.getItem('paypalCancel') === '1') {
    localStorage.removeItem('paypalCancel');
    popupTitle.textContent = "❌ Pagamento annullato";
    popupText.innerHTML = "Hai annullato il processo di pagamento. Se vuoi riprovare, seleziona il piano e clicca su Paga.";
    popup.style.display = 'flex';
  }

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
    });
  });

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
    if (e.key === "Enter" || e.key === " ") startAudio();
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

  const items = document.querySelectorAll('#servizi-list li');
  items.forEach(item => {
    item.addEventListener('click', () => {
      popupTitle.textContent = item.textContent;
      popupText.textContent = item.getAttribute('data-desc');
      popup.style.display = 'flex';
    });
  });

  document.querySelectorAll('#servizi-list li, #titoli-list li, .contatti ul li').forEach((item, i) => setTimeout(() => item.classList.add('visible'), 1000 + i * 300));

  function closePopup() {
    popup.classList.add('fade-out');
    setTimeout(() => {
      popup.style.display = 'none';
      popup.classList.remove('fade-out');
    }, 500);
  }

  closeBtn.addEventListener('click', closePopup);
  closeBtn.addEventListener('keydown', function(e) {
    if (e.key === "Enter" || e.key === " ") closePopup();
  });

  window.onclick = function(event) {
    if (event.target === popup) closePopup();
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape" && popup.style.display === 'flex') closePopup();
  });
});

function isValidDurata() {
  const durata = document.getElementById("durata");
  return !!durata.value;
}

if (document.getElementById('paypal-button-container')) {
  paypal.Buttons({
    createOrder: function(data, actions) {
      const amount = document.getElementById("durata").value;
      if (!isValidDurata()) {
        alert("Seleziona una durata valida prima di procedere all'acquisto.");
        throw new Error("Durata non selezionata");
      }
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: amount
          }
        }]
      });
    },
    onApprove: (data, actions) => actions.order.capture().then(details => {
      const name = details.payer.name.given_name;
      popupTitle.textContent = "✅ Pagamento completato";
      popupText.innerHTML = `Grazie per il tuo acquisto, <strong>${name}</strong>!<br>Verrai contattato a breve per iniziare il tuo percorso. 💪🔥`;
      popup.style.display = 'flex';
    }),
    onCancel: function(data) {
      try {
        localStorage.setItem('paypalCancel', '1');
      } catch (e) {}
      location.reload();
    },
    onError: function(err) {
      popupTitle.textContent = "⚠️ Errore durante il pagamento";
      popupText.innerHTML = "Si è verificato un errore tecnico durante il pagamento. Ti consigliamo di riprovare tra qualche minuto.<br><br>Se il problema persiste, contattaci per assistenza.";
      popup.style.display = 'flex';
    }
  }).render('#paypal-button-container');
}

document.getElementById('feedbackForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var msgBox = document.getElementById('msg-feedback');
  msgBox.textContent = 'Invio in corso...';
  fetch('https://script.google.com/macros/s/AKfycbwlJaaj_Fg2Bw2Ilhfb9HCiid-xlKOTC2_TA0h2cHO5ROnC_MpmwKsuygY-rrt5UeLZgQ/exec', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      nome: document.getElementById('nome').value,
      commento: document.getElementById('commento').value
    })
  }).then(function() {
    msgBox.textContent = 'Grazie per il tuo feedback!';
    document.getElementById('feedbackForm').reset();
  }).catch(function() {
    msgBox.textContent = "Errore nell'invio. Riprova più tardi.";
  });
});

function openCopyrightPopup() {
  document.getElementById("copyrightPopup").style.display = "flex";
}

function closeCopyrightPopup() {
  document.getElementById("copyrightPopup").style.display = "none";
}

function closePopup(event) {
  if (event.target.id === "copyrightPopup") {
    closeCopyrightPopup();
  }
}

document.querySelectorAll('#menu-list a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('menu-list').classList.remove('show');
    document.getElementById('audio-toggle').style.display = 'block';
  });
});

document.getElementById('menu-toggle').addEventListener('click', function() {
  var menuList = document.getElementById('menu-list');
  var audioToggle = document.getElementById('audio-toggle');

  menuList.classList.toggle('show');

  if (menuList.classList.contains('show')) {
    audioToggle.style.display = 'none';
  } else {
    audioToggle.style.display = 'block';
  }
});
