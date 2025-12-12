let qrInstance = null;
let mountEl = null;

export function initQR(container) {
    if (!container) return;

    mountEl = container;

    if (!qrInstance && typeof QRCodeStyling !== "undefined") {
        qrInstance = new QRCodeStyling({
            width: 220,
            height: 220,
            margin: 2,
            dotsOptions: { color: "#000", type: "rounded" },
            backgroundOptions: { color: "#fff" }
        });
    }

    mountEl.innerHTML = "";
    qrInstance.append(mountEl);
}

export function updateQR(data) {
    if (!qrInstance || !data) return;
    qrInstance.update({ data });
}

export function downloadQR(filename = "qr.png") {
    if (!qrInstance) return;

    qrInstance.download({
        name: filename.replace(".png", ""),
        extension: "png"
    });
}
