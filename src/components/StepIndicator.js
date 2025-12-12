export function renderStepIndicator() {
    const container = document.getElementById("step-indicator");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-8">
        <div class="relative">

            <div class="absolute top-6 left-1/6 right-1/6 h-1 bg-slate-200 rounded"></div>

            <ol class="grid grid-cols-3 gap-0 text-center relative z-10">

            <li class="step flex flex-col items-center" data-step="1">
                <span class="step-circle">
                <i data-lucide="link" class="step-icon"></i>
                </span>
                <span class="step-label">Tipo de QR</span>
            </li>

            <li class="step flex flex-col items-center" data-step="2">
                <span class="step-circle">
                <i data-lucide="file-text" class="step-icon"></i>
                </span>
                <span class="step-label">Contenido</span>
            </li>

            <li class="step flex flex-col items-center" data-step="3">
                <span class="step-circle">
                <i data-lucide="palette" class="step-icon"></i>
                </span>
                <span class="step-label">Diseño</span>
            </li>

            </ol>
        </div>
        </div>
    `;
}
export function goToStep(step) {
    const steps = document.querySelectorAll(".step");
    if (!steps.length) return;

    steps.forEach(el => {
        const current = Number(el.dataset.step);

        el.classList.toggle("is-active", current === step);
        el.classList.toggle("is-complete", current < step);

        const icon = el.querySelector("i");
        if (current < step) {
        icon.setAttribute("data-lucide", "check");
        }
    });

    lucide.createIcons();
}
