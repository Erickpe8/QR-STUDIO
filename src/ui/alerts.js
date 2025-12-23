const CONTAINER_ID = "toast-container";
const DEFAULT_DURATION = 4500;

const typeConfig = {
    info: {
        role: "status",
        classes: "bg-info-soft border-info-subtle text-fg-info-strong",
    },
    success: {
        role: "alert",
        classes: "bg-success-soft border-success-subtle text-fg-success-strong",
    },
    warning: {
        role: "alert",
        classes: "bg-warning-soft border-warning-subtle text-fg-warning-strong",
    },
    danger: {
        role: "alert",
        classes: "bg-danger-soft border-danger-subtle text-fg-danger-strong",
    },
    loading: {
        role: "status",
        classes: "bg-info-soft border-info-subtle text-fg-info-strong",
    },
};

let container = null;

export function initAlerts() {
    ensureContainer();
}

export function notify(type, title, message, options = {}) {
    const toast = createToast({ type, title, message, options });
    enqueueToast(toast, options);
    return toast.handle;
}

export function notifyList(type, title, items = [], options = {}) {
    const toast = createToast({ type, title, items, options });
    enqueueToast(toast, options);
    return toast.handle;
}

export function notifyLoading(title, message) {
    const toast = createToast({
        type: "loading",
        title,
        message,
        options: { duration: 0, dismissible: false },
    });
    enqueueToast(toast, { duration: 0, dismissible: false });
    return toast.handle;
}

function ensureContainer() {
    if (container) return container;
    container = document.getElementById(CONTAINER_ID);
    if (container) return container;

    container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.className =
        "fixed top-6 right-6 z-50 flex flex-col gap-3 w-[320px] max-w-[calc(100vw-2rem)]";
    document.body.appendChild(container);
    return container;
}

function createToast({ type, title, message, items, options }) {
    const resolvedType = typeConfig[type] ? type : "info";
    const { classes, role } = typeConfig[resolvedType];
    const toast = document.createElement("div");
    toast.className = [
        "toast-enter",
        "border rounded-xl shadow-lg px-4 py-3",
        "backdrop-blur-sm bg-white/80",
        "flex flex-col gap-2",
        classes,
    ].join(" ");
    toast.setAttribute("role", role);
    toast.setAttribute("aria-live", role === "status" ? "polite" : "assertive");

    const header = document.createElement("div");
    header.className = "flex items-start gap-3";

    const icon = document.createElement("div");
    icon.className = "mt-1";
    if (resolvedType === "loading") {
        const spinner = document.createElement("div");
        spinner.className =
            "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin";
        icon.appendChild(spinner);
    } else {
        const dot = document.createElement("div");
        dot.className = "w-2.5 h-2.5 rounded-full bg-current opacity-80";
        icon.appendChild(dot);
    }

    const body = document.createElement("div");
    body.className = "flex-1";

    const titleEl = document.createElement("div");
    titleEl.className = "text-sm font-semibold leading-tight";
    titleEl.textContent = title || "Aviso";

    const messageEl = document.createElement("div");
    messageEl.className = "text-sm text-slate-600 mt-1";
    messageEl.textContent = message || "";

    body.appendChild(titleEl);
    if (message) {
        body.appendChild(messageEl);
    }

    if (Array.isArray(items) && items.length) {
        const list = document.createElement("ul");
        list.className = "mt-2 list-disc list-inside text-sm text-slate-600";
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        body.appendChild(list);
    }

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className =
        "ml-2 text-slate-400 hover:text-slate-600 transition";
    closeButton.setAttribute("aria-label", "Cerrar");
    closeButton.textContent = "x";

    header.appendChild(icon);
    header.appendChild(body);
    header.appendChild(closeButton);
    toast.appendChild(header);

    const handle = {
        update: (nextType, nextTitle, nextMessage, nextOptions = {}) => {
            updateToast(
                toast,
                nextType,
                nextTitle,
                nextMessage,
                nextOptions
            );
        },
        dismiss: () => dismissToast(toast),
    };

    closeButton.addEventListener("click", () => handle.dismiss());

    return { toast, handle };
}

function enqueueToast({ toast, handle }, options = {}) {
    const root = ensureContainer();
    root.appendChild(toast);

    const duration =
        typeof options.duration === "number" ? options.duration : DEFAULT_DURATION;
    if (duration > 0) {
        scheduleDismiss(toast, duration);
    }

    toast.handle = handle;
}

function updateToast(toast, type, title, message, options = {}) {
    const resolvedType = typeConfig[type] ? type : "info";
    const config = typeConfig[resolvedType];

    toast.className = [
        "toast-enter",
        "border rounded-xl shadow-lg px-4 py-3",
        "backdrop-blur-sm bg-white/80",
        "flex flex-col gap-2",
        config.classes,
    ].join(" ");
    toast.setAttribute("role", config.role);
    toast.setAttribute(
        "aria-live",
        config.role === "status" ? "polite" : "assertive"
    );

    const titleEl = toast.querySelector(".text-sm.font-semibold");
    const messageEl = toast.querySelector(".text-sm.text-slate-600");
    const listEl = toast.querySelector("ul");
    const iconWrapper = toast.querySelector(".mt-1");

    if (titleEl) titleEl.textContent = title || "Aviso";
    if (messageEl) {
        if (message) {
            messageEl.textContent = message;
            messageEl.classList.remove("hidden");
        } else {
            messageEl.textContent = "";
            messageEl.classList.add("hidden");
        }
    }
    if (listEl) listEl.remove();

    if (iconWrapper) {
        iconWrapper.innerHTML = "";
        if (resolvedType === "loading") {
            const spinner = document.createElement("div");
            spinner.className =
                "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin";
            iconWrapper.appendChild(spinner);
        } else {
            const dot = document.createElement("div");
            dot.className =
                "w-2.5 h-2.5 rounded-full bg-current opacity-80";
            iconWrapper.appendChild(dot);
        }
    }

    const duration =
        typeof options.duration === "number" ? options.duration : DEFAULT_DURATION;
    if (resolvedType !== "loading" && duration > 0) {
        scheduleDismiss(toast, duration);
    }
}

function scheduleDismiss(toast, duration) {
    clearTimeout(toast.dismissTimer);
    toast.dismissTimer = setTimeout(() => {
        dismissToast(toast);
    }, duration);
}

function dismissToast(toast) {
    if (!toast || toast.classList.contains("toast-exit")) return;
    toast.classList.remove("toast-enter");
    toast.classList.add("toast-exit");
    clearTimeout(toast.dismissTimer);
    const remove = () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    };
    toast.addEventListener("animationend", remove, { once: true });
    setTimeout(remove, 250);
}
