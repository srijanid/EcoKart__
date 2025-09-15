function renderHome(params = {}) {
  const page = document.getElementById('page');
  let products = [...PRODUCTS];

  // filter by search
  if (params.q) {
    const q = params.q.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
  }

  // filter by category
  if (params.cat) {
    products = products.filter(p => p.category === params.cat);
  }

  page.innerHTML = `
    <!-- Hero (only for home) -->
    <section class="relative bg-gradient-to-r from-green-100 via-cyan-100 to-blue-100 pt-12 pb-16 text-center rounded-2xl shadow-md mb-10">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6">
          Shop Eco-Friendly, Live Sustainably
        </h1>
        <p class="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Discover eco-friendly products handpicked to make your lifestyle greener and smarter.
        </p>
        <a href="#/products"
          class="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg transition">
          Shop Now
        </a>
      </div>
    </section>

    <!-- Products -->
    <div>
      <h1 class="text-2xl font-bold mb-4">Eco-friendly Products</h1>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${products.map(p => `
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer" data-id="${p.id}">
            <img src="${p.img}" alt="${p.title}" class="h-40 w-full object-cover">
            <div class="p-4">
              <div class="font-semibold">${p.title}</div>
              <div class="text-sm text-slate-500">${p.category}</div>
              <div class="mt-2 font-bold">${money(p.price)}</div>
              <button class="mt-3 w-full bg-green-600 text-white py-2 rounded-md text-sm add-to-cart">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // event: open product page
  page.querySelectorAll('[data-id]').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.classList.contains('add-to-cart')) return;
      location.hash = '#/product?id=' + card.dataset.id;
    });
  });

  // event: add to cart
  page.querySelectorAll('.add-to-cart').forEach((btn, i) => {
    btn.addEventListener('click', e => {
      const product = products[i];
      const cart = getCart();
      const existing = cart.find(it => it.id === product.id);
      if (existing) existing.qty++;
      else cart.push({ id: product.id, qty: 1 });
      saveCart(cart);
      updateCartCount();
      flyImageToCart(btn.closest('[data-id]').querySelector('img'));
      e.stopPropagation();
    });
  });
}
