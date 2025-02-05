// 📌 Verifică dacă utilizatorul este logat
function checkUserStatus() {
    const token = localStorage.getItem("token");
    const userStatus = document.getElementById("userStatus");
    const logoutButton = document.getElementById("logoutButton");
    const loginButton = document.getElementById("loginButton");

    if (token) {
        const userData = parseJwt(token);
        if (userStatus) userStatus.innerHTML = `Logged in as: <strong>${userData.email}</strong>`;
        if (logoutButton) logoutButton.style.display = "block";
        if (loginButton) loginButton.style.display = "none";
    } else {
        if (userStatus) userStatus.innerHTML = "Not logged in";
        if (logoutButton) logoutButton.style.display = "none";
        if (loginButton) loginButton.style.display = "block";
    }
}

// 📌 Decodare token JWT
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
}

// 📌 Logout
function logout() {
    localStorage.clear();
    alert("You have been logged out.");
    window.location.href = "index.html";
}

// 📌 Restricționare acces bazat pe vârstă
function checkUserAccess() {
    const token = localStorage.getItem("token");
    const age = parseInt(localStorage.getItem("age"), 10);
    const currentPath = window.location.pathname;

    if (!token && (currentPath.includes("/under14/") || currentPath.includes("/over14/"))) {
        alert("You must be logged in to access this section.");
        window.location.href = "../register.html";
        return;
    }

    if (age < 14 && currentPath.includes("/over14/")) {
        alert("You are too young to access this section.");
        window.location.href = "../index.html";
    }
}

// 📌 Apelăm verificările la încărcarea paginii
document.addEventListener("DOMContentLoaded", () => {
    checkUserStatus();
    checkUserAccess();
});
