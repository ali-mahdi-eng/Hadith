if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((registration) => {

        // Force check for updates on every visit
        registration.update();

        // When a new SW is found, activate it immediately in background
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            newWorker.addEventListener('statechange', () => {
                // New version installed and ready — activate silently
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        });
    });

    // When new SW takes control, reload to apply the update
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}