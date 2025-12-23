export const qrState = {
    qrData: "",
    fgColor: "#111827",
    bgColor: "#ffffff",
    selectedType: "",
    payload: {},
    step: 1,
    ticket: {
        handle: "",
        title: "",
        subtitle: "",
        ticketNumber: "",
        footerLeft: "",
        footerRight: "",
        logo: "",
        logoEnabled: false,
        logoPosition: "top-center",
        badges: ["", "", ""],
        layout: "center",
        spacing: "md",
        fontScale: "md",
        showHandle: true,
        showTitle: true,
        showSubtitle: true,
        showTicketNumber: true,
        showFooter: true,
        theme: {
            bgType: "gradient",
            bgColor: "#0f172a",
            gradientFrom: "#0f172a",
            gradientTo: "#1f2937",
            borderColor: "#1f2937",
            textColor: "#f8fafc",
        },
        pattern: {
            enabled: true,
            style: "squares",
            opacity: 0.08,
            density: "media",
        },
        corners: "rounded-3xl",
        shadow: "strong",
    },
};

export function setSelectedType(type) {
    qrState.selectedType = type;
}

export function resetPayload() {
    qrState.payload = {};
    qrState.qrData = "";
}

export function setStep(step) {
    qrState.step = step;
}

export function buildQrDataByType(type, payload = {}) {
    switch (type) {
        case "url":
            return (payload.url || "").trim();
        case "wifi":
            return buildWifiPayload(payload);
        case "contact":
            return buildVCardPayload(payload);
        case "text":
            return (payload.message || "").trim();
        case "whatsapp":
            return buildWhatsAppPayload(payload);
        case "location":
            return buildMapsPayload(payload);
        case "event":
            return buildEventPayload(payload);
        case "email":
            return buildEmailPayload(payload);
        case "phone":
            return buildPhonePayload(payload);
        default:
            return "";
    }
}

function buildWifiPayload(payload) {
    const encryption =
        payload.encryption === "NONE"
            ? "nopass"
            : payload.encryption === "WPA/WPA2"
              ? "WPA"
              : payload.encryption;

    const hidden = payload.hidden ? "H:true;" : "";
    const password = payload.password || "";
    const ssid = payload.ssid || "";

    return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`;
}

function buildVCardPayload(payload) {
    const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${payload.fullName}`];

    if (payload.phone) {
        lines.push(`TEL:${payload.phone}`);
    }

    if (payload.email) {
        lines.push(`EMAIL:${payload.email}`);
    }

    if (payload.company) {
        lines.push(`ORG:${payload.company}`);
    }

    if (payload.title) {
        lines.push(`TITLE:${payload.title}`);
    }

    if (payload.website) {
        lines.push(`URL:${payload.website}`);
    }

    lines.push("END:VCARD");

    return lines.join("\n");
}

function buildWhatsAppPayload(payload) {
    const phone = normalizePhoneNumber(payload.phone);
    if (!phone) return "";
    const message = (payload.message || "").trim();
    const query = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${phone}${query}`;
}

function buildMapsPayload(payload) {
    const address = (payload.address || "").trim();
    if (!address) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
}

function buildEmailPayload(payload) {
    const to = (payload.to || "").trim();
    if (!to) return "";
    const query = [];
    if (payload.subject) {
        query.push(`subject=${encodeURIComponent(payload.subject.trim())}`);
    }
    if (payload.body) {
        query.push(`body=${encodeURIComponent(payload.body.trim())}`);
    }
    const suffix = query.length ? `?${query.join("&")}` : "";
    return `mailto:${to}${suffix}`;
}

function buildPhonePayload(payload) {
    const phone = normalizePhoneNumber(payload.phone);
    if (!phone) return "";
    return `tel:+${phone}`;
}

function buildEventPayload(payload) {
    const title = escapeIcsText(payload.title || "");
    const startDate = payload.startDate || "";
    const startTime = payload.startTime || "";
    if (!title || !startDate || !startTime) return "";

    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT"];
    lines.push(`SUMMARY:${title}`);
    lines.push(`DTSTART:${formatIcsDateTime(startDate, startTime)}`);

    if (payload.endDate) {
        const endTime = payload.endTime || "00:00";
        lines.push(`DTEND:${formatIcsDateTime(payload.endDate, endTime)}`);
    }

    if (payload.location) {
        lines.push(`LOCATION:${escapeIcsText(payload.location)}`);
    }

    if (payload.description) {
        lines.push(`DESCRIPTION:${escapeIcsText(payload.description)}`);
    }

    lines.push("END:VEVENT", "END:VCALENDAR");
    return lines.join("\n");
}

function normalizePhoneNumber(value = "") {
    const cleaned = String(value).trim().replace(/[\s()-]/g, "");
    if (!/^\+?\d+$/.test(cleaned)) return "";
    return cleaned.replace(/^\+/, "");
}

function formatIcsDateTime(dateValue, timeValue) {
    const date = dateValue.replace(/-/g, "");
    const time = (timeValue || "00:00").replace(":", "");
    return `${date}T${time}00`;
}

function escapeIcsText(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
}
