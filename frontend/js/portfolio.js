async function uploadFile(courseName, courseId, type) {
    const fileInput = document.getElementById(`fileInput-${courseName}-${type}`);
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!fileInput.files.length) {
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
        loadSubmissions(courseName, courseId);
    } catch (error) {
        alert("Upload failed.");
    }
}

// Fetch user submissions
async function loadSubmissions(courseName, courseId) {
    const user_id = localStorage.getItem("user_id");

    const response = await fetch(`http://localhost:5000/api/portfolio/user/${user_id}`);
    const submissions = await response.json();

    // Filter submissions
    const homework = submissions.filter(sub => sub.course_id == courseId && sub.type === "assignment");
    const projects = submissions.filter(sub => sub.course_id == courseId && sub.type === "project");

    document.getElementById(`submissionList-${courseName}-homework`).innerHTML = homework.map(sub => `
        <p>Homework: <a href="${sub.file_path}" target="_blank">View File</a></p>
    `).join("");

    document.getElementById(`submissionList-${courseName}-project`).innerHTML = projects.map(sub => `
        <p>Project: <a href="${sub.file_path}" target="_blank">View File</a></p>
    `).join("");
}

// Admin function to view all submissions
async function loadAllSubmissions() {
    const response = await fetch("http://localhost:5000/api/portfolio/admin/submissions");
    const submissions = await response.json();

    document.getElementById("adminSubmissionList").innerHTML = submissions.map(sub => `
        <p>User ${sub.user_id}: <a href="${sub.file_path}" target="_blank">${sub.type}</a></p>
    `).join("");
}

// Load all user submissions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadSubmissions("capcut", 3);
    loadSubmissions("chatgpt", 4);
});
