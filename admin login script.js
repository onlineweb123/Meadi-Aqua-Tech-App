import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

function setBtnLoading(btnId, ldrId, txtId, isLoading, text) {
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
        txt.innerText = text;
    }
}

document.getElementById("loginBtn").onclick = async () => {
    setBtnLoading("loginBtn", "loginLdr", "loginTxt", true);
    const u = document.getElementById("loginUser").value;
    const p = document.getElementById("loginPass").value;
    try {
        const snapshot = await get(ref(db, 'admin'));
        if (snapshot.exists() && u === snapshot.val().user && p === snapshot.val().pass) {
            document.getElementById("loginOverlay").style.display = "none";
            document.getElementById("mainApp").style.display = "block";
            loadAdminData();
        } else {
            alert("தவறான விபரங்கள்!");
        }
    } catch (e) { alert("Error connecting to Firebase"); }
    setBtnLoading("loginBtn", "loginLdr", "loginTxt", false, "Login");
};

document.getElementById("updateBtn").onclick = async () => {
    const phone = document.getElementById("securityPhone").value;
    if (phone === "9344165879") {
        setBtnLoading("updateBtn", "updateLdr", "updateTxt", true);
        const newUser = document.getElementById("newUser").value;
        const newPass = document.getElementById("newPass").value;
        if(newUser && newPass) {
            await update(ref(db, 'admin'), { user: newUser, pass: newPass });
            alert("Updated! Login with new details.");
            location.reload();
        } else { alert("Fill all fields"); }
        setBtnLoading("updateBtn", "updateLdr", "updateTxt", false, "Update Credentials");
    } else { alert("பாதுகாப்பு எண் தவறு!"); }
};

async function loadAdminData() {
    document.getElementById("titleLoader").style.display = "block";
    try {
        const snapshot = await get(ref(db, 'users'));
        if (snapshot.exists()) {
            const users = Object.entries(snapshot.val());
            let fCount = 0, aCount = 0, tableHTML = "", cardsHTML = "";
            const today = new Date();
            users.forEach(([userId, user]) => {
                let fExp = false, aExp = false;
                if(user.lastFilterDate) {
                    let d = new Date(user.lastFilterDate); d.setMonth(d.getMonth()+3);
                    if(today > d) { fExp = true; fCount++; }
                }
                if(user.lastAMCDate) {
                    let d = new Date(user.lastAMCDate); d.setFullYear(d.getFullYear()+1);
                    if(today > d) { aExp = true; aCount++; }
                }
                if(fExp || aExp) {
                    tableHTML += `<tr>
                        <td><b>${user.name}</b></td>
                        <td style="color:var(--danger); font-size:10px; font-weight:bold;">${fExp ? 'FILTER' : ''} ${aExp ? 'AMC' : ''}</td>
                        <td><input type="date" id="ef-${userId}" style="width:110px" value="${user.lastFilterDate || ''}"></td>
                        <td><input type="date" id="ea-${userId}" style="width:110px" value="${user.lastAMCDate || ''}"></td>
                        <td><button class="save-btn" id="btn-${userId}" onclick="saveUser('${userId}')">Save</button></td>
                    </tr>`;
                }
                cardsHTML += `<div class="user-card">
                    <div><b>${user.name}</b><br><small>📞 ${user.phone}</small></div>
                    <div style="text-align:right; font-size:11px;">F: ${user.lastFilterDate || '--'}<br>A: ${user.lastAMCDate || '--'}</div>
                </div>`;
            });
            document.getElementById("totalUsers").innerText = users.length;
            document.getElementById("filterDueCount").innerText = fCount;
            document.getElementById("amcDueCount").innerText = aCount;
            document.getElementById("userList").innerHTML = cardsHTML;
            if(tableHTML) {
                document.getElementById("urgentSection").style.display = "block";
                document.getElementById("expiryTableBody").innerHTML = tableHTML;
            } else {
                document.getElementById("urgentSection").style.display = "none";
            }
        }
    } catch (e) { console.error(e); }
    document.getElementById("titleLoader").style.display = "none";
}

window.saveUser = async (id) => {
    const btn = document.getElementById(`btn-${id}`);
    const nF = document.getElementById(`ef-${id}`).value;
    const nA = document.getElementById(`ea-${id}`).value;
    btn.innerText = "...";
    btn.disabled = true;
    await update(ref(db, `users/${id}`), { lastFilterDate: nF, lastAMCDate: nA });
    loadAdminData();
};

window.showSettings = () => { document.getElementById("loginOverlay").style.display = "none"; document.getElementById("settingsPage").style.display = "flex"; };
window.hideSettings = () => { document.getElementById("settingsPage").style.display = "none"; document.getElementById("loginOverlay").style.display = "flex"; };
