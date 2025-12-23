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

export function updateQR(data, fgColor, bgColor) {
    if (!qrInstance || !data) return;

    const options = { data };

    if (fgColor) {
        options.dotsOptions = { color: fgColor, type: "rounded" };
    }

    if (bgColor) {
        options.backgroundOptions = { color: bgColor };
    }

    qrInstance.update(options);
}

export function downloadQR(filename = "qr.png") {
    if (!qrInstance) return;

    qrInstance.download({
        name: filename.replace(".png", ""),
        extension: "png"
    });
}
