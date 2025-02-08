// 📌 Verifică dacă utilizatorul este logat și actualizează navbar-ul
function checkUserStatus() {
    const token = localStorage.getItem("token");
    const userStatus = document.getElementById("userStatus");
    const logoutButton = document.getElementById("logoutButton");
    const loginButton = document.getElementById("loginButton");

    if (token) {
        const userData = parseJwt(token);
        if (userData && userData.id) {
            localStorage.setItem("userId", userData.id); // ✅ Salvează userId
            localStorage.setItem("age", userData.age);   // ✅ Salvează vârsta utilizatorului
        }
        if (userStatus) userStatus.innerHTML = `Logged in as: <strong>${userData.email}</strong>`;
        if (logoutButton) logoutButton.style.display = "block";
        if (loginButton) loginButton.style.display = "none";
    } else {
        if (userStatus) userStatus.innerHTML = `<a href="register.html">Using without an account</a>`;
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

// 📌 Login utilizator
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        console.log("✅ Login successful:", data);

        if (data.token && data.user.id) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("age", data.user.age);
            window.location.href = "portfolio.html"; // ✅ Redirecționează la portofoliu
        } else {
            throw new Error("Invalid response from server");
        }
    } catch (error) {
        console.error("❌ Login error:", error);
        alert("Login failed: " + error.message);
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

    // ❌ Blochează accesul doar la cursurile "Over 14" din portfolio, nu la întreaga pagină
    if (age < 14 && currentPath.includes("portfolio.html")) {
        document.addEventListener("DOMContentLoaded", () => {
            const over14Courses = document.querySelectorAll(".over14-course");
            over14Courses.forEach(course => {
                course.style.display = "none"; // Ascunde cursurile interzise
            });
        });
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

