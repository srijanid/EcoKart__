let PRODUCTS = [];
const LS_KEYS = { CART: 'ecokart_cart', ORDER: 'ecokart_last_order',WISHLIST:'ecokart_wishlist' };

async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    PRODUCTS = await res.json();
  } catch (e) {
    console.error('Failed to load products.json', e);
    PRODUCTS = [];
  }
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function money(n) {
  return '₹' + Number(n).toFixed(0);
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.CART) || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
}

function updateCartCount() {
  const c = getCart().reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = c;
}

function flyImageToCart(img) {
  if (!img) return;
  const clone = img.cloneNode(true);
  const rect = img.getBoundingClientRect();
  clone.style.position = 'fixed';
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.classList.add('fly-to-cart');
  document.body.appendChild(clone);

  const cartBtn = document.getElementById('cartBtn');
  const rect2 = cartBtn.getBoundingClientRect();
  setTimeout(() => {
    clone.style.transform = `translate(${rect2.left - rect.left}px, ${rect2.top - rect.top}px) scale(.1)`;
    clone.style.opacity = '0.4';
  }, 20);
  setTimeout(() => clone.remove(), 700);
}

function renderProgressBar(activeStep) {
  const steps = ["Cart", "Checkout", "Thanks"];
  return `
    <div class="flex justify-center items-center mb-10">
      ${steps.map((step, i) => {
        const isActive = i === activeStep;
        return `
          <div class="flex items-center">
            <div class="w-8 h-8 flex items-center justify-center rounded-full ${
              isActive ? "bg-green-600 text-white" : "bg-slate-200 text-slate-600"
            } font-bold text-sm">${i + 1}</div>
            <div class="ml-2 mr-4 font-medium ${
              isActive ? "text-green-600" : "text-slate-500"
            }">${step}</div>
            ${i < steps.length - 1 ? `<div class="w-10 h-0.5 bg-slate-300 mx-2"></div>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// render stars dynamically
function renderStars(rating, max = 5) {
  let stars = "";
  for (let i = 1; i <= max; i++) {
    if (rating >= i) {
      stars += `<i class="fa-solid fa-star text-yellow-400"></i>`; // full star
    } else if (rating >= i - 0.5) {
      stars += `<i class="fa-solid fa-star-half-stroke text-yellow-400"></i>`; // half star
    } else {
      stars += `<i class="fa-regular fa-star text-yellow-400"></i>`; // empty star
    }
  }
  return stars;
}

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.WISHLIST) || '[]'); }
  catch { return []; }
}

function saveWishlist(wishlist) {
  localStorage.setItem(LS_KEYS.WISHLIST, JSON.stringify(wishlist));
}

function updateWishlistCount() {
  const count = getWishlist().length; // just number of products
  const el = document.getElementById("wishlistCount");
  if (el) el.textContent = count;
}

function toggleWishlist(product) {
  let wishlist = getWishlist();
  if (isInWishlist(product.id)) {
    wishlist = wishlist.filter(p => p.id !== product.id);
  } else {
    wishlist.push({ id: product.id, title: product.title, price: product.price, img: product.img });
  }
  saveWishlist(wishlist);
  updateWishlistCount(); // refresh badge immediately
}


function isInWishlist(id) {
  return getWishlist().some(p => p.id === id);
}
