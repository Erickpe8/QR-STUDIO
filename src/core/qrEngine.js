let qrInstance;
let mounted = false;
let fallbackCanvasRef = null;

export function initQR() {
    qrInstance = typeof QRCodeStyling !== "undefined"
        ? new QRCodeStyling({
            width: 220,
            height: 220,
            margin: 2,
            dotsOptions: { color: "#000", type: "rounded" },
            backgroundOptions: { color: "#fff" }
        })
        : null;

    mounted = false;
    fallbackCanvasRef = null;
}

function renderFallbackQR(data, canvas) {
    if (!canvas || typeof QRCode === "undefined") return;
    QRCode.toCanvas(canvas, data, { width: 220, margin: 2 }).catch(() => {});
}

export function updateQR(data, container) {
    if (!data || !container) return;

    container.classList.remove("hidden");
    container.style.removeProperty("display");
    container.style.removeProperty("visibility");
    container.style.removeProperty("opacity");
    container.style.removeProperty("position");
    container.style.removeProperty("inset");
    container.style.removeProperty("width");
    container.style.removeProperty("height");

    if (!mounted) {
        container.innerHTML = "";

        if (qrInstance) {
            qrInstance.append(container);
        } else {
            const canvas = document.createElement("canvas");
            canvas.id = "qr-fallback-canvas";
            canvas.width = 220;
            canvas.height = 220;
            container.appendChild(canvas);
            fallbackCanvasRef = canvas;
        }

        mounted = true;
    }

    if (qrInstance) {
        qrInstance.update({ data });
        return;
    }

    const fallbackCanvas =
        container.querySelector("#qr-fallback-canvas") ||
        container.querySelector("canvas");

    renderFallbackQR(data, fallbackCanvas);
    fallbackCanvasRef = fallbackCanvas;
}

export function downloadQR(filename = "qr.png") {
    if (qrInstance) {
        const name = filename.replace(/\.png$/i, "") || "qr";
        qrInstance.download({ name, extension: "png" });
        return;
    }

    if (!fallbackCanvasRef) return;

    const link = document.createElement("a");
    link.href = fallbackCanvasRef.toDataURL("image/png");
    link.download = filename || "qr.png";
    link.click();
}
