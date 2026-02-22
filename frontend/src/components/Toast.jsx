// ── Toast notification system ─────────────────────────────────────────────────
// Usage: import { useToast, ToastContainer } from './Toast';
// In App or Dashboard: const toast = useToast(); toast.success("Done!")

import { useState, useCallback, createContext, useContext } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const add = useCallback((message, type = "info", duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const api = {
        success: (msg) => add(msg, "success"),
        error: (msg) => add(msg, "error"),
        info: (msg) => add(msg, "info"),
        warning: (msg) => add(msg, "warning"),
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type} fade-in`}>
                        <span className="toast-icon">
                            {t.type === "success" ? "✅"
                                : t.type === "error" ? "❌"
                                    : t.type === "warning" ? "⚠️"
                                        : "ℹ️"}
                        </span>
                        <span className="toast-msg">{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
