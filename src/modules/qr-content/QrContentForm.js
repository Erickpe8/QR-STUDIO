import { updateQR } from "../../core/qrEngine.js";
import { setPreviewState } from "../../components/QrPreview.js";
import { buildQrDataByType, qrState } from "../../state.js";
import { notifyList } from "../../ui/alerts.js";

let currentValidity = false;
let currentMissing = [];
let attemptedAdvance = false;
let revalidateCurrentForm = null;
let currentInvalidFieldId = "";
let validationToastHandle = null;

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

    attemptedAdvance = false;
    currentValidity = false;
    currentMissing = [];
    currentInvalidFieldId = "";
    revalidateCurrentForm = null;

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
                           hover:bg-indigo-700 transition"
                    aria-disabled="true"
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
        nextButton.addEventListener("click", event => {
            if (!currentValidity) {
                event.preventDefault();
                attemptedAdvance = true;
                if (typeof revalidateCurrentForm === "function") {
                    revalidateCurrentForm();
                }
                if (currentMissing.length) {
                    notifyValidation(currentMissing, currentInvalidFieldId);
                }
                return;
            }
            notifyValidation([], "");
            onNext();
        });
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
                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3
                               text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                               focus:border-indigo-400"
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
                        Este campo es obligatorio
                    </p>
                    <p id="whatsapp-phone-hint" class="text-xs text-slate-500 hidden">
                        Solo numeros, minimo 7
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
                        Este campo es obligatorio
                    </p>
                    <p id="phone-number-hint" class="text-xs text-slate-500 hidden">
                        Solo numeros, minimo 7
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

    const touched = {
        url: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const value = input.value.trim();
        const isEmpty = value.length === 0;
        const isValid = !isEmpty && isValidUrl(value);
        const showFieldError = submitAttempt || touched.url;
        const showError = showFieldError && !isValid;
        const missing = !isValid && submitAttempt
            ? ["URL: Ingresa una URL valida que empiece por http:// o https://"]
            : [];

        if (showError) {
            error.textContent = isEmpty
                ? "Este campo es obligatorio"
                : "Ingresa una URL valida con http o https";
        }
        error.classList.toggle("hidden", !showError);
        const fieldId = !isValid && submitAttempt ? "qr-url-input" : "";
        setValidationState(isValid, missing, fieldId);

        applyQrData(isValid, { url: value }, nextButton);
    };

    input.addEventListener("input", validate);
    input.addEventListener("blur", () => {
        touched.url = true;
        validate();
    });

    revalidateCurrentForm = validate;
    validate();
}

function setupWifiForm(nextButton) {
    const ssidInput = document.getElementById("wifi-ssid");
    const passwordInput = document.getElementById("wifi-password");
    const encryptionSelect = document.getElementById("wifi-encryption");
    const hiddenInput = document.getElementById("wifi-hidden");
    const error = document.getElementById("wifi-ssid-error");

    const touched = {
        ssid: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value.trim();
        const encryption = encryptionSelect.value;
        const hidden = hiddenInput.checked;
        const isEmpty = ssid.length === 0;
        const isValid = !isEmpty;
        const showFieldError = submitAttempt || touched.ssid;
        const showError = showFieldError && !isValid;
        const missing = !isValid && submitAttempt
            ? ["SSID: Este campo es obligatorio"]
            : [];

        if (showError) {
            error.textContent = "Este campo es obligatorio";
        }
        error.classList.toggle("hidden", !showError);
        const fieldId = !isValid && submitAttempt ? "wifi-ssid" : "";
        setValidationState(isValid, missing, fieldId);

        const payload = {
            ssid,
            password,
            encryption,
            hidden,
        };
        applyQrData(isValid, payload, nextButton);
    };

    [ssidInput, passwordInput, encryptionSelect, hiddenInput].forEach(el => {
        el.addEventListener("input", validate);
        el.addEventListener("change", validate);
    });
    ssidInput.addEventListener("blur", () => {
        touched.ssid = true;
        validate();
    });

    revalidateCurrentForm = validate;
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

    const touched = {
        name: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const fullName = nameInput.value.trim();
        const isEmpty = fullName.length === 0;
        const isValid = !isEmpty;
        const showFieldError = submitAttempt || touched.name;
        const showError = showFieldError && !isValid;
        const missing = !isValid && submitAttempt
            ? ["Nombre completo: Este campo es obligatorio"]
            : [];

        if (showError) {
            error.textContent = "Este campo es obligatorio";
        }
        error.classList.toggle("hidden", !showError);
        const fieldId = !isValid && submitAttempt ? "contact-name" : "";
        setValidationState(isValid, missing, fieldId);

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
        el.addEventListener("input", validate);
    });
    nameInput.addEventListener("blur", () => {
        touched.name = true;
        validate();
    });

    revalidateCurrentForm = validate;
    validate();
}

