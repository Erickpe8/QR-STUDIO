import { initQR, downloadQR, updateQR } from "../core/qrEngine.js";

let qrCanvasEl = null;

export function renderQrPreview() {
    const container = document.getElementById("qr-preview");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 w-full max-w-[360px] xl:w-[360px] shrink-0">
            <div class="text-sm font-semibold text-slate-700 mb-4">
                Vista previa
            </div>

            <!-- CONTENEDOR FIJO -->
            <div class="flex items-center justify-center bg-slate-100 rounded-xl w-full h-[260px]">
                <div
                    class="relative flex items-center justify-center"
                    style="width:220px; height:220px;"
                >
                    <div
                        id="qr-placeholder"
                        class="absolute inset-0 flex items-center justify-center
                               text-slate-400 text-sm text-center px-4"
                        aria-live="polite"
                    >
                        El codigo QR aparecera aqui
                    </div>

                    <!-- AQUÍ SE MONTA EL QR -->
                    <div
                        id="qr-canvas"
                        class="absolute inset-0 flex items-center justify-center"
                        role="img"
                        aria-label="Vista previa del codigo QR"
                    ></div>
                </div>
            </div>

            <button
                id="qr-download-btn"
                class="mt-5 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl
                       hover:bg-indigo-700 transition disabled:opacity-50"
                aria-label="Descargar codigo QR"
                disabled
            >
                Descargar QR
            </button>
        </div>
    `;

    qrCanvasEl = document.getElementById("qr-canvas");

    initQR(qrCanvasEl);

    document
        .getElementById("qr-download-btn")
        .addEventListener("click", () => downloadQR("qr-studio.png"));

    setPreviewState(false);
}

export function setPreviewState(hasData) {
    const placeholder = document.getElementById("qr-placeholder");
    const downloadBtn = document.getElementById("qr-download-btn");
    const qrCanvas = document.getElementById("qr-canvas");

    if (!placeholder || !downloadBtn || !qrCanvas) return;

    placeholder.style.opacity = hasData ? "0" : "1";
    placeholder.style.pointerEvents = hasData ? "none" : "auto";
    qrCanvas.style.opacity = hasData ? "1" : "0";

    downloadBtn.disabled = !hasData;
}

export function getQrCanvas() {
    return qrCanvasEl;
}

export function updateQrPreview(data, fgColor, bgColor) {
    if (!data) return;
    updateQR(data, fgColor, bgColor);
}
