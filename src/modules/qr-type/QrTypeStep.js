import { qrTypes } from "../../config/qrTypes.js";
import { qrState, resetPayload, setSelectedType } from "../../state.js";
import { setPreviewState } from "../../components/QrPreview.js";

const baseButtonClass =
    "relative w-full flex items-center gap-3 px-5 py-5 rounded-2xl border text-left transition-all duration-200 ease-out min-h-[108px]";
const activeButtonClass =
    "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm";
const inactiveButtonClass =
    "border-slate-200 bg-white text-slate-700 hover:ring-2 hover:ring-indigo-200 hover:border-slate-300";

export function renderQrTypeStep({ onNext } = {}) {
    const container = document.getElementById("module-container");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-[32px] shadow-lg p-6 space-y-6 w-full max-w-6xl mx-auto">
            <div>
                <h3 class="text-lg font-semibold text-slate-800">
                    Tipo de QR
                </h3>
                <p class="text-sm text-slate-500">
                    Selecciona el tipo de contenido que quieres compartir
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                ${qrTypes
                    .map(
                        type => `
                    <button
                        type="button"
                        data-qr-type="${type.id}"
                        class="${baseButtonClass} ${getButtonStateClass(type.id)}"
                    >
                        <span
                            data-card-check
                            class="absolute top-3 right-3 hidden rounded-full bg-emerald-100 text-emerald-600 p-0.5"
                        >
                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                        </span>

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

        </div>
    `;

    const typeButtons = container.querySelectorAll("[data-qr-type]");

    typeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const nextType = button.dataset.qrType;
            if (!nextType) return;
            const typeChanged = nextType !== qrState.selectedType;

            setSelectedType(nextType);
            updateTypeSelectionUI();

            if (typeChanged) {
                resetPayload();
                setPreviewState(false);
            }
            if (typeof onNext === "function") {
                onNext();
            }
        });
    });

    updateTypeSelectionUI();
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function updateTypeSelectionUI() {
    const typeButtons = document.querySelectorAll("[data-qr-type]");
    const enabled = Boolean(qrState.selectedType);

    typeButtons.forEach(button => {
        const isActive = button.dataset.qrType === qrState.selectedType;
        button.className = `${baseButtonClass} ${
            isActive ? activeButtonClass : inactiveButtonClass
        }`;
        const checkEl = button.querySelector("[data-card-check]");
        if (checkEl) {
            checkEl.classList.toggle("hidden", !isActive);
        }
    });

}

function getButtonStateClass(typeId) {
    return qrState.selectedType === typeId
        ? activeButtonClass
        : inactiveButtonClass;
}

