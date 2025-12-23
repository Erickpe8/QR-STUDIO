const baseCardClass =
    "ticket-card relative border overflow-hidden";

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
    sm: "p-4 gap-4",
    md: "p-6 gap-5",
    lg: "p-8 gap-6",
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
        handle: "text-sm",
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
        content.className = `relative z-10 flex flex-col ${spacing} ${alignment}`;
    }

    const handle = document.getElementById("ticket-handle");
    const title = document.getElementById("ticket-title");
    const subtitle = document.getElementById("ticket-subtitle");
    const number = document.getElementById("ticket-number");
    const footer = document.getElementById("ticket-footer");
    const footerLeft = document.getElementById("ticket-footer-left");
    const footerRight = document.getElementById("ticket-footer-right");

    const fontScale =
        fontScaleClasses[ticketProps.fontScale] || fontScaleClasses.md;

    updateText(handle, ticketProps.handle, ticketProps.showHandle, fontScale.handle);
    updateText(title, ticketProps.title, ticketProps.showTitle, fontScale.title);
    updateText(subtitle, ticketProps.subtitle, ticketProps.showTitle, fontScale.subtitle);
    updateText(number, ticketProps.ticketNumber, ticketProps.showTicketNumber, fontScale.number);

    if (footer) {
        footer.classList.toggle("hidden", !ticketProps.showFooter);
    }
    updateText(footerLeft, ticketProps.footerLeft, ticketProps.showFooter, fontScale.footer);
    updateText(footerRight, ticketProps.footerRight, ticketProps.showFooter, fontScale.footer);

    const badgeRow = document.getElementById("ticket-badges");
    if (badgeRow) {
        updateBadges(badgeRow, ticketProps.badges, ticketProps.layout);
    }

    const logo = document.getElementById("ticket-logo");
    const logoWrapper = document.getElementById("ticket-logo-wrapper");
    if (logo && logoWrapper) {
        const showLogo = ticketProps.logoEnabled && ticketProps.logo;
        logoWrapper.classList.toggle("hidden", !showLogo);
        if (showLogo) {
            logo.src = ticketProps.logo;
        }
        logoWrapper.className = `w-full flex ${
            ticketProps.logoPosition === "top-left"
                ? "justify-start"
                : "justify-center"
        }`;
    }

    const pattern = document.getElementById("ticket-pattern");
    if (pattern) {
        applyPattern(pattern, patternProps, theme.textColor);
    }
}

function getTicketMarkup(props) {
    const ticketProps = withDefaults(props);
    const { theme, pattern } = ticketProps;
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
                class="absolute -top-16 right-8 w-48 h-48 rounded-full blur-3xl opacity-40"
                style="background: ${theme.gradientTo || theme.textColor};"
            ></div>

            <div
                id="ticket-pattern"
                class="absolute inset-0 pointer-events-none"
            ></div>

            <div id="ticket-content" class="relative z-10 flex flex-col ${spacing}">
                <div class="flex flex-col gap-3">
                    <div id="ticket-badges" class="flex flex-wrap gap-2 justify-center"></div>

                    <div id="ticket-logo-wrapper" class="w-full flex justify-center ${
        ticketProps.logoEnabled && ticketProps.logo ? "" : "hidden"
    }">
                        <img
                            id="ticket-logo"
                            class="w-10 h-10 rounded-full object-cover border border-white/20"
                            alt="Logo"
                        />
                    </div>

                    <div id="ticket-handle" class="uppercase tracking-wide ${fontScale.handle}"></div>
                    <div id="ticket-title" class="font-semibold ${fontScale.title}"></div>
                    <div id="ticket-subtitle" class="opacity-80 ${fontScale.subtitle}"></div>
                </div>

                <div id="ticket-layout" class="flex flex-col items-center gap-4 flex-1 justify-center">
                    <div
                        class="bg-white/10 rounded-3xl p-3 border border-white/15"
                    >
                        <div
                            id="qr-canvas"
                            class="ticket-qr flex items-center justify-center"
                            role="img"
                            aria-label="Vista previa del codigo QR"
                        ></div>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <div id="ticket-number" class="font-semibold tracking-tight ${fontScale.number}"></div>

                    <div id="ticket-footer" class="flex items-center justify-between opacity-75">
                        <span id="ticket-footer-left" class="${fontScale.footer}"></span>
                        <span id="ticket-footer-right" class="${fontScale.footer}"></span>
                    </div>
                </div>
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
        showTicketNumber: props.showTicketNumber !== false,
        showFooter: props.showFooter !== false,
        theme: {
            bgType: theme.bgType || "gradient",
            bgColor: theme.bgColor || "#0f172a",
            gradientFrom: theme.gradientFrom || "#0f172a",
            gradientTo: theme.gradientTo || "#1f2937",
            borderColor: theme.borderColor || "#1f2937",
            textColor: theme.textColor || "#f8fafc",
        },
        pattern: {
            enabled: Boolean(pattern.enabled),
            style: pattern.style || "squares",
            opacity: typeof pattern.opacity === "number" ? pattern.opacity : 0.18,
            density: pattern.density || "media",
        },
        corners: props.corners || "rounded-3xl",
        shadow: props.shadow || "strong",
    };
}

function updateText(el, value, isVisible, sizeClass) {
    if (!el) return;
    const shouldShow = isVisible && value;
    el.className = `${sizeClass || ""} ${shouldShow ? "" : "hidden"}`.trim();
    el.textContent = shouldShow ? value : "";
}

function getBackgroundStyle(theme) {
    if (theme.bgType === "gradient") {
        return `linear-gradient(160deg, ${theme.gradientFrom}, ${theme.gradientTo})`;
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
    const rgba = hexToRgba(color, 0.25);

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
