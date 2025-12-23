import { qrTypes } from "../../config/qrTypes.js";
import { qrState, resetPayload, setSelectedType } from "../../state.js";
import { setPreviewState } from "../../components/QrPreview.js";

const baseButtonClass =
    "w-full flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition min-h-[96px]";
const activeButtonClass = "border-indigo-500 bg-indigo-50 text-indigo-700";
const inactiveButtonClass =
    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

export function renderQrTypeStep({ onNext } = {}) {
    const container = document.getElementById("module-container");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-5 space-y-4">
            <div>
                <h3 class="text-lg font-semibold text-slate-800">
                    Tipo de QR
                </h3>
                <p class="text-sm text-slate-500">
                    Selecciona el tipo de contenido para tu QR
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${qrTypes
                    .map(
                        type => `
                    <button
                        type="button"
                        data-qr-type="${type.id}"
                        class="${baseButtonClass} ${getButtonStateClass(type.id)}"
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200">
                                <i data-lucide="${type.icon}" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="font-semibold">${type.label}</div>
                                <div class="text-sm text-slate-500">
                                    ${type.description}
                                </div>
                            </div>
                        </div>
                    </button>
                `
                    )
                    .join("")}
            </div>

            <div class="flex justify-end">
                <button
                    id="qr-type-next"
                    class="px-6 py-3 bg-indigo-600 text-white rounded-xl
                           hover:bg-indigo-700 transition disabled:opacity-50"
                    aria-label="Continuar al siguiente paso"
                    ${qrState.selectedType ? "" : "disabled"}
                >
                    Continuar
                </button>
            </div>
        </div>
    `;

    const typeButtons = container.querySelectorAll("[data-qr-type]");
    const nextButton = document.getElementById("qr-type-next");

    typeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const nextType = button.dataset.qrType;
            if (!nextType || nextType === qrState.selectedType) return;

            setSelectedType(nextType);
            resetPayload();
            setPreviewState(false);
            updateTypeSelectionUI();
        });
    });

    if (nextButton && onNext) {
        nextButton.addEventListener("click", onNext);
    }

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function updateTypeSelectionUI() {
    const typeButtons = document.querySelectorAll("[data-qr-type]");
    const nextButton = document.getElementById("qr-type-next");

    typeButtons.forEach(button => {
        const isActive = button.dataset.qrType === qrState.selectedType;
        button.className = `${baseButtonClass} ${
            isActive ? activeButtonClass : inactiveButtonClass
        }`;
    });

    if (nextButton) {
        nextButton.disabled = !qrState.selectedType;
    }

}

function getButtonStateClass(typeId) {
    return qrState.selectedType === typeId
        ? activeButtonClass
        : inactiveButtonClass;
}
