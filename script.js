document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert("Login failed: " + data.message);
    }
});



//ydudidiifigiffof


document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
    } else {
        alert("Registration failed: " + data.message);
    }
});



//fhfuduxufuxufifififificcifi



document.getElementById("enrollmentForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const gradeLevel = document.getElementById("gradeLevel").value;
    const birthDate = document.getElementById("birthDate").value;
    const address = document.getElementById("address").value;
    const guardian = document.getElementById("guardian").value;
    const contact = document.getElementById("contact").value;
    const documents = document.getElementById("documents").files[0];

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("gradeLevel", gradeLevel);
    formData.append("birthDate", birthDate);
    formData.append("address", address);
    formData.append("guardian", guardian);
    formData.append("contact", contact);
    formData.append("documents", documents);

    const response = await fetch("http://localhost:5000/api/enroll", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    if (response.ok) {
        alert("Enrollment submitted successfully!");
        window.location.href = "dashboard.html";
    } else {
        alert("Enrollment failed: " + data.message);
    }
});



//dufufufufifffififigigo


document.addEventListener("DOMContentLoaded", async function() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to log in first!");
        window.location.href = "login.html";
        return;
    }

    // Fetch user details
    const userResponse = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userName").textContent = userData.name;
    document.getElementById("userRole").textContent = userData.role;

    if (userData.role === "student") {
        document.getElementById("studentDashboard").style.display = "block";
        
        // Fetch student enrollment data
        const enrollResponse = await fetch("http://localhost:5000/api/enroll/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const enrollData = await enrollResponse.json();

        if (enrollResponse.ok) {
            document.getElementById("enrollmentInfo").innerHTML = `
                <strong>Name:</strong> ${enrollData.fullName} <br>
                <strong>Grade Level:</strong> ${enrollData.gradeLevel} <br>
                <strong>Status:</strong> ${enrollData.status}
            `;
        } else {
            document.getElementById("enrollmentInfo").textContent = "No enrollment data found.";
        }
    } 
    
    else if (userData.role === "admin") {
        document.getElementById("adminDashboard").style.display = "block";

        // Fetch all enrolled students
        const studentsResponse = await fetch("http://localhost:5000/api/enroll/all", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const studentsData = await studentsResponse.json();

        if (studentsResponse.ok) {
            const studentsTable = document.querySelector("#studentsTable tbody");
            studentsData.forEach(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.fullName}</td>
                    <td>${student.gradeLevel}</td>
                    <td>${student.status}</td>
                `;
                studentsTable.appendChild(row);
            });
        }
    }

    // Logout function
    document.getElementById("logoutBtn").addEventListener("click", function() {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});


//ududufufigiffiffi

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to log in first!");
        window.location.href = "login.html";
        return;
    }

    const userResponse = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    const userData = await userResponse.json();
    if (!userResponse.ok) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userName").textContent = userData.name;
    document.getElementById("userRole").textContent = userData.role;

    if (userData.role === "admin") {
        document.getElementById("adminDashboard").style.display = "block";
        loadEnrolledStudents();

        document.getElementById("filterStatus").addEventListener("change", loadEnrolledStudents);
    }

    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    async function loadEnrolledStudents() {
        const filter = document.getElementById("filterStatus").value;
        const response = await fetch(`http://localhost:5000/api/dashboard/all?status=${filter}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        const students = await response.json();
        const tableBody = document.querySelector("#studentsTable tbody");
        tableBody.innerHTML = "";

        students.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.fullName}</td>
                <td>${student.gradeLevel}</td>
                <td>${student.status}</td>
                <td>
                    <button class="approve-btn" data-id="${student.id}">Approve</button>
                    <button class="reject-btn" data-id="${student.id}">Reject</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".approve-btn").forEach(btn => {
            btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved"));
        });

        document.querySelectorAll(".reject-btn").forEach(btn => {
            btn.addEventListener("click", () => updateStatus(btn.dataset.id, "rejected"));
        });
    }

    async function updateStatus(id, status) {
        const response = await fetch(`http://localhost:5000/api/dashboard/update/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            alert("Status updated successfully!");
            loadEnrolledStudents();
        } else {
            alert("Failed to update status.");
        }
    }
});