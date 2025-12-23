import { renderHeader } from "./components/Header.js";
import { renderStepIndicator } from "./components/StepIndicator.js";
import { renderQrPreview } from "./components/QrPreview.js";
import { navigateToStep } from "./navigation.js";

renderHeader();
renderStepIndicator();
renderQrPreview();

navigateToStep(1);
