import firebaseConfig from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized Firebase app or individual services
export default app;
