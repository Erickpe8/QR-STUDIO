let qr;
let isInitialized = false;

export function initQR(container) {
    qr = new QRCodeStyling({
        width: 260,
        height: 260,
        margin: 10,
        dotsOptions: {
        color: "#000",
        type: "rounded"
        },
        backgroundOptions: {
        color: "#fff"
        }
    });

    container.innerHTML = "";
}

export function updateQR(data, container) {
    if (!data) return;

    if (!isInitialized) {
        qr.append(container);
        isInitialized = true;
    }

    qr.update({ data });
}

    export function downloadQR() {
    if (qr && isInitialized) {
        qr.download({ name: "qr-studio", extension: "png" });
    }
}
