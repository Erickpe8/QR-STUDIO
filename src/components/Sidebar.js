export function renderSidebar() {
    const sidebar = document.getElementById("app-sidebar");

    sidebar.innerHTML = `
        <nav class="h-full p-6 space-y-4">
        <h2 class="text-xs font-semibold text-slate-500 uppercase">
            Tipos de QR
        </h2>

        <!-- URL -->
        <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                bg-indigo-50 text-indigo-700 font-medium
                hover:bg-indigo-100 transition">
            <i data-lucide="link" class="w-5 h-5"></i>
            <span>URL / Enlace</span>
        </button>   
    `;
}
