let selectedSize = null; // store selected size

function renderProductPage(params) {
  const product = findProduct(params.id);
  const page = document.getElementById("page");

  if (!product) {
    page.innerHTML = `<div class="p-8 text-center">Product not found</div>`;
    return;
  }

  page.innerHTML = `
    <div class="grid md:grid-cols-2 gap-10 items-start">
      <!-- Product Image -->
      <div class="relative group">
        <img src="${product.img}" 
             class="w-full rounded-2xl shadow-lg transform transition duration-300 group-hover:scale-105 group-hover:shadow-xl" />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-800">${product.title}</h1>

        <!-- Rating -->
        <div class="flex items-center gap-3">
          <div class="flex text-lg">
            ${renderStars(product.rating || 4.2)}
          </div>
          <span class="text-sm text-gray-600">(${product.reviews || 120} reviews)</span>
        </div>

        <!-- Price -->
        <div class="flex items-center gap-2 text-2xl font-bold text-green-700">
          <i class="fa-solid fa-indian-rupee-sign"></i> ${money(product.price)}
        </div>

        <!-- Description -->
        <p class="text-gray-600 leading-relaxed">${product.desc}</p>

        <!-- Size Selection -->
        <div>
          <div class="font-medium text-gray-700 mb-2">Select Size:</div>
          <div id="sizeOptions" class="flex gap-3">
            ${["S", "M", "L", "XL"].map(size => `
              <button data-size="${size}" 
                class="size-btn px-4 py-2 border rounded-lg hover:bg-green-50 hover:border-green-600">
                ${size}
              </button>
            `).join("")}
          </div>
          <div id="sizeWarning" class="text-sm text-red-500 hidden mt-1">⚠ Please select a size</div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button id="addToCartBtn" 
                  class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:scale-105">
            <i class="fa-solid fa-cart-shopping"></i>
            Add to Cart
          </button>

          <button id="wishlistBtn" 
                  class="flex items-center gap-2 border border-gray-300 hover:border-green-600 hover:text-green-600 text-gray-600 px-6 py-3 rounded-xl shadow-sm transition">
            <i class="fa-regular fa-heart"></i>
            Wishlist
          </button>
        </div>
      </div>
    </div>
  `;

  // Select size
  document.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;

      // Highlight active size
      document.querySelectorAll(".size-btn").forEach(b => 
        b.classList.remove("border-green-600", "bg-green-100", "text-green-700")
      );
      btn.classList.add("border-green-600", "bg-green-100", "text-green-700");

      document.getElementById("sizeWarning").classList.add("hidden");
    });
  });

  // Add to cart
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    if (!selectedSize) {
      document.getElementById("sizeWarning").classList.remove("hidden");
      return;
    }

    const cart = getCart();
    const existing = cart.find(it => it.id === product.id && it.size === selectedSize);

    if (existing) existing.qty++;
    else cart.push({ id: product.id, qty: 1, size: selectedSize });

    saveCart(cart);
    updateCartCount();
    flyImageToCart(page.querySelector("img"));
  });

  // Add to wishlist
  document.getElementById("wishlistBtn").addEventListener("click", () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.find(it => it.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("✅ Added to Wishlist");
    } else {
      alert("❤️ Already in Wishlist");
    }
  });
}

