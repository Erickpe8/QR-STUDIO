export function renderHeader() {
    const header = document.getElementById("app-header");

    header.innerHTML = `
        <div class="h-16 bg-white border-b flex items-center justify-between px-6">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            QR
            </div>
            <span class="font-semibold text-lg text-slate-800">
            QR Studio
            </span>
        </div>

        <div class="text-sm text-slate-500">
            Generador modular de códigos QR
        </div>
        </div>
    `;
}
