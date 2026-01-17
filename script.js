// --- SECTION 1: FLOWER ANIMATION ---
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

let flowers = [];
for(let i = 0; i < 100; i++) {
    flowers.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*4+2, d: Math.random()*2+1, a: Math.random()*1-0.5 });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffcc00";
    flowers.forEach(f => {
        ctx.beginPath(); ctx.arc(f.x, f.y, f.s, 0, Math.PI*2); ctx.fill();
        f.y += f.d; f.x += f.a;
        if(f.y > canvas.height) { f.y = -10; f.x = Math.random()*canvas.width; }
    });
    requestAnimationFrame(draw);
}
draw();

// --- SECTION 2: COUNTDOWN TIMER ---
const targetDate = new Date("Jan 23, 2026 08:30:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById("days").innerText = d;
    document.getElementById("hours").innerText = h;
    document.getElementById("mins").innerText = m;
    document.getElementById("secs").innerText = s;
}, 1000);

// --- SECTION 3: ADMIN DASHBOARD & REGISTRATION ---
const adminPassword = "admin123";

function checkLogin() {
    const input = document.getElementById("adminPass").value;
    if (input === adminPassword) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        renderMembers();
    } else { alert("ভুল পাসওয়ার্ড!"); }
}

function logout() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
}

function addParticipant() {
    const name = document.getElementById("regName").value;
    const id = document.getElementById("regID").value;
    const fee = document.getElementById("regFee").value;
    if (!name || !id) return alert("তথ্য দিন!");

    let members = JSON.parse(localStorage.getItem("pujaMembers")) || [];
    members.push({ name, id, fee });
    localStorage.setItem("pujaMembers", JSON.stringify(members));
    document.getElementById("regName").value = "";
    document.getElementById("regID").value = "";
    renderMembers();
}

function renderMembers() {
    const list = document.getElementById("memberList");
    const totalSpan = document.getElementById("totalCount");
    list.innerHTML = "";
    let members = JSON.parse(localStorage.getItem("pujaMembers")) || [];
    totalSpan.innerText = members.length;
    members.forEach((m, index) => {
        list.innerHTML += `<tr><td>${m.name}</td><td>${m.id}</td><td class="${m.fee === 'Paid' ? 'status-paid' : 'status-unpaid'}">${m.fee}</td><td><button class="delete-btn" onclick="deleteMember(${index})">X</button></td></tr>`;
    });
}

function deleteMember(index) {
    let members = JSON.parse(localStorage.getItem("pujaMembers"));
    members.splice(index, 1);
    localStorage.setItem("pujaMembers", JSON.stringify(members));
    renderMembers();
}
// --- USER AUTH & REGISTRATION LOGIC ---

// 1. User Signup
function userSignup() {
    const name = document.getElementById("userName").value;
    const pass = document.getElementById("userPass").value;

    if (!name || !pass) return alert("নাম এবং পাসওয়ার্ড দিন!");

    let users = JSON.parse(localStorage.getItem("siteUsers")) || {};
    if (users[name]) return alert("এই নামে অলরেডি অ্যাকাউন্ট আছে!");

    users[name] = pass;
    localStorage.setItem("siteUsers", JSON.stringify(users));
    alert("অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করুন।");
}

// 2. User Login
function userLogin() {
    const name = document.getElementById("userName").value;
    const pass = document.getElementById("userPass").value;
    let users = JSON.parse(localStorage.getItem("siteUsers")) || {};

    if (users[name] && users[name] === pass) {
        document.getElementById("userAuthBox").style.display = "none";
        document.getElementById("userEventForm").style.display = "block";
        document.getElementById("loggedInUser").innerText = name;
    } else {
        alert("ভুল নাম বা পাসওয়ার্ড!");
    }
}

// 3. Submit Puja Registration (Event specific)
function submitPujaReg() {
    const name = document.getElementById("loggedInUser").innerText;
    const id = document.getElementById("studentID").value;
    const fee = document.getElementById("userFeeStatus").value;

    if (!id) return alert("আপনার আইডি দিন!");

    let pujaMembers = JSON.parse(localStorage.getItem("pujaMembers")) || [];
    
    // Check if already registered
    const exists = pujaMembers.find(m => m.id === id);
    if(exists) return alert("আপনি অলরেডি রেজিস্টার্ড!");

    pujaMembers.push({ name, id, fee });
    localStorage.setItem("pujaMembers", JSON.stringify(pujaMembers));

    alert("পূজা রেজিস্ট্রেশন সফল হয়েছে!");
    renderMembers(); // Dashboard update korbe
}

// 4. User Logout
function userLogout() {
    document.getElementById("userAuthBox").style.display = "block";
    document.getElementById("userEventForm").style.display = "none";
    document.getElementById("userName").value = "";
    document.getElementById("userPass").value = "";
}