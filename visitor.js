import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const visitorContainer = document.getElementById("visitorDetails");
  const serviceCards = document.querySelectorAll(".service-card");
  const proceedBtn = document.getElementById("proceedBtn");

  let selectedServices = [];

  // Get logged-in Firestore document ID from sessionStorage
  const userDocId = sessionStorage.getItem("userDocId");
  if (!userDocId) {
    visitorContainer.innerHTML = `<div class="detail-item"><i class="fas fa-exclamation-circle"></i> Please log in to see your visitor information.</div>`;
    return;
  }

  try {
    const docRef = doc(db, "users", userDocId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      visitorContainer.innerHTML = `<div class="detail-item"><i class="fas fa-exclamation-circle"></i> User data not found.</div>`;
      return;
    }

    const data = docSnap.data();

    // Fallbacks if fullName or email is missing
    const fullName = data.fullName || (data.email ? data.email.split("@")[0] : "Anonymous");
    const email = data.email || "-";

    const createdAt = data.visitTime ? (data.visitTime.toDate ? data.visitTime.toDate() : new Date(data.visitTime)) : new Date();
    const timeIn = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = createdAt.toLocaleDateString();

    visitorContainer.innerHTML = `
      <div class="detail-item"><i class="fas fa-user"></i> Name: ${fullName}</div>
      <div class="detail-item"><i class="fas fa-envelope"></i> Email: ${email}</div>
      <div class="detail-item"><i class="fas fa-clock"></i> Time In: ${timeIn}</div>
      <div class="detail-item"><i class="fas fa-calendar-alt"></i> Date: ${date}</div>
    `;

    // Service selection
    serviceCards.forEach(card => {
      card.addEventListener("click", () => {
        card.classList.toggle("selected");
        const service = card.dataset.service;
        if (card.classList.contains("selected")) {
          selectedServices.push(service);
        } else {
          selectedServices = selectedServices.filter(s => s !== service);
        }
      });
    });

    // Proceed button
    proceedBtn.addEventListener("click", async (e) => {
      if (selectedServices.length === 0) {
        e.preventDefault();
        alert("❌ Please select at least one service!");
        return;
      }

      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();

        const servicesToSave = selectedServices.map(s => ({ service: s, timestamp: new Date() }));
        window.servicesSelected = servicesToSave;

        await updateDoc(docRef, {
          servicesSelected: arrayUnion(...servicesToSave),
          visitTime: new Date(),
          blocked: false,
          ip: ipData.ip
        });

        window.location.href = "welcome.html";
      } catch (err) {
        e.preventDefault();
        console.error("Error recording services:", err);
        alert("❌ Failed to record services.");
      }
    });

  } catch (err) {
    console.error(err);
    visitorContainer.innerHTML = `<div class="detail-item"><i class="fas fa-exclamation-circle"></i> Error loading user data.</div>`;
  }
});