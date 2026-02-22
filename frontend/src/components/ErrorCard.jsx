export default function ErrorCard({ error, onDismiss }) {
    if (!error) return null;

    return (
        <div className="error-card fade-in">
            <div className="error-icon-wrap">
                <span className="error-icon">⚠️</span>
            </div>
            <div className="error-body">
                <div className="error-title">Wrong Image Detected</div>
                <div className="error-message">{error}</div>
                <div className="error-hint">
                    Please re-upload the correct medical image and try again.
                </div>
            </div>
            {onDismiss && (
                <button className="error-dismiss btn-ghost btn-sm" onClick={onDismiss}>
                    ✕ Dismiss
                </button>
            )}
        </div>
    );
}
