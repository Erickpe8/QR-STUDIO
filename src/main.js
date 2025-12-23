import { renderHeader } from "./components/Header.js";
import { renderSidebar } from "./components/Sidebar.js";
import { renderStepIndicator } from "./components/StepIndicator.js";
import { renderQrPreview } from "./components/QrPreview.js";
import { navigateToStep } from "./navigation.js";

renderHeader();
renderSidebar();
renderStepIndicator();
renderQrPreview();

navigateToStep(1);
