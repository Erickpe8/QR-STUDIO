const baseCardClass =
    "ticket-card relative border overflow-visible";

const shadowClasses = {
    none: "shadow-none",
    soft: "shadow-lg shadow-slate-900/20",
    strong: "shadow-2xl shadow-slate-900/40",
};

const layoutClasses = {
    center: "items-center text-center",
    left: "items-start text-left",
    right: "items-end text-right",
};

const spacingClasses = {
    sm: "p-5 gap-4",
    md: "p-6 gap-5",
    lg: "p-7 gap-6",
};

const fontScaleClasses = {
    sm: {
        handle: "text-xs",
        title: "text-lg",
        subtitle: "text-sm",
        number: "text-2xl",
        footer: "text-xs",
    },
    md: {
        handle: "text-sm",
        title: "text-xl",
        subtitle: "text-sm",
        number: "text-3xl",
        footer: "text-xs",
    },
    lg: {
        handle: "text-base",
        title: "text-2xl",
        subtitle: "text-base",
        number: "text-4xl",
        footer: "text-sm",
    },
};

export function renderTicketCard(container, props) {
    if (!container) return null;

    container.innerHTML = getTicketMarkup(props);
    return container.querySelector("#qr-canvas");
}

export function updateTicketCard(props) {
    const ticket = document.getElementById("ticket-export");
    if (!ticket) return;

    const ticketProps = withDefaults(props);
    const { theme, pattern: patternProps } = ticketProps;

    ticket.className = `${baseCardClass} ${ticketProps.corners} ${
        shadowClasses[ticketProps.shadow] || shadowClasses.soft
    }`;
    ticket.style.borderColor = theme.borderColor;
    ticket.style.color = theme.textColor;
    ticket.style.background = getBackgroundStyle(theme);

    const content = document.getElementById("ticket-content");
    if (content) {
        const spacing =
            spacingClasses[ticketProps.spacing] || spacingClasses.md;
        const alignment =
            layoutClasses[ticketProps.layout] || layoutClasses.center;
        content.className = `relative z-10 flex flex-col ${spacing}`;

        const header = document.getElementById("ticket-header");
        const footer = document.getElementById("ticket-footer");

        if (header) {
            header.className = `flex items-center gap-3 ${
                alignment === layoutClasses.center
                    ? "justify-center text-center"
                    : alignment === layoutClasses.left
                      ? "justify-start text-left"
                      : "justify-end text-right"
            }`;
        }

        if (footer) {
            footer.className = `flex flex-col gap-2 opacity-80 ${
                alignment === layoutClasses.center
                    ? "items-center text-center"
                    : alignment === layoutClasses.left
                      ? "items-start text-left"
                      : "items-end text-right"
            }`;
        }
    }

    const handle = document.getElementById("ticket-handle");
    const title = document.getElementById("ticket-title");
    const subtitle = document.getElementById("ticket-subtitle");
    const number = document.getElementById("ticket-number");
    const footer = document.getElementById("ticket-footer");
    const footerSpacer = document.getElementById("ticket-footer-spacer");
    const footerLeft = document.getElementById("ticket-footer-left");
    const footerRight = document.getElementById("ticket-footer-right");

    const fontScale =
        fontScaleClasses[ticketProps.fontScale] || fontScaleClasses.md;

    updateText(
        handle,
        ticketProps.handle,
        ticketProps.showHandle,
        fontScale.handle,
        "opacity-60 uppercase tracking-wide"
    );
    updateText(
        title,
        ticketProps.title,
        ticketProps.showTitle,
        fontScale.title,
        "font-semibold tracking-wide"
    );
    updateText(
        subtitle,
        ticketProps.subtitle,
        ticketProps.showSubtitle,
        fontScale.subtitle,
        "opacity-70"
    );
    updateText(
        number,
        ticketProps.ticketNumber,
        ticketProps.showTicketNumber,
        fontScale.number,
        "font-semibold tracking-tight"
    );

    if (footer) {
        footer.classList.toggle("hidden", !ticketProps.showFooter);
    }
    if (footerSpacer) {
        footerSpacer.classList.toggle("hidden", ticketProps.showFooter);
    }
    updateText(
        footerLeft,
        ticketProps.footerLeft,
        ticketProps.showFooter,
        fontScale.footer,
        "opacity-70"
    );
    updateText(
        footerRight,
        ticketProps.footerRight,
        ticketProps.showFooter,
        fontScale.footer,
        "opacity-70"
    );

    const badgeRow = document.getElementById("ticket-badges");
    if (badgeRow) {
        updateBadges(badgeRow, ticketProps.badges, ticketProps.layout);
    }

    const logo = document.getElementById("ticket-logo");
    const logoPlaceholder = document.getElementById("ticket-logo-placeholder");
    const logoWrapper = document.getElementById("ticket-logo-wrapper");
    if (logo && logoWrapper && logoPlaceholder) {
        const showLogo = ticketProps.logoEnabled;
        const hasImage = Boolean(ticketProps.logo);

        logoWrapper.classList.toggle("hidden", !showLogo);
        logoWrapper.className = `flex ${
            ticketProps.logoPosition === "top-left"
                ? "justify-start"
                : "justify-center"
        }`;

        if (showLogo && hasImage) {
            logo.src = ticketProps.logo;
            logo.classList.remove("hidden");
            logoPlaceholder.classList.add("hidden");
        } else if (showLogo) {
            logo.classList.add("hidden");
            logoPlaceholder.classList.remove("hidden");
            logoPlaceholder.textContent = getInitials(ticketProps);
        }
    }

    const pattern = document.getElementById("ticket-pattern");
    if (pattern) {
        applyPattern(pattern, patternProps, theme.textColor);
    }
}

