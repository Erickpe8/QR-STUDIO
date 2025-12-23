import { initQR, downloadQR, updateQR } from "../core/qrEngine.js";
import { renderTicketCard, updateTicketCard } from "./TicketCard.js";
import { qrState } from "../state.js";

let qrCanvasEl = null;

export function renderQrPreview() {
    const container = document.getElementById("qr-preview");
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 w-full max-w-[360px] xl:w-[360px] shrink-0">
            <div class="text-sm font-semibold text-slate-700 mb-4">
                Vista previa
            </div>

            <div class="relative flex items-center justify-center bg-slate-100 rounded-xl w-full h-[700px] p-6">
                <div
                    id="qr-placeholder"
                    class="absolute inset-0 flex items-center justify-center
                           text-slate-400 text-sm text-center px-6"
                    aria-live="polite"
                >
                    El codigo QR aparecera aqui
                </div>

                <div id="ticket-container" class="relative z-10 w-full flex justify-center max-w-[420px]"></div>
            </div>

            <button
                id="qr-download-btn"
                class="mt-5 w-full px-4 py-3 bg-indigo-600 text-white rounded-xl
                       hover:bg-indigo-700 transition disabled:opacity-50"
                aria-label="Descargar codigo QR"
                disabled
            >
                Descargar QR
            </button>
        </div>
    `;

    const ticketContainer = document.getElementById("ticket-container");
    qrCanvasEl = renderTicketCard(ticketContainer, getTicketProps());

    initQR(qrCanvasEl);
    updateTicketCard(getTicketProps());

    document
        .getElementById("qr-download-btn")
        .addEventListener("click", () => {
            downloadTicket();
        });

    setPreviewState(false);
}

export function setPreviewState(hasData) {
    const placeholder = document.getElementById("qr-placeholder");
    const downloadBtn = document.getElementById("qr-download-btn");
    const qrCanvas = document.getElementById("qr-canvas");

    if (!placeholder || !downloadBtn || !qrCanvas) return;

    placeholder.style.opacity = hasData ? "0" : "1";
    placeholder.style.pointerEvents = hasData ? "none" : "auto";
    qrCanvas.style.opacity = hasData ? "1" : "0";

    downloadBtn.disabled = !hasData;
}

export function getQrCanvas() {
    return qrCanvasEl;
}

export function updateQrPreview(data, fgColor, bgColor) {
    if (!data) return;
    updateQR(data, fgColor, bgColor);
}

export function refreshTicketCard() {
    updateTicketCard(getTicketProps());
}

function getTicketProps() {
    return {
        ...qrState.ticket,
        qrData: qrState.text,
    };
}

async function downloadTicket(filename) {
    const ticket = document.getElementById("ticket-export");

    if (!ticket) {
        downloadQR(filename);
        return;
    }

    if (typeof html2canvas === "undefined") {
        downloadQR(filename);
        return;
    }

    await nextFrame();
    const rect = ticket.getBoundingClientRect();

    const scale = rect.width < 340 ? 3 : 2;

    html2canvas(ticket, {
        backgroundColor: null,
        scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
    }).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = filename || getTicketFilename();
        link.click();
    });
}

function getTicketFilename() {
    const now = new Date();
    const pad = value => String(value).padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
        now.getDate()
    )}-${pad(now.getHours())}${pad(now.getMinutes())}`;

    return `qr-ticket-${stamp}.png`;
}

function nextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
}
