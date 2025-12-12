import { initQR, downloadQR } from "../core/qrEngine.js";

export function renderQrPreview() {
    const container = document.getElementById("qr-preview");
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-col items-center w-full gap-5">

            <div class="w-full max-w-[580px]">
                <div class="relative mx-auto bg-white border border-slate-200 border-[8px] rounded-t-2xl h-[220px] md:h-[300px] max-w-[520px] shadow-2xl">
                    <div class="relative rounded-xl overflow-hidden h-full w-full bg-slate-900 flex items-center justify-center">

                        <div
                            id="qr-placeholder"
                            class="absolute inset-0 flex items-center justify-center text-slate-300 text-sm text-center px-6 transition-opacity duration-200"
                        >
                            El codigo QR aparecera aqui
                        </div>

                        <div
                            id="qr-canvas"
                            class="hidden flex items-center justify-center transition-opacity duration-200"
                            style="width: 220px; height: 220px;"
                        ></div>

                    </div>
                </div>
                <div class="relative mx-auto bg-white border border-slate-200 rounded-b-2xl rounded-t-sm h-[18px] max-w-[560px] shadow">
                    <div class="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[64px] h-[6px] md:w-[96px] md:h-[8px] bg-slate-200"></div>
                </div>
            </div>

            <button
                id="qr-download-btn"
                class="px-5 py-3 bg-indigo-600 text-white rounded-xl
                        hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
            >
                Descargar QR
            </button>
        </div>
    `;

    initQR();

    const downloadBtn = document.getElementById("qr-download-btn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => downloadQR("qr-studio.png"));
    }
}

export function setPreviewState(hasData) {
    const placeholder = document.getElementById("qr-placeholder");
    const canvas = document.getElementById("qr-canvas");
    const downloadBtn = document.getElementById("qr-download-btn");

    if (!placeholder || !canvas || !downloadBtn) return;

    if (hasData) {
        placeholder.classList.add("opacity-0");
        placeholder.classList.add("pointer-events-none");

        canvas.classList.remove("hidden");
        canvas.classList.add("opacity-100");

        downloadBtn.disabled = false;
    } else {
        placeholder.classList.remove("opacity-0");
        placeholder.classList.remove("pointer-events-none");

        canvas.classList.add("hidden");

        downloadBtn.disabled = true;
    }
}
