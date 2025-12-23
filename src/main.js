import { renderHeader } from "./components/Header.js";
import { renderStepIndicator } from "./components/StepIndicator.js";
import { initAlerts } from "./ui/alerts.js";
import { navigateToStep } from "./navigation.js";

renderHeader();
renderStepIndicator();
initAlerts();

navigateToStep(1);
