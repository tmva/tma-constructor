document.addEventListener('DOMContentLoaded', async () => {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  const projectsList = document.getElementById('projects-list');
  const createBtn = document.getElementById('create-project');
  const modal = document.getElementById('modal-template');
  const closeBtn = document.getElementById('close-modal');
  const templateCards = document.querySelectorAll('.template-card');

  // Загружаем проекты
  async function loadProjects() {
    try {
      const res = await fetch(`/api/projects?initData=${tg.initData}`);
      const projects = await res.json();
      
      if (!projects.length) {
        projectsList.innerHTML = '<p class="empty">У вас пока нет проектов</p>';
        return;
      }

      projectsList.innerHTML = projects.map(p => `
        <div class="project-card">
          <h3>${p.name}</h3>
          <p>Тип: ${p.type === 'shop' ? '🛒 Магазин' : p.type === 'booking' ? '📅 Запись' : '🔌 Интеграция'}</p>
          <p>Создан: ${new Date(p.created).toLocaleDateString('ru')}</p>
          <button class="btn-open" data-id="${p.id}">Открыть</button>
        </div>
      `).join('');
    } catch (error) {
      projectsList.innerHTML = '<p class="error">Ошибка загрузки проектов</p>';
    }
  }

  // Модалка выбора шаблона
  createBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const template = card.dataset.template;
      // Переходим в редактор с выбранным шаблоном
      window.location.href = `editor.html?template=${template}`;
    });
  });

  // Инициализация
  loadProjects();
});