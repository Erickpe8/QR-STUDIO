import { updateQR } from "../../core/qrEngine.js";
import { setPreviewState } from "../../components/QrPreview.js";
import { qrState } from "../../state.js";

export function renderQrContentForm({ onBack, onNext } = {}) {
    const container = document.getElementById("module-container");
    if (!container) return;

    if (!qrState.selectedType) {
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow p-6 space-y-4">
                <h3 class="text-lg font-semibold text-slate-800">
                    Contenido
                </h3>
                <p class="text-sm text-slate-500">
                    Selecciona un tipo de QR para continuar.
                </p>
                <div class="flex justify-end">
                    <button
                        id="qr-content-back"
                        class="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                    >
                        Volver
                    </button>
                </div>
            </div>
        `;

        const backButton = document.getElementById("qr-content-back");
        if (backButton && onBack) {
            backButton.addEventListener("click", onBack);
        }
        return;
    }

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow p-6 space-y-6">
            <div>
                <h3 class="text-lg font-semibold text-slate-800">
                    Contenido
                </h3>
                <p class="text-sm text-slate-500">
                    Completa la informacion segun el tipo seleccionado
                </p>
            </div>

            <div class="space-y-4">
                ${getFormMarkup()}
            </div>

            <div class="flex justify-between">
                <button
                    id="qr-content-back"
                    class="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                    Volver
                </button>
                <button
                    id="qr-content-next"
                    class="px-6 py-3 bg-indigo-600 text-white rounded-xl
                           hover:bg-indigo-700 transition disabled:opacity-50"
                    disabled
                >
                    Continuar
                </button>
            </div>
        </div>
    `;

    const backButton = document.getElementById("qr-content-back");
    const nextButton = document.getElementById("qr-content-next");

    if (backButton && onBack) {
        backButton.addEventListener("click", onBack);
    }

    if (nextButton && onNext) {
        nextButton.addEventListener("click", onNext);
    }

    if (qrState.selectedType === "url") {
        setupUrlForm(nextButton);
    }

    if (qrState.selectedType === "wifi") {
        setupWifiForm(nextButton);
    }

    if (qrState.selectedType === "contact") {
        setupContactForm(nextButton);
    }
}

function getFormMarkup() {
    if (qrState.selectedType === "wifi") {
        return `
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">SSID</label>
                <input
                    id="wifi-ssid"
                    type="text"
                    placeholder="Nombre de la red"
                    value="${qrState.payload.ssid || ""}"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p id="wifi-ssid-error" class="text-sm text-red-500 hidden" role="alert">
                    El SSID es obligatorio
                </p>
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Password</label>
                <input
                    id="wifi-password"
                    type="text"
                    placeholder="Clave (opcional)"
                    value="${qrState.payload.password || ""}"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Encriptacion</label>
                <select
                    id="wifi-encryption"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    ${getWifiOptions()}
                </select>
            </div>

            <label class="flex items-center gap-3 text-sm text-slate-700">
                <input id="wifi-hidden" type="checkbox" class="w-4 h-4" ${
                    qrState.payload.hidden ? "checked" : ""
                } />
                Red oculta
            </label>
        `;
    }

    if (qrState.selectedType === "contact") {
        return `
            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Nombre completo</label>
                <input
                    id="contact-name"
                    type="text"
                    placeholder="Nombre y apellido"
                    value="${qrState.payload.fullName || ""}"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p id="contact-name-error" class="text-sm text-red-500 hidden" role="alert">
                    El nombre es obligatorio
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Telefono</label>
                    <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+51 999 999 999"
                        value="${qrState.payload.phone || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        placeholder="correo@empresa.com"
                        value="${qrState.payload.email || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Empresa</label>
                    <input
                        id="contact-company"
                        type="text"
                        placeholder="Empresa"
                        value="${qrState.payload.company || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Cargo</label>
                    <input
                        id="contact-title"
                        type="text"
                        placeholder="Cargo"
                        value="${qrState.payload.title || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Sitio web</label>
                <input
                    id="contact-website"
                    type="url"
                    placeholder="https://empresa.com"
                    value="${qrState.payload.website || ""}"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        `;
    }

    return `
        <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">URL</label>
            <input
                id="qr-url-input"
                type="url"
                placeholder="https://ejemplo.com"
                value="${qrState.payload.url || ""}"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p id="qr-url-error" class="text-sm text-red-500 hidden" role="alert">
                Ingresa una URL valida con http o https
            </p>
        </div>
    `;
}

function setupUrlForm(nextButton) {
    const input = document.getElementById("qr-url-input");
    const error = document.getElementById("qr-url-error");

    let touched = false;

    const validate = () => {
        const value = input.value.trim();
        const isValid = isValidUrl(value);
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        nextButton.disabled = !isValid;

        qrState.payload.url = value;

        if (isValid) {
            qrState.text = value;
            updateQR(value);
            setPreviewState(true);
        } else {
            qrState.text = "";
            setPreviewState(false);
        }
    };

    input.addEventListener("input", () => {
        touched = true;
        validate();
    });

    validate();
}

function setupWifiForm(nextButton) {
    const ssidInput = document.getElementById("wifi-ssid");
    const passwordInput = document.getElementById("wifi-password");
    const encryptionSelect = document.getElementById("wifi-encryption");
    const hiddenInput = document.getElementById("wifi-hidden");
    const error = document.getElementById("wifi-ssid-error");

    let touched = false;

    const validate = () => {
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value.trim();
        const encryption = encryptionSelect.value;
        const hidden = hiddenInput.checked;
        const isValid = ssid.length > 0;
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        nextButton.disabled = !isValid;

        qrState.payload = {
            ssid,
            password,
            encryption,
            hidden,
        };

        if (isValid) {
            const wifiPayload = buildWifiPayload(qrState.payload);
            qrState.text = wifiPayload;
            updateQR(wifiPayload);
            setPreviewState(true);
        } else {
            qrState.text = "";
            setPreviewState(false);
        }
    };

    [ssidInput, passwordInput, encryptionSelect, hiddenInput].forEach(el => {
        el.addEventListener("input", () => {
            touched = true;
            validate();
        });
        el.addEventListener("change", () => {
            touched = true;
            validate();
        });
    });

    validate();
}

function setupContactForm(nextButton) {
    const nameInput = document.getElementById("contact-name");
    const phoneInput = document.getElementById("contact-phone");
    const emailInput = document.getElementById("contact-email");
    const companyInput = document.getElementById("contact-company");
    const titleInput = document.getElementById("contact-title");
    const websiteInput = document.getElementById("contact-website");
    const error = document.getElementById("contact-name-error");

    let touched = false;

    const validate = () => {
        const fullName = nameInput.value.trim();
        const isValid = fullName.length > 0;
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        nextButton.disabled = !isValid;

        qrState.payload = {
            fullName,
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            company: companyInput.value.trim(),
            title: titleInput.value.trim(),
            website: websiteInput.value.trim(),
        };

        if (isValid) {
            const vcard = buildVCardPayload(qrState.payload);
            qrState.text = vcard;
            updateQR(vcard);
            setPreviewState(true);
        } else {
            qrState.text = "";
            setPreviewState(false);
        }
    };

    [
        nameInput,
        phoneInput,
        emailInput,
        companyInput,
        titleInput,
        websiteInput,
    ].forEach(el => {
        el.addEventListener("input", () => {
            touched = true;
            validate();
        });
    });

    validate();
}

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function getWifiOptions() {
    const selected = qrState.payload.encryption || "WPA/WPA2";
    const options = ["WPA/WPA2", "WEP", "NONE"];

    return options
        .map(
            value =>
                `<option value="${value}" ${
                    selected === value ? "selected" : ""
                }>${value}</option>`
        )
        .join("");
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
