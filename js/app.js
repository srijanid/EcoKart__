// ROUTER

const ROUTES = {
  '': renderHome,
  '/': renderHome,
  '/product': renderProductPage,
  '/cart': renderCartPage,
  '/checkout': renderCheckoutPage,
  '/thanks': renderThanksPage,
  '/wishlist':renderWishlistPage
};

function parseHash() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = hash.split('?');
  const params = {};
  if (qs) new URLSearchParams(qs).forEach((v, k) => params[k] = v);
  return { path, params };
}

function route() {
  const { path, params } = parseHash();
  const page = ROUTES[path] || renderNotFound;
  page(params);
}

// INIT
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('cartBtn').addEventListener('click', () => location.hash = '#/cart');
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value.trim();
  location.hash = '#/?q=' + encodeURIComponent(q);
});
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

window.addEventListener('hashchange', route);
window.addEventListener('load', async () => {
  await loadProducts();
  updateCartCount();
  route();
});

window.addEventListener('load',async()=>{
  updateWishlistCount();
})
