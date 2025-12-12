export function renderSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;

    sidebar.innerHTML = `
        <div
            id="sidebar-overlay"
            class="fixed inset-0 bg-black/40 z-40 hidden md:hidden"
        ></div>

        <aside
            id="sidebar-panel"
            class="
                fixed md:static
                inset-y-0 left-0
                z-50 md:z-auto
                w-64
                h-full
                bg-white
                border-r border-slate-200
                transform -translate-x-full md:translate-x-0
                transition-transform duration-300 ease-in-out
            "
        >
            <nav class="h-full p-6 space-y-4">
                <h2 class="text-xs font-semibold text-slate-500 uppercase">
                    Tipos de QR
                </h2>

                <button
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-indigo-50 text-indigo-700 font-medium
                           hover:bg-indigo-100 transition"
                >
                    <i data-lucide="link" class="w-5 h-5"></i>
                    <span>URL / Enlace</span>
                </button>
            </nav>
        </aside>
    `;

    const overlay = document.getElementById("sidebar-overlay");
    const panel = document.getElementById("sidebar-panel");

    const closeSidebar = () => {
        panel.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
    };

    overlay.addEventListener("click", closeSidebar);

    window.toggleSidebar = () => {
        const isOpen = !panel.classList.contains("-translate-x-full");

        if (isOpen) {
            closeSidebar();
        } else {
            panel.classList.remove("-translate-x-full");
            overlay.classList.remove("hidden");
        }
    };
}
