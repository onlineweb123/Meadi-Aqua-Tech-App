import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAqyyGJt_t0ztknMudFVLmo6relkEa284g",
    authDomain: "meadi-aqua-tech.firebaseapp.com",
    databaseURL: "https://meadi-aqua-tech-default-rtdb.firebaseio.com",
    projectId: "meadi-aqua-tech",
    storageBucket: "meadi-aqua-tech.firebasestorage.app",
    messagingSenderId: "531151217708",
    appId: "1:531151217708:web:b30b6e1a0bf7fa60f29d89"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Loader Function
function setBtnLoading(btnId, ldrId, txtId, isLoading, defaultText) {
    const btn = document.getElementById(btnId);
    const ldr = document.getElementById(ldrId);
    const txt = document.getElementById(txtId);
    if (isLoading) {
        btn.disabled = true;
        ldr.style.display = "block";
        txt.innerText = "Processing...";
    } else {
        btn.disabled = false;
        ldr.style.display = "none";
        txt.innerText = defaultText;
    }
}

// Login Process
document.getElementById("loginBtn").onclick = async () => {
    const u = document.getElementById("loginUser").value;
    const p = document.getElementById("loginPass").value;
    if(!u || !p) return alert("Please enter both Username and Password!");

    setBtnLoading("loginBtn", "loginLdr", "loginTxt", true);
    try {
        const snapshot = await get(ref(db, 'admin'));
        if (snapshot.exists() && u === snapshot.val().user && p === snapshot.val().pass) {
            
            // ✅ இந்த வரிதான் மிக முக்கியம்: ஒருமுறை லாகின் செய்ததை உறுதிப்படுத்துகிறது
            sessionStorage.setItem("isAdminAuthenticated", "true"); 
            
            window.location.href = "admin.html"; 
        } else {
            alert("Invalid Username or Password!");
        }
    } catch (e) { 
        alert("Database Error! Check connection."); 
    }
    setBtnLoading("loginBtn", "loginLdr", "loginTxt", false, "Login");
};

// Security Code Reset Process
document.getElementById("updateBtn").onclick = async () => {
    const code = document.getElementById("securityPhone").value;
    const newUser = document.getElementById("newUser").value;
    const newPass = document.getElementById("newPass").value;

    if (code === "9344165879") {
        if(!newUser || !newPass) return alert("Please enter new details!");
        
        setBtnLoading("updateBtn", "updateLdr", "updateTxt", true);
        try {
            await update(ref(db, 'admin'), { user: newUser, pass: newPass });
            alert("Credentials updated! Please login.");
            location.reload();
        } catch (e) { 
            alert("Update failed!"); 
        }
        setBtnLoading("updateBtn", "updateLdr", "updateTxt", false, "Update Credentials");
    } else {
        alert("Incorrect Security Code!");
    }
};

// Page Toggles
document.getElementById("btnShowSettings").onclick = () => {
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("settingsPage").style.display = "flex";
};

document.getElementById("btnHideSettings").onclick = () => {
    document.getElementById("settingsPage").style.display = "none";
    document.getElementById("loginOverlay").style.display = "flex";
};
