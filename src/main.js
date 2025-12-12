import { renderHeader } from "./components/Header.js";
import { renderSidebar } from "./components/Sidebar.js";
import { renderStepIndicator, goToStep } from "./components/StepIndicator.js";
import { renderQrPreview } from "./components/QrPreview.js";
import { renderQrUrlForm } from "./modules/qr-url/QrUrlForm.js";

renderHeader();
renderSidebar();
renderStepIndicator();
renderQrPreview();
renderQrUrlForm();

goToStep(1);
