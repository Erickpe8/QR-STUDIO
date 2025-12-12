import { qrState } from "../../state.js";
import { goToStep } from "../../components/StepIndicator.js";
import { updateQrPreview } from "../../components/QrPreview.js";

export function renderQrUrlDesigner() {
    const container = document.getElementById("module-container");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
            <h3 class="text-lg font-semibold text-slate-800">Personaliza el QR</h3>
            <p class="text-sm text-slate-500">Cambia colores y mira el resultado en vivo</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Color del QR</label>
            <input id="qr-fg" type="color" class="w-full h-12 rounded-xl border border-slate-200" value="${qrState.fgColor}">
            </div>

            <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Color de fondo</label>
            <input id="qr-bg" type="color" class="w-full h-12 rounded-xl border border-slate-200" value="${qrState.bgColor}">
            </div>
        </div>

        <div class="flex justify-between">
            <button id="back-to-content"
            class="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
            Volver
            </button>

            <button id="next-to-design"
            class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Siguiente
            </button>
        </div>
        </div>
    `;

    const fg = document.getElementById("qr-fg");
    const bg = document.getElementById("qr-bg");

    fg.addEventListener("input", () => {
        qrState.fgColor = fg.value;
        updateQrPreview(qrState.text, qrState.fgColor, qrState.bgColor);
    });

    bg.addEventListener("input", () => {
        qrState.bgColor = bg.value;
        updateQrPreview(qrState.text, qrState.fgColor, qrState.bgColor);
    });

    document.getElementById("back-to-content").addEventListener("click", () => {
        goToStep(1);
    });

    document.getElementById("next-to-design").addEventListener("click", () => {
        goToStep(3);
    });
}
