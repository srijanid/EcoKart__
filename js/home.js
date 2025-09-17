function renderHome(params = {}) {
  const page = document.getElementById('page');
  let products = [...PRODUCTS];

  // Filter by search
  if (params.q) {
    const q = params.q.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
  }

  // Filter by category
  if (params.cat) {
    products = products.filter(p => p.category === params.cat);
  }

  // Filter by rating
  if (params.rating) {
    products = products.filter(p => (p.rating || 0) >= params.rating);
  }

  // Filter by price
  if (params.minPrice != null) {
    products = products.filter(p => p.price >= params.minPrice);
  }
  if (params.maxPrice != null) {
    products = products.filter(p => p.price <= params.maxPrice);
  }

  // Layout
  page.innerHTML = `
    <!-- Hero (only for home) -->
    <section class="relative bg-gradient-to-r from-green-100 via-cyan-100 to-blue-100 pt-12 pb-16 text-center rounded-2xl shadow-md mb-10 max-w-7xl mx-auto">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6">
          Shop Eco-Friendly, Live Sustainably
        </h1>
        <p class="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Discover eco-friendly products handpicked to make your lifestyle greener and smarter.
        </p>
        <a href="#"
          class="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg transition">
          Shop Now
        </a>
      </div>
    </section>

    <!-- Products + Filters -->
    <section id="products" class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <!-- Sidebar Filters -->
      <aside class="bg-white rounded-xl shadow-sm p-5 h-fit md:sticky md:top-20">
        <h2 class="text-lg font-bold mb-4">Filters</h2>

        <!-- Category Filter -->
        <div class="mb-6">
          <h3 class="font-medium mb-2">Category</h3>
          ${[...new Set(PRODUCTS.map(p => p.category))].map(cat => `
            <label class="flex items-center gap-2 text-sm mb-1 cursor-pointer">
              <input type="radio" name="filter-cat" value="${cat}" ${params.cat === cat ? "checked" : ""}>
              <span>${cat}</span>
            </label>
          `).join("")}
          <label class="flex items-center gap-2 text-sm mt-1 cursor-pointer">
            <input type="radio" name="filter-cat" value="" ${!params.cat ? "checked" : ""}>
            <span>All</span>
          </label>
        </div>

        <!-- Rating Filter -->
        <div class="mb-6">
          <h3 class="font-medium mb-2">Rating</h3>
          ${[4, 3, 2].map(r => `
            <label class="flex items-center gap-2 text-sm mb-1 cursor-pointer">
              <input type="radio" name="filter-rating" value="${r}" ${params.rating == r ? "checked" : ""}>
              <span>${r}★ & above</span>
            </label>
          `).join("")}
          <label class="flex items-center gap-2 text-sm mt-1 cursor-pointer">
            <input type="radio" name="filter-rating" value="" ${!params.rating ? "checked" : ""}>
            <span>All</span>
          </label>
        </div>

        <!-- Price Filter -->
        <div>
          <h3 class="font-medium mb-2">Price</h3>
          <input type="number" id="minPrice" placeholder="Min" value="${params.minPrice ?? ""}" class="w-full mb-2 border rounded px-2 py-1 text-sm">
          <input type="number" id="maxPrice" placeholder="Max" value="${params.maxPrice ?? ""}" class="w-full mb-3 border rounded px-2 py-1 text-sm">
          <button id="applyPrice" class="w-full bg-green-600 text-white text-sm py-2 rounded-md hover:bg-green-700">Apply</button>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="md:col-span-3">
        <h1 class="text-2xl font-bold mb-4">Eco-friendly Products</h1>
        ${products.length ? `
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            ${products.map(p => `
              <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer" data-id="${p.id}">
                <img src="${p.img}" alt="${p.title}" class="h-40 w-full object-cover">
                <div class="p-4">
                  <div class="font-semibold">${p.title}</div>
                  <div class="text-sm text-slate-500">${p.category}</div>
                  <div class="mt-2 font-bold">${money(p.price)}</div>
                  <div class="flex items-center text-yellow-500 text-sm mt-1">⭐ ${p.rating || 4}</div>
                  <button class="mt-3 w-full bg-green-600 text-white py-2 rounded-md text-sm add-to-cart">Add to Cart</button>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `<p class="text-slate-500">No products found</p>`}
      </div>
    </section>
  `;

  // Filter Handlers
  page.querySelectorAll("input[name='filter-cat']").forEach(el => {
    el.addEventListener("change", () => {
      renderHome({ ...params, cat: el.value || null });
    });
  });

  page.querySelectorAll("input[name='filter-rating']").forEach(el => {
    el.addEventListener("change", () => {
      renderHome({ ...params, rating: el.value || null });
    });
  });

  const applyPrice = page.querySelector("#applyPrice");
  if (applyPrice) {
    applyPrice.addEventListener("click", () => {
      const min = parseFloat(page.querySelector("#minPrice").value) || null;
      const max = parseFloat(page.querySelector("#maxPrice").value) || null;
      renderHome({ ...params, minPrice: min, maxPrice: max });
    });
  }

  // Clear All Filters
  const clearBtn = page.querySelector("#clearFilters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      renderHome({});
    });
  }

  //Toggle Filters on Mobile
  const toggleBtn = page.querySelector("#toggleFilters");
  if (toggleBtn) {
    const sidebar = page.querySelector("aside");
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
      sidebar.classList.toggle("absolute");
      sidebar.classList.toggle("z-50");
      sidebar.classList.toggle("w-3/4");
      sidebar.classList.toggle("left-0");
      sidebar.classList.toggle("top-0");
      sidebar.classList.toggle("h-full");
    });
  }


  // Product click
  page.querySelectorAll('[data-id]').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.classList.contains('add-to-cart')) return;
      location.hash = '#/product?id=' + card.dataset.id;
    });
  });

  // Add to cart
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
