const CONTAINER_ID = "toast-container";
const DEFAULT_DURATION = 4500;

const typeConfig = {
    info: {
        role: "status",
        classes: "bg-indigo-600 text-white",
    },
    success: {
        role: "alert",
        classes: "bg-emerald-600 text-white",
    },
    warning: {
        role: "alert",
        classes: "bg-amber-500 text-slate-900",
    },
    danger: {
        role: "alert",
        classes: "bg-rose-600 text-white",
    },
    loading: {
        role: "status",
        classes: "bg-indigo-600 text-white",
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
    const toast = createToast({
        type,
        title,
        message: options.message || "",
        items,
        options,
    });
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
        "fixed top-24 right-6 z-[99999] flex flex-col gap-3 w-[420px] max-w-[92vw]";
    document.body.appendChild(container);
    return container;
}

function createToast({ type, title, message, items, options = {} }) {
    const resolvedType = typeConfig[type] ? type : "info";
    const { classes, role } = typeConfig[resolvedType];
    const toast = document.createElement("div");
    toast.className = [
        "toast-enter",
        "border border-white/15 rounded-2xl shadow-2xl px-4 py-3",
        "flex flex-col gap-3 cursor-pointer",
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
        const symbol = document.createElement("div");
        symbol.className = "w-3.5 h-3.5 rounded-full bg-white/80";
        icon.appendChild(symbol);
    }

    const body = document.createElement("div");
    body.className = "flex-1";

    const titleEl = document.createElement("div");
    titleEl.className = "text-sm font-semibold";
    titleEl.textContent = title || "Aviso";

    const messageEl = document.createElement("div");
    messageEl.className = "text-sm opacity-90 mt-1";
    messageEl.textContent = message || "";

    body.appendChild(titleEl);
    if (message) {
        body.appendChild(messageEl);
    }

    if (Array.isArray(items) && items.length) {
        const list = document.createElement("ul");
        list.className = "mt-2 list-disc list-inside text-sm opacity-90 space-y-1";
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        body.appendChild(list);
    }

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "ml-2 text-white/80 hover:text-white";
    closeButton.setAttribute("aria-label", "Cerrar");
    closeButton.textContent = "×";

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

    closeButton.addEventListener("click", event => {
        event.stopPropagation();
        handle.dismiss();
    });

    toast.actionHandler = options.onAction;
    toast.addEventListener("click", event => {
        if (event.target.closest("button")) return;
        toast.actionHandler?.();
    });

    renderActionButton(toast, options);

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
        "border border-white/15 rounded-2xl shadow-2xl px-4 py-3",
        "flex flex-col gap-3 cursor-pointer",
        config.classes,
    ].join(" ");
    toast.setAttribute("role", config.role);
    toast.setAttribute(
        "aria-live",
        config.role === "status" ? "polite" : "assertive"
    );

    const titleEl = toast.querySelector(".text-sm.font-semibold");
    const messageEl = toast.querySelector(".text-sm.opacity-90");
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
    if (Array.isArray(options.items) && options.items.length) {
        const list = document.createElement("ul");
        list.className = "mt-2 list-disc list-inside text-sm opacity-90 space-y-1";
        options.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            list.appendChild(li);
        });
        toast.querySelector(".flex-1").appendChild(list);
    }

    if (iconWrapper) {
        iconWrapper.innerHTML = "";
        if (resolvedType === "loading") {
            const spinner = document.createElement("div");
            spinner.className =
                "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin";
            iconWrapper.appendChild(spinner);
        } else {
            const symbol = document.createElement("div");
            symbol.className = "w-3.5 h-3.5 rounded-full bg-white/80";
            iconWrapper.appendChild(symbol);
        }
    }

    const duration =
        typeof options.duration === "number" ? options.duration : DEFAULT_DURATION;
    if (resolvedType !== "loading" && duration > 0) {
        scheduleDismiss(toast, duration);
    }

    toast.actionHandler = options.onAction;
    renderActionButton(toast, options);
}

function renderActionButton(toast, options = {}) {
    const existing = toast.querySelector("[data-toast-actions]");
    if (existing) {
        existing.remove();
    }
    if (!options.actionLabel) {
        return;
    }

    const actions = document.createElement("div");
    actions.dataset.toastActions = "true";
    actions.className = "mt-3 flex justify-end";

    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className =
        "text-sm font-semibold text-white/90 hover:text-white underline";
    actionButton.textContent = options.actionLabel;
    actionButton.addEventListener("click", event => {
        event.stopPropagation();
        options.onAction?.();
    });

    actions.appendChild(actionButton);
    toast.appendChild(actions);
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
