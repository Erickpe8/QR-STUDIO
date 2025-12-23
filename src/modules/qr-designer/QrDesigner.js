import { qrState } from "../../state.js";
import { refreshTicketCard, updateQrPreview } from "../../components/QrPreview.js";

const presetOptions = [
    {
        id: "nocturne",
        label: "Nocturno",
        theme: {
            bgType: "gradient",
            gradientFrom: "#020617",
            gradientTo: "#0f172a",
            textColor: "#f8fafc",
            borderColor: "#1f2937",
        },
        qrFg: "#f8fafc",
        qrBg: "#0f172a",
    },
    {
        id: "amber",
        label: "Amber",
        theme: {
            bgType: "gradient",
            gradientFrom: "#111827",
            gradientTo: "#92400e",
            textColor: "#fff7ed",
            borderColor: "#f59e0b",
        },
        qrFg: "#111827",
        qrBg: "#fff7ed",
    },
    {
        id: "mint",
        label: "Mint",
        theme: {
            bgType: "solid",
            bgColor: "#ecfeff",
            textColor: "#0f172a",
            borderColor: "#94a3b8",
        },
        qrFg: "#0f172a",
        qrBg: "#ffffff",
    },
    {
        id: "rose",
        label: "Rose",
        theme: {
            bgType: "gradient",
            gradientFrom: "#1f2937",
            gradientTo: "#881337",
            textColor: "#fdf2f8",
            borderColor: "#f472b6",
        },
        qrFg: "#fdf2f8",
        qrBg: "#1f2937",
    },
];

const fontScales = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
];

const spacingLevels = [
    { value: "sm", label: "Compacto" },
    { value: "md", label: "Normal" },
    { value: "lg", label: "Amplio" },
];

const densities = [
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" },
];

