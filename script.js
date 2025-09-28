// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC7krgo-VZsXADe_F0eHJg_HjK2UPNDWPU",
    authDomain: "envisionmedtech-36a3a.firebaseapp.com",
    projectId: "envisionmedtech-36a3a",
    storageBucket: "envisionmedtech-36a3a.firebasestorage.app",
    messagingSenderId: "583556024883",
    appId: "1:583556024883:web:62c498e588fd5626687146"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  // 🔐 Check if user is logged in
  onAuthStateChanged(auth, user => {
    if (!user && !window.location.pathname.includes("login.html")) {
      alert("Please log in to access this page.");
      window.location.href = "login.html";
    }
  });

  // 🔓 Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("Logged out!");
        window.location.href = "login.html";
      } catch (err) {
        alert("Logout error: " + err.message);
      }
    });
  }

  // 🔑 Google Sign-In button with popup guard
  const googleLoginBtn = document.getElementById("googleLogin");
  let isLoggingIn = false;

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      if (isLoggingIn) return;
      isLoggingIn = true;

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 🔐 Log user to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        });

        alert("Signed in as " + user.email);
        window.location.href = "index.html";
      } catch (err) {
        alert("Login error: " + err.message);
      } finally {
        isLoggingIn = false;
      }
    });
  }

  // 📦 Request item function
  window.requestItem = function(itemName) {
    const form = document.getElementById('requestForm');
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth' });

    const equipmentInput = document.getElementById('equipmentType');
    if (equipmentInput) {
      equipmentInput.value = itemName;
    }
  };
});