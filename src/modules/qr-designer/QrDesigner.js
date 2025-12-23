
import { qrState } from "../../state.js";
import { refreshTicketCard, updateQrPreview } from "../../components/QrPreview.js";
import { notifyLoading } from "../../ui/alerts.js";

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
        label: "Ámbar",
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
        label: "Menta",
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
        label: "Rosa",
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
    { value: "sm", label: "Pequeña" },
    { value: "md", label: "Media" },
    { value: "lg", label: "Grande" },
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

const bgTypeOptions = [
    { value: "solid", label: "Sólido" },
    { value: "gradient", label: "Gradiente" },
];

const cornerOptions = [
    { value: "rounded-xl", label: "Suave" },
    { value: "rounded-2xl", label: "Redondeado" },
    { value: "rounded-3xl", label: "Muy redondeado" },
];

const shadowOptions = [
    { value: "none", label: "Ninguna" },
    { value: "soft", label: "Suave" },
    { value: "strong", label: "Fuerte" },
];

const patternOptions = [
    { value: "none", label: "Ninguno" },
    { value: "dots", label: "Puntos" },
    { value: "squares", label: "Cuadros" },
];

const selectClass =
    "w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm " +
    "hover:border-neutral-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500";
const textClass =
    "w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm " +
    "hover:border-neutral-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500";
