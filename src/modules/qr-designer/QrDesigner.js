import { qrState } from "../../state.js";
import { refreshTicketCard, updateQrPreview } from "../../components/QrPreview.js";

const densities = [
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" },
];

const fontScales = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
];

export function renderQrDesigner({ onBack, onNext } = {}) {
    const container = document.getElementById("module-container");
    if (!container) return;

    const ticket = qrState.ticket;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 space-y-8">
            <div>
                <h3 class="text-lg font-semibold text-slate-800">Diseno de tarjeta</h3>
                <p class="text-sm text-slate-500">Personaliza la tarjeta y el QR</p>
            </div>

            <div class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Handle</label>
                        <input id="ticket-handle-input" type="text" placeholder="/@usuario"
                            value="${ticket.handle}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Numero de ticket</label>
                        <input id="ticket-number-input" type="text" placeholder="#000210"
                            value="${ticket.ticketNumber}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Titulo</label>
                        <input id="ticket-title-input" type="text" placeholder="Titulo principal"
                            value="${ticket.title}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Subtitulo</label>
                        <input id="ticket-subtitle-input" type="text" placeholder="Descripcion corta"
                            value="${ticket.subtitle}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Footer izquierdo</label>
                        <input id="ticket-footer-left-input" type="text" placeholder="Fecha"
                            value="${ticket.footerLeft}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Footer derecho</label>
                        <input id="ticket-footer-right-input" type="text" placeholder="Hora"
                            value="${ticket.footerRight}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Badges (3 slots)</label>
                    <div class="grid md:grid-cols-3 gap-3">
                        ${ticket.badges
                            .map(
                                (badge, index) => `
                            <input data-badge-index="${index}" type="text" placeholder="Badge"
                                value="${badge}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        `
                            )
                            .join("")}
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Logo (URL)</label>
                        <input id="ticket-logo-input" type="url" placeholder="https://logo.png"
                            value="${ticket.logo}" class="w-full px-4 py-3 border border-slate-300 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Posicion logo</label>
                        <select id="ticket-logo-position-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["top-center", "top-left"], ticket.logoPosition)}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 items-end">
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-logo-enabled-input" type="checkbox" class="w-4 h-4"
                            ${ticket.logoEnabled ? "checked" : ""} />
                        Mostrar logo
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-handle-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showHandle ? "checked" : ""} />
                        Mostrar handle
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-title-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showTitle ? "checked" : ""} />
                        Mostrar titulo
                    </label>
                </div>

                <div class="grid md:grid-cols-3 gap-4 items-end">
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-number-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showTicketNumber ? "checked" : ""} />
                        Mostrar numero
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-footer-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showFooter ? "checked" : ""} />
                        Mostrar footer
                    </label>
                    <div></div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Layout</label>
                        <select id="ticket-layout-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["center", "left", "right"], ticket.layout)}
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Espaciado</label>
                        <select id="ticket-spacing-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["sm", "md", "lg"], ticket.spacing)}
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Escala tipografica</label>
                        <select id="ticket-fontscale-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${fontScales
                                .map(
                                    option =>
                                        `<option value="${option.value}" ${
                                            ticket.fontScale === option.value
                                                ? "selected"
                                                : ""
                                        }>${option.label}</option>`
                                )
                                .join("")}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Esquinas</label>
                        <select id="ticket-corners-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(
                                ["rounded-xl", "rounded-2xl", "rounded-3xl"],
                                ticket.corners
                            )}
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Sombra</label>
                        <select id="ticket-shadow-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["none", "soft", "strong"], ticket.shadow)}
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Tipo de fondo</label>
                        <select id="ticket-bgtype-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["solid", "gradient"], ticket.theme.bgType)}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Color de fondo</label>
                        <input id="ticket-bgcolor-input" type="color" value="${ticket.theme.bgColor}"
                            class="w-full h-12 rounded-xl border border-slate-200" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Color del texto</label>
                        <input id="ticket-textcolor-input" type="color" value="${ticket.theme.textColor}"
                            class="w-full h-12 rounded-xl border border-slate-200" />
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Gradiente desde</label>
                        <input id="ticket-gradient-from-input" type="color" value="${ticket.theme.gradientFrom}"
                            class="w-full h-12 rounded-xl border border-slate-200" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Gradiente hasta</label>
                        <input id="ticket-gradient-to-input" type="color" value="${ticket.theme.gradientTo}"
                            class="w-full h-12 rounded-xl border border-slate-200" />
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Color del borde</label>
                        <input id="ticket-border-input" type="color" value="${ticket.theme.borderColor}"
                            class="w-full h-12 rounded-xl border border-slate-200" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Color del QR</label>
                        <input id="qr-fg" type="color" class="w-full h-12 rounded-xl border border-slate-200"
                            value="${qrState.fgColor}">
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Fondo del QR</label>
                        <input id="qr-bg" type="color" class="w-full h-12 rounded-xl border border-slate-200"
                            value="${qrState.bgColor}">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Patron</label>
                        <select id="ticket-pattern-style-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["none", "dots", "squares"], ticket.pattern.style)}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 items-end">
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-pattern-enabled-input" type="checkbox" class="w-4 h-4"
                            ${ticket.pattern.enabled ? "checked" : ""} />
                        Activar patron
                    </label>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Opacidad</label>
                        <input id="ticket-pattern-opacity-input" type="range" min="0" max="1" step="0.05"
                            value="${ticket.pattern.opacity}"
                            class="w-full" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Densidad</label>
                        <select id="ticket-pattern-density-input"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${densities
                                .map(
                                    option =>
                                        `<option value="${option.value}" ${
                                            ticket.pattern.density === option.value
                                                ? "selected"
                                                : ""
                                        }>${option.label}</option>`
                                )
                                .join("")}
                        </select>
                    </div>
                </div>
            </div>

            <div class="flex justify-between">
                <button id="back-to-content"
                    class="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
                    Volver
                </button>

                <button id="next-to-design"
                    class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                    Siguiente
                </button>
            </div>
        </div>
    `;

    bindDesignerControls();

    document.getElementById("back-to-content").addEventListener("click", () => {
        if (onBack) {
            onBack();
        }
    });

    document.getElementById("next-to-design").addEventListener("click", () => {
        if (onNext) {
            onNext();
        }
    });
}

function bindDesignerControls() {
    const ticket = qrState.ticket;

    bindInput("ticket-handle-input", value => {
        ticket.handle = value;
    });
    bindInput("ticket-title-input", value => {
        ticket.title = value;
    });
    bindInput("ticket-subtitle-input", value => {
        ticket.subtitle = value;
    });
    bindInput("ticket-number-input", value => {
        ticket.ticketNumber = value;
    });
    bindInput("ticket-footer-left-input", value => {
        ticket.footerLeft = value;
    });
    bindInput("ticket-footer-right-input", value => {
        ticket.footerRight = value;
    });
    bindInput("ticket-logo-input", value => {
        ticket.logo = value;
    });

    bindSelect("ticket-layout-input", value => {
        ticket.layout = value;
    });
    bindSelect("ticket-corners-input", value => {
        ticket.corners = value;
    });
    bindSelect("ticket-shadow-input", value => {
        ticket.shadow = value;
    });
    bindSelect("ticket-bgtype-input", value => {
        ticket.theme.bgType = value;
    });
    bindSelect("ticket-logo-position-input", value => {
        ticket.logoPosition = value;
    });
    bindSelect("ticket-spacing-input", value => {
        ticket.spacing = value;
    });
    bindSelect("ticket-fontscale-input", value => {
        ticket.fontScale = value;
    });

    bindColor("ticket-bgcolor-input", value => {
        ticket.theme.bgColor = value;
    });
    bindColor("ticket-textcolor-input", value => {
        ticket.theme.textColor = value;
    });
    bindColor("ticket-gradient-from-input", value => {
        ticket.theme.gradientFrom = value;
    });
    bindColor("ticket-gradient-to-input", value => {
        ticket.theme.gradientTo = value;
    });
    bindColor("ticket-border-input", value => {
        ticket.theme.borderColor = value;
    });

    bindSelect("ticket-pattern-style-input", value => {
        ticket.pattern.style = value;
    });
    bindSelect("ticket-pattern-density-input", value => {
        ticket.pattern.density = value;
    });

    const badgeInputs = document.querySelectorAll("[data-badge-index]");
    badgeInputs.forEach(input => {
        input.addEventListener("input", () => {
            const index = Number(input.dataset.badgeIndex);
            ticket.badges[index] = input.value;
            refreshTicketCard();
        });
    });

    const patternEnabled = document.getElementById("ticket-pattern-enabled-input");
    if (patternEnabled) {
        patternEnabled.addEventListener("change", () => {
            ticket.pattern.enabled = patternEnabled.checked;
            refreshTicketCard();
        });
    }

    const patternOpacity = document.getElementById("ticket-pattern-opacity-input");
    if (patternOpacity) {
        patternOpacity.addEventListener("input", () => {
            ticket.pattern.opacity = Number(patternOpacity.value);
            refreshTicketCard();
        });
    }

    const logoEnabled = document.getElementById("ticket-logo-enabled-input");
    if (logoEnabled) {
        logoEnabled.addEventListener("change", () => {
            ticket.logoEnabled = logoEnabled.checked;
            refreshTicketCard();
        });
    }

    const showHandle = document.getElementById("ticket-show-handle-input");
    if (showHandle) {
        showHandle.addEventListener("change", () => {
            ticket.showHandle = showHandle.checked;
            refreshTicketCard();
        });
    }

    const showTitle = document.getElementById("ticket-show-title-input");
    if (showTitle) {
        showTitle.addEventListener("change", () => {
            ticket.showTitle = showTitle.checked;
            refreshTicketCard();
        });
    }

    const showNumber = document.getElementById("ticket-show-number-input");
    if (showNumber) {
        showNumber.addEventListener("change", () => {
            ticket.showTicketNumber = showNumber.checked;
            refreshTicketCard();
        });
    }

    const showFooter = document.getElementById("ticket-show-footer-input");
    if (showFooter) {
        showFooter.addEventListener("change", () => {
            ticket.showFooter = showFooter.checked;
            refreshTicketCard();
        });
    }

    const fg = document.getElementById("qr-fg");
    const bg = document.getElementById("qr-bg");

    if (fg) {
        fg.addEventListener("input", () => {
            qrState.fgColor = fg.value;
            updateQrPreview(qrState.text, qrState.fgColor, qrState.bgColor);
        });
    }

    if (bg) {
        bg.addEventListener("input", () => {
            qrState.bgColor = bg.value;
            updateQrPreview(qrState.text, qrState.fgColor, qrState.bgColor);
        });
    }
}

function bindInput(id, onChange) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", () => {
        onChange(input.value);
        refreshTicketCard();
    });
}

function bindSelect(id, onChange) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("change", () => {
        onChange(input.value);
        refreshTicketCard();
    });
}

function bindColor(id, onChange) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", () => {
        onChange(input.value);
        refreshTicketCard();
    });
}

function getSelectOptions(options, selected) {
    return options
        .map(
            option =>
                `<option value="${option}" ${
                    option === selected ? "selected" : ""
                }>${option}</option>`
        )
        .join("");
}