function setupTextForm(nextButton) {
    const input = document.getElementById("text-message");
    const error = document.getElementById("text-message-error");

    const touched = {
        message: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const message = input.value.trim();
        const isEmpty = message.length === 0;
        const isValid = !isEmpty && message.length <= 500;
        const showFieldError = submitAttempt || touched.message;
        const showError = showFieldError && !isValid;
        const missing = !isValid && submitAttempt
            ? ["Mensaje: Este campo es obligatorio"]
            : [];

        if (showError) {
            error.textContent = isEmpty
                ? "Este campo es obligatorio"
                : "Mensaje demasiado largo";
        }
        error.classList.toggle("hidden", !showError);
        const fieldId = !isValid && submitAttempt ? "text-message" : "";
        setValidationState(isValid, missing, fieldId);
        applyQrData(isValid, { message }, nextButton);
    };

    input.addEventListener("input", validate);
    input.addEventListener("blur", () => {
        touched.message = true;
        validate();
    });

    revalidateCurrentForm = validate;
    validate();
}

function setupWhatsAppForm(nextButton) {
    const phoneInput = document.getElementById("whatsapp-phone");
    const messageInput = document.getElementById("whatsapp-message");
    const error = document.getElementById("whatsapp-phone-error");
    const hint = document.getElementById("whatsapp-phone-hint");

    const touched = {
        phone: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const phoneValue = phoneInput.value.trim();
        const cleanedPhone = cleanPhoneValue(phoneValue);
        const isEmpty = phoneValue.length === 0;
        const isValid = !isEmpty && isValidPhone(phoneValue);
        const showFieldError = submitAttempt || touched.phone;
        const showError = showFieldError && !isValid;
        const showHint = !showError && !isEmpty && !isValid;

        if (showError) {
            error.textContent = isEmpty
                ? "Este campo es obligatorio"
                : "Telefono invalido";
        }

        error.classList.toggle("hidden", !showError);
        if (hint) {
            hint.classList.toggle("hidden", !showHint);
        }

        const fieldId = submitAttempt && !isValid ? "whatsapp-phone" : "";
        setValidationState(
            isValid,
            submitAttempt && !isValid
                ? ["Numero de telefono: Usa solo numeros. Ej: +57 3001234567"]
                : [],
            fieldId
        );
        applyQrData(
            isValid,
            {
                phone: cleanedPhone,
                message: messageInput.value.trim(),
            },
            nextButton
        );
    };

    phoneInput.addEventListener("input", validate);
    messageInput.addEventListener("input", validate);
    phoneInput.addEventListener("blur", () => {
        touched.phone = true;
        validate();
    });

    revalidateCurrentForm = validate;
    validate();
}
function setupLocationForm(nextButton) {
    const input = document.getElementById("location-address");
    const error = document.getElementById("location-address-error");

    const touched = {
        address: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const address = input.value.trim();
        const isEmpty = address.length === 0;
        const isValid = !isEmpty;
        const showFieldError = submitAttempt || touched.address;
        const showError = showFieldError && !isValid;
        const missing = !isValid && submitAttempt
            ? ["Direccion o lugar: Este campo es obligatorio"]
            : [];

        if (showError) {
            error.textContent = "Este campo es obligatorio";
        }
        error.classList.toggle("hidden", !showError);
        const fieldId = !isValid && submitAttempt ? "location-address" : "";
        setValidationState(isValid, missing, fieldId);
        applyQrData(isValid, { address }, nextButton);
    };

    input.addEventListener("input", validate);
    input.addEventListener("blur", () => {
        touched.address = true;
        validate();
    });

    revalidateCurrentForm = validate;
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
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const title = titleInput.value.trim();
        const startDate = startDateInput.value;
        const startTime = startTimeInput.value;

        const isTitleValid = title.length > 0;
        const isStartDateValid = Boolean(startDate);
        const isStartTimeValid = Boolean(startTime);
        const isValid = isTitleValid && isStartDateValid && isStartTimeValid;
        const missing = [];
        if (!isTitleValid) {
            missing.push("Titulo del evento: Este campo es obligatorio");
        }
        if (!isStartDateValid) {
            missing.push("Fecha de inicio: Este campo es obligatorio");
        }
        if (!isStartTimeValid) {
            missing.push("Hora de inicio: Este campo es obligatorio");
        }

        titleError.classList.toggle(
            "hidden",
            !((submitAttempt || touched.title) && !isTitleValid)
        );
        startDateError.classList.toggle(
            "hidden",
            !((submitAttempt || touched.startDate) && !isStartDateValid)
        );
        startTimeError.classList.toggle(
            "hidden",
            !((submitAttempt || touched.startTime) && !isStartTimeValid)
        );

        let fieldId = "";
        if (!isTitleValid) {
            fieldId = "event-title";
        } else if (!isStartDateValid) {
            fieldId = "event-start-date";
        } else if (!isStartTimeValid) {
            fieldId = "event-start-time";
        }
        setValidationState(
            isValid,
            submitAttempt && !isValid ? missing : [],
            fieldId
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

    titleInput.addEventListener("input", validate);
    startDateInput.addEventListener("input", validate);
    startTimeInput.addEventListener("input", validate);
    titleInput.addEventListener("blur", () => {
        touched.title = true;
        validate();
    });
    startDateInput.addEventListener("blur", () => {
        touched.startDate = true;
        validate();
    });
    startTimeInput.addEventListener("blur", () => {
        touched.startTime = true;
        validate();
    });
    [endDateInput, endTimeInput, locationInput, descriptionInput].forEach(el => {
        el.addEventListener("input", validate);
    });

    revalidateCurrentForm = validate;
    validate();
}

function setupEmailForm(nextButton) {
    const toInput = document.getElementById("email-to");
    const subjectInput = document.getElementById("email-subject");
    const bodyInput = document.getElementById("email-body");
    const error = document.getElementById("email-to-error");

    const touched = {
        to: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const to = toInput.value.trim();
        const isEmpty = to.length === 0;
        const isValid = !isEmpty && isValidEmail(to);
        const showFieldError = submitAttempt || touched.to;
        const showError = showFieldError && !isValid;
        const missing = !isValid && submitAttempt
            ? ["Correo destino: Ingresa un correo valido"]
            : [];

        if (showError) {
            error.textContent = isEmpty
                ? "Este campo es obligatorio"
                : "Correo invalido";
        }
        error.classList.toggle("hidden", !showError);
        const fieldId = !isValid && submitAttempt ? "email-to" : "";
        setValidationState(isValid, missing, fieldId);
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
        el.addEventListener("input", validate);
    });
    toInput.addEventListener("blur", () => {
        touched.to = true;
        validate();
    });

    revalidateCurrentForm = validate;
    validate();
}

