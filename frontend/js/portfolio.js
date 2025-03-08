async function uploadFile(courseName, courseId, type) {
    const idSuffix = type === 'assignment' ? 'homework' : type;
    console.log('courseName:', courseName, 'type:', type, 'idSuffix:', idSuffix);
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

// 📌 Load user submissions and display them
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
                    <p><a href="${sub.file_path}" target="_blank">📂 ${sub.type.toUpperCase()} - View File</a>
                    ${sub.type === "assignment" ? `<br><strong>Grade:</strong> ${sub.grade || "Not graded yet"}` : ""}
                    ${sub.type === "project" ? `<br><strong>Feedback:</strong> ${sub.feedback || "No feedback yet"}` : ""}
                    </p>
                `;
            }
        });

    } catch (error) {
        console.error("Error loading submissions:", error);
    }
}

// 📌 Admin Function to Submit Grade
async function submitGrade(submissionId) {
    const grade = document.getElementById(`gradeInput-${submissionId}`).value;
    if (!grade || grade < 1 || grade > 10) {
        alert("Grade must be between 1 and 10");
        return;
    }

    try {
        await fetch(`http://localhost:5000/api/portfolio/grade/${submissionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ grade }),
        });
        alert("Grade submitted successfully!");
        loadAllSubmissions();
    } catch (error) {
        alert("Error submitting grade");
    }
}

// 📌 Admin Function to Submit Feedback
async function submitFeedback(submissionId) {
    const feedback = document.getElementById(`feedbackInput-${submissionId}`).value;
    if (!feedback || feedback.length < 5) {
        alert("Feedback must be at least 5 characters long");
        return;
    }

    try {
        await fetch(`http://localhost:5000/api/portfolio/feedback/${submissionId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feedback }),
        });
        alert("Feedback submitted successfully!");
        loadAllSubmissions();
    } catch (error) {
        alert("Error submitting feedback");
    }
}

// 📌 Load all submissions for the admin panel
async function loadAllSubmissions() {
    try {
        const response = await fetch("http://localhost:5000/api/portfolio/admin/submissions");
        const submissions = await response.json();

        document.getElementById("adminSubmissionList").innerHTML = submissions.map(sub => `
            <p>User ${sub.user_id} - <a href="${sub.file_path}" target="_blank">${sub.type}</a>
            ${sub.type === "assignment" ? `
                <input type="number" id="gradeInput-${sub.id}" placeholder="Enter grade (1-10)">
                <button onclick="submitGrade(${sub.id})">Submit Grade</button>
            ` : `
                <input type="text" id="feedbackInput-${sub.id}" placeholder="Enter feedback">
                <button onclick="submitFeedback(${sub.id})">Submit Feedback</button>
            `}
            </p>
        `).join("");
    } catch (error) {
        console.error("Error loading all submissions:", error);
    }
}

// 📌 Ensure all user files load when page loads
document.addEventListener("DOMContentLoaded", async () => {
    let userId = localStorage.getItem("userId");

    if (!userId || userId === "null") { 
        console.error("❌ UserId is null! Ensure you are logged in.");
        alert("You must be logged in to see your submissions.");
        return;
    }

    await loadUserFiles(userId);
    loadAllSubmissions();
});