function getTicketMarkup(props) {
    const ticketProps = withDefaults(props);
    const { theme } = ticketProps;
    const spacing =
        spacingClasses[ticketProps.spacing] || spacingClasses.md;
    const fontScale =
        fontScaleClasses[ticketProps.fontScale] || fontScaleClasses.md;

    return `
        <div
            id="ticket-export"
            class="${baseCardClass} ${ticketProps.corners} ${
        shadowClasses[ticketProps.shadow] || shadowClasses.soft
    }"
            style="border-color: ${theme.borderColor}; color: ${
        theme.textColor
    }; background: ${getBackgroundStyle(theme)};"
        >
            <div
                id="ticket-pattern"
                class="absolute inset-0 pointer-events-none"
            ></div>

            <div id="ticket-content" class="relative z-10 flex flex-col ${spacing}">
                <div class="flex flex-col gap-3">
                    <div id="ticket-badges" class="flex flex-wrap gap-2 justify-center"></div>

                    <div id="ticket-header" class="flex items-center justify-center gap-3">
                        <div id="ticket-logo-wrapper" class="${
        ticketProps.logoEnabled ? "" : "hidden"
    }">
                            <div
                                class="w-12 h-12 rounded-full border border-white/15 bg-white/5 backdrop-blur flex items-center justify-center overflow-hidden"
                            >
                                <img
                                    id="ticket-logo"
                                    class="w-full h-full object-cover"
                                    alt="Logo"
                                />
                                <span id="ticket-logo-placeholder" class="opacity-80 text-sm font-semibold tracking-wide"></span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1">
                            <div id="ticket-handle" class="${fontScale.handle}"></div>
                            <div id="ticket-title" class="${fontScale.title}"></div>
                            <div id="ticket-subtitle" class="${fontScale.subtitle}"></div>
                        </div>
                    </div>
                </div>

                <div id="ticket-qr-zone" class="flex-1 flex items-center justify-center mt-2">
                    <div class="mx-auto w-full max-w-[280px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/10">
                        <div
                            id="qr-canvas"
                            class="ticket-qr w-full h-auto block"
                            role="img"
                            aria-label="Vista previa del codigo QR"
                        ></div>
                    </div>
                </div>

                <div id="ticket-footer" class="flex flex-col gap-2 opacity-80">
                    <div id="ticket-number" class="${fontScale.number}"></div>
                    <div class="flex items-center justify-between w-full">
                        <span id="ticket-footer-left" class="${fontScale.footer}"></span>
                        <span id="ticket-footer-right" class="${fontScale.footer}"></span>
                    </div>
                </div>
                <div id="ticket-footer-spacer" class="h-6"></div>
            </div>
        </div>
    `;
}

