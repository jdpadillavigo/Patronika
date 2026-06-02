type SessionExpiredListener = () => void;

const listeners = new Set<SessionExpiredListener>();
let notified = false;

function subscribe(listener: SessionExpiredListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notify(): void {
    if (notified) return;
    notified = true;
    listeners.forEach(listener => listener());
}

function reset(): void {
    notified = false;
}

const SessionExpiredService = {
    subscribe,
    notify,
    reset,
};

export default SessionExpiredService;
