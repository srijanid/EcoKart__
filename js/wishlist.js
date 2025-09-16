function renderWishlistPage() {
  const page = document.getElementById("page");
  const wishlist = JSON.parse(localStorage.getItem(LS_KEYS.WISHLIST) || "[]");

  if (!wishlist.length) {
    page.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div class="w-24 h-24 flex items-center justify-center rounded-full bg-red-50 text-red-500 mb-6 shadow-sm">
          <i class="fa-regular fa-heart text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h2>
        <p class="text-slate-500 mb-6 max-w-md">
          Looks like you haven’t added any favorites yet. Start exploring our eco-friendly products and save the ones you love.
        </p>
        <a href="#/" class="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:from-green-600 hover:to-cyan-600 transition">
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  page.innerHTML = `
    <div class="max-w-6xl mx-auto py-10 px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            <i class="fa-regular fa-heart text-red-500"></i>
            My Wishlist
          </h1>
          <p class="text-slate-500 mt-1 text-base">Curated items you love, saved for later.</p>
        </div>
        <a href="#/" class="text-green-600 font-medium hover:text-green-700 transition">
          Continue Shopping →
        </a>
      </div>

      <!-- Wishlist grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${wishlist.map(p => `
          <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col border border-slate-100">
            <div class="relative">
              <img src="${p.img}" alt="${p.title}" class="h-48 w-full object-cover group-hover:scale-105 transition duration-300">
              <button data-id="${p.id}" class="remove-wish absolute top-3 right-3 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-2 shadow-md transition">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <h2 class="font-semibold text-lg text-slate-800 group-hover:text-green-600 transition">
                ${p.title}
              </h2>
              <p class="text-sm text-slate-500 mt-1">${p.category}</p>
              <p class="mt-3 font-bold text-green-700 text-lg">${money(p.price)}</p>
              
              <div class="mt-auto pt-4">
                <button data-id="${p.id}" class="add-cart w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-lg hover:from-green-600 hover:to-cyan-600 transition ">
                  <i class="fa-solid fa-cart-plus mr-2"></i> Add to Cart
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

  // Product click
  // page.querySelectorAll('[data-id]').forEach(card => {
  //   card.addEventListener('click', e => {
  //     if (e.target.classList.contains('add-to-cart')) return;
  //     location.hash = '#/product?id=' + card.dataset.id;
  //   });
  // });

  // Remove from wishlist
  page.querySelectorAll(".remove-wish").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const newWishlist = wishlist.filter(p => p.id !== id);
      localStorage.setItem(LS_KEYS.WISHLIST, JSON.stringify(newWishlist));
      updateWishlistCount();
      renderWishlistPage(); // re-render
    });
  });
}

