// 📌 Verifică dacă utilizatorul este logat și afișează starea în pagină
function checkUserStatus() {
    const token = localStorage.getItem("token");
    const userStatus = document.getElementById("userStatus"); // Element pentru afișarea stării utilizatorului
    const logoutButton = document.getElementById("logoutButton"); // Buton Logout
    const loginButton = document.getElementById("loginButton"); // Buton Login

    if (token) {
        // ✅ Utilizator logat
        const userData = parseJwt(token);
        userStatus.innerHTML = `Logged in as: <strong>${userData.email}</strong>`; // Afișează email-ul utilizatorului

        if (logoutButton) logoutButton.style.display = "block";
        if (loginButton) loginButton.style.display = "none";
    } else {
        // ❌ Utilizator nelogat
        userStatus.innerHTML = "Not logged in";
        if (logoutButton) logoutButton.style.display = "none";
        if (loginButton) loginButton.style.display = "block";
    }
}

// 📌 Funcție pentru a decoda un token JWT
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
}

// 📌 Funcția de logout
function logout() {
    localStorage.clear(); // Șterge token-ul
    alert("You have been logged out.");
    window.location.href = "index.html"; // Redirecționează la pagina principală
}

function checkRestrictedAccess() {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (!token && (currentPath.includes("/under14/") || currentPath.includes("/over14/"))) {
        alert("You must be logged in to access this section.");
        window.location.href = "../register.html";
    }
}

function checkUserAccess() {
    const token = localStorage.getItem("token");
    const age = parseInt(localStorage.getItem("age"), 10);
    const currentPath = window.location.pathname;

    // 📌 Log for Debugging
    console.log("Stored Age in localStorage:", age);
    console.log("Current Path:", currentPath);

    if (!token && (currentPath.includes("/under14/") || currentPath.includes("/over14/"))) {
        alert("You must be logged in to access this section.");
        window.location.href = "../register.html";
        return;
    }

    // 📌 Restrict Under-14 Users from Over14
    if (age < 14 && currentPath.includes("/over14/")) {
        alert("You are too young to access this section.");
        window.location.href = "../index.html";
        return;
    }
}

// 📌 Call function when page loads
checkUserAccess();


// 📌 Apelăm funcția la încărcarea paginii
checkRestrictedAccess();


// 📌 Apelăm funcția imediat ce se încarcă pagina
checkUserStatus();
