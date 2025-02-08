async function uploadFile(courseName, courseId, type) {
    const idSuffix = type === 'assignment' ? 'homework' : type;
    console.log('courseName:', courseName, 'type:', type, 'idSuffix:', idSuffix)
    const fileInput = document.getElementById(`file-${courseName}-${idSuffix}`);
    console.log(`file-${courseName}-${idSuffix}`);

    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!fileInput || !fileInput.files.length) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("user_id", user_id);
    formData.append("course_id", courseId);
    formData.append("type", type);


    try {
        const response = await fetch("http://localhost:5000/api/portfolio/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        alert(result.message);
        console.log(result.message);
        loadUserSubmissions();
    } catch (error) {
        alert("Upload failed.");
    }
}

// 📌 Funcție pentru a încărca fișierele utilizatorului
async function loadUserSubmissions() {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        console.error("User ID missing. User not logged in.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/portfolio/user/${user_id}`);
        const submissions = await response.json();

        if (!Array.isArray(submissions)) {
            console.error("Invalid submissions format:", submissions);
            return;
        }

        submissions.forEach(sub => {
            const submissionList = document.getElementById(`submissionList-${sub.course_id}-${sub.type}`);
            if (submissionList) {
                submissionList.innerHTML += `
                    <p><a href="${sub.file_path}" target="_blank">📂 ${sub.type.toUpperCase()} - View File</a></p>
                `;
            }
        });

    } catch (error) {
        console.error("Error loading submissions:", error);
    }
}

// 📌 Încarcă automat fișierele utilizatorului la încărcarea paginii
/*document.addEventListener("DOMContentLoaded", () => {
    loadUserSubmissions();
});
*/

document.addEventListener("DOMContentLoaded", async () => {
    let userId = localStorage.getItem("userId");

    if (!userId || userId === "null") { 
        console.error("❌ UserId is null! Ensure you are logged in.");
        alert("You must be logged in to see your submissions.");
        return;
    }

    await loadUserFiles(userId);
});
