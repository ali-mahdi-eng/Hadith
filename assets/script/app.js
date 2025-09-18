// Comment this file when change or edit any other files.

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((registration) => {
    // Is there a new version?
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // A new version is ready but not yet activated
            showUpdateNotification(newWorker);
          }
        }
      });
    });
  });
}

// Notify the user about a new update
function showUpdateNotification(worker) {
    const notification = document.createElement('div');
        notification.className = "notification";
        notification.classList.add("notification-in");
        notification.textContent = "هناك تحديث جديد";
    const updateNowBtn = document.createElement('button');
          updateNowBtn.className = "update-now-btn";
          updateNowBtn.textContent = "حدث الآن";

    updateNowBtn.addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    });
    // Display Notification
    document.querySelector("#main").appendChild(notification);
    // Auto-hide the notification after 15 seconds
    setTimeout(() => {
        notification.classList.remove("notification-in");
        notification.classList.add("notification-out");
        setTimeout(() => {
            notification.remove();
        }, 500); // Wait for transition to finish
    }, 15000); // 15 seconds
}
