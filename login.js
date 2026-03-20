// ✅ Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyFkpU9IneWYS9mljcPhzV0iYJDfzdxMk",
  authDomain: "josh-32784.firebaseapp.com",
  projectId: "josh-32784",
  storageBucket: "josh-32784.firebasestorage.app",
  messagingSenderId: "387876840610",
  appId: "1:387876840610:web:57e635d1b0de4d130f23fb",
  measurementId: "G-RS7ZXCRHVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const form = document.getElementById("libraryLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loadingOverlay = document.getElementById("loadingOverlay");
const toastContainer = document.getElementById("toastContainer");

// Toast function
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
      <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
      <span>${message}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// Show/hide loading
function showLoading(show) {
  loadingOverlay.classList.toggle("active", show);
}

// Login form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showToast("Fill in all fields!", "error");
    return;
  }

  showLoading(true);

  try {
    // Query Firestore for a user with matching email AND password
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching user
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Store Firestore document ID for visitor.js
      sessionStorage.setItem("userDocId", userDoc.id);

      showToast(`Login successful! Welcome, ${userData.fullName}`, "success");

      setTimeout(() => {
        window.location.href = "visitor.html"; // redirect to visitor page
      }, 1000);
    } else {
      showToast("Invalid email or password.", "error");
    }

  } catch (err) {
    console.error(err);
    showToast("Login failed: " + err.message, "error");
  }

  showLoading(false);
});

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});