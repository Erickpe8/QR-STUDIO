export function renderHeader() {
  const header = document.getElementById("app-header");
  if (!header) return;

  header.innerHTML = `
    <header class="h-16 bg-white border-b flex items-center justify-between px-6">
      
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
          QR
        </div>
        <span class="text-lg font-semibold text-slate-800">
          QR Studio
        </span>
      </div>

      <div class="flex items-center gap-3">

        ${iconButton(
          "Portafolio",
          "https://erickpe8.github.io/Erickpe8/",
          "https://cdn-icons-png.flaticon.com/256/7963/7963882.png",
          "bg-slate-100"
        )}

        ${iconButton(
          "GitHub",
          "https://github.com/Erickpe8",
          "https://cdn-icons-png.flaticon.com/512/25/25231.png",
          "bg-slate-900"
        )}

        ${iconButton(
          "Instagram",
          "https://www.instagram.com/erickperez_8/",
          "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
          "bg-slate-100"
        )}

        ${iconButton(
          "YouTube",
          "https://www.youtube.com/@ErickPerez_8",
          "https://cdn-icons-png.flaticon.com/512/174/174883.png",
          "bg-slate-100"
        )}

      </div>
    </header>
  `;
}

function iconButton(label, url, img, bgClass) {
  return `
    <a
      href="${url}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="${label}"
      class="w-10 h-10 rounded-full flex items-center justify-center
             transition hover:scale-110 hover:shadow-md ${bgClass}"
    >
      <img
        src="${img}"
        alt="${label}"
        class="w-6 h-6 object-contain"
      />
    </a>
  `;
}
