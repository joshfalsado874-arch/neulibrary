// ✅ Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyFkpU9IneWYS9mljcPhzV0iYJDfzdxMk",
  authDomain: "josh-32784.firebaseapp.com",
  projectId: "josh-32784",
  storageBucket: "josh-32784.firebasestorage.app",
  messagingSenderId: "387876840610",
  appId: "1:387876840610:web:57e635d1b0de4d130f23fb",
  measurementId: "G-RS7ZXCRHVV"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Courses per department
const courses = {
  "College of Engineering": ["BS Computer Engineering", "BS Civil Engineering", "BS Electrical Engineering"],
  "College of Business": ["BS Accountancy", "BS Marketing", "BS Entrepreneurship"],
  "College of Arts and Sciences": ["BA English", "BA Psychology", "BS Biology"]
};

// ✅ Populate course dropdown based on selected department
const departmentSelect = document.getElementById("department");
const courseSelect = document.getElementById("courseProgram");

departmentSelect.addEventListener("change", () => {
  const selectedDept = departmentSelect.value;

  // Clear previous options
  courseSelect.innerHTML = '<option value="" disabled selected>Select Course / Program</option>';

  if (courses[selectedDept]) {
    courses[selectedDept].forEach(course => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);
    });
  }
});

// ✅ Register logic
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userType = document.querySelector('input[name="userType"]:checked')?.value;
    const department = departmentSelect.value;
    const courseProgram = courseSelect.value;

    // Validation
    if (!userType) {
      alert("Select user type!");
      return;
    }

    if (!department) {
      alert("Select department!");
      return;
    }

    if (!courseProgram) {
      alert("Select course / program!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!fullName || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      // Add user to Firestore (duplicate emails allowed)
      await addDoc(collection(db, "users"), {
        fullName,
        email,
        password, // ⚠️ For demo only. Do NOT store plain text passwords in production!
        userType,
        department,
        courseProgram,
        createdAt: new Date()
      });

      alert("✅ Registered successfully!");
      window.location.href = "login.html";

    } catch (err) {
      console.error(err);
      alert("❌ Registration failed: " + err.message);
    }
  });
});