export function renderQrDesigner({ onBack, onNext } = {}) {
    const container = document.getElementById("module-container");
    if (!container) return;

    const ticket = qrState.ticket;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 space-y-6">
            <div>
                <h3 class="text-lg font-semibold text-slate-800">Diseño esencial</h3>
                <p class="text-sm text-slate-500">Personaliza la tarjeta sin scroll largo</p>
            </div>

            <div class="space-y-5">
                <details open class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Preajustes
                    </summary>
                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                        ${presetOptions
                            .map(
                                preset => `
                            <button
                                type="button"
                                data-preset-id="${preset.id}"
                                class="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition"
                            >
                                ${preset.label}
                            </button>
                        `
                            )
                            .join("")}
                    </div>
                </details>

                <details open class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Colores
                    </summary>
                    <div class="mt-4 space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Color del QR</label>
                            <div class="flex items-center gap-3">
                                <button id="qr-fg-swatch" type="button"
                                    class="w-10 h-10 rounded-xl ring-1 ring-black/10"
                                    style="background:${qrState.fgColor};"></button>
                                <input id="qr-fg-hex" type="text" class="${textClass}" value="${qrState.fgColor}">
                                <input id="qr-fg" type="color" class="hidden" value="${qrState.fgColor}">
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Fondo del QR</label>
                            <div class="flex items-center gap-3">
                                <button id="qr-bg-swatch" type="button"
                                    class="w-10 h-10 rounded-xl ring-1 ring-black/10"
                                    style="background:${qrState.bgColor};"></button>
                                <input id="qr-bg-hex" type="text" class="${textClass}" value="${qrState.bgColor}">
                                <input id="qr-bg" type="color" class="hidden" value="${qrState.bgColor}">
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Fondo de la tarjeta</label>
                            <select id="ticket-bgtype-input" class="${selectClass}">
                                ${getSelectOptions(bgTypeOptions, ticket.theme.bgType)}
                            </select>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Color sólido</label>
                            <div class="flex items-center gap-3">
                                <button id="ticket-bg-swatch" type="button"
                                    class="w-10 h-10 rounded-xl ring-1 ring-black/10"
                                    style="background:${ticket.theme.bgColor};"></button>
                                <input id="ticket-bgcolor-hex" type="text" class="${textClass}" value="${ticket.theme.bgColor}">
                                <input id="ticket-bgcolor-input" type="color" class="hidden" value="${ticket.theme.bgColor}">
                            </div>
                        </div>

                        <div id="ticket-gradient-section"
                            class="space-y-3 min-h-[84px] ${
                                ticket.theme.bgType === "gradient"
                                    ? ""
                                    : "opacity-50 pointer-events-none"
                            }">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Color 1</label>
                                <div class="flex items-center gap-3">
                                    <button id="ticket-gradient-from-swatch" type="button"
                                        class="w-10 h-10 rounded-xl ring-1 ring-black/10"
                                        style="background:${ticket.theme.gradientFrom};"></button>
                                    <input id="ticket-gradient-from-hex" type="text" class="${textClass}" value="${ticket.theme.gradientFrom}">
                                    <input id="ticket-gradient-from-input" type="color" class="hidden" value="${ticket.theme.gradientFrom}">
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Color 2</label>
                                <div class="flex items-center gap-3">
                                    <button id="ticket-gradient-to-swatch" type="button"
                                        class="w-10 h-10 rounded-xl ring-1 ring-black/10"
                                        style="background:${ticket.theme.gradientTo};"></button>
                                    <input id="ticket-gradient-to-hex" type="text" class="${textClass}" value="${ticket.theme.gradientTo}">
                                    <input id="ticket-gradient-to-input" type="color" class="hidden" value="${ticket.theme.gradientTo}">
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Color de borde</label>
                            <div class="flex items-center gap-3">
                                <button id="ticket-border-swatch" type="button"
                                    class="w-10 h-10 rounded-xl ring-1 ring-black/10"
                                    style="background:${ticket.theme.borderColor};"></button>
                                <input id="ticket-border-hex" type="text" class="${textClass}" value="${ticket.theme.borderColor}">
                                <input id="ticket-border-input" type="color" class="hidden" value="${ticket.theme.borderColor}">
                            </div>
                        </div>
                    </div>
                </details>

                <details class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Logo
                    </summary>
                    <div class="mt-4 space-y-2">
                        <div id="logo-dropzone"
                            class="flex items-center justify-between gap-3 px-4 py-3 h-20 rounded-xl border border-dashed border-slate-300 bg-slate-50 cursor-pointer
                                   hover:border-slate-400 hover:bg-white/70 focus-within:ring-2 focus-within:ring-indigo-500">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                    <img id="logo-preview" class="w-full h-full object-cover ${ticket.logo ? "" : "hidden"}" alt="Vista previa del logo" />
                                    <span id="logo-placeholder" class="text-xs text-slate-500 ${ticket.logo ? "hidden" : ""}">Logo</span>
                                </div>
                                <div>
                                    <div class="text-sm font-medium text-slate-700">Arrastra tu logo o haz clic</div>
                                    <div id="logo-filename" class="text-xs text-slate-500 truncate max-w-[140px]">
                                        ${ticket.logo ? "Logo cargado" : "PNG o JPG"}
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <button id="logo-change" type="button"
                                    class="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition">
                                    Cambiar
                                </button>
                                <button id="logo-remove" type="button"
                                    class="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition">
                                    Quitar
                                </button>
                            </div>
                            <input id="logo-input" type="file" accept="image/*" class="hidden" />
                        </div>
                    </div>
                </details>

                <details class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Estructura
                    </summary>
                    <div class="mt-4 space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Esquinas</label>
                            <div class="flex flex-wrap gap-2" id="corner-chips">
                                ${cornerOptions
                                    .map(
                                        option => `
                                    <button type="button" data-value="${option.value}"
                                        class="chip-base ${ticket.corners === option.value ? "chip-active" : "chip-inactive"}">
                                        ${option.label}
                                    </button>
                                `
                                    )
                                    .join("")}
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Sombra</label>
                            <div class="flex flex-wrap gap-2" id="shadow-chips">
                                ${shadowOptions
                                    .map(
                                        option => `
                                    <button type="button" data-value="${option.value}"
                                        class="chip-base ${ticket.shadow === option.value ? "chip-active" : "chip-inactive"}">
                                        ${option.label}
                                    </button>
                                `
                                    )
                                    .join("")}
                            </div>
                        </div>
                    </div>
                </details>

                <details class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Textos
                    </summary>
                    <div class="mt-4 space-y-4">
                        <div class="grid md:grid-cols-3 gap-4 items-end">
                            <label class="flex items-center gap-2 text-sm text-slate-700">
                                <input id="ticket-show-title-input" type="checkbox" class="w-4 h-4"
                                    ${ticket.showTitle ? "checked" : ""} />
                                Mostrar título
                            </label>
                            <label class="flex items-center gap-2 text-sm text-slate-700">
                                <input id="ticket-show-subtitle-input" type="checkbox" class="w-4 h-4"
                                    ${ticket.showSubtitle ? "checked" : ""} />
                                Mostrar subtítulo
                            </label>
                            <label class="flex items-center gap-2 text-sm text-slate-700">
                                <input id="ticket-show-footer-input" type="checkbox" class="w-4 h-4"
                                    ${ticket.showFooter ? "checked" : ""} />
                                Mostrar pie
                            </label>
                        </div>

                        <div id="title-section" class="space-y-2 min-h-[84px] ${
                            ticket.showTitle ? "" : "opacity-50 pointer-events-none"
                        }">
                            <label class="text-sm font-medium text-slate-700">Título</label>
                            <input id="ticket-title-input" type="text" placeholder="Título" maxlength="28"
                                class="${textClass}" value="${ticket.title}">
                            <div class="flex justify-end text-xs text-slate-500">
                                <span id="ticket-title-count">0/28</span>
                            </div>
                        </div>

                        <div id="subtitle-section" class="space-y-2 min-h-[84px] ${
                            ticket.showSubtitle ? "" : "opacity-50 pointer-events-none"
                        }">
                            <label class="text-sm font-medium text-slate-700">Subtítulo</label>
                            <input id="ticket-subtitle-input" type="text" placeholder="Subtítulo" maxlength="40"
                                class="${textClass}" value="${ticket.subtitle}">
                            <div class="flex justify-end text-xs text-slate-500">
                                <span id="ticket-subtitle-count">0/40</span>
                            </div>
                        </div>

                        <div id="footer-section" class="grid md:grid-cols-2 gap-4 min-h-[84px] ${
                            ticket.showFooter ? "" : "opacity-50 pointer-events-none"
                        }">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Fecha</label>
                                <input id="ticket-footer-left-input" type="date" placeholder="Fecha"
                                    class="${textClass}" value="${ticket.footerLeft}">
                                <p id="ticket-date-hint" class="text-xs text-amber-600 hidden">
                                    Formato: DD/MM/AAAA
                                </p>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Hora</label>
                                <input id="ticket-footer-right-input" type="time" placeholder="Hora"
                                    class="${textClass}" value="${ticket.footerRight}">
                                <p id="ticket-time-hint" class="text-xs text-amber-600 hidden">
                                    Formato: HH:MM
                                </p>
                            </div>
                        </div>
                    </div>
                </details>

                <details class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                        Avanzado
                    </summary>
                    <div class="mt-4 space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Patrón</label>
                                <select id="ticket-pattern-style-input" class="${selectClass}">
                                    ${getSelectOptions(patternOptions, ticket.pattern.style)}
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Densidad</label>
                                <select id="ticket-pattern-density-input" class="${selectClass}">
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
                                Activar patrón
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
                                <label class="text-sm font-medium text-slate-700">Tipografía</label>
                                <select id="ticket-fontscale-input" class="${selectClass}">
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
                                <select id="ticket-spacing-input" class="${selectClass}">
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
    bindChipGroup("corner-chips", value => {
        ticket.corners = value;
        refreshTicketCard();
    });
    bindChipGroup("shadow-chips", value => {
        ticket.shadow = value;
        refreshTicketCard();
    });

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

    const bgTypeSelect = document.getElementById("ticket-bgtype-input");
    if (bgTypeSelect) {
        bgTypeSelect.addEventListener("change", () => {
            ticket.theme.bgType = bgTypeSelect.value;
            toggleGradientSection();
            refreshTicketCard();
        });
    }

    bindCountedInput("ticket-title-input", "ticket-title-count", 28, value => {
        ticket.title = value;
    });
    bindCountedInput("ticket-subtitle-input", "ticket-subtitle-count", 40, value => {
        ticket.subtitle = value;
    });
    bindDateInput("ticket-footer-left-input", "ticket-date-hint", value => {
        ticket.footerLeft = value;
    });
    bindTimeInput("ticket-footer-right-input", "ticket-time-hint", value => {
        ticket.footerRight = value;
    });

    const showTitle = document.getElementById("ticket-show-title-input");
    if (showTitle) {
        showTitle.addEventListener("change", () => {
            ticket.showTitle = showTitle.checked;
            toggleSectionState("title-section", ticket.showTitle);
            refreshTicketCard();
        });
    }

    const showSubtitle = document.getElementById("ticket-show-subtitle-input");
    if (showSubtitle) {
        showSubtitle.addEventListener("change", () => {
            ticket.showSubtitle = showSubtitle.checked;
            toggleSectionState("subtitle-section", ticket.showSubtitle);
            refreshTicketCard();
        });
    }

    const showFooter = document.getElementById("ticket-show-footer-input");
    if (showFooter) {
        showFooter.addEventListener("change", () => {
            ticket.showFooter = showFooter.checked;
            toggleSectionState("footer-section", ticket.showFooter);
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

    bindColorPair("qr-fg", "qr-fg-hex", "qr-fg-swatch", value => {
        qrState.fgColor = value;
        updateQrPreview(qrState.qrData, qrState.fgColor, qrState.bgColor);
    });
    bindColorPair("qr-bg", "qr-bg-hex", "qr-bg-swatch", value => {
        qrState.bgColor = value;
        updateQrPreview(qrState.qrData, qrState.fgColor, qrState.bgColor);
    });
    bindColorPair("ticket-bgcolor-input", "ticket-bgcolor-hex", "ticket-bg-swatch", value => {
        ticket.theme.bgColor = value;
    });
    bindColorPair(
        "ticket-gradient-from-input",
        "ticket-gradient-from-hex",
        "ticket-gradient-from-swatch",
        value => {
            ticket.theme.gradientFrom = value;
        }
    );
    bindColorPair(
        "ticket-gradient-to-input",
        "ticket-gradient-to-hex",
        "ticket-gradient-to-swatch",
        value => {
            ticket.theme.gradientTo = value;
        }
    );
    bindColorPair(
        "ticket-border-input",
        "ticket-border-hex",
        "ticket-border-swatch",
        value => {
            ticket.theme.borderColor = value;
        }
    );

    toggleGradientSection();
    toggleSectionState("title-section", ticket.showTitle);
    toggleSectionState("subtitle-section", ticket.showSubtitle);
    toggleSectionState("footer-section", ticket.showFooter);
    updateCounter(
        document.getElementById("ticket-title-count"),
        (ticket.title || "").length,
        23
    );
    updateCounter(
        document.getElementById("ticket-subtitle-count"),
        (ticket.subtitle || "").length,
        23
    );
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
        qrState.ticket.logo = null;
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
        const notifyHandle = notifyLoading(
            "Subiendo logo",
            "Procesando imagen"
        );
        const reader = new FileReader();
        reader.onload = () => {
            qrState.ticket.logo = reader.result;
            qrState.ticket.logoEnabled = true;
            preview.src = reader.result;
            preview.classList.remove("hidden");
            placeholder.classList.add("hidden");
            filename.textContent = truncateName(file.name);
            refreshTicketCard();
            notifyHandle.update("success", "Logo cargado", "Listo");
        };
        reader.onerror = () => {
            notifyHandle.update(
                "danger",
                "No se pudo cargar",
                "Formato invalido o archivo corrupto"
            );
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
            updateQrPreview(qrState.qrData, qrState.fgColor, qrState.bgColor);
            refreshTicketCard();
        });
    });
}

