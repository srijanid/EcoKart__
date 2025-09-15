function renderCartPage() {
  const page = document.getElementById('page');
  const cart = getCart();

  // attach product info, filter out missing ones
  const items = cart
    .map(it => ({ ...it, product: findProduct(it.id) }))
    .filter(it => it.product); // ignore missing products

  if (!items.length) {
    page.innerHTML = `<div class="p-8 text-center">Your cart is empty.</div>`;
    return;
  }

  page.innerHTML = `
  <div class="max-w-5xl mx-auto py-8">
  ${renderProgressBar(0)}
    <h1 class="text-2xl font-bold mb-4">Your Cart</h1>
    <div class="space-y-4">
      ${items.map(it => `
        <div class="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
          <img src="${it.product.img}" class="w-16 h-16 object-cover rounded">
          <div class="flex-1">
            <div class="font-semibold">${it.product.title}</div>
            <div class="text-sm text-slate-500">${money(it.product.price)}</div>
            <div class="mt-2 flex items-center gap-2">
              <button class="qty-dec bg-slate-200 px-2 rounded" data-id="${it.id}">-</button>
              <span>${it.qty}</span>
              <button class="qty-inc bg-slate-200 px-2 rounded" data-id="${it.id}">+</button>
            </div>
          </div>
          <div class="font-bold">${money(it.qty * it.product.price)}</div>
          <button class="remove-item text-red-600 text-sm" data-id="${it.id}">Remove</button>
        </div>
      `).join('')}
    </div>
    <div class="mt-6 text-right">
      <a href="#/checkout" class="bg-green-600 text-white px-6 py-2 rounded-md">Proceed to Checkout</a>
    </div>
    </div>
  `;

  // qty update handlers
  page.querySelectorAll('.qty-dec').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, -1))
  );
  page.querySelectorAll('.qty-inc').forEach(btn =>
    btn.addEventListener('click', () => changeQty(btn.dataset.id, 1))
  );
  page.querySelectorAll('.remove-item').forEach(btn =>
    btn.addEventListener('click', () => removeItem(btn.dataset.id))
  );

  function changeQty(id, delta) {
    const cart = getCart();
    const it = cart.find(i => i.id === id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart.splice(cart.indexOf(it), 1);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
  }

  function removeItem(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
  }
}
