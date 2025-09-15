function renderThanksPage() {
  const page = document.getElementById("page");
  const order = JSON.parse(localStorage.getItem(LS_KEYS.ORDER) || "null");

  if (!order) {
    page.innerHTML = `<div class="p-8 text-center">No recent order found.</div>`;
    return;
  }

  page.innerHTML = `
    <div class="max-w-4xl mx-auto py-12 px-4">
      ${renderProgressBar(2)}

      <div class="bg-white shadow-lg rounded-2xl p-8 text-center">
        <!-- Success Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Message -->
        <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Order Confirmed!</h1>
        <p class="text-slate-600 mb-6">
          Thank you for shopping with us. We’ll send updates to 
          <span class="font-semibold text-slate-800">${order.customer.email}</span>.
        </p>

        <!-- Order Summary -->
        <div class="bg-slate-50 rounded-lg p-6 shadow-inner text-left max-w-md mx-auto">
          <h2 class="font-semibold text-lg mb-4">Order Summary</h2>
          <div class="divide-y divide-slate-200">
            ${order.items
              .map(
                (it) => `
              <div class="flex justify-between py-2 text-sm">
                <span>${it.product.title} × ${it.qty}</span>
                <span class="font-medium">${money(it.qty * it.product.price)}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total</span>
            <span>${money(order.total)}</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a href="#/" class="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-md font-medium">
            Continue Shopping
          </a>
          <a href="#/cart" class="bg-slate-200 hover:bg-slate-300 transition text-slate-800 px-6 py-3 rounded-md font-medium">
            View Cart
          </a>
        </div>
      </div>
    </div>
  `;
}