function bindChipGroup(containerId, onChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener("click", event => {
        const button = event.target.closest("button[data-value]");
        if (!button) return;

        container.querySelectorAll("button[data-value]").forEach(el => {
            el.classList.remove("chip-active");
            el.classList.add("chip-inactive");
        });
        button.classList.remove("chip-inactive");
        button.classList.add("chip-active");

        onChange(button.dataset.value);
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

function bindCountedInput(id, counterId, max, onChange) {
    const input = document.getElementById(id);
    const counter = document.getElementById(counterId);
    if (!input || !counter) return;

    const update = () => {
        const value = input.value || "";
        onChange(value);
        updateCounter(counter, value.length, max);
        refreshTicketCard();
    };

    input.addEventListener("input", update);
    update();
}

function bindDateInput(id, hintId, onChange) {
    const input = document.getElementById(id);
    const hint = document.getElementById(hintId);
    if (!input || !hint) return;

    const update = () => {
        const value = input.value.trim();
        if (!value) {
            hint.classList.add("hidden");
            onChange("");
            refreshTicketCard();
            return;
        }

        const normalized = normalizeDateValue(value);
        if (normalized) {
            hint.classList.add("hidden");
            onChange(normalized);
        } else {
            hint.classList.remove("hidden");
        }
        refreshTicketCard();
    };

    input.addEventListener("input", update);
    update();
}

function bindTimeInput(id, hintId, onChange) {
    const input = document.getElementById(id);
    const hint = document.getElementById(hintId);
    if (!input || !hint) return;

    const update = () => {
        const value = input.value.trim();
        if (!value) {
            hint.classList.add("hidden");
            onChange("");
            refreshTicketCard();
            return;
        }

        if (isValidTime(value)) {
            hint.classList.add("hidden");
            onChange(value);
        } else {
            hint.classList.remove("hidden");
        }
        refreshTicketCard();
    };

    input.addEventListener("input", update);
    update();
}

function getSelectOptions(options, selected) {
    return options
        .map(option => {
            const value = typeof option === "string" ? option : option.value;
            const label = typeof option === "string" ? option : option.label;
            return `<option value="${value}" ${
                value === selected ? "selected" : ""
            }>${label}</option>`;
        })
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
    setValue("ticket-bgcolor-hex", ticket.theme.bgColor);
    setValue("ticket-gradient-from-input", ticket.theme.gradientFrom);
    setValue("ticket-gradient-from-hex", ticket.theme.gradientFrom);
    setValue("ticket-gradient-to-input", ticket.theme.gradientTo);
    setValue("ticket-gradient-to-hex", ticket.theme.gradientTo);
    setValue("ticket-border-input", ticket.theme.borderColor);
    setValue("ticket-border-hex", ticket.theme.borderColor);
    setValue("qr-fg", qrState.fgColor);
    setValue("qr-fg-hex", qrState.fgColor);
    setValue("qr-bg", qrState.bgColor);
    setValue("qr-bg-hex", qrState.bgColor);

    setSwatch("qr-fg-swatch", qrState.fgColor);
    setSwatch("qr-bg-swatch", qrState.bgColor);
    setSwatch("ticket-bg-swatch", ticket.theme.bgColor);
    setSwatch("ticket-border-swatch", ticket.theme.borderColor);
    setSwatch("ticket-gradient-from-swatch", ticket.theme.gradientFrom);
    setSwatch("ticket-gradient-to-swatch", ticket.theme.gradientTo);

    toggleGradientSection();
    toggleSectionState("title-section", ticket.showTitle);
    toggleSectionState("subtitle-section", ticket.showSubtitle);
    toggleSectionState("footer-section", ticket.showFooter);
    updateCounter(
        document.getElementById("ticket-title-count"),
        (ticket.title || "").length,
        28
    );
    updateCounter(
        document.getElementById("ticket-subtitle-count"),
        (ticket.subtitle || "").length,
        40
    );
}

function setValue(id, value) {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = value;
}

function setSwatch(id, value) {
    const swatch = document.getElementById(id);
    if (!swatch || !value) return;
    swatch.style.background = value;
}

function bindColorPair(colorId, hexId, swatchId, onChange) {
    const colorInput = document.getElementById(colorId);
    const hexInput = document.getElementById(hexId);
    const swatch = document.getElementById(swatchId);

    if (!colorInput || !hexInput || !swatch) return;

    const updateAll = value => {
        const normalized = normalizeHex(value);
        if (!normalized) return;
        colorInput.value = normalized;
        hexInput.value = normalized;
        swatch.style.background = normalized;
        onChange(normalized);
        refreshTicketCard();
    };

    swatch.addEventListener("click", () => {
        colorInput.click();
    });

    colorInput.addEventListener("input", () => {
        updateAll(colorInput.value);
    });

    hexInput.addEventListener("input", () => {
        updateAll(hexInput.value);
    });
}

function normalizeHex(value) {
    if (!value) return null;
    const hex = value.trim().toLowerCase();
    if (/^#([0-9a-f]{3})$/.test(hex)) {
        return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    if (/^#([0-9a-f]{6})$/.test(hex)) {
        return hex;
    }
    return null;
}

function updateCounter(counter, current, max) {
    if (!counter) return;
    counter.textContent = `${current}/${max}`;
    if (current >= max) {
        counter.classList.remove("text-slate-500");
        counter.classList.add("text-amber-600");
    } else {
        counter.classList.add("text-slate-500");
        counter.classList.remove("text-amber-600");
    }
}

function normalizeDateValue(value) {
    const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
        return `${iso[1]}-${iso[2]}-${iso[3]}`;
    }

    const slash = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (slash) {
        return `${slash[3]}-${slash[2]}-${slash[1]}`;
    }

    return null;
}

function isValidTime(value) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function toggleGradientSection() {
    const section = document.getElementById("ticket-gradient-section");
    if (!section) return;
    const isGradient = qrState.ticket.theme.bgType === "gradient";
    section.classList.toggle("opacity-50", !isGradient);
    section.classList.toggle("pointer-events-none", !isGradient);
}

function toggleSectionState(id, isActive) {
    const section = document.getElementById(id);
    if (!section) return;
    section.classList.toggle("opacity-50", !isActive);
    section.classList.toggle("pointer-events-none", !isActive);
}


