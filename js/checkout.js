function renderCheckoutPage() {
  const page = document.getElementById("page");
  const cart = getCart();

  const items = cart
    .map((it) => ({ ...it, product: findProduct(it.id) }))
    .filter((it) => it.product);

  if (!items.length) {
    page.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div class="w-24 h-24 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-6 shadow-sm">
          <i class="fa-solid fa-cart-shopping text-5xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p class="text-slate-500 mb-6 max-w-md">
          Looks like you haven’t added any products yet. Start exploring our eco-friendly products.
        </p>
        <a href="#/" class="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:from-green-600 hover:to-cyan-600 transition">
          Browse Products
        </a>
      </div>
    `;
    return;
  }

  let subtotal = items.reduce((s, it) => s + it.qty * it.product.price, 0);
  let shipping = subtotal >= 2000 ? 0 : 50;
  let discount = 0;
  let appliedCoupon = null;

  function renderSummary() {
    const total = subtotal + shipping - discount;
    return `
      <div class="space-y-2">
        <div class="flex justify-between text-sm"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="flex justify-between text-sm"><span>Shipping</span><span>${shipping === 0 ? "Free" : money(shipping)}</span></div>
        ${
          discount > 0
            ? `<div class="flex justify-between text-sm text-green-600"><span>Discount</span><span>- ${money(discount)}</span></div>`
            : ""
        }
        <div class="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total</span><span>${money(total)}</span>
        </div>
      </div>
    `;
  }

  page.innerHTML = `
    <div class="max-w-6xl mx-auto py-8 px-4">
      ${renderProgressBar(1)}
      <h1 class="text-3xl font-extrabold mb-8 text-slate-800">Checkout</h1>

      <form id="checkoutForm" class="grid lg:grid-cols-3 gap-8">

        <!-- Shipping & Payment (2/3 width) -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Shipping Details -->
          <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 class="text-lg font-semibold text-slate-700 border-b pb-2">Shipping Details</h2>

            <div>
              <input name="name" placeholder="Full name" required class="field w-full border rounded-lg px-4 py-3 text-sm" />
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
            <div>
              <input name="email" type="email" placeholder="Email" required class="field w-full border rounded-lg px-4 py-3 text-sm" />
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
            <div>
              <input name="phone" type="tel" placeholder="Phone (10 digits)" required class="field w-full border rounded-lg px-4 py-3 text-sm" />
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
            <div>
              <input name="city" placeholder="City" required class="field w-full border rounded-lg px-4 py-3 text-sm" />
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
            <div>
              <input name="address1" placeholder="Address Line 1" required class="field w-full border rounded-lg px-4 py-3 text-sm" />
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
            <div>
              <input name="address2" placeholder="Address Line 2 (Optional)" class="field w-full border rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <input name="zip" placeholder="ZIP code" required class="field w-full border rounded-lg px-4 py-3 text-sm" />
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
            <div>
              <select id="stateSelect" name="state" required class="field w-full border rounded-lg px-4 py-3 text-sm">
                <option value="">Select State</option>
              </select>
              <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
            </div>
          </div>

          <!-- Payment Options -->
          <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 class="text-lg font-semibold text-slate-700 border-b pb-2">Payment Options</h2>
            <div class="space-y-3">

              <!-- UPI -->
              <label class="flex items-center justify-between border rounded-xl p-3 cursor-pointer hover:shadow-md">
                <div class="flex items-center gap-3">
                  <input type="radio" name="payment" value="UPI" required class="accent-green-600">
                  <span class="font-medium text-slate-700">UPI</span>
                </div>
                <div class="flex gap-2">
                  <img src="/assets/gpay.png" class="h-8 p-1">
                  <img src="/assets/phonpe.png" class="h-8 p-1">
                  <img src="/assets/paytm.png" class="h-8">
                </div>
                <div id="upiDetails" class="hidden mt-2">
                  <input type="text" name="upi" placeholder="yourname@upi" class="field w-full border rounded-lg px-3 py-2 text-sm" />
                  <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
                </div>
              </label>

              <!-- Card -->
              <label class="flex flex-col border rounded-xl p-3 cursor-pointer hover:shadow-md">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <input type="radio" name="payment" value="Card" class="accent-green-600">
                    <span class="font-medium text-slate-700">Credit / Debit Card</span>
                  </div>
                  <div class="flex gap-2">
                    <img src="/assets/visa.png" class="h-8">
                    <img src="/assets/master.png" class="h-8">
                  </div>
                </div>
                <div id="cardDetails" class="hidden space-y-2 mt-2">
                  <div>
                    <input type="tel" inputmode="numeric" name="cardNumber" placeholder="xxxx xxxx xxxx xxxx" maxlength="19" class="field w-full border rounded-lg px-3 py-2 text-sm" />
                    <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
                  </div>
                  <div class="flex gap-2">
                    <div class="flex-1">
                      <input type="text" name="expiry" placeholder="MM/YY" maxlength="5" class="field w-full border rounded-lg px-3 py-2 text-sm" />
                      <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
                    </div>
                    <div class="flex-1">
                      <input type="text" name="cvv" placeholder="CVV" maxlength="4" class="field w-full border rounded-lg px-3 py-2 text-sm" />
                      <p class="error-msg text-red-500 text-xs mt-1 hidden"></p>
                    </div>
                  </div>
                </div>
              </label>

              <!-- COD -->
              <label class="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:shadow-md">
                <input type="radio" name="payment" value="COD" class="accent-green-600">
                <span class="font-medium text-slate-700">Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col self-start">
          <h2 class="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Order Summary</h2>
          <div class="flex-1 space-y-3 overflow-y-auto max-h-64 pr-2">
            ${items
              .map(
                (it) => `
              <div class="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-lg">
                <span class="text-slate-700">${it.product.title} (${it.size || "Free Size"}) × ${it.qty}</span>
                <span class="font-semibold text-slate-800">${money(
                  it.qty * it.product.price
                )}</span>
              </div>`
              )
              .join("")}
          </div>

          <!-- Coupon -->
          <div class="mt-4 flex gap-2">
            <input id="couponInput" type="text" placeholder="Coupon code" class="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button type="button" id="applyCouponBtn" class="px-4 py-2 bg-slate-200 rounded-lg text-sm hover:bg-slate-300">Apply</button>
          </div>

          <div id="summaryBox" class="mt-6">${renderSummary()}</div>
          <button class="mt-6 bg-gradient-to-r from-green-500 to-cyan-500 text-white px-6 py-3 rounded-xl w-full shadow-md font-semibold hover:from-green-600 hover:to-cyan-600">
            Place Order
          </button>
        </div>
      </form>
    </div>
  `;

  const states = [
  // States
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",

  // Union Territories
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Ladakh","Lakshadweep","Puducherry","Jammu and Kashmir"
];

// Populate state dropdown
const stateSelect = document.getElementById("stateSelect");
states.forEach(state => {
  const opt = document.createElement("option");
  opt.value = state;
  opt.textContent = state;
  stateSelect.appendChild(opt);
});
// check if state was previously selected
  page.querySelectorAll("input[name=payment]").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const cardBox = document.getElementById("cardDetails");
    const upiBox = document.getElementById("upiDetails");
    cardBox.classList.toggle("hidden", e.target.value !== "Card");
    upiBox.classList.toggle("hidden", e.target.value !== "UPI");
  });
});


  // Coupon logic
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

  // Toggle card fields visibility
  page.querySelectorAll("input[name=payment]").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const cardBox = document.getElementById("cardDetails");
      cardBox.classList.toggle("hidden", e.target.value !== "Card");
    });
  });

  // Inline validation
  function setError(input, msg) {
    const errorEl = input.parentElement.querySelector(".error-msg");
    if (msg) {
      errorEl.textContent = msg;
      errorEl.classList.remove("hidden");
      input.classList.add("border-red-500");
    } else {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
      input.classList.remove("border-red-500");
    }
  }

  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;

// Validate fields
const name = form.querySelector("input[name=name]");
if (!/^[a-zA-Z ]{3,}$/.test(data.name)) {
  setError(name, "Enter a valid full name.");
  valid = false;
} else setError(name, "");

const email = form.querySelector("input[name=email]");
if (!/^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
  setError(email, "Enter a valid email address.");
  valid = false;
} else setError(email, "");

const phone = form.querySelector("input[name=phone]");
if (!/^\d{10}$/.test(data.phone)) {
  setError(phone, "Enter a valid 10-digit phone number.");
  valid = false;
} else setError(phone, "");

const zip = form.querySelector("input[name=zip]");
if (!/^\d{6}$/.test(data.zip)) {
  setError(zip, "Enter a valid 6-digit PIN code.");
  valid = false;
} else {
  setError(zip, "");
}

// Validate payment method
if (data.payment === "Card") {
  const cardNumber = form.querySelector("input[name=cardNumber]");
  if (!/^\d{16}$/.test((data.cardNumber || "").replace(/\s+/g, ""))) {
    setError(cardNumber, "Enter a valid 16-digit card number.");
    valid = false;
  } else {
    setError(cardNumber, "");
  }

  const expiry = form.querySelector("input[name=expiry]");
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry || "")) {
    setError(expiry, "Enter expiry in MM/YY format.");
    valid = false;
  } else {
    setError(expiry, "");
  }

  const cvv = form.querySelector("input[name=cvv]");
  if (!/^\d{3}$/.test(data.cvv || "")) {
    setError(cvv, "Enter a valid 3-digit CVV.");
    valid = false;
  } else {
    setError(cvv, "");
  }
} else if (data.payment === "UPI") {
  const upi = form.querySelector("input[name=upi]");
  if (!/^[\w.-]+@[\w.-]+$/.test(data.upi || "")) {
    setError(upi, "Enter a valid UPI ID (example: name@upi).");
    valid = false;
  } else {
    setError(upi, "");
  }
} else if (data.payment === "COD") {
  // no extra validation
}


    if (!valid) return;

    // Save order
    const total = subtotal + shipping - discount;
    localStorage.setItem(
      LS_KEYS.ORDER,
      JSON.stringify({ items, subtotal, shipping, discount, total, customer: data })
    );
    saveCart([]);
    updateCartCount();
    location.hash = "#/thanks";
  });
}
