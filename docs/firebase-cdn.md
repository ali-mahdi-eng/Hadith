
```html

<!-- My Firebase CDN Code (Past this code in html file to be used) -->
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDze9cbDS5jK9dwiDrQsjLIf-leOv8LjH4",
    authDomain: "hadith-827b3.firebaseapp.com",
    projectId: "hadith-827b3",
    storageBucket: "hadith-827b3.firebasestorage.app",
    messagingSenderId: "636245239229",
    appId: "1:636245239229:web:66442363f8727a7f0eded4",
    measurementId: "G-Z8GSCMD54D"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

```