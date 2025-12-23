import { renderHeader } from "./components/Header.js";
import { renderStepIndicator } from "./components/StepIndicator.js";
import { navigateToStep } from "./navigation.js";

renderHeader();
renderStepIndicator();

navigateToStep(1);
