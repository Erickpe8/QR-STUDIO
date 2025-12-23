export const qrState = {
    text: "",
    fgColor: "#111827",
    bgColor: "#ffffff",
    selectedType: "url",
    payload: {},
    step: 1,
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
