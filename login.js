import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaeCLZ98isu0tMlPCGcFH2kDUzPinMSVw",
  authDomain: "rapid-repo.firebaseapp.com",
  databaseURL: "https://rapid-repo-default-rtdb.firebaseio.com",
  projectId: "rapid-repo",
  storageBucket: "rapid-repo.appspot.com",
  messagingSenderId: "731599470074",
  appId: "1:731599470074:web:8f2d575214398df7473843"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const role = userSnap.data().role;
      if (role === "admin") {
        window.location.href = "/admin.html";
      } else {
        window.location.href = "/agent.html";
      }
    } else {
      alert("No role assigned.");
    }
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
