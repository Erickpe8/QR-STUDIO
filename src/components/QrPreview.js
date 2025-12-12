export function renderQrPreview() {
    const preview = document.getElementById("qr-preview");

    preview.innerHTML = `
        <div class="bg-white w-80 rounded-xl shadow-lg p-6 flex flex-col items-center">
        <div class="w-56 h-56 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
            Vista previa del QR
        </div>

        <p class="mt-4 text-sm text-slate-500 text-center">
            El código QR aparecerá aquí
        </p>
        </div>
    `;
}
