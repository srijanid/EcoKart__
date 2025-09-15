function renderNotFound() {
  document.getElementById('page').innerHTML = `
     <div class="flex flex-col items-center justify-center text-center py-16">
      <!-- Icon -->
      <div class="text-6xl mb-6 text-red-500">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-slate-800 mb-2">
        404 - Page Not Found
      </h1>

      <!-- Message -->
      <p class="text-slate-600 max-w-md mb-6">
        Oops! The page you’re looking for doesn’t exist or has been moved.  
        Let’s get you back on track.
      </p>

      <!-- CTA -->
      <a href="#/"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow hover:shadow-md transition">
        <i class="fa-solid fa-house"></i>
        Back to Home
      </a>
    </div>
  `;
}
