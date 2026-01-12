Learning on the Go – Online Courses Platform

This project is a full-stack educational platform that allows users to access online courses through a **web application** and a **mobile application**.
The backend exposes REST APIs used by both clients and stores data in a shared database.

---

How to Run and Use the Application (5 Steps)

Step 1: Install required software

Make sure the following tools are installed on your system:

* **Node.js** (v18+ recommended)
* **npm** (comes with Node.js)
* **Git**
* **PostgreSQL** (or the database configured in the project)
* **Android Studio** (for running the mobile app)

---

Step 2: Clone the repository

Clone the project from GitHub and navigate into the folder:

```bash
git clone https://github.com/USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME
```

---

Step 3: Start the backend server

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Configure the database connection (if needed), then start the server:

```bash
npm start
```

The backend will run at:

```
http://localhost:3000
```

---

Step 4: Open the web application

Open the web interface by either:

* opening `frontend/index.html` directly in the browser
  **or**
* using a local server (recommended):

```bash
cd frontend
npm install
npm start
```

You can now:

* register a user
* log in
* manage courses and users (CRUD operations)

---

Step 5: Run and use the mobile application

Open the `mobile` folder in **Android Studio**.

1. Sync Gradle dependencies
2. Start an Android emulator or connect a physical device
3. Run the application

The mobile app allows users to:

* browse shortened course content
* complete quizzes
* track learning progress
* synchronize data with the backend when online

---

Application Usage

* The **web application** is mainly used for administration and full content management.
* The **mobile application** focuses on learning on the go, quizzes, progress tracking, and rewards.
* Both applications communicate with the same backend using RESTful web services.

---

Technologies Used

* **Backend:** Node.js, Express, REST API
* **Database:** PostgreSQL
* **Web:** HTML, CSS, JavaScript
* **Mobile:** Android (Java/Kotlin), SQLite (offline mode)
* **Version Control:** Git & GitHub

---

