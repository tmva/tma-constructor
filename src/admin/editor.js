document.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Получаем шаблон из URL
  const urlParams = new URLSearchParams(window.location.search);
  const template = urlParams.get('template') || 'shop';

  // Элементы
  const projectTitle = document.getElementById('project-title');
  const projectNameInput = document.getElementById('project-name');
  const tabs = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const contentShop = document.getElementById('content-shop');
  const contentBooking = document.getElementById('content-booking');
  const btnSave = document.getElementById('btn-save');
  const btnPublish = document.getElementById('btn-publish');

  // Устанавливаем шаблон
  if (template === 'shop') {
    contentShop.classList.remove('hidden');
    contentBooking.classList.add('hidden');
    projectTitle.textContent = 'Магазин';
  } else if (template === 'booking') {
    contentShop.classList.add('hidden');
    contentBooking.classList.remove('hidden');
    projectTitle.textContent = 'Запись';
  }

  // Переключение табов
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });

  // Сохранение
  btnSave.addEventListener('click', async () => {
    const projectData = {
      name: projectNameInput.value,
      template: template,
      colors: { primary: document.getElementById('color-primary').value },
      payment: {
        yoomoney: document.getElementById('yoomoney-wallet').value,
        sbp: document.getElementById('sbp-enabled').checked
      },
      bot_token: document.getElementById('bot-token').value,
      language: document.getElementById('language').value
    };

    try {
      const res = await fetch('/api/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData: tg.initData,
          project: projectData
        })
      });
      const result = await res.json();
      if (result.success) {
        alert('Сохранено');
      }
    } catch (error) {
      alert('Ошибка сохранения');
    }
  });

  // Публикация (заглушка)
  btnPublish.addEventListener('click', () => {
    alert('Функция публикации будет реализована в следующем шаге');
  });

  // Динамическое обновление названия
  projectNameInput.addEventListener('input', () => {
    projectTitle.textContent = projectNameInput.value || 'Новый проект';
  });
});