document.addEventListener('DOMContentLoaded', async () => {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  
  // Загружаем товары с нашего API
  const res = await fetch(`https://your-netlify-url.netlify.app/api/project/${window.SHOP_CONFIG.projectId}/data`);
  const products = await res.json();
  
  // Рендерим товары
  const container = document.getElementById('products-container');
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button onclick="addToCart('${p.id}')">В корзину</button>
    </div>
  `).join('');
});

// Корзина (заглушка)
let cart = [];
function addToCart(id) {
  cart.push(id);
  document.getElementById('cart-count').textContent = cart.length;
}