import { renderHeader } from "./components/Header.js";
import { renderStepIndicator } from "./components/StepIndicator.js";
import { initAlerts } from "./ui/alerts.js";
import { navigateToStep } from "./navigation.js";

renderHeader();
renderStepIndicator();
initAlerts();

function syncPreviewTop() {
    const mainContent = document.querySelector(".main-content");
    if (!mainContent) return;

    const top = mainContent.getBoundingClientRect().top;
    const value = Math.max(0, Math.round(top + 8));
    document.documentElement.style.setProperty(
        "--preview-top",
        `${value}px`
    );
}

window.syncPreviewTop = syncPreviewTop;
window.addEventListener("resize", syncPreviewTop);

requestAnimationFrame(syncPreviewTop);
setTimeout(syncPreviewTop, 50);

navigateToStep(1);
