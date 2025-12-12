import { goToStep } from "../../components/StepIndicator.js";
import { updateQR } from "../../core/qrEngine.js";
import { setPreviewState } from "../../components/QrPreview.js";

export function renderQrUrlForm() {
    const container = document.getElementById("module-container");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 space-y-6">

        <div>
            <h3 class="text-lg font-semibold text-slate-800">
            Ingresa el enlace
            </h3>
            <p class="text-sm text-slate-500">
            El codigo QR redirigira a esta URL
            </p>
        </div>

        <div class="space-y-2">
            <input
            id="qr-url-input"
            type="url"
            placeholder="https://ejemplo.com"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p id="qr-url-error" class="text-sm text-red-500 hidden">
            Ingresa una URL valida
            </p>
        </div>

        <div class="flex justify-end">
            <button
            id="qr-url-next"
            class="px-6 py-3 bg-indigo-600 text-white rounded-xl
                    hover:bg-indigo-700 transition disabled:opacity-50"
            disabled
            >
            Continuar
            </button>
        </div>

        </div>
    `;

    const input = document.getElementById("qr-url-input");
    const button = document.getElementById("qr-url-next");
    const error = document.getElementById("qr-url-error");
    const canvas = document.getElementById("qr-canvas");

    const sanitizeUrl = (value) => {
        if (!value) return "";
        const hasProtocol = /^https?:\/\//i.test(value);
        return hasProtocol ? value : `https://${value}`;
    };

    input.addEventListener("input", () => {
        const rawValue = input.value.trim();
        const value = sanitizeUrl(rawValue);

        try {
            const validUrl = new URL(value);

            error.classList.add("hidden");
            button.disabled = false;

            setPreviewState(true);
            updateQR(validUrl.toString(), canvas);
        } catch {
            error.classList.remove("hidden");
            button.disabled = true;

            setPreviewState(false);
        }
    });

    button.addEventListener("click", () => {
        goToStep(2);
    });
}
