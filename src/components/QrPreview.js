import { initQR } from "../core/qrEngine.js";

export function renderQrPreview() {
    const container = document.getElementById("qr-preview");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 w-full max-w-sm">
        
        <div
            id="qr-placeholder"
            class="h-[260px] flex items-center justify-center
                text-slate-400 text-sm border-2 border-dashed rounded-xl"
        >
            El código QR aparecerá aquí
        </div>

        <div
            id="qr-canvas"
            class="hidden flex justify-center"
        ></div>

        </div>
    `;

    initQR(document.getElementById("qr-canvas"));
}
