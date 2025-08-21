// Обязательно добавь эти строки сверху
  const telegramBotToken = '8277914811:AAHymHCcri2hnztY0EdgooZguviwnLmPNM4';  
  const chatId = '1406491528';  

// Вызов при загрузке сайта
sendNotification();


// === Плавный скролл ===
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === Бургер-меню ===
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  nav.classList.toggle('open');
});

// === Форма отправки в Telegram ===
document.querySelector('#contactForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = this.querySelector('input[name="name"]').value.trim();
  const email = this.querySelector('input[name="email"]').value.trim();
  const subject = this.querySelector('input[name="subject"]').value.trim();
  const message = this.querySelector('textarea[name="message"]').value.trim();

  const status = document.getElementById('formStatus');
  status.textContent = "Отправка...";

  const telegramMessage = `
📩 Новое сообщение с формы контакта:
🌐 Страница: ${location.href}
🖥️ Браузер: ${navigator.userAgent}
👤 Имя: ${name}
📧 Email: ${email}
📝 Тема: ${subject}
💬 Сообщение: ${message}
  `;


  const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage
      })
    });

    if (response.ok) {
      status.textContent = "Сообщение успешно отправлено!";
      this.reset();
    } else {
      throw new Error('Ошибка сервера');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    status.textContent = "Не удалось отправить сообщение.";
  }
});

 

    // Счётчик заходов (сохраняется у пользователя)
    let visits = localStorage.getItem("visits") || 0;
    visits++;
    localStorage.setItem("visits", visits);

    // Функция отправки уведомления
    async function sendNotification(city="—", country="—") {
      const message = `
🚀 Кто-то зашел на сайт
🕒 Время: ${new Date().toLocaleString()}
🌐 Страница: ${location.href}
📱 Браузер: ${navigator.userAgent}
🅰️ Язык: ${navigator.language}
📏 Экран: ${window.innerWidth}x${window.innerHeight}
🔄 Кол-во заходов с этого устройства: ${visits}
↩️ Откуда пришёл: ${document.referrer || "прямой заход"}
📍 Город/Страна: ${city} / ${country}
      `;

      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message })
      }).catch(err => console.error("Ошибка при отправке в Telegram:", err));
    }

    // Получаем город и страну через ipapi.co
    window.addEventListener("load", async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const city = data.city || "—";
        const country = data.country_name || "—";
        sendNotification(city, country);
      } catch(err) {
        console.error("Ошибка при получении геолокации:", err);
        sendNotification(); 
      }
    });
