import { goToStep } from "./components/StepIndicator.js";
import { renderQrTypeStep } from "./modules/qr-type/QrTypeStep.js";
import { renderQrContentForm } from "./modules/qr-content/QrContentForm.js";
import { renderQrUrlDesigner } from "./modules/qr-url/QrUrlDesigner.js";
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

    renderQrUrlDesigner({
        onBack: () => navigateToStep(2),
        onNext: () => navigateToStep(3),
    });
}
