import { goToStep } from "./components/StepIndicator.js";
import { renderQrTypeStep } from "./modules/qr-type/QrTypeStep.js";
import { renderQrContentForm } from "./modules/qr-content/QrContentForm.js";
import { renderQrDesigner } from "./modules/qr-designer/QrDesigner.js";
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