export function renderQrDesigner({ onBack, onNext } = {}) {
    const container = document.getElementById("module-container");
    if (!container) return;

    const ticket = qrState.ticket;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 space-y-6">
            <div>
                <h3 class="text-lg font-semibold text-slate-800">Diseno esencial</h3>
                <p class="text-sm text-slate-500">Personaliza la tarjeta sin scroll largo</p>
            </div>

            <div class="space-y-5">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Presets</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                        ${presetOptions
                            .map(
                                preset => `
                            <button
                                type="button"
                                data-preset-id="${preset.id}"
                                class="px-3 py-2 rounded-xl border text-sm font-medium hover:bg-slate-50 transition"
                            >
                                ${preset.label}
                            </button>
                        `
                            )
                            .join("")}
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">QR color</label>
                        <input id="qr-fg" type="color" class="w-full h-11 rounded-xl border border-slate-200"
                            value="${qrState.fgColor}">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">QR fondo</label>
                        <input id="qr-bg" type="color" class="w-full h-11 rounded-xl border border-slate-200"
                            value="${qrState.bgColor}">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Card fondo</label>
                        <select id="ticket-bgtype-input"
                            class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["solid", "gradient"], ticket.theme.bgType)}
                        </select>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Color fondo</label>
                        <input id="ticket-bgcolor-input" type="color" value="${ticket.theme.bgColor}"
                            class="w-full h-11 rounded-xl border border-slate-200" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Gradiente</label>
                        <div class="grid grid-cols-2 gap-2">
                            <input id="ticket-gradient-from-input" type="color" value="${ticket.theme.gradientFrom}"
                                class="w-full h-11 rounded-xl border border-slate-200" />
                            <input id="ticket-gradient-to-input" type="color" value="${ticket.theme.gradientTo}"
                                class="w-full h-11 rounded-xl border border-slate-200" />
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Logo</label>
                    <div id="logo-dropzone"
                        class="flex items-center justify-between gap-3 px-4 py-3 h-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50 cursor-pointer">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                <img id="logo-preview" class="w-full h-full object-cover ${ticket.logo ? "" : "hidden"}" alt="Logo preview" />
                                <span id="logo-placeholder" class="text-xs text-slate-500 ${ticket.logo ? "hidden" : ""}">Logo</span>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-slate-700">Arrastra o haz click</div>
                                <div id="logo-filename" class="text-xs text-slate-500 truncate max-w-[140px]">
                                    ${ticket.logo ? "Logo cargado" : "PNG o JPG"}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button id="logo-change" type="button"
                                class="px-3 py-1.5 text-xs rounded-lg border border-slate-300 hover:bg-white transition">
                                Cambiar
                            </button>
                            <button id="logo-remove" type="button"
                                class="px-3 py-1.5 text-xs rounded-lg border border-slate-300 hover:bg-white transition">
                                Quitar
                            </button>
                        </div>
                        <input id="logo-input" type="file" accept="image/*" class="hidden" />
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Esquinas</label>
                        <select id="ticket-corners-input"
                            class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
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
                            class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            ${getSelectOptions(["none", "soft", "strong"], ticket.shadow)}
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Borde</label>
                        <input id="ticket-border-input" type="color" value="${ticket.theme.borderColor}"
                            class="w-full h-11 rounded-xl border border-slate-200" />
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4 items-end">
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-title-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showTitle ? "checked" : ""} />
                        Mostrar titulo
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-subtitle-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showSubtitle ? "checked" : ""} />
                        Mostrar subtitulo
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700">
                        <input id="ticket-show-footer-input" type="checkbox" class="w-4 h-4"
                            ${ticket.showFooter ? "checked" : ""} />
                        Mostrar footer
                    </label>
                </div>

                <details class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Avanzado
                    </summary>
                    <div class="mt-4 space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Patron</label>
                                <select id="ticket-pattern-style-input"
                                    class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    ${getSelectOptions(["none", "dots", "squares"], ticket.pattern.style)}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Densidad</label>
                                <select id="ticket-pattern-density-input"
                                    class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
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

                        <div class="grid md:grid-cols-2 gap-4 items-end">
                            <label class="flex items-center gap-2 text-sm text-slate-700">
                                <input id="ticket-pattern-enabled-input" type="checkbox" class="w-4 h-4"
                                    ${ticket.pattern.enabled ? "checked" : ""} />
                                Activar patron
                            </label>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Opacidad</label>
                                <input id="ticket-pattern-opacity-input" type="range" min="0" max="1" step="0.02"
                                    value="${ticket.pattern.opacity}"
                                    class="w-full" />
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Tipografia</label>
                                <select id="ticket-fontscale-input"
                                    class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
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
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Espaciado</label>
                                <select id="ticket-spacing-input"
                                    class="w-full px-3 py-2.5 border border-slate-300 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    ${spacingLevels
                                        .map(
                                            option =>
                                                `<option value="${option.value}" ${
                                                    ticket.spacing === option.value
                                                        ? "selected"
                                                        : ""
                                                }>${option.label}</option>`
                                        )
                                        .join("")}
                                </select>
                            </div>
                        </div>
                    </div>
                </details>
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
    bindLogoUploader();
    bindPresets();

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

    bindSelect("ticket-corners-input", value => {
        ticket.corners = value;
    });
    bindSelect("ticket-shadow-input", value => {
        ticket.shadow = value;
    });
    bindSelect("ticket-bgtype-input", value => {
        ticket.theme.bgType = value;
    });

    bindColor("ticket-bgcolor-input", value => {
        ticket.theme.bgColor = value;
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

    const showTitle = document.getElementById("ticket-show-title-input");
    if (showTitle) {
        showTitle.addEventListener("change", () => {
            ticket.showTitle = showTitle.checked;
            refreshTicketCard();
        });
    }

    const showSubtitle = document.getElementById("ticket-show-subtitle-input");
    if (showSubtitle) {
        showSubtitle.addEventListener("change", () => {
            ticket.showSubtitle = showSubtitle.checked;
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

    bindSelect("ticket-pattern-style-input", value => {
        ticket.pattern.style = value;
    });
    bindSelect("ticket-pattern-density-input", value => {
        ticket.pattern.density = value;
    });
    bindSelect("ticket-fontscale-input", value => {
        ticket.fontScale = value;
    });
    bindSelect("ticket-spacing-input", value => {
        ticket.spacing = value;
    });

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

function bindLogoUploader() {
    const dropzone = document.getElementById("logo-dropzone");
    const input = document.getElementById("logo-input");
    const preview = document.getElementById("logo-preview");
    const filename = document.getElementById("logo-filename");
    const placeholder = document.getElementById("logo-placeholder");
    const changeBtn = document.getElementById("logo-change");
    const removeBtn = document.getElementById("logo-remove");

    if (!dropzone || !input || !preview || !filename || !placeholder) return;

    const openPicker = event => {
        event.stopPropagation();
        input.click();
    };

    dropzone.addEventListener("click", openPicker);
    changeBtn.addEventListener("click", openPicker);
    removeBtn.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        qrState.ticket.logo = "";
        preview.src = "";
        preview.classList.add("hidden");
        placeholder.classList.remove("hidden");
        filename.textContent = "Sin logo";
        qrState.ticket.logoEnabled = false;
        refreshTicketCard();
    });

    dropzone.addEventListener("dragenter", event => {
        event.preventDefault();
        dropzone.classList.add("bg-white");
    });
    dropzone.addEventListener("dragover", event => {
        event.preventDefault();
        dropzone.classList.add("bg-white");
    });
    dropzone.addEventListener("dragleave", event => {
        if (event.target === dropzone) {
            dropzone.classList.remove("bg-white");
        }
    });
    dropzone.addEventListener("drop", event => {
        event.preventDefault();
        dropzone.classList.remove("bg-white");
        const files = event.dataTransfer ? event.dataTransfer.files : null;
        const file = files && files.length ? files[0] : null;
        if (file) {
            handleLogoFile(file);
        }
    });

    input.addEventListener("change", event => {
        const file = event.target.files[0];
        if (file) {
            handleLogoFile(file);
        }
    });

    function handleLogoFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            qrState.ticket.logo = reader.result;
            qrState.ticket.logoEnabled = true;
            preview.src = reader.result;
            preview.classList.remove("hidden");
            placeholder.classList.add("hidden");
            filename.textContent = truncateName(file.name);
            refreshTicketCard();
        };
        reader.readAsDataURL(file);
    }
}

function bindPresets() {
    const buttons = document.querySelectorAll("[data-preset-id]");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const preset = presetOptions.find(
                item => item.id === button.dataset.presetId
            );
            if (!preset) return;

            const ticket = qrState.ticket;
            ticket.theme.bgType = preset.theme.bgType || ticket.theme.bgType;
            ticket.theme.bgColor = preset.theme.bgColor || ticket.theme.bgColor;
            ticket.theme.gradientFrom =
                preset.theme.gradientFrom || ticket.theme.gradientFrom;
            ticket.theme.gradientTo =
                preset.theme.gradientTo || ticket.theme.gradientTo;
            ticket.theme.borderColor =
                preset.theme.borderColor || ticket.theme.borderColor;
            ticket.theme.textColor =
                preset.theme.textColor || ticket.theme.textColor;

            qrState.fgColor = preset.qrFg || qrState.fgColor;
            qrState.bgColor = preset.qrBg || qrState.bgColor;

            syncControlValues();
            updateQrPreview(qrState.text, qrState.fgColor, qrState.bgColor);
            refreshTicketCard();
        });
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

function truncateName(name) {
    if (name.length <= 18) return name;
    return `${name.slice(0, 12)}...${name.slice(-4)}`;
}

function syncControlValues() {
    const ticket = qrState.ticket;
    setValue("ticket-bgtype-input", ticket.theme.bgType);
    setValue("ticket-bgcolor-input", ticket.theme.bgColor);
    setValue("ticket-gradient-from-input", ticket.theme.gradientFrom);
    setValue("ticket-gradient-to-input", ticket.theme.gradientTo);
    setValue("ticket-border-input", ticket.theme.borderColor);
    setValue("qr-fg", qrState.fgColor);
    setValue("qr-bg", qrState.bgColor);
}

function setValue(id, value) {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = value;
}
