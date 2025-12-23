import { qrTypes } from "../config/qrTypes.js";
import { qrState, resetPayload, setSelectedType } from "../state.js";
import { setPreviewState } from "./QrPreview.js";
import { renderActiveStep } from "../navigation.js";

const baseButtonClass =
    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition";
const activeButtonClass = "bg-indigo-50 text-indigo-700";
const inactiveButtonClass =
    "bg-white text-slate-700 hover:bg-slate-50";

export function renderSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;

    // Ajusta el contenedor para que no reserve espacio extra en mobile
    sidebar.className = "relative md:w-72 w-0 flex-shrink-0";

    sidebar.innerHTML = `
        <div
            id="sidebar-overlay"
            class="fixed inset-0 bg-black/40 z-40 hidden md:hidden"
        ></div>

        <div
            id="sidebar-panel"
            class="
                absolute md:static inset-y-0 left-0
                z-50 md:z-auto
                w-72 h-full bg-white
                border-r border-slate-200
                transform -translate-x-full md:translate-x-0
                transition-transform duration-300 ease-in-out
                shadow-lg md:shadow-none
            "
        >
            <nav class="h-full p-6 space-y-4">
                <h2 class="text-xs font-semibold text-slate-500 uppercase">
                    Tipos de QR
                </h2>

                ${qrTypes
                    .map(
                        type => `
                    <button
                        type="button"
                        data-qr-type="${type.id}"
                        class="${baseButtonClass} ${getButtonStateClass(type.id)}"
                    >
                        <i data-lucide="${type.icon}" class="w-5 h-5"></i>
                        <span>${type.label}</span>
                    </button>
                `
                    )
                    .join("")}
            </nav>
        </div>
    `;

    const overlay = document.getElementById("sidebar-overlay");
    const panel = document.getElementById("sidebar-panel");

    const closeSidebar = () => {
        panel.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
    };

    overlay.addEventListener("click", closeSidebar);

    const typeButtons = sidebar.querySelectorAll("[data-qr-type]");

    typeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const nextType = button.dataset.qrType;
            if (!nextType || nextType === qrState.selectedType) return;

            setSelectedType(nextType);
            resetPayload();
            setPreviewState(false);
            updateSidebarSelection();
            renderActiveStep();
        });
    });

    window.toggleSidebar = () => {
        const isOpen = !panel.classList.contains("-translate-x-full");

        if (isOpen) {
            closeSidebar();
        } else {
            panel.classList.remove("-translate-x-full");
            overlay.classList.remove("hidden");
        }
    };

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function getButtonStateClass(typeId) {
    return qrState.selectedType === typeId
        ? activeButtonClass
        : inactiveButtonClass;
}

export function updateSidebarSelection() {
    const buttons = document.querySelectorAll("[data-qr-type]");

    buttons.forEach(button => {
        const isActive = button.dataset.qrType === qrState.selectedType;
        button.className = `${baseButtonClass} ${
            isActive ? activeButtonClass : inactiveButtonClass
        }`;
    });
}
