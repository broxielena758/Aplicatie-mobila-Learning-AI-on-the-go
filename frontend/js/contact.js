document.getElementById("contact-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // 🔥 Evită refresh-ul paginii

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    console.log(name);

    if (!name || !email || !message) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Message sent successfully!");
            document.getElementById("contact-form").reset();
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error, please try again later.");
    }
});

