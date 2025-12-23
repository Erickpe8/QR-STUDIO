export function renderStepIndicator() {
    const container = document.getElementById("step-indicator");
    if (!container) return;

    container.innerHTML = `
        <div class="w-full">
            <ol class="grid grid-cols-3 items-center text-center gap-5 md:gap-6">
                <li class="step flex flex-col items-center gap-3" data-step="1">
                    <span class="step-circle">
                        <i data-lucide="link" class="step-icon"></i>
                    </span>
                    <span class="step-label">Tipo</span>
                </li>

                <li class="step flex flex-col items-center gap-3" data-step="2">
                    <span class="step-circle">
                        <i data-lucide="file-text" class="step-icon"></i>
                    </span>
                    <span class="step-label">Contenido</span>
                </li>

                <li class="step flex flex-col items-center gap-3" data-step="3">
                    <span class="step-circle">
                        <i data-lucide="palette" class="step-icon"></i>
                    </span>
                    <span class="step-label">Diseño</span>
                </li>
            </ol>

            <div class="h-1 bg-slate-100 rounded-full mt-5">
                <div class="h-1 bg-indigo-600 rounded-full step-progress"></div>
            </div>
        </div>
    `;
}

export function goToStep(step) {
    const steps = document.querySelectorAll(".step");
    if (!steps.length) return;

    steps.forEach(el => {
        const current = Number(el.dataset.step);
        const isActive = current === step;
        const isComplete = current < step;

        el.classList.toggle("is-active", isActive);
        el.classList.toggle("is-complete", isComplete);

        const icon = el.querySelector("i");

        if (icon && current < step) {
            icon.setAttribute("data-lucide", "check");
        }

        if (icon && current === step) {
            if (current === 1) icon.setAttribute("data-lucide", "link");
            if (current === 2) icon.setAttribute("data-lucide", "file-text");
            if (current === 3) icon.setAttribute("data-lucide", "palette");
        }
    });

    const progress = document.querySelector(".step-progress");
    if (progress) {
        const width = step === 1 ? "33%" : step === 2 ? "66%" : "100%";
        progress.style.width = width;
    }

    lucide.createIcons();
}