function setupPhoneForm(nextButton) {
    const input = document.getElementById("phone-number");
    const error = document.getElementById("phone-number-error");
    const hint = document.getElementById("phone-number-hint");

    const touched = {
        phone: false,
    };
    let submitAttempt = false;

    const validate = () => {
        if (attemptedAdvance) {
            submitAttempt = true;
        }
        const phoneValue = input.value.trim();
        const cleanedPhone = cleanPhoneValue(phoneValue);
        const isEmpty = phoneValue.length === 0;
        const isValid = !isEmpty && isValidPhone(phoneValue);
        const showFieldError = submitAttempt || touched.phone;
        const showError = showFieldError && !isValid;
        const showHint = !showError && !isEmpty && !isValid;

        if (showError) {
            error.textContent = isEmpty
                ? "Este campo es obligatorio"
                : "Telefono invalido";
        }
        error.classList.toggle("hidden", !showError);
        if (hint) {
            hint.classList.toggle("hidden", !showHint);
        }

        const fieldId = submitAttempt && !isValid ? "phone-number" : "";
        setValidationState(
            isValid,
            submitAttempt && !isValid
                ? ["Telefono: Usa solo numeros. Ej: +57 3001234567"]
                : [],
            fieldId
        );
        applyQrData(isValid, { phone: cleanedPhone }, nextButton);
    };

    input.addEventListener("input", validate);
    input.addEventListener("blur", () => {
        touched.phone = true;
        validate();
    });

    revalidateCurrentForm = validate;
    validate();
}
function applyQrData(isValid, payload, nextButton) {
    qrState.payload = payload;
    const data = isValid
        ? buildQrDataByType(qrState.selectedType, payload)
        : "";
    qrState.qrData = data;

    setNextButtonState(nextButton, isValid);

    if (isValid && data) {
        updateQR(data, qrState.fgColor, qrState.bgColor);
        setPreviewState(true);
        if (attemptedAdvance) {
            notifyValidation([]);
        }
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
    if (!/^\+?\d+$/.test(cleaned)) return false;
    const digits = cleaned.replace(/^\+/, "");
    return digits.length >= 7;
}

const VALIDATION_TOAST_DURATION = 4000;
const VALIDATION_MAX_ITEMS = 4;

function setValidationState(isValid, missing = [], fieldId = "") {
    currentValidity = isValid;
    currentMissing = missing;
    currentInvalidFieldId = fieldId;
}

function notifyValidation(errors, fieldId = "") {
    if (!errors || !errors.length) {
        if (validationToastHandle) {
            validationToastHandle.dismiss();
            validationToastHandle = null;
        }
        return;
    }

    const items = errors.slice(0, VALIDATION_MAX_ITEMS);
    if (errors.length > VALIDATION_MAX_ITEMS) {
        items.push(`y ${errors.length - VALIDATION_MAX_ITEMS} más...`);
    }

    const message = "Corrige lo siguiente:";
    const options = {
        message,
        duration: VALIDATION_TOAST_DURATION,
        actionLabel: "Ver campo",
        onAction: () => focusField(fieldId),
    };

    if (validationToastHandle) {
        validationToastHandle.update(
            "danger",
            "No se puede continuar",
            message,
            {
                ...options,
                items,
            }
        );
    } else {
        validationToastHandle = notifyList(
            "danger",
            "No se puede continuar",
            items,
            options
        );
    }
}

function focusField(fieldId) {
    if (!fieldId) return;
    const target = document.getElementById(fieldId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof target.focus === "function") {
        target.focus({ preventScroll: true });
    }
}

function setNextButtonState(button, isValid) {
    if (!button) return;
    button.setAttribute("aria-disabled", isValid ? "false" : "true");
    button.classList.toggle("opacity-50", !isValid);
    button.classList.toggle("cursor-not-allowed", !isValid);
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

