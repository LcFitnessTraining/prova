const menuToggle=document.getElementById('menu-toggle');const menuList=document.getElementById('menu-list');const audioToggle=document.getElementById('audio-toggle');const bgMusic=document.getElementById('bg-music');const audioOverlay=document.getElementById('audio-overlay');const durataSelect=document.getElementById('durata');const paypalButtonWrapper=document.getElementById('paypal-button-wrapper');const popup=document.getElementById('popup');const copyrightPopup=document.getElementById('copyrightPopup');const feedbackForm=document.getElementById('feedbackForm');const msgFeedback=document.getElementById('msg-feedback');let audioInitialized=!1;let menuOpen=!1;document.addEventListener('DOMContentLoaded',function(){initializeParticles();initializeMenu();initializeAudio();initializePayPal();initializeServicePopups();initializeFAQ();initializeFeedbackForm()});function initializeParticles(){if(typeof particlesJS!=='undefined'){particlesJS('particles-js',{particles:{number:{value:50,density:{enable:!0,value_area:800}},color:{value:'#ff0000'},shape:{type:'circle'},opacity:{value:0.5,random:!1},size:{value:3,random:!0},line_linked:{enable:!0,distance:150,color:'#ff0000',opacity:0.4,width:1},move:{enable:!0,speed:2,direction:'none',random:!1,straight:!1,out_mode:'out',bounce:!1}},interactivity:{detect_on:'canvas',events:{onhover:{enable:!0,mode:'repulse'},onclick:{enable:!0,mode:'push'},resize:!0}},retina_detect:!0})}}
function initializeMenu(){if(menuToggle&&menuList){menuToggle.addEventListener('click',toggleMenu);const menuLinks=menuList.querySelectorAll('a');menuLinks.forEach(link=>{link.addEventListener('click',closeMenu)});document.addEventListener('click',function(event){if(!menuToggle.contains(event.target)&&!menuList.contains(event.target)){closeMenu()}})}}
function toggleMenu(){menuOpen=!menuOpen;if(menuOpen){menuList.classList.remove('hidden');menuToggle.setAttribute('aria-expanded','true')}else{menuList.classList.add('hidden');menuToggle.setAttribute('aria-expanded','false')}}
function closeMenu(){menuOpen=!1;menuList.classList.add('hidden');menuToggle.setAttribute('aria-expanded','false')}
function initializeAudio(){if(audioToggle&&bgMusic&&audioOverlay){audioToggle.addEventListener('click',toggleAudio);audioOverlay.addEventListener('click',initializeAudioOnMobile);if(isMobileDevice()){audioOverlay.style.display='block'}}}
function toggleAudio(){if(!audioInitialized){initializeAudioPlayback()}else{if(bgMusic.paused){playAudio()}else{pauseAudio()}}}
function initializeAudioOnMobile(){initializeAudioPlayback();audioOverlay.style.display='none'}
function initializeAudioPlayback(){bgMusic.play().then(()=>{audioInitialized=!0;updateAudioButton(!1)}).catch(error=>{console.log('Audio autoplay prevented:',error);updateAudioButton(!0)})}
function playAudio(){bgMusic.play().then(()=>{updateAudioButton(!1)}).catch(error=>{console.log('Audio play failed:',error)})}
function pauseAudio(){bgMusic.pause();updateAudioButton(!0)}
function updateAudioButton(isPaused){if(audioToggle){audioToggle.textContent=isPaused?'🔇 Off':'🔊 On'}}
function isMobileDevice(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
function initializePayPal(){if(durataSelect&&paypalButtonWrapper){durataSelect.addEventListener('change',handleDurationChange)}}
function handleDurationChange(){const amount=durataSelect.value;if(amount){showPayPalButton();updatePayPalMessage(amount);loadPayPalScript(amount)}else{hidePayPalButton()}}
function showPayPalButton(){paypalButtonWrapper.style.display='block';setTimeout(()=>{paypalButtonWrapper.classList.add('fade')},10)}
function hidePayPalButton(){paypalButtonWrapper.style.display='none';paypalButtonWrapper.classList.remove('fade')}
function updatePayPalMessage(amount){const paypalMessage=document.getElementById('paypal-message');if(paypalMessage){paypalMessage.setAttribute('data-pp-amount',amount)}}
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
amount: { value: amount, currency_code: 'EUR' }
}]
});
},
onApprove: function(data, actions) {
return actions.order.capture().then(function(details) {
showPaymentPopup(
Grazie ${details.payer.name.given_name}! Il tuo ordine da ${amount}€ è stato processato. Sarai contattato a breve dal Coach per cominciare il tuo percorso!,
'success'
);
sendOrderConfirmation(details);
});
},
onCancel: function(data) {
showPaymentPopup('Il pagamento è stato annullato.', 'error');
}
}).render('#paypal-button-container');
}
}
function initializeServicePopups(){const servicesList=document.getElementById('servizi-list');const closeBtn=document.querySelector('.close-btn');if(servicesList){const serviceItems=servicesList.querySelectorAll('li');serviceItems.forEach(item=>{item.addEventListener('click',()=>showServicePopup(item))})}
if(closeBtn){closeBtn.addEventListener('click',closeServicePopup)}
if(popup){popup.addEventListener('click',function(event){if(event.target===popup){closeServicePopup()}})}}
function showServicePopup(serviceItem){const title=serviceItem.textContent;const description=serviceItem.getAttribute('data-desc');const popupTitle=document.getElementById('popup-title');const popupText=document.getElementById('popup-text');if(popupTitle&&popupText&&popup){popupTitle.textContent=title;popupText.textContent=description;popup.style.display='block';setTimeout(()=>{popup.style.opacity='1'},10)}}
function closeServicePopup(){if(popup){popup.style.opacity='0';setTimeout(()=>{popup.style.display='none'},300)}}
function initializeFAQ(){const faqQuestions=document.querySelectorAll('.faq-question');faqQuestions.forEach(question=>{question.addEventListener('click',function(){const answer=this.nextElementSibling;const isActive=this.classList.contains('active');faqQuestions.forEach(q=>{q.classList.remove('active');q.nextElementSibling.classList.remove('active')});if(!isActive){this.classList.add('active');answer.classList.add('active')}})})}
function initializeFeedbackForm(){if(feedbackForm){feedbackForm.addEventListener('submit',async function(e){e.preventDefault();const form=e.target;const data=new FormData(form);try{const response=await fetch(form.action,{method:form.method,body:data,headers:{'Accept':'application/json'}});if(response.ok){showSuccessMessage("Grazie per il tuo feedback!");form.reset()}else{showErrorMessage("Si è verificato un errore. Riprova più tardi.")}}catch(error){showErrorMessage("Errore di rete. Controlla la connessione.")}})}}
function openCopyrightPopup(){if(copyrightPopup){copyrightPopup.style.display='block'}}
function closeCopyrightPopup(){if(copyrightPopup){copyrightPopup.style.display='none'}}
function closePopup(event){if(event.target===copyrightPopup){closeCopyrightPopup()}}
function showSuccessMessage(message){const notification=createNotification(message,'success');document.body.appendChild(notification);setTimeout(()=>{notification.remove()},5000)}
function showErrorMessage(message){const notification=createNotification(message,'error');document.body.appendChild(notification);setTimeout(()=>{notification.remove()},5000)}
function createNotification(message,type){const notification=document.createElement('div');notification.className=notification ${type};notification.textContent=message;notification.style.cssText=  position: fixed;   top: 20px;   right: 20px;   padding: 15px 20px;   border-radius: 5px;   color: white;   font-weight: bold;   z-index: 3000;   max-width: 300px;   opacity: 0;   transform: translateX(100%);   transition: all 0.3s ease;  ;
if(type==='success'){notification.style.background='#28a745';notification.style.border='2px solid #1e7e34'}else if(type==='error'){notification.style.background='#dc3545';notification.style.border='2px solid #bd2130'}
setTimeout(()=>{notification.style.opacity='1';notification.style.transform='translateX(0)'},10);setTimeout(()=>{notification.style.opacity='0';notification.style.transform='translateX(100%)'},4500);return notification}
document.addEventListener('click',function(event){if(event.target.matches('a[href^="#"]')){event.preventDefault();const targetId=event.target.getAttribute('href').substring(1);const targetElement=document.getElementById(targetId);if(targetElement){const offsetTop=targetElement.offsetTop-80;window.scrollTo({top:offsetTop,behavior:'smooth'})}}});document.addEventListener('keydown',function(event){if(event.key==='Escape'){closeServicePopup();closeCopyrightPopup();closeMenu()}
if(event.key==='Enter'){const focusedElement=document.activeElement;if(focusedElement.classList.contains('close-btn')){closeServicePopup()}
if(focusedElement.id==='audio-overlay'){initializeAudioOnMobile()}}});function showPaymentPopup(message,type){const popupTitle=document.getElementById('popup-title');const popupText=document.getElementById('popup-text');const popup=document.getElementById('popup');if(popupTitle&&popupText&&popup){popupTitle.textContent=type==='success'?'Pagamento completato':'Pagamento annullato';popupText.textContent=message;popup.style.display='block';setTimeout(()=>{popup.style.opacity='1'},10);setTimeout(()=>{popup.style.opacity='0';setTimeout(()=>{popup.style.display='none'},300)},15000)}}
window.openCopyrightPopup=openCopyrightPopup;window.closeCopyrightPopup=closeCopyrightPopup;window.closePopup=closePopup;requestIdleCallback(function(deadline){while(deadline.timeRemaining()>0){}})
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
if (choice.outcome === 'accepted') {
console.log('App installata!');
}
deferredPrompt = null;
installBtn.style.display = 'none';
});
}
});

