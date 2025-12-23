export const qrState = {
    text: "",
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
    qrState.text = "";
}

export function setStep(step) {
    qrState.step = step;
}
