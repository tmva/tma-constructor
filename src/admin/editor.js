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
        alert('Проект сохранён');
      }
    } catch (error) {
      alert('Ошибка сохранения');
    }
  });

  // Публикация
  btnPublish.addEventListener('click', async () => {
    const projectData = {
      projectId: 'test_' + Date.now(), // временный ID
      name: projectNameInput.value || 'Мой магазин',
      template: template
    };

    alert('Запускаю деплой...');

    try {
      const res = await fetch('/api/deploy-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const result = await res.json();
      
      if (result.url) {
        alert(`Готово! Магазин опубликован: ${result.url}`);
      }
    } catch (error) {
      alert('Ошибка деплоя');
    }
  });

  // Динамическое обновление названия
  projectNameInput.addEventListener('input', () => {
    projectTitle.textContent = projectNameInput.value || 'Новый проект';
  });

  // Управление товарами (магазин)
  if (template === 'shop') {
    const productsList = document.getElementById('products-list');
    const btnAddProduct = document.getElementById('btn-add-product');
    const modalItem = document.getElementById('modal-item');
    const btnCancelItem = document.getElementById('btn-cancel-item');
    const btnSaveItem = document.getElementById('btn-save-item');

    let products = [];

    function renderProducts() {
      productsList.innerHTML = products.map((p, i) => `
        <div class="product-item">
          <strong>${p.name}</strong> – ${p.price} ₽
          <button onclick="removeProduct(${i})">🗑</button>
        </div>
      `).join('');
    }

    window.removeProduct = (index) => {
      products.splice(index, 1);
      renderProducts();
    };

    btnAddProduct.addEventListener('click', () => {
      modalItem.classList.remove('hidden');
    });

    btnCancelItem.addEventListener('click', () => {
      modalItem.classList.add('hidden');
    });

    btnSaveItem.addEventListener('click', () => {
      const name = document.getElementById('item-name').value;
      const price = document.getElementById('item-price').value;
      const desc = document.getElementById('item-description').value;

      if (name && price) {
        products.push({ name, price, description: desc });
        renderProducts();
        modalItem.classList.add('hidden');
        // Очищаем поля
        document.getElementById('item-name').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-description').value = '';
      }
    });
  }
});