function withDefaults(props = {}) {
    const theme = props.theme || {};
    const pattern = props.pattern || {};

    return {
        handle: props.handle || "",
        title: props.title || "",
        subtitle: props.subtitle || "",
        ticketNumber: props.ticketNumber || "",
        footerLeft: props.footerLeft || "",
        footerRight: props.footerRight || "",
        qrData: props.qrData || "",
        logo: props.logo || "",
        logoEnabled: Boolean(props.logoEnabled),
        logoPosition: props.logoPosition || "top-center",
        badges: Array.isArray(props.badges) ? props.badges.slice(0, 3) : ["", "", ""],
        layout: props.layout || "center",
        spacing: props.spacing || "md",
        fontScale: props.fontScale || "md",
        showHandle: props.showHandle !== false,
        showTitle: props.showTitle !== false,
        showSubtitle: props.showSubtitle !== false,
        showTicketNumber: props.showTicketNumber !== false,
        showFooter: props.showFooter !== false,
        theme: {
            bgType: theme.bgType || "gradient",
            bgColor: theme.bgColor || "#0f172a",
            gradientFrom: theme.gradientFrom || "#020617",
            gradientTo: theme.gradientTo || "#0f172a",
            borderColor: theme.borderColor || "#1f2937",
            textColor: theme.textColor || "#f8fafc",
        },
        pattern: {
            enabled: Boolean(pattern.enabled),
            style: pattern.style || "squares",
            opacity: typeof pattern.opacity === "number" ? pattern.opacity : 0.08,
            density: pattern.density || "media",
        },
        corners: props.corners || "rounded-3xl",
        shadow: props.shadow || "strong",
    };
}

function updateText(el, value, isVisible, sizeClass, baseClass = "") {
    if (!el) return;
    const shouldShow = isVisible && value;
    el.className = `${baseClass} ${sizeClass || ""} ${
        shouldShow ? "" : "hidden"
    }`.trim();
    el.textContent = shouldShow ? value : "";
}

function getBackgroundStyle(theme) {
    if (theme.bgType === "gradient") {
        return `linear-gradient(180deg, ${theme.gradientFrom}, ${theme.gradientTo})`;
    }

    return theme.bgColor;
}

function updateBadges(container, badges, layout) {
    const items = (badges || []).slice(0, 3).filter(Boolean);

    if (!items.length) {
        container.innerHTML = "";
        container.classList.add("hidden");
        return;
    }

    const alignment =
        layout === "left"
            ? "justify-start"
            : layout === "right"
              ? "justify-end"
              : "justify-center";
    container.className = `flex flex-wrap gap-2 ${alignment}`;
    container.innerHTML = items
        .map(
            badge => `
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20">
                ${badge}
            </span>
        `
        )
        .join("");
}

function applyPattern(element, pattern, textColor) {
    if (!pattern.enabled || pattern.style === "none") {
        element.style.display = "none";
        return;
    }

    element.style.display = "block";
    element.style.opacity = pattern.opacity;
    element.style.backgroundImage = getPatternBackground(
        pattern.style,
        textColor
    );
    element.style.backgroundSize = getPatternSize(pattern.density);
}

function getPatternBackground(style, color) {
    const rgba = hexToRgba(color, 0.08);

    if (style === "squares") {
        return `linear-gradient(90deg, ${rgba} 1px, transparent 1px),
                linear-gradient(${rgba} 1px, transparent 1px)`;
    }

    return `radial-gradient(${rgba} 1px, transparent 1px)`;
}

function getPatternSize(density) {
    if (density === "alta") return "14px 14px";
    if (density === "baja") return "28px 28px";
    return "20px 20px";
}

function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const expanded = value.length === 3
        ? value
              .split("")
              .map(char => char + char)
              .join("")
        : value;
    const intVal = Number.parseInt(expanded, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getInitials(ticketProps) {
    const source = ticketProps.title || ticketProps.handle || "QR";
    const cleaned = source.replace(/[@/#]/g, "").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);

    if (!parts.length) return "QR";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
