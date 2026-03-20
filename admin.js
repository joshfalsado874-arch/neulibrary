// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginForm = document.getElementById("adminLoginForm");
const loginText = document.getElementById("loginText");
const loadingSpinner = document.getElementById("loadingSpinner");

// Prevent crash if form not found
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        loadingSpinner.style.display = "inline-block";
        loginText.textContent = "Logging in...";

        try {
            // 🔐 Login using Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔍 Check Firestore role
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                throw new Error("User record not found in database");
            }

            const userData = userSnap.data();

            if (userData.role !== "admin") {
                await signOut(auth);
                throw new Error("Access denied: Not an admin");
            }

            // ✅ SUCCESS
            showToast("Login successful!", "success");

            setTimeout(() => {
                window.location.href = "admindashboard.html";
            }, 1000);

        } catch (error) {
            console.error(error);

            let message = "Login failed";

            if (error.code === "auth/user-not-found") {
                message = "User not found";
            } else if (error.code === "auth/wrong-password") {
                message = "Wrong password";
            } else if (error.code === "auth/invalid-email") {
                message = "Invalid email format";
            } else if (error.message) {
                message = error.message;
            }

            showToast(message, "error");

        } finally {
            loadingSpinner.style.display = "none";
            loginText.textContent = "Login to Admin";
        }
    });
}

// Toast
function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.remove(), 3000);
}

// 👁 Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassword.classList.toggle("show");
    });
}