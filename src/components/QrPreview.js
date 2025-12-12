export function renderQrPreview() {
    const container = document.getElementById("qr-preview");

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 w-full max-w-sm flex flex-col items-center">
        <div
            id="qr-canvas-wrapper"
            class="w-56 h-56 flex items-center justify-center border-2 border-dashed rounded-xl text-slate-400"
        >
            Vista previa del QR
        </div>
        </div>
    `;
}

export function updateQrPreview(text) {
    const wrapper = document.getElementById("qr-canvas-wrapper");
    if (!wrapper || !text) return;

    wrapper.innerHTML = "";

    QRCode.toCanvas(
        text,
        { width: 220, margin: 2 },
        (err, canvas) => {
        if (err) return;
        wrapper.appendChild(canvas);
        }
    );
}
