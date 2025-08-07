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
  notification.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #222;
    color: white;
    padding: 12px;
    text-align: center;
    font-size: 16px;
    z-index: 10000;
    box-shadow: 0 -2px 5px rgba(0,0,0,0.3);
    transition: transform 0.3s ease;
  `;
  notification.innerHTML = `
    A new update is available 
    <button style="margin-left:10px; padding:5px 10px; background:#fff; border:none; cursor:pointer;">
      Update Now
    </button>
  `;

  const btn = notification.querySelector('button');
  btn.addEventListener('click', () => {
    worker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  });

  document.body.appendChild(notification);

  // Auto-hide the notification after 20 seconds
  setTimeout(() => {
    notification.style.transform = 'translateY(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300); // Wait for transition to finish
  }, 10000); // 10 seconds
}