function renderWishlistPage() {
  const page = document.getElementById("page");
  const wishlist = JSON.parse(localStorage.getItem(LS_KEYS.WISHLIST) || "[]");

  if (!wishlist.length) {
    page.innerHTML = `
      <div class="p-8 text-center text-gray-600">
        <i class="fa-regular fa-heart text-4xl mb-4 text-red-500"></i>
        <p class="text-lg font-medium">Your Wishlist is empty</p>
        <a href="#/" class="mt-4 inline-block text-green-600 underline">Continue Shopping</a>
      </div>
    `;
    return;
  }

  page.innerHTML = `
    <div class="max-w-5xl mx-auto py-6">
      <h1 class="text-2xl font-bold mb-2 flex items-center gap-2">
        <i class="fa-regular fa-heart text-red-500"></i>
        My Wishlist
      </h1>
      <p class="text-slate-600 mb-6">Items you love, saved for later</p>

      <div class="grid md:grid-cols-3 gap-6">
        ${wishlist.map(p => `
          <div class="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col">
            <img src="${p.img}" alt="${p.title}" class="h-40 w-full object-cover">
            <div class="p-4 flex-1 flex flex-col">
              <div class="font-semibold text-gray-800">${p.title}</div>
              <div class="text-sm text-slate-500 mb-2">${p.category}</div>
              <div class="font-bold text-green-700 mb-3">${money(p.price)}</div>
              
              <div class="mt-auto flex gap-2">
                <button data-id="${p.id}" class="add-cart flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm">
                  <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
                <button data-id="${p.id}" class="remove-wish px-3 py-2 border rounded-md hover:bg-red-50 hover:text-red-600">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // Add to cart
  page.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const product = wishlist.find(p => p.id === id);
      if (!product) return;

      const cart = getCart();
      const existing = cart.find(it => it.id === product.id);
      if (existing) existing.qty++;
      else cart.push({ id: product.id, qty: 1, size: product.size || "M" });

      saveCart(cart);
      updateCartCount();
      flyImageToCart(btn.closest("div").querySelector("img"));
    });
  });

  // Remove from wishlist
  page.querySelectorAll(".remove-wish").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const newWishlist = wishlist.filter(p => p.id !== id);
      localStorage.setItem(LS_KEYS.WISHLIST, JSON.stringify(newWishlist));
      renderWishlistPage(); // re-render
    });
  });
}

