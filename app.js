import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, updateDoc, doc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaeCLZ98isu0tMlPCGcFH2kDUzPinMSVw",
  authDomain: "rapid-repo.firebaseapp.com",
  databaseURL: "https://rapid-repo-default-rtdb.firebaseio.com",
  projectId: "rapid-repo",
  storageBucket: "rapid-repo.firebasestorage.app",
  messagingSenderId: "731599470074",
  appId: "1:731599470074:web:8f2d575214398df7473843",
  measurementId: "G-1T4F7E461P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const authSection = document.getElementById("authSection");
const adminSection = document.getElementById("adminSection");
const reportsList = document.getElementById("reportsList");
const statusFilter = document.getElementById("statusFilter");
const plateSearch = document.getElementById("plateSearch");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().role === "admin") {
      authSection.style.display = "none";
      adminSection.style.display = "block";
      loadReports();
    } else {
      alert("Access denied.");
      logout();
    }
  }
});

window.login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password).catch(err => alert(err.message));
};

window.logout = () => signOut(auth);

async function loadReports() {
  reportsList.innerHTML = "";
  const filter = statusFilter.value;
  const search = plateSearch.value.toLowerCase();
  const snapshot = await getDocs(collection(db, "reports"));
  let count = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    if ((filter && data.status !== filter) || (search && !data.plate.toLowerCase().includes(search))) return;

    const div = document.createElement("div");
    div.className = "report-card";
    div.innerHTML = `
      <strong>Plate:</strong> ${data.plate}<br>
      <strong>Status:</strong> ${data.status}<br>
      <strong>Submitted:</strong> ${data.createdAt?.toDate().toLocaleString() || 'N/A'}<br><br>
      ${data.licensePhotoUrl ? `<img src="${data.licensePhotoUrl}" alt="License">` : ''}
      ${data.vehiclePhotoUrl ? `<img src="${data.vehiclePhotoUrl}" alt="Vehicle">` : ''}
      ${data.locationPhotoUrl ? `<img src="${data.locationPhotoUrl}" alt="Location">` : ''}<br><br>
      <textarea placeholder="Add internal notes..." id="notes-${id}"></textarea><br>
      <button onclick="markComplete('${id}')">Mark as Completed</button>
      <button onclick="emailPolice('${id}')">Email Police</button>
      <button onclick="exportPDF('${id}')">Export PDF</button>
    `;
    reportsList.appendChild(div);
    count++;
  });

  if (count === 0) reportsList.innerHTML = "<p>No matching reports found.</p>";
}

window.markComplete = async (id) => {
  const ref = doc(db, "reports", id);
  await updateDoc(ref, { status: "Completed" });
  loadReports();
};

window.emailPolice = async (id) => {
  alert(`Pretending to email police with report ID: ${id}`);
};

window.exportPDF = (id) => {
  alert(`Pretending to export PDF for report ID: ${id}`);
};

statusFilter.addEventListener("change", loadReports);
plateSearch.addEventListener("input", loadReports);