function renderCheckoutPage() {
  const page = document.getElementById('page');
  const cart = getCart();

  // attach product info and ignore broken entries
  const items = cart
    .map(it => ({ ...it, product: findProduct(it.id) }))
    .filter(it => it.product);

  if (!items.length) {
    page.innerHTML = `<div class="p-8 text-center text-slate-600">Your cart is empty.</div>`;
    return;
  }

  let subtotal = items.reduce((s, it) => s + it.qty * it.product.price, 0);
  let shipping = subtotal >= 500 ? 0 : 50;
  let discount = 0;
  let appliedCoupon = null;

  function renderSummary() {
    const total = subtotal + shipping - discount;
    return `
      <div class="space-y-2">
        <div class="flex justify-between text-sm"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="flex justify-between text-sm"><span>Shipping</span><span>${shipping === 0 ? "Free" : money(shipping)}</span></div>
        ${discount > 0 ? `<div class="flex justify-between text-sm text-green-600"><span>Discount</span><span>- ${money(discount)}</span></div>` : ""}
        <div class="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total</span><span>${money(total)}</span>
        </div>
      </div>
    `;
  }

  page.innerHTML = `
    <div class="max-w-5xl mx-auto py-8">
      
      <!-- Step Indicator -->
       ${renderProgressBar(1)}

      <h1 class="text-3xl font-extrabold mb-8 text-slate-800">Checkout</h1>
      <form id="checkoutForm" class="grid md:grid-cols-2 gap-8">
        
        <!-- Shipping Details -->
        <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 class="text-lg font-semibold text-slate-700 border-b pb-2">Shipping Details</h2>
          <input name="name" placeholder="Full name" required class="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
          <input name="email" type="email" placeholder="Email" required class="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
          <input name="address" placeholder="Address" required class="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
          <input name="city" placeholder="City" required class="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
          <input name="zip" placeholder="ZIP code" required class="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
          
          <!-- Payment Options -->
          <h2 class="text-lg font-semibold text-slate-700 border-b pb-2 mt-4">Payment Options</h2>
          <label class="flex items-center gap-2"><input type="radio" name="payment" value="UPI" required class="accent-green-600"> UPI</label>
          <label class="flex items-center gap-2"><input type="radio" name="payment" value="Card" class="accent-green-600"> Credit/Debit Card</label>
          <label class="flex items-center gap-2"><input type="radio" name="payment" value="COD" class="accent-green-600"> Cash on Delivery</label>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <h2 class="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Order Summary</h2>
          <div class="flex-1 space-y-3 overflow-y-auto max-h-64 pr-2">
            ${items.map(it => `
              <div class="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-lg">
                <span class="text-slate-700">${it.product.title} (${it.size || "Free Size"}) × ${it.qty}</span>
                <span class="font-semibold text-slate-800">${money(it.qty * it.product.price)}</span>
              </div>
            `).join("")}
          </div>
          
          <!-- Coupon -->
          <div class="mt-4 flex gap-2">
            <input id="couponInput" type="text" placeholder="Coupon code" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none" />
            <button type="button" id="applyCouponBtn" class="px-4 py-2 bg-slate-200 rounded-lg text-sm hover:bg-slate-300 transition">Apply</button>
          </div>

          <!-- Totals -->
          <div id="summaryBox" class="mt-6">${renderSummary()}</div>
          
          <button class="mt-6 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 transition text-white px-6 py-3 rounded-xl w-full shadow-md font-semibold">
            Place Order
          </button>
        </div>
      </form>
    </div>
  `;

  // coupon logic
  page.querySelector("#applyCouponBtn").addEventListener("click", () => {
    const code = page.querySelector("#couponInput").value.trim().toUpperCase();
    if (code === "ECO10" && !appliedCoupon) {
      discount = Math.round(subtotal * 0.1);
      appliedCoupon = "ECO10";
      page.querySelector("#summaryBox").innerHTML = renderSummary();
      alert("Coupon applied! 10% off.");
    } else if (appliedCoupon) {
      alert("Coupon already applied.");
    } else {
      alert("Invalid coupon code.");
    }
  });

  // submit handler
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const total = subtotal + shipping - discount;

    // Save order
    localStorage.setItem(
      LS_KEYS.ORDER,
      JSON.stringify({ items, subtotal, shipping, discount, total, customer: data })
    );

    saveCart([]); // clear cart
    updateCartCount();
    location.hash = "#/thanks";
  });
}


