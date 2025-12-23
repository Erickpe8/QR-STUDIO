import { goToStep } from "./components/StepIndicator.js";
import { renderQrTypeStep } from "./modules/qr-type/QrTypeStep.js";
import { renderQrContentForm } from "./modules/qr-content/QrContentForm.js";
import { renderQrDesigner } from "./modules/qr-designer/QrDesigner.js";
import { renderQrPreview } from "./components/QrPreview.js";
import { qrState, setStep } from "./state.js";

export function navigateToStep(step) {
    setStep(step);
    goToStep(step);
    renderStep(step);
}

export function renderActiveStep() {
    renderStep(qrState.step);
}

function renderStep(step) {
    renderLayoutForStep(step);

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

function renderLayoutForStep(step) {
    const layoutRoot = document.getElementById("layout-root");
    if (!layoutRoot) return;

    if (step === 1) {
        layoutRoot.innerHTML = `
            <div class="w-full">
                <div id="module-container"></div>
            </div>
        `;
        window.syncPreviewTop?.();
        return;
    }

    layoutRoot.innerHTML = `
        <div class="main-content grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <section
                id="options-column"
                class="options-column min-w-0 lg:col-span-2 lg:overflow-y-auto lg:pr-3 lg:pb-24"
            >
                <div
                    class="options-panel bg-white rounded-2xl shadow-sm p-6 h-full space-y-6"
                >
                    <div id="module-container"></div>
                </div>
            </section>
            <aside
                id="preview-column"
                class="preview-column min-w-0 lg:col-span-1 lg:sticky lg:block lg:z-10"
            >
                <div class="preview-panel bg-white rounded-2xl shadow-sm p-6">
                    <div
                        class="preview-frame flex items-center justify-center"
                    >
                        <div id="qr-preview"></div>
                    </div>
                </div>
            </aside>
        </div>
    `;

    renderQrPreview();
    window.syncPreviewTop?.();
}
