import { goToStep } from "./components/StepIndicator.js";
import { renderQrTypeStep } from "./modules/qr-type/QrTypeStep.js";
import { renderQrContentForm } from "./modules/qr-content/QrContentForm.js";
import { renderQrDesigner } from "./modules/qr-designer/QrDesigner.js";
import { renderQrPreview } from "./components/QrPreview.js";
import { qrState, setStep } from "./state.js";

let previewRendered = false;

export function navigateToStep(step) {
    setStep(step);
    goToStep(step);
    updateLayoutForStep(step);
    renderStep(step);
}

export function renderActiveStep() {
    renderStep(qrState.step);
}

function renderStep(step) {
    if (step === 1) {
        renderQrTypeStep({
            onNext: () => navigateToStep(2),
        });
        return;
    }

    if (step === 2) {
        renderQrContentForm({
            onBack: () => navigateToStep(1),
            onNext: () => navigateToStep(3),
        });
        return;
    }

    renderQrDesigner({
        onBack: () => navigateToStep(2),
        onNext: () => navigateToStep(3),
    });
}

function updateLayoutForStep(step) {
    const mainContent = document.querySelector(".main-content");
    const optionsColumn = document.getElementById("options-column");
    const previewColumn = document.getElementById("preview-column");
    const optionsPanel = document.getElementById("options-panel");
    const previewRoot = document.getElementById("qr-preview");

    if (!mainContent || !optionsColumn || !previewColumn || !optionsPanel) return;

    if (step >= 2) {
        mainContent.className =
            "main-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-start";
        optionsColumn.className = "lg:col-span-7 min-w-0";
        optionsPanel.className = "options-panel h-full overflow-y-auto pr-2";
        previewColumn.className = "lg:col-span-5 min-w-0";
        previewColumn.classList.remove("hidden");

        if (!previewRendered) {
            renderQrPreview();
            previewRendered = true;
        }
        return;
    }

    mainContent.className = "main-content";
    optionsColumn.className = "min-w-0";
    optionsPanel.className = "options-panel h-full";
    previewColumn.className = "hidden";
    if (previewRoot) {
        previewRoot.innerHTML = "";
    }
    previewRendered = false;
}
