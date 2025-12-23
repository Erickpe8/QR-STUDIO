import { updateQR } from "../../core/qrEngine.js";
import { setPreviewState } from "../../components/QrPreview.js";
import { buildQrDataByType, qrState } from "../../state.js";

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

    switch (qrState.selectedType) {
        case "url":
            setupUrlForm(nextButton);
            break;
        case "wifi":
            setupWifiForm(nextButton);
            break;
        case "contact":
            setupContactForm(nextButton);
            break;
        case "text":
            setupTextForm(nextButton);
            break;
        case "whatsapp":
            setupWhatsAppForm(nextButton);
            break;
        case "location":
            setupLocationForm(nextButton);
            break;
        case "event":
            setupEventForm(nextButton);
            break;
        case "email":
            setupEmailForm(nextButton);
            break;
        case "phone":
            setupPhoneForm(nextButton);
            break;
        default:
            setupUrlForm(nextButton);
            break;
    }
}

function getFormMarkup() {
    switch (qrState.selectedType) {
        case "wifi":
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
                        Este campo es obligatorio
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
        case "contact":
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
                        Este campo es obligatorio
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
        case "text":
            return `
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Mensaje</label>
                    <textarea
                        id="text-message"
                        rows="4"
                        maxlength="500"
                        placeholder="Escribe tu mensaje"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >${qrState.payload.message || ""}</textarea>
                    <p id="text-message-error" class="text-sm text-red-500 hidden" role="alert">
                        Este campo es obligatorio
                    </p>
                </div>
            `;
        case "whatsapp":
            return `
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Numero de telefono</label>
                    <input
                        id="whatsapp-phone"
                        type="tel"
                        placeholder="+51999999999"
                        value="${qrState.payload.phone || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p id="whatsapp-phone-error" class="text-sm text-red-500 hidden" role="alert">
                        Telefono invalido
                    </p>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Mensaje (opcional)</label>
                    <textarea
                        id="whatsapp-message"
                        rows="3"
                        placeholder="Hola, quiero mas informacion"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >${qrState.payload.message || ""}</textarea>
                </div>
            `;
        case "location":
            return `
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Direccion o lugar</label>
                    <input
                        id="location-address"
                        type="text"
                        placeholder="Direccion o lugar"
                        value="${qrState.payload.address || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p id="location-address-error" class="text-sm text-red-500 hidden" role="alert">
                        Este campo es obligatorio
                    </p>
                </div>
            `;
        case "event":
            return `
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Titulo del evento</label>
                    <input
                        id="event-title"
                        type="text"
                        placeholder="Titulo del evento"
                        value="${qrState.payload.title || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p id="event-title-error" class="text-sm text-red-500 hidden" role="alert">
                        Este campo es obligatorio
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Fecha de inicio</label>
                        <input
                            id="event-start-date"
                            type="date"
                            value="${qrState.payload.startDate || ""}"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p id="event-start-date-error" class="text-sm text-red-500 hidden" role="alert">
                            Este campo es obligatorio
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Hora de inicio</label>
                        <input
                            id="event-start-time"
                            type="time"
                            value="${qrState.payload.startTime || ""}"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p id="event-start-time-error" class="text-sm text-red-500 hidden" role="alert">
                            Este campo es obligatorio
                        </p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Fecha de fin</label>
                        <input
                            id="event-end-date"
                            type="date"
                            value="${qrState.payload.endDate || ""}"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-700">Hora de fin</label>
                        <input
                            id="event-end-time"
                            type="time"
                            value="${qrState.payload.endTime || ""}"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Ubicacion (opcional)</label>
                    <input
                        id="event-location"
                        type="text"
                        placeholder="Ubicacion"
                        value="${qrState.payload.location || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Descripcion (opcional)</label>
                    <textarea
                        id="event-description"
                        rows="3"
                        placeholder="Descripcion"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >${qrState.payload.description || ""}</textarea>
                </div>
            `;
        case "email":
            return `
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Correo destino</label>
                    <input
                        id="email-to"
                        type="email"
                        placeholder="correo@empresa.com"
                        value="${qrState.payload.to || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p id="email-to-error" class="text-sm text-red-500 hidden" role="alert">
                        Correo invalido
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Asunto (opcional)</label>
                    <input
                        id="email-subject"
                        type="text"
                        placeholder="Asunto"
                        value="${qrState.payload.subject || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Mensaje (opcional)</label>
                    <textarea
                        id="email-body"
                        rows="3"
                        placeholder="Mensaje"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >${qrState.payload.body || ""}</textarea>
                </div>
            `;
        case "phone":
            return `
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-700">Numero de telefono</label>
                    <input
                        id="phone-number"
                        type="tel"
                        placeholder="+51999999999"
                        value="${qrState.payload.phone || ""}"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p id="phone-number-error" class="text-sm text-red-500 hidden" role="alert">
                        Telefono invalido
                    </p>
                </div>
            `;
        case "url":
        default:
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

        applyQrData(isValid, { url: value }, nextButton);
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

        const payload = {
            ssid,
            password,
            encryption,
            hidden,
        };
        applyQrData(isValid, payload, nextButton);
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

        const payload = {
            fullName,
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            company: companyInput.value.trim(),
            title: titleInput.value.trim(),
            website: websiteInput.value.trim(),
        };
        applyQrData(isValid, payload, nextButton);
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

function setupTextForm(nextButton) {
    const input = document.getElementById("text-message");
    const error = document.getElementById("text-message-error");

    let touched = false;

    const validate = () => {
        const message = input.value.trim();
        const isValid = message.length > 0 && message.length <= 500;
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        applyQrData(isValid, { message }, nextButton);
    };

    input.addEventListener("input", () => {
        touched = true;
        validate();
    });

    validate();
}

function setupWhatsAppForm(nextButton) {
    const phoneInput = document.getElementById("whatsapp-phone");
    const messageInput = document.getElementById("whatsapp-message");
    const error = document.getElementById("whatsapp-phone-error");

    let touched = false;

    const validate = () => {
        const phoneValue = phoneInput.value.trim();
        const cleanedPhone = cleanPhoneValue(phoneValue);
        const isValid = cleanedPhone.length > 0 && isValidPhone(phoneValue);
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        applyQrData(
            isValid,
            {
                phone: cleanedPhone,
                message: messageInput.value.trim(),
            },
            nextButton
        );
    };

    [phoneInput, messageInput].forEach(el => {
        el.addEventListener("input", () => {
            touched = true;
            validate();
        });
    });

    validate();
}

function setupLocationForm(nextButton) {
    const input = document.getElementById("location-address");
    const error = document.getElementById("location-address-error");

    let touched = false;

    const validate = () => {
        const address = input.value.trim();
        const isValid = address.length > 0;
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        applyQrData(isValid, { address }, nextButton);
    };

    input.addEventListener("input", () => {
        touched = true;
        validate();
    });

    validate();
}

function setupEventForm(nextButton) {
    const titleInput = document.getElementById("event-title");
    const startDateInput = document.getElementById("event-start-date");
    const startTimeInput = document.getElementById("event-start-time");
    const endDateInput = document.getElementById("event-end-date");
    const endTimeInput = document.getElementById("event-end-time");
    const locationInput = document.getElementById("event-location");
    const descriptionInput = document.getElementById("event-description");

    const titleError = document.getElementById("event-title-error");
    const startDateError = document.getElementById("event-start-date-error");
    const startTimeError = document.getElementById("event-start-time-error");

    const touched = {
        title: false,
        startDate: false,
        startTime: false,
    };

    const validate = () => {
        const title = titleInput.value.trim();
        const startDate = startDateInput.value;
        const startTime = startTimeInput.value;

        const isTitleValid = title.length > 0;
        const isStartDateValid = Boolean(startDate);
        const isStartTimeValid = Boolean(startTime);
        const isValid = isTitleValid && isStartDateValid && isStartTimeValid;

        titleError.classList.toggle(
            "hidden",
            !(touched.title && !isTitleValid)
        );
        startDateError.classList.toggle(
            "hidden",
            !(touched.startDate && !isStartDateValid)
        );
        startTimeError.classList.toggle(
            "hidden",
            !(touched.startTime && !isStartTimeValid)
        );

        applyQrData(
            isValid,
            {
                title,
                startDate,
                startTime,
                endDate: endDateInput.value || "",
                endTime: endTimeInput.value || "",
                location: locationInput.value.trim(),
                description: descriptionInput.value.trim(),
            },
            nextButton
        );
    };

    titleInput.addEventListener("input", () => {
        touched.title = true;
        validate();
    });
    startDateInput.addEventListener("input", () => {
        touched.startDate = true;
        validate();
    });
    startTimeInput.addEventListener("input", () => {
        touched.startTime = true;
        validate();
    });
    [endDateInput, endTimeInput, locationInput, descriptionInput].forEach(el => {
        el.addEventListener("input", () => {
            validate();
        });
    });

    validate();
}

function setupEmailForm(nextButton) {
    const toInput = document.getElementById("email-to");
    const subjectInput = document.getElementById("email-subject");
    const bodyInput = document.getElementById("email-body");
    const error = document.getElementById("email-to-error");

    let touched = false;

    const validate = () => {
        const to = toInput.value.trim();
        const isValid = isValidEmail(to);
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        applyQrData(
            isValid,
            {
                to,
                subject: subjectInput.value.trim(),
                body: bodyInput.value.trim(),
            },
            nextButton
        );
    };

    [toInput, subjectInput, bodyInput].forEach(el => {
        el.addEventListener("input", () => {
            touched = true;
            validate();
        });
    });

    validate();
}

function setupPhoneForm(nextButton) {
    const input = document.getElementById("phone-number");
    const error = document.getElementById("phone-number-error");

    let touched = false;

    const validate = () => {
        const phoneValue = input.value.trim();
        const cleanedPhone = cleanPhoneValue(phoneValue);
        const isValid = cleanedPhone.length > 0 && isValidPhone(phoneValue);
        const showError = touched && !isValid;

        error.classList.toggle("hidden", !showError);
        applyQrData(isValid, { phone: cleanedPhone }, nextButton);
    };

    input.addEventListener("input", () => {
        touched = true;
        validate();
    });

    validate();
}

function applyQrData(isValid, payload, nextButton) {
    qrState.payload = payload;
    const data = isValid
        ? buildQrDataByType(qrState.selectedType, payload)
        : "";
    qrState.qrData = data;

    nextButton.disabled = !isValid;

    if (isValid && data) {
        updateQR(data, qrState.fgColor, qrState.bgColor);
        setPreviewState(true);
    } else {
        setPreviewState(false);
    }
}

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function cleanPhoneValue(value) {
    return String(value).trim().replace(/[\s()-]/g, "");
}

function isValidPhone(value) {
    const cleaned = cleanPhoneValue(value);
    return /^\+?\d+$/.test(cleaned);
